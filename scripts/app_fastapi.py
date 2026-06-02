# scripts/app_fastapi.py

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from pathlib import Path
from typing import Dict, List
import uuid
import os
import json
import numpy as np

# -------------------------
# Local AI modules
# -------------------------
from scripts.asr import speech_to_text
from scripts.language_detect import detect_language

# -------------------------
# FAISS & Embeddings
# -------------------------
import faiss
from sentence_transformers import SentenceTransformer

# -------------------------
# Gemini (NEW SDK)
# -------------------------
from google import genai
from dotenv import load_dotenv

# -------------------------
# App Setup
# -------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

app = FastAPI(title="PostOpPal AI Service")

# -------------------------
# FAISS Setup (Optional RAG)
# -------------------------
INDEX_PATH = BASE_DIR / "post_op_faiss.index"
META_PATH = BASE_DIR / "post_op_faiss_meta.json"
EMBED_MODEL_NAME = "all-MiniLM-L6-v2"

faiss_index = None
faiss_meta = []

if INDEX_PATH.exists() and META_PATH.exists():
    try:
        faiss_index = faiss.read_index(str(INDEX_PATH))
        faiss_meta = json.loads(META_PATH.read_text(encoding="utf-8"))
        print(f"✓ FAISS loaded ({faiss_index.ntotal} vectors)")
    except Exception as e:
        print(f"⚠️ FAISS load error: {e}")
else:
    print("⚠️ FAISS files not found, running without RAG")

embed_model = SentenceTransformer(EMBED_MODEL_NAME)

# -------------------------
# Gemini Setup
# -------------------------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("❌ GEMINI_API_KEY missing in .env file")

client = genai.Client(api_key=GEMINI_API_KEY)
print("✓ Gemini client initialized")

# -------------------------
# Helper Functions
# -------------------------

def generate_gemini_answer(prompt: str) -> str:
    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents=prompt
    )
    return response.text


def retrieve_docs(query: str, k: int = 3) -> List[Dict]:
    if not faiss_index:
        return []

    q_emb = embed_model.encode([query])[0].astype("float32")
    q_emb /= np.linalg.norm(q_emb)

    D, I = faiss_index.search(np.array([q_emb]), k)

    results = []
    for idx in I[0]:
        if 0 <= idx < len(faiss_meta):
            results.append({
                "text": faiss_meta[idx].get("text", ""),
                "source": faiss_meta[idx].get("source", "unknown")
            })
    return results


def rag_pipeline(query: str) -> Dict:
    docs = retrieve_docs(query)
    context = "\n\n".join([d["text"] for d in docs])
    sources = [d["source"] for d in docs]

    prompt = f"""
You are a post-operative medical assistant.

STRICT RULES:
- Use ONLY the context below
- Reply in the SAME language as the patient's question (Hindi / Hinglish / English)
- Keep answers short, polite, and reassuring
- If unsure, advise contacting the doctor

Context:
{context}

Patient Question:
{query}

Answer:
"""

    answer = generate_gemini_answer(prompt)

    return {
        "answer": answer,
        "sources": sources
    }

# -------------------------
# API Endpoints
# -------------------------

@app.get("/")
def health():
    return {"status": "ok", "service": "PostOpPal AI"}

# ---- TEXT CHAT (WhatsApp uses this) ----
@app.post("/answer")
async def answer(text: str = Form(...)):
    return JSONResponse(content=rag_pipeline(text))

# ---- SPEECH CHAT (future / optional) ----
@app.post("/speech-chat")
async def speech_chat(audio: UploadFile = File(...)):
    temp_dir = BASE_DIR / "temp"
    temp_dir.mkdir(exist_ok=True)

    audio_path = temp_dir / f"{uuid.uuid4().hex}_{audio.filename}"
    audio_path.write_bytes(await audio.read())

    user_text = speech_to_text(str(audio_path))
    if not user_text:
        raise HTTPException(status_code=400, detail="No speech detected")

    language = detect_language(user_text)
    result = rag_pipeline(user_text)

    return {
        "user_text": user_text,
        "language": language,
        "ai_text": result["answer"],
        "sources": result["sources"]
    }
    