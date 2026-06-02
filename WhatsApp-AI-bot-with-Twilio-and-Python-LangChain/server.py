# """
# PostOpPal – WhatsApp AI Bot for Post-Surgical Recovery
# Integrates with WhatsApp via Twilio and uses Google Gemini for AI responses.
# Includes patient profiles, personalized recovery plans, chat history,
# Gemini Vision wound image analysis, and Gemini audio transcription for voice messages.
# """

# import os
# import re
# import uuid
# import shutil
# import logging
# import sqlite3
# import datetime
# import mimetypes
# import time
# import base64
# import threading
# from typing import Optional

# from dotenv import load_dotenv
# from flask import Flask, request, Response
# from twilio.twiml.messaging_response import MessagingResponse
# from twilio.rest import Client as TwilioClient
# import requests
# from requests.auth import HTTPBasicAuth
# from requests.adapters import HTTPAdapter, Retry
# from PIL import Image

# # ── Optional: Google GenAI ────────────────────────────────────────────────────
# GENAI_CLIENT = None
# GENAI_LEGACY = None
# CLIENT_KIND  = None

# try:
#     from google import genai as genai_client_lib
#     GENAI_CLIENT = genai_client_lib
#     CLIENT_KIND  = "genai_client"
# except ImportError:
#     try:
#         import google.generativeai as genai_legacy
#         GENAI_LEGACY = genai_legacy
#         CLIENT_KIND  = "generativeai"
#     except ImportError:
#         CLIENT_KIND = Noposne

# # ── Optional: LangChain + FAISS ───────────────────────────────────────────────
# LC_AVAILABLE = False
# try:
#     from langchain_community.document_loaders import PyPDFLoader
#     from langchain_text_splitters import CharacterTextSplitter
#     from langchain_community.vectorstores import FAISS
#     from langchain_community.embeddings.base import Embeddings
#     from langchain.schema import Document as LC_Document
#     LC_AVAILABLE = True
# except ImportError:
#     pass

# # ── Optional: Tesseract OCR ───────────────────────────────────────────────────
# TESSERACT_AVAILABLE = False
# try:
#     import pytesseract
#     TESSERACT_AVAILABLE = True
# except ImportError:
#     pass

# # ── Optional: Google Cloud Speech (legacy fallback) ───────────────────────────
# GCLOUD_SPEECH_AVAILABLE = False
# try:
#     from google.cloud import speech_v1p1beta1 as speech
#     GCLOUD_SPEECH_AVAILABLE = True
# except ImportError:
#     pass

# # ── Optional: wearable helper ─────────────────────────────────────────────────
# WEARABLE_AVAILABLE = False
# try:
#     from wearable_helper import save_wearable_data, get_wearable_data, wearable_risk
#     WEARABLE_AVAILABLE = True
# except ImportError:
#     pass

# # ── Patient manager ───────────────────────────────────────────────────────────
# from patient_manager import (
#     save_patient, get_patient, build_patient_context,
#     build_recovery_plan_prompt, save_recovery_plan, get_recovery_plan,
#     save_chat, get_chat_history, days_since_surgery,
# )

# # ── Load .env ─────────────────────────────────────────────────────────────────
# load_dotenv()

# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GENAI_API_KEY")
# if not GEMINI_API_KEY:
#     raise RuntimeError("❌ GEMINI_API_KEY missing in .env")

# UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# INDEX_DIR = os.getenv("INDEX_DIR", "faiss_gemini_index")
# os.makedirs(INDEX_DIR, exist_ok=True)

# SESSION_DB = os.getenv("SESSION_DB", "sessions.db")

# LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
# logging.basicConfig(level=getattr(logging, LOG_LEVEL))
# LOGGER = logging.getLogger("postoppal")

# TWILIO_ACCOUNT_SID   = os.getenv("TWILIO_ACCOUNT_SID")
# TWILIO_AUTH_TOKEN    = os.getenv("TWILIO_AUTH_TOKEN")
# TWILIO_WHATSAPP_FROM = os.getenv("TWILIO_WHATSAPP_FROM", "whatsapp:+14155238886")

# TWILIO_AUTH = (
#     HTTPBasicAuth(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
#     if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN else None
# )

# TWILIO_REST = (
#     TwilioClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
#     if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN else None
# )

# # ── HTTP session ──────────────────────────────────────────────────────────────
# REQUESTS_SESSION = requests.Session()
# _RETRIES = Retry(total=3, backoff_factor=0.3, status_forcelist=(500, 502, 503, 504))
# REQUESTS_SESSION.mount("https://", HTTPAdapter(max_retries=_RETRIES))
# REQUESTS_SESSION.mount("http://",  HTTPAdapter(max_retries=_RETRIES))


# # ------------------------------------------------------------------ #
# #  Language Detection                                                  #
# # ------------------------------------------------------------------ #
 
# # Unicode range for Devanagari script (Hindi characters)
# _DEVANAGARI_RE = re.compile(r'[\u0900-\u097F]')
 
# # Common Hinglish marker words written in Latin script
# _HINGLISH_WORDS = {
#     "kya", "hai", "hain", "nahi", "nahin", "aur", "mein", "main",
#     "kar", "karo", "karna", "hua", "hoga", "ho", "bhi", "toh",
#     "yeh", "ye", "woh", "wo", "ek", "do", "theek", "thik",
#     "abhi", "jab", "tab", "phir", "fir", "bahut", "accha", "acha",
#     "dard", "dawa", "dawai", "khana", "pani", "doctor", "bukhar",
#     "takleef", "problem", "batao", "bata", "samajh", "samjha",
#     "kyun", "kyu", "kaise", "kaisa", "kitna", "kitne", "kab",
#     "matlab", "sahi", "galat", "hona", "tha", "thi", "the",
#     "raha", "rahi", "rahe", "liya", "liye", "dena", "dono",
#     "apna", "apne", "mera", "meri", "tera", "teri", "uska",
#     "sirf", "bas", "lekin", "par", "aaj", "kal", "raat", "din",
# }
 
 
# def detect_language(text: str) -> str:
#     """
#     Detect the language/style of the incoming message.
 
#     Returns one of:
#         "hindi"    – message contains Devanagari script
#         "hinglish" – message is in Roman script but uses Hindi/Urdu words
#         "english"  – everything else
#     """
#     if not text:
#         return "english"
 
#     # Pure Hindi (Devanagari)
#     if _DEVANAGARI_RE.search(text):
#         return "hindi"
 
#     # Hinglish: check what fraction of words are Hinglish markers
#     words = re.findall(r"[a-zA-Z]+", text.lower())
#     if words:
#         hindi_word_count = sum(1 for w in words if w in _HINGLISH_WORDS)
#         ratio = hindi_word_count / len(words)
#         if ratio >= 0.20 or hindi_word_count >= 2:   # ≥20 % OR at least 2 known words
#             return "hinglish"
 
#     return "english"
 
 
# def language_instruction(lang: str) -> str:
#     """
#     Return the language-style instruction to embed in the Gemini prompt.
#     """
#     if lang == "hindi":
#         return (
#             "IMPORTANT: The user is writing in Hindi (Devanagari script). "
#             "You MUST reply entirely in Hindi using Devanagari script. "
#             "Do NOT use English or Roman script in your reply."
#         )
#     elif lang == "hinglish":
#         return (
#             "IMPORTANT: The user is writing in Hinglish (a casual mix of Hindi "
#             "and English using Roman script, like 'Mujhe dard ho raha hai'). "
#             "You MUST reply in the same Hinglish style — Roman script, mix of "
#             "Hindi and English words, friendly and conversational tone. "
#             "Do NOT reply in pure English or pure Devanagari Hindi."
#         )
#     else:
#         return (
#             "IMPORTANT: The user is writing in English. "
#             "Reply in clear, simple English."
#         )
 
 
# # ── Gemini client ─────────────────────────────────────────────────────────────
# GEMINI_CLIENT = None
# if CLIENT_KIND == "genai_client" and GENAI_CLIENT is not None:
#     GEMINI_CLIENT = GENAI_CLIENT.Client(api_key=GEMINI_API_KEY)
# elif CLIENT_KIND == "generativeai" and GENAI_LEGACY is not None:
#     GENAI_LEGACY.configure(api_key=GEMINI_API_KEY)

# # ── Audio extensions WhatsApp/Twilio sends ────────────────────────────────────
# # WhatsApp voice notes come as .ogg (opus codec) — this is the most important one
# AUDIO_EXTENSIONS = (".ogg", ".oga", ".opus", ".wav", ".flac", ".mp3", ".m4a", ".aac", ".amr")

# AUDIO_MIME_MAP = {
#     ".ogg":  "audio/ogg",
#     ".oga":  "audio/ogg",
#     ".opus": "audio/ogg",
#     ".wav":  "audio/wav",
#     ".flac": "audio/flac",
#     ".mp3":  "audio/mpeg",
#     ".m4a":  "audio/mp4",
#     ".aac":  "audio/aac",
#     ".amr":  "audio/amr",
# }

# # ── Rate limiting ─────────────────────────────────────────────────────────────
# MIN_SECONDS_BETWEEN_CALLS = float(os.getenv("MIN_SECONDS_BETWEEN_CALLS", "3"))
# _LAST_CALL: dict = {}


# def can_call_ai(user: str) -> bool:
#     now  = time.time()
#     last = _LAST_CALL.get(user)
#     if last and (now - last) < MIN_SECONDS_BETWEEN_CALLS:
#         return False
#     _LAST_CALL[user] = now
#     return True


# def safe_reply(text) -> str:
#     try:
#         txt = str(text).strip()
#     except (ValueError, TypeError):
#         txt = ""
#     return txt if txt else "I'm here! How can I help you today?"


# # ── Send WhatsApp message via Twilio REST (for async replies) ─────────────────
# def send_whatsapp_message(to: str, body: str) -> None:
#     if not TWILIO_REST:
#         LOGGER.error("Twilio REST client not configured — cannot send async message")
#         return
#     try:
#         TWILIO_REST.messages.create(
#             from_=TWILIO_WHATSAPP_FROM,
#             to=to,
#             body=body,
#         )
#         LOGGER.info("Async message sent to %s", to)
#     except Exception as e:
#         LOGGER.exception("Failed to send async WhatsApp message: %s", e)


# # ── Gemini text generation ────────────────────────────────────────────────────
# def gemini_generate_with_retry(
#     prompt: str, model: str = "gemini-2.5-flash", max_retries: int = 3
# ) -> str:
#     if CLIENT_KIND not in ("genai_client", "generativeai"):
#         return "⚠️ AI model is not configured. Please install google-generativeai."

#     for attempt in range(max_retries):
#         try:
#             if CLIENT_KIND == "genai_client" and GEMINI_CLIENT is not None:
#                 res  = GEMINI_CLIENT.models.generate_content(model=model, contents=prompt)
#                 text = getattr(res, "text", None) or getattr(res, "content", None)
#                 if not text and hasattr(res, "candidates") and res.candidates:
#                     c    = res.candidates[0]
#                     text = getattr(c, "content", None) or getattr(c, "text", None)
#                 return safe_reply(text if text else str(res))

#             if CLIENT_KIND == "generativeai" and GENAI_LEGACY is not None:
#                 m   = GENAI_LEGACY.GenerativeModel(model_name=model)
#                 res = m.generate_content(prompt)
#                 return safe_reply(getattr(res, "text", str(res)))

#         except Exception as e:
#             err = str(e)
#             LOGGER.warning("Gemini attempt %d failed: %s", attempt + 1, err)
#             if "429" in err or "RESOURCE_EXHAUSTED" in err:
#                 if attempt < max_retries - 1:
#                     wait = (2 ** attempt) + 1
#                     LOGGER.info("Rate limit – retrying in %ds", wait)
#                     time.sleep(wait)
#                     continue
#                 return "⚠️ Free Gemini limit reached. Please wait 1–2 minutes and try again."
#             return "⚠️ AI service unavailable. Please try again later."

#     return "Request failed after retries."


# # ── Gemini Vision – Wound / Image Analysis ────────────────────────────────────
# def gemini_analyze_image(image_path: str, patient_ctx: str = "", caption: str = "") -> str:
#     """Send image to Gemini Vision for wound/medical analysis."""
#     if CLIENT_KIND not in ("genai_client", "generativeai"):
#         return "⚠️ AI vision model is not configured."

#     try:
#         with open(image_path, "rb") as f:
#             image_bytes = f.read()
#         image_data = base64.b64encode(image_bytes).decode("utf-8")

#         ext       = os.path.splitext(image_path)[1].lower()
#         mime_map  = {
#             ".jpg":  "image/jpeg",
#             ".jpeg": "image/jpeg",
#             ".png":  "image/png",
#             ".webp": "image/webp",
#             ".gif":  "image/gif",
#         }
#         mime_type = mime_map.get(ext, "image/jpeg")

#         prompt = f"""You are PostOpPal, a compassionate post-operative care assistant.
# A patient has sent you a photo of their surgical wound or recovery area via WhatsApp.

# PATIENT INFORMATION:
# {patient_ctx if patient_ctx else "No patient profile available."}

# {"PATIENT NOTE: " + caption if caption and caption.strip() else ""}

# Please analyze this image and respond with this structure:

# 🔍 *Wound Observation:*
# Describe what you see — color, swelling, discharge, closure, skin condition.

# ✅ *Signs of Normal Healing:*
# List any positive indicators visible.

# ⚠️ *Concerning Signs:*
# Flag anything abnormal — spreading redness, pus, wound opening, unusual color, excessive swelling.
# If none, say "None observed."

# 🚨 *Urgency Level:*
# Choose one: ROUTINE / MONITOR / SEE DOCTOR TODAY / EMERGENCY

# 📋 *Recommended Next Steps:*
# Clear, specific advice for right now.

# ⚕️ _This is an AI assessment and cannot replace a physical examination by your doctor._"""

#         if CLIENT_KIND == "genai_client" and GEMINI_CLIENT is not None:
#             try:
#                 from google.genai import types as genai_types
#                 response = GEMINI_CLIENT.models.generate_content(
#                     model="gemini-2.5-flash",
#                     contents=[
#                         genai_types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
#                         genai_types.Part.from_text(text=prompt),
#                     ],
#                 )
#             except (ImportError, AttributeError):
#                 response = GEMINI_CLIENT.models.generate_content(
#                     model="gemini-2.5-flash",
#                     contents=[
#                         {"inline_data": {"mime_type": mime_type, "data": image_data}},
#                         {"text": prompt},
#                     ],
#                 )
#             text = getattr(response, "text", None)
#             if not text and hasattr(response, "candidates") and response.candidates:
#                 text = getattr(response.candidates[0], "content", None)
#             return safe_reply(text if text else str(response))

#         if CLIENT_KIND == "generativeai" and GENAI_LEGACY is not None:
#             model    = GENAI_LEGACY.GenerativeModel("gemini-2.5-flash")
#             response = model.generate_content([
#                 {"mime_type": mime_type, "data": image_data},
#                 prompt,
#             ])
#             return safe_reply(getattr(response, "text", str(response)))

#     except FileNotFoundError:
#         LOGGER.error("Image file not found: %s", image_path)
#         return "⚠️ Image file could not be read. Please try sending it again."
#     except Exception as e:
#         LOGGER.exception("Gemini image analysis failed: %s", e)
#         return (
#             "⚠️ I wasn't able to analyze the image right now.\n\n"
#             "Please describe your wound in text and I'll help assess it."
#         )


# # ── Gemini Audio – Voice Message Transcription + Response ─────────────────────
# def gemini_transcribe_and_respond(audio_path: str, patient_ctx: str = "") -> str:
#     """
#     Transcribe a WhatsApp voice note using Gemini and generate a medical response.
#     Gemini 2.5 Flash natively understands OGG/opus (WhatsApp default format).
#     No extra libraries needed — works with just the Gemini API key.
#     """
#     if CLIENT_KIND not in ("genai_client", "generativeai"):
#         return "⚠️ AI model is not configured."

#     try:
#         with open(audio_path, "rb") as f:
#             audio_bytes = f.read()
#         audio_data = base64.b64encode(audio_bytes).decode("utf-8")

#         ext       = os.path.splitext(audio_path)[1].lower()
#         mime_type = AUDIO_MIME_MAP.get(ext, "audio/ogg")

#         LOGGER.info("Transcribing audio: %s (%s, %d bytes)", audio_path, mime_type, len(audio_bytes))

#         prompt = f"""You are PostOpPal, a compassionate post-operative care assistant.
# A patient has sent you a voice message via WhatsApp.

# PATIENT INFORMATION:
# {patient_ctx if patient_ctx else "No patient profile available."}

# Please:
# 1. Transcribe exactly what the patient said
# 2. Respond to their question or concern as a post-op care assistant

# Format your response as:

# 🎙️ *You said:*
# [transcription here]

# 💬 *PostOpPal Response:*
# [your helpful, personalized medical response here]

# ⚕️ _If this is urgent, please contact your doctor or call 112._"""

#         # ── New google-genai client ───────────────────────────────────────────
#         if CLIENT_KIND == "genai_client" and GEMINI_CLIENT is not None:
#             try:
#                 from google.genai import types as genai_types
#                 response = GEMINI_CLIENT.models.generate_content(
#                     model="gemini-2.5-flash",
#                     contents=[
#                         genai_types.Part.from_bytes(data=audio_bytes, mime_type=mime_type),
#                         genai_types.Part.from_text(text=prompt),
#                     ],
#                 )
#             except (ImportError, AttributeError):
#                 response = GEMINI_CLIENT.models.generate_content(
#                     model="gemini-2.5-flash",
#                     contents=[
#                         {"inline_data": {"mime_type": mime_type, "data": audio_data}},
#                         {"text": prompt},
#                     ],
#                 )
#             text = getattr(response, "text", None)
#             if not text and hasattr(response, "candidates") and response.candidates:
#                 text = getattr(response.candidates[0], "content", None)
#             return safe_reply(text if text else str(response))

#         # ── Legacy google-generativeai client ─────────────────────────────────
#         if CLIENT_KIND == "generativeai" and GENAI_LEGACY is not None:
#             model    = GENAI_LEGACY.GenerativeModel("gemini-2.5-flash")
#             response = model.generate_content([
#                 {"mime_type": mime_type, "data": audio_data},
#                 prompt,
#             ])
#             return safe_reply(getattr(response, "text", str(response)))

#     except FileNotFoundError:
#         LOGGER.error("Audio file not found: %s", audio_path)
#         return "⚠️ Could not read your voice message. Please try sending it again."
#     except Exception as e:
#         LOGGER.exception("Gemini audio transcription failed: %s", e)
#         return (
#             "⚠️ I couldn't process your voice message right now.\n\n"
#             "Please type your question and I'll help you! 💬"
#         )


# # ── Async handlers (avoid Twilio 15s timeout) ─────────────────────────────────
# def analyze_image_async(from_number: str, local_path: str, patient_id: Optional[str],
#                         patient_ctx: str, caption: str) -> None:
#     try:
#         LOGGER.info("Async wound analysis started for %s", from_number)
#         analysis = gemini_analyze_image(local_path, patient_ctx, caption)

#         if patient_id:
#             save_chat(patient_id, from_number, "user",
#                       f"[Sent wound image] {caption}".strip())
#             save_chat(patient_id, from_number, "assistant", analysis)

#         if TESSERACT_AVAILABLE and LC_AVAILABLE:
#             try:
#                 txt = ocr_image_to_text(local_path)
#                 if txt.strip():
#                     index_documents([LC_Document(page_content=txt)])
#             except Exception:
#                 pass

#         send_whatsapp_message(from_number, analysis)
#         LOGGER.info("Async wound analysis complete for %s", from_number)

#     except Exception as e:
#         LOGGER.exception("Async image thread error: %s", e)
#         send_whatsapp_message(
#             from_number,
#             "⚠️ Wound analysis failed. Please describe your wound in text and I'll help you."
#         )


# def analyze_audio_async(from_number: str, local_path: str, patient_id: Optional[str],
#                         patient_ctx: str) -> None:
#     try:
#         LOGGER.info("Async audio transcription started for %s", from_number)
#         response_text = gemini_transcribe_and_respond(local_path, patient_ctx)

#         if patient_id:
#             save_chat(patient_id, from_number, "user",      "[Sent voice message]")
#             save_chat(patient_id, from_number, "assistant", response_text)

#         send_whatsapp_message(from_number, response_text)
#         LOGGER.info("Async audio transcription complete for %s", from_number)

#     except Exception as e:
#         LOGGER.exception("Async audio thread error: %s", e)
#         send_whatsapp_message(
#             from_number,
#             "⚠️ Couldn't process your voice message. Please type your question instead 💬"
#         )


# # ── Embeddings ────────────────────────────────────────────────────────────────
# def embed_text(text: str) -> list:
#     if not text:
#         return []
#     try:
#         if CLIENT_KIND == "genai_client" and GEMINI_CLIENT is not None:
#             r = GEMINI_CLIENT.models.embed_content(model="text-embedding-004", content=text)
#             return getattr(r, "embedding", None) or []
#         if CLIENT_KIND == "generativeai" and GENAI_LEGACY is not None:
#             r = GENAI_LEGACY.embed_content(model="text-embedding-004", content=text)
#             return getattr(r, "embedding", None) or []
#     except Exception as e:
#         LOGGER.exception("Embedding failed: %s", e)
#         raise RuntimeError(f"Embedding failed: {e}")
#     raise RuntimeError("No embedding client configured")


# if LC_AVAILABLE:
#     class GeminiEmbeddings(Embeddings):
#         def embed_documents(self, texts):
#             return [embed_text(t) for t in texts]
#         def embed_query(self, text):
#             return embed_text(text)
#     _EMBEDDINGS = GeminiEmbeddings()
# else:
#     _EMBEDDINGS = None


# def index_documents(docs: list):
#     if not LC_AVAILABLE or _EMBEDDINGS is None:
#         return None
#     try:
#         splitter = CharacterTextSplitter(chunk_size=1500, chunk_overlap=200)
#         chunks   = splitter.split_documents(docs)
#         store    = FAISS.from_documents(documents=chunks, embedding=_EMBEDDINGS)
#         store.save_local(INDEX_DIR)
#         return store
#     except Exception as e:
#         LOGGER.exception("Indexing failed: %s", e)
#         return None


# def retrieve_context(query: str) -> str:
#     if not LC_AVAILABLE or _EMBEDDINGS is None:
#         return ""
#     if not os.path.exists(os.path.join(INDEX_DIR, "index.faiss")):
#         return ""
#     try:
#         store = FAISS.load_local(INDEX_DIR, embeddings=_EMBEDDINGS, allow_dangerous_deserialization=True)
#         docs  = store.similarity_search(query, k=3)
#         return "\n\n---\n\n".join(d.page_content for d in docs)
#     except Exception as e:
#         LOGGER.error("Context retrieval failed: %s", e)
#         return ""


# # ── Media download ────────────────────────────────────────────────────────────
# def download_media(url: str) -> str:
#     parsed_ext = os.path.splitext(url.split("?")[0])[1]
#     response   = REQUESTS_SESSION.get(url, stream=True, timeout=30, auth=TWILIO_AUTH,
#                                       headers={"User-Agent": "PostOpPal/1.0"})
#     response.raise_for_status()

#     content_type = response.headers.get("Content-Type", "").split(";")[0].strip().lower()
#     ext = parsed_ext or mimetypes.guess_extension(content_type) or ""
#     if not ext:
#         ct_map = {
#             "audio/ogg":       ".ogg",
#             "audio/mpeg":      ".mp3",
#             "audio/wav":       ".wav",
#             "audio/mp4":       ".m4a",
#             "audio/aac":       ".aac",
#             "audio/amr":       ".amr",
#             "audio/flac":      ".flac",
#             "image/jpeg":      ".jpg",
#             "image/png":       ".png",
#             "image/webp":      ".webp",
#             "application/pdf": ".pdf",
#         }
#         ext = ct_map.get(content_type, ".bin")

#     path = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4().hex}{ext}")
#     with open(path, "wb") as f:
#         shutil.copyfileobj(response.raw, f)

#     LOGGER.info("Downloaded media → %s  content-type=%s", path, content_type)
#     return path


# # ── OCR ───────────────────────────────────────────────────────────────────────
# def ocr_image_to_text(path: str) -> str:
#     if not TESSERACT_AVAILABLE:
#         raise RuntimeError("Tesseract not available")
#     return pytesseract.image_to_string(Image.open(path)) or ""


# # ── Legacy Google Cloud Speech (kept as fallback, not used for voice notes) ───
# def transcribe_audio_gcloud(path: str) -> str:
#     if not GCLOUD_SPEECH_AVAILABLE:
#         raise RuntimeError("Google Cloud Speech not available")
#     client  = speech.SpeechClient()
#     content = open(path, "rb").read()
#     config  = speech.RecognitionConfig(
#         encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
#         audio_channel_count=1, language_code="en-US",
#         enable_automatic_punctuation=True,
#     )
#     resp = client.recognize(config=config, audio=speech.RecognitionAudio(content=content))
#     return " ".join(r.alternatives[0].transcript for r in resp.results if r.alternatives)


# # ── Red-flag detection ────────────────────────────────────────────────────────
# _RED_FLAGS = [
#     "fever", "bleeding", "pus", "severe pain", "faint",
#     "shortness of breath", "chest pain", "vomiting", "swelling", "infection",
# ]
# _RED_FLAG_REGEX = re.compile(
#     r"\b(" + "|".join(re.escape(rf) for rf in _RED_FLAGS) + r")\b", re.IGNORECASE
# )

# def detect_red_flag(text: str) -> Optional[str]:
#     m = _RED_FLAG_REGEX.search(text or "")
#     return m.group(0).lower() if m else None


# # ── Session DB ────────────────────────────────────────────────────────────────
# QR_PATIENT_PATTERN = re.compile(r"POSTOPPAL_PATIENT_(\w+)", re.IGNORECASE)
# _SETUP_STATE: dict = {}

# SETUP_STEPS = ["name", "age", "surgery_type", "surgery_date", "doctor_name", "allergies", "medications"]
# SETUP_PROMPTS = {
#     "name":         "👤 What is the patient's full name?",
#     "age":          "🎂 What is the patient's age?",
#     "surgery_type": "🏥 What type of surgery was performed? (e.g. knee replacement, appendectomy)",
#     "surgery_date": "📅 What was the surgery date? (format: YYYY-MM-DD)",
#     "doctor_name":  "👨‍⚕️ What is the doctor/surgeon's name?",
#     "allergies":    "⚠️ Any known allergies? (or type 'none')",
#     "medications":  "💊 Current medications? (or type 'none')",
# }


# def init_session_db() -> None:
#     conn = sqlite3.connect(SESSION_DB)
#     conn.execute("""CREATE TABLE IF NOT EXISTS sessions(
#         from_number TEXT PRIMARY KEY,
#         patient_id  TEXT,
#         created_at  TEXT
#     )""")
#     conn.commit()
#     conn.close()


# def save_session_db(from_number: str, patient_id: str) -> None:
#     conn = sqlite3.connect(SESSION_DB)
#     conn.execute(
#         "INSERT OR REPLACE INTO sessions(from_number, patient_id, created_at) VALUES (?,?,?)",
#         (from_number, patient_id, datetime.datetime.now(datetime.timezone.utc).isoformat()),
#     )
#     conn.commit()
#     conn.close()


# def get_session_db(from_number: str) -> Optional[str]:
#     conn = sqlite3.connect(SESSION_DB)
#     row  = conn.execute("SELECT patient_id FROM sessions WHERE from_number = ?", (from_number,)).fetchone()
#     conn.close()
#     return row[0] if row else None


# init_session_db()

# # ── Flask app ─────────────────────────────────────────────────────────────────
# APP = Flask(__name__)


# @APP.route("/", methods=["GET"])
# def home():
#     return "PostOpPal Bot Running ✅"


# @APP.route("/whatsapp/incoming", methods=["POST"])
# def whatsapp_incoming():
#     try:
#         from_number   = (request.values.get("From") or "").strip()
#         incoming_text = (request.values.get("Body") or "").strip()
#         media_url     = request.values.get("MediaUrl0")
#         num_media     = int(request.values.get("NumMedia") or 0)

#         LOGGER.info("From=%s NumMedia=%d Body=%s", from_number, num_media, incoming_text[:120])

#         resp = MessagingResponse()
#         msg  = resp.message()

#         def reply(text):
#             msg.body(text)
#             return Response(str(resp), mimetype="application/xml")

#         # ── Wearable data ─────────────────────────────────────────────────────
#         if incoming_text.lower().startswith("wearable"):
#             if not WEARABLE_AVAILABLE:
#                 return reply("⚠️ Wearable module not installed.")
#             try:
#                 _, hr, steps, sleep = incoming_text.split()
#                 save_wearable_data(from_number, hr, steps, sleep)
#                 return reply("✅ Wearable data saved! I'll use this to personalise your advice.")
#             except ValueError:
#                 return reply("⚠️ Format: wearable <hr> <steps> <sleep>  e.g. wearable 85 6000 7")

#         # ── Profile setup flow ────────────────────────────────────────────────
#         if from_number in _SETUP_STATE:
#             state = _SETUP_STATE[from_number]
#             step  = state["step"]
#             state["data"][step] = incoming_text.strip()

#             idx      = SETUP_STEPS.index(step)
#             next_idx = idx + 1

#             if next_idx < len(SETUP_STEPS):
#                 next_step     = SETUP_STEPS[next_idx]
#                 state["step"] = next_step
#                 return reply(SETUP_PROMPTS[next_step])
#             else:
#                 patient_id = state["patient_id"]
#                 save_patient(patient_id, **state["data"])
#                 del _SETUP_STATE[from_number]

#                 plan_prompt = build_recovery_plan_prompt(patient_id)
#                 plan        = gemini_generate_with_retry(plan_prompt)
#                 save_recovery_plan(patient_id, plan)

#                 return reply(
#                     f"✅ Profile saved for Patient {patient_id}!\n\n"
#                     f"📋 *Your Personalized Recovery Plan:*\n\n{plan}\n\n"
#                     f"You can now ask me anything about your recovery! 💪"
#                 )

#         # ── Media handling ────────────────────────────────────────────────────
#         if num_media > 0 and media_url:
#             try:
#                 local_path = download_media(media_url)
#             except Exception as e:
#                 LOGGER.exception("Media download failed: %s", e)
#                 return reply("⚠️ Couldn't download the media. Please try again.")

#             lower = local_path.lower()

#             # ── PDF ───────────────────────────────────────────────────────────
#             if lower.endswith(".pdf") and LC_AVAILABLE:
#                 try:
#                     docs = PyPDFLoader(local_path).load()
#                     index_documents(docs)
#                     return reply("📄 PDF indexed. Ask me anything from it.")
#                 except Exception as e:
#                     LOGGER.exception("PDF failed: %s", e)
#                     return reply("⚠️ Failed to process PDF.")

#             # ── Image → async Gemini Vision wound analysis ────────────────────
#             if lower.endswith((".png", ".jpg", ".jpeg", ".webp")):
#                 patient_id  = get_session_db(from_number)
#                 patient_ctx = (
#                     build_patient_context(patient_id)
#                     if patient_id else "No patient profile linked."
#                 )
#                 threading.Thread(
#                     target=analyze_image_async,
#                     args=(from_number, local_path, patient_id, patient_ctx, incoming_text),
#                     daemon=True,
#                 ).start()
#                 return reply(
#                     "🔍 *Analyzing your wound image...*\n\n"
#                     "Please wait — I'll send the full assessment in a few seconds 🩹"
#                 )

#             # ── Audio → async Gemini transcription + response ─────────────────
#             if lower.endswith(AUDIO_EXTENSIONS):
#                 patient_id  = get_session_db(from_number)
#                 patient_ctx = (
#                     build_patient_context(patient_id)
#                     if patient_id else "No patient profile linked."
#                 )
#                 threading.Thread(
#                     target=analyze_audio_async,
#                     args=(from_number, local_path, patient_id, patient_ctx),
#                     daemon=True,
#                 ).start()
#                 return reply(
#                     "🎙️ *Voice message received!*\n\n"
#                     "Transcribing and analyzing... I'll reply in a few seconds 💬"
#                 )

#             # ── Unknown media ─────────────────────────────────────────────────
#             LOGGER.warning("Unrecognized media file: %s", local_path)
#             return reply(
#                 "📎 Media received but format not recognized.\n\n"
#                 "Supported formats:\n"
#                 "🩹 Images: jpg, png\n"
#                 "🎙️ Voice: ogg, mp3, m4a, wav\n"
#                 "📄 Documents: pdf"
#             )

#         # ── Text commands ─────────────────────────────────────────────────────
#         if incoming_text:

#             match = QR_PATIENT_PATTERN.search(incoming_text)
#             if match:
#                 patient_id = match.group(1)
#                 save_session_db(from_number, patient_id)
#                 patient = get_patient(patient_id)
#                 if patient and patient.get("name"):
#                     plan      = get_recovery_plan(patient_id)
#                     plan_text = "\n\n📋 Your recovery plan is ready. Type *myplan* to view it." if plan else ""
#                     return reply(
#                         f"✅ Welcome back, {patient['name']}!\n"
#                         f"Patient ID: {patient_id}{plan_text}\n\n"
#                         f"Ask me anything about your recovery 💪"
#                     )
#                 else:
#                     _SETUP_STATE[from_number] = {"step": "name", "data": {}, "patient_id": patient_id}
#                     return reply(
#                         f"✅ Connected! Patient ID: {patient_id}\n\n"
#                         f"Let me set up your profile for personalized care.\n\n"
#                         + SETUP_PROMPTS["name"]
#                     )

#             patient_id = get_session_db(from_number)
#             if not patient_id:
#                 return reply(
#                     "👋 Hello! Please scan your PostOpPal QR code first.\n"
#                     "It will send a message like: POSTOPPAL_PATIENT_1023"
#                 )

#             if incoming_text.lower() in ("myplan", "my plan", "recovery plan", "plan"):
#                 plan = get_recovery_plan(patient_id)
#                 if plan:
#                     return reply(f"📋 *Your Recovery Plan:*\n\n{plan}")
#                 return reply("No recovery plan found. Type *newplan* to generate one.")

#             if incoming_text.lower() in ("newplan", "new plan", "regenerate plan"):
#                 patient = get_patient(patient_id)
#                 if not patient or not patient.get("surgery_type"):
#                     return reply("⚠️ Please complete your profile first before generating a plan.")
#                 plan_prompt = build_recovery_plan_prompt(patient_id)
#                 plan        = gemini_generate_with_retry(plan_prompt)
#                 save_recovery_plan(patient_id, plan)
#                 return reply(f"📋 *Your New Recovery Plan:*\n\n{plan}")

#             if incoming_text.lower() in ("myprofile", "my profile", "profile"):
#                 patient = get_patient(patient_id)
#                 if not patient:
#                     return reply("No profile found. Please complete setup.")
#                 days     = days_since_surgery(patient)
#                 days_str = f"{days} days ago" if days is not None else "unknown"
#                 return reply(
#                     f"👤 *Your Profile*\n\n"
#                     f"Name      : {patient['name'] or 'Not set'}\n"
#                     f"Age       : {patient['age'] or 'Not set'}\n"
#                     f"Surgery   : {patient['surgery_type'] or 'Not set'}\n"
#                     f"Date      : {patient['surgery_date'] or 'Not set'} ({days_str})\n"
#                     f"Doctor    : {patient['doctor_name'] or 'Not set'}\n"
#                     f"Allergies : {patient['allergies'] or 'None'}\n"
#                     f"Meds      : {patient['medications'] or 'None'}\n\n"
#                     f"Type *update* to change any information."
#                 )

#             if incoming_text.lower() in ("update", "update profile", "edit profile"):
#                 _SETUP_STATE[from_number] = {"step": "name", "data": {}, "patient_id": patient_id}
#                 return reply("Let's update your profile.\n\n" + SETUP_PROMPTS["name"])

#             if incoming_text.lower() in ("help", "menu", "commands"):
#                 return reply(
#                     "🤖 *PostOpPal Commands*\n\n"
#                     "📋 *myplan* – View your recovery plan\n"
#                     "🔄 *newplan* – Regenerate your recovery plan\n"
#                     "👤 *myprofile* – View your profile\n"
#                     "✏️ *update* – Update your profile\n"
#                     "📊 *wearable 85 6000 7* – Log heart rate, steps, sleep\n"
#                     "🩹 *Send a photo* – AI wound analysis\n"
#                     "🎙️ *Send a voice note* – Speak your question\n"
#                     "❓ Ask any question about your recovery!\n\n"
#                     "Examples:\n"
#                     "• Is swelling normal?\n"
#                     "• When can I drive?\n"
#                     "• What should I eat?\n"
#                     "• [Send wound photo for visual AI analysis]\n"
#                     "• [Record a voice note to ask your question]"
#                 )

#             red_flag = detect_red_flag(incoming_text)
#             if red_flag:
#                 return reply(
#                     f"🚨 *Emergency Alert!*\n\n"
#                     f"I noticed you mentioned: *{red_flag}*\n\n"
#                     f"Please contact your doctor or emergency services immediately!\n"
#                     f"🏥 Emergency: 112\n"
#                     f"📞 Or call your doctor right away."
#                 )

#             if not can_call_ai(from_number):
#                 return reply("⏳ Please wait a few seconds before asking again.")

#             wearable_data = get_wearable_data(from_number) if WEARABLE_AVAILABLE else None
#             patient_ctx   = build_patient_context(patient_id, wearable_data)
#             rag_ctx       = retrieve_context(incoming_text)

#             history      = get_chat_history(patient_id, limit=6)
#             history_text = ""
#             if history:
#                 history_text = "\nRecent conversation:\n" + "\n".join(
#                     f"{'Patient' if h['role'] == 'user' else 'Assistant'}: {h['message']}"
#                     for h in history
#                 )

#             prompt = f"""You are PostOpPal, a compassionate and knowledgeable post-operative care assistant.

# PATIENT INFORMATION:
# {patient_ctx}
# {history_text}

# {"RELEVANT MEDICAL DOCUMENTS:\n" + rag_ctx if rag_ctx else ""}

# PATIENT'S QUESTION: {incoming_text}

# Instructions:
# - Give personalized advice based on this specific patient's surgery type, age, and recovery stage
# - Reference their specific surgery and how many days post-op they are
# - Be warm, supportive, and easy to understand
# - Use emojis for readability
# - If the question is beyond your scope, advise them to contact their doctor
# - Keep response concise (suitable for WhatsApp)"""

#             answer = gemini_generate_with_retry(prompt)
#             save_chat(patient_id, from_number, "user",      incoming_text)
#             save_chat(patient_id, from_number, "assistant", answer)
#             return reply(safe_reply(answer))

#         # ── Fallback ──────────────────────────────────────────────────────────
#         return reply(
#             "👋 Hello! Send a question, type *help* for all commands,\n"
#             "send a wound photo 🩹 or voice note 🎙️ for AI analysis!"
#         )

#     except Exception as e:
#         LOGGER.exception("Server error: %s", e)
#         resp2 = MessagingResponse()
#         resp2.message("⚠️ Something went wrong. Please try again later.")
#         return Response(str(resp2), mimetype="application/xml")


# # ── Entry point ───────────────────────────────────────────────────────────────
# if __name__ == "__main__":
#     LOGGER.info("=" * 60)
#     LOGGER.info("PostOpPal Bot Starting")
#     LOGGER.info("=" * 60)
#     LOGGER.info("CLIENT_KIND         : %s", CLIENT_KIND)
#     LOGGER.info("Gemini key set      : %s", bool(GEMINI_API_KEY))
#     LOGGER.info("LangChain/FAISS     : %s", LC_AVAILABLE)
#     LOGGER.info("Tesseract OCR       : %s", TESSERACT_AVAILABLE)
#     LOGGER.info("Google Cloud Speech : %s", GCLOUD_SPEECH_AVAILABLE)
#     LOGGER.info("Wearable helper     : %s", WEARABLE_AVAILABLE)
#     LOGGER.info("Twilio REST client  : %s", bool(TWILIO_REST))

#     PORT  = int(os.getenv("PORT", "5000"))
#     DEBUG = os.getenv("DEBUG", "False").lower() == "true"
#     LOGGER.info("Starting on 0.0.0.0:%d  debug=%s", PORT, DEBUG)
#     APP.run(host="0.0.0.0", port=PORT, debug=DEBUG)


"""
WhatsApp AI Bot with Twilio and Python LangChain
A chatbot server that integrates with WhatsApp via Twilio
and uses LangChain for AI-powered responses.
"""

import os
import re
import uuid
import shutil
import logging
import sqlite3
import datetime
import mimetypes
import time
from typing import Optional
from dotenv import load_dotenv
from flask import Flask, request, Response
from twilio.twiml.messaging_response import MessagingResponse
import requests
from requests.auth import HTTPBasicAuth
from requests.adapters import HTTPAdapter, Retry
from PIL import Image

# Optional libs — imported conditionally
GENAI_CLIENT = None
GENAI_LEGACY = None
CLIENT_KIND = None

try:
    from google import genai as genai_client_lib
    GENAI_CLIENT = genai_client_lib
    CLIENT_KIND = "genai_client"
except ImportError:
    try:
        import google.generativeai as genai_legacy
        GENAI_LEGACY = genai_legacy
        CLIENT_KIND = "generativeai"
    except ImportError:
        CLIENT_KIND = None

from twilio.twiml.messaging_response import MessagingResponse
from wearable_helper import save_wearable_data, get_wearable_data, wearable_risk

# Optional LangChain + FAISS
LC_AVAILABLE = False
try:
    from langchain_community.document_loaders import PyPDFLoader
    from langchain_text_splitters import CharacterTextSplitter
    from langchain_community.vectorstores import FAISS
    from langchain.schema import Document as LC_Document
    LC_AVAILABLE = True
except ImportError:
    LC_AVAILABLE = False

# Optional Tesseract OCR
TESSERACT_AVAILABLE = False
try:
    import pytesseract
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False

# Optional Google Cloud Speech
GCLOUD_SPEECH_AVAILABLE = False
try:
    from google.cloud import speech_v1p1beta1 as speech
    GCLOUD_SPEECH_AVAILABLE = True
except ImportError:
    GCLOUD_SPEECH_AVAILABLE = False

# ---------------- Load .env and config ----------------
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GENAI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("❌ GEMINI_API_KEY (or GENAI_API_KEY) missing in .env")

UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

INDEX_DIR = os.getenv("INDEX_DIR", "faiss_gemini_index")
os.makedirs(INDEX_DIR, exist_ok=True)

SESSION_DB = os.getenv("SESSION_DB", "sessions.db")

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=getattr(logging, LOG_LEVEL))
LOGGER = logging.getLogger("postoppal")

# Twilio credentials (optional for authenticated media fetching)
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_AUTH = None
if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
    TWILIO_AUTH = HTTPBasicAuth(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# ---------------- HTTP session with retries ----------------
REQUESTS_SESSION = requests.Session()
RETRIES = Retry(total=3, backoff_factor=0.3, status_forcelist=(500, 502, 503, 504))
REQUESTS_SESSION.mount("https://", HTTPAdapter(max_retries=RETRIES))
REQUESTS_SESSION.mount("http://", HTTPAdapter(max_retries=RETRIES))

# ---------------- Utility ----------------
def safe_reply(text: str) -> str:
    """Safely convert text to reply string."""
    try:
        txt = str(text).strip()
    except (ValueError, TypeError):
        txt = ""
    return txt if txt else "I'm here! How can I help you today?"


# ------------------------------------------------------------------ #
#  Language Detection                                                  #
# ------------------------------------------------------------------ #

# Unicode range for Devanagari script (Hindi characters)
_DEVANAGARI_RE = re.compile(r'[\u0900-\u097F]')

# Common Hinglish marker words written in Latin script
_HINGLISH_WORDS = {
    "kya", "hai", "hain", "nahi", "nahin", "aur", "mein", "main",
    "kar", "karo", "karna", "hua", "hoga", "ho", "bhi", "toh",
    "yeh", "ye", "woh", "wo", "ek", "do", "theek", "thik",
    "abhi", "jab", "tab", "phir", "fir", "bahut", "accha", "acha",
    "dard", "dawa", "dawai", "khana", "pani", "doctor", "bukhar",
    "takleef", "problem", "batao", "bata", "samajh", "samjha",
    "kyun", "kyu", "kaise", "kaisa", "kitna", "kitne", "kab",
    "matlab", "sahi", "galat", "hona", "tha", "thi", "the",
    "raha", "rahi", "rahe", "liya", "liye", "dena", "dono",
    "apna", "apne", "mera", "meri", "tera", "teri", "uska",
    "sirf", "bas", "lekin", "par", "aaj", "kal", "raat", "din",
}


def detect_language(text: str) -> str:
    """
    Detect the language/style of the incoming message.

    Returns one of:
        "hindi"    – message contains Devanagari script
        "hinglish" – message is in Roman script but uses Hindi/Urdu words
        "english"  – everything else
    """
    if not text:
        return "english"

    # Pure Hindi (Devanagari)
    if _DEVANAGARI_RE.search(text):
        return "hindi"

    # Hinglish: check what fraction of words are Hinglish markers
    words = re.findall(r"[a-zA-Z]+", text.lower())
    if words:
        hindi_word_count = sum(1 for w in words if w in _HINGLISH_WORDS)
        ratio = hindi_word_count / len(words)
        if ratio >= 0.20 or hindi_word_count >= 2:   # ≥20 % OR at least 2 known words
            return "hinglish"

    return "english"


def language_instruction(lang: str) -> str:
    """
    Return the language-style instruction to embed in the Gemini prompt.
    """
    if lang == "hindi":
        return (
            "IMPORTANT: The user is writing in Hindi (Devanagari script). "
            "You MUST reply entirely in Hindi using Devanagari script. "
            "Do NOT use English or Roman script in your reply."
        )
    elif lang == "hinglish":
        return (
            "IMPORTANT: The user is writing in Hinglish (a casual mix of Hindi "
            "and English using Roman script, like 'Mujhe dard ho raha hai'). "
            "You MUST reply in the same Hinglish style — Roman script, mix of "
            "Hindi and English words, friendly and conversational tone. "
            "Do NOT reply in pure English or pure Devanagari Hindi."
        )
    else:
        return (
            "IMPORTANT: The user is writing in English. "
            "Reply in clear, simple English."
        )


# ---------------- Gemini client setup ----------------
GEMINI_CLIENT = None
if CLIENT_KIND == "genai_client" and GENAI_CLIENT is not None:
    GEMINI_CLIENT = GENAI_CLIENT.Client(api_key=GEMINI_API_KEY)
elif CLIENT_KIND == "generativeai" and GENAI_LEGACY is not None:
    GENAI_LEGACY.configure(api_key=GEMINI_API_KEY)

# ---------------- Simple per-user rate limiting ----------------
MIN_SECONDS_BETWEEN_CALLS = float(os.getenv("MIN_SECONDS_BETWEEN_CALLS", "3"))
_LAST_CALL = {}  # from_number -> timestamp (epoch seconds)

def can_call_ai(user: str) -> bool:
    """Check if user can call AI based on rate limiting."""
    now = time.time()
    last = _LAST_CALL.get(user)
    if last and (now - last) < MIN_SECONDS_BETWEEN_CALLS:
        return False
    _LAST_CALL[user] = now
    return True


# ---------------- Gemini Generation with Retry Logic ----------------
def gemini_generate_with_retry(prompt: str, model: str = "gemini-2.5-flash", max_retries: int = 3) -> str:
    """
    Generate content with automatic retry for rate limits (429 errors).
    """
    if CLIENT_KIND not in ("genai_client", "generativeai"):
        LOGGER.warning("No Gemini client available (CLIENT_KIND=%s)", CLIENT_KIND)
        return "AI model is not configured on the server."

    for attempt in range(max_retries):
        try:
            if CLIENT_KIND == "genai_client" and GEMINI_CLIENT is not None:
                res = GEMINI_CLIENT.models.generate_content(model=model, contents=prompt)
                text = getattr(res, "text", None) or getattr(res, "content", None)
                if not text and hasattr(res, "candidates") and res.candidates:
                    candidate = res.candidates[0]
                    text = getattr(candidate, "content", None) or getattr(candidate, "text", None)
                return safe_reply(text if text else str(res))

            if CLIENT_KIND == "generativeai" and GENAI_LEGACY is not None:
                model_obj = GENAI_LEGACY.GenerativeModel(model_name=model)
                res = model_obj.generate_content(prompt)
                return safe_reply(getattr(res, "text", str(res)))

        except Exception as e:
            err_msg = str(e)
            LOGGER.warning(f"Gemini API call attempt {attempt + 1} failed: {err_msg}")

            if "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg:
                if attempt < max_retries - 1:
                    wait_time = (2 ** attempt) + 1
                    LOGGER.info(f"Rate limit hit. Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                    continue
                else:
                    LOGGER.error("Max retries reached for rate limit.")
                    return "⚠️ Free Gemini limit reached. Please wait 1–2 minutes and try again."

            LOGGER.exception(f"Non-retryable error in Gemini API: {err_msg}")
            return "⚠️ AI service is currently unavailable. Please try again later."

    return "Request failed after retries."


# ---------------- Embeddings & RAG helpers ----------------
def embed_text(text: str) -> list:
    """Generate embeddings for text using Gemini."""
    if not text:
        return []

    try:
        if CLIENT_KIND == "genai_client" and GEMINI_CLIENT is not None:
            response = GEMINI_CLIENT.models.embed_content(
                model="text-embedding-004",
                content=text
            )
            if hasattr(response, 'embedding'):
                return response.embedding
            elif isinstance(response, dict) and 'embedding' in response:
                return response['embedding']
            else:
                response2 = GEMINI_CLIENT.embed_content(
                    model="text-embedding-004",
                    content=text
                )
                return response2.embedding

        elif CLIENT_KIND == "generativeai" and GENAI_LEGACY is not None:
            response = GENAI_LEGACY.embed_content(
                model="text-embedding-004",
                content=text
            )
            if hasattr(response, 'embedding'):
                return response.embedding
            elif isinstance(response, dict) and 'embedding' in response:
                return response['embedding']
            return response

    except Exception as e:
        LOGGER.exception(f"Embedding failed for text (len={len(text)}): {str(e)}")
        raise RuntimeError(f"Embedding failed: {str(e)}")

    raise RuntimeError("No embedding client configured")


def index_documents(docs: list) -> Optional[object]:
    """Index documents using FAISS."""
    if not LC_AVAILABLE:
        LOGGER.warning("LangChain/FAISS not available; skipping indexing")
        return None

    try:
        splitter = CharacterTextSplitter(chunk_size=1500, chunk_overlap=200)
        chunks = splitter.split_documents(docs)

        try:
            store = FAISS.from_documents(documents=chunks, embedding=embed_text)
            store.save_local(INDEX_DIR)
            LOGGER.info(f"FAISS index created at {INDEX_DIR}")
            return store
        except Exception as e:
            LOGGER.error(f"FAISS.from_documents failed: {e}")
            texts = [chunk.page_content for chunk in chunks]
            embeddings = [embed_text(text) for text in texts]

            import numpy as np
            import faiss as faiss_lib
            import pickle

            embeddings_np = np.array(embeddings).astype('float32')
            dimension = embeddings_np.shape[1]
            index = faiss_lib.IndexFlatL2(dimension)
            index.add(embeddings_np)
            faiss_lib.write_index(index, os.path.join(INDEX_DIR, "index.faiss"))

            with open(os.path.join(INDEX_DIR, "index.pkl"), 'wb') as f:
                pickle.dump(texts, f)

            LOGGER.info(f"FAISS index created manually at {INDEX_DIR}")
            return None

    except Exception as e:
        LOGGER.exception(f"Failed to index documents: {e}")
        return None


def retrieve_context(query: str) -> str:
    """Retrieve context from FAISS index."""
    if not LC_AVAILABLE:
        return ""
    if not os.path.exists(os.path.join(INDEX_DIR, "index.faiss")):
        return ""

    try:
        store = FAISS.load_local(
            INDEX_DIR,
            embeddings=embed_text,
            allow_dangerous_deserialization=True
        )
        docs = store.similarity_search(query, k=3)
        return "\n\n---\n\n".join([d.page_content for d in docs])
    except Exception as e:
        LOGGER.error(f"Error retrieving context: {e}")
        return ""


# ---------------- Media download ----------------
def download_media(url: str) -> str:
    """Download media with retries."""
    parsed_ext = os.path.splitext(url.split("?")[0])[1]

    try:
        response = REQUESTS_SESSION.get(
            url,
            stream=True,
            timeout=30,
            auth=TWILIO_AUTH,
            headers={"User-Agent": "PostOpPal/1.0"}
        )
        response.raise_for_status()
    except Exception as e:
        LOGGER.exception(f"Failed to GET media url: {url}")
        raise

    content_type = response.headers.get("Content-Type", "").split(";")[0].strip().lower()
    ext = parsed_ext

    if not ext and content_type:
        ext = mimetypes.guess_extension(content_type) or ""

    if not ext:
        ct_map = {
            "image/jpeg": ".jpg", "image/jpg": ".jpg", "image/png": ".png",
            "application/pdf": ".pdf", "audio/mpeg": ".mp3", "audio/x-wav": ".wav",
            "audio/wav": ".wav", "audio/mp4": ".m4a",
        }
        ext = ct_map.get(content_type, ".bin")

    name = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(UPLOAD_FOLDER, name)

    try:
        with open(path, "wb") as f:
            shutil.copyfileobj(response.raw, f)
    except Exception as e:
        LOGGER.exception(f"Failed writing media to disk: {path}")
        raise

    LOGGER.info(f"Downloaded media to {path} (content-type={content_type})")
    return path


# ---------------- OCR / Transcription ----------------
def ocr_image_to_text(path: str) -> str:
    if not TESSERACT_AVAILABLE:
        raise RuntimeError("Tesseract not available")
    try:
        text = pytesseract.image_to_string(Image.open(path))
        return text or ""
    except Exception as e:
        LOGGER.exception(f"OCR failed: {e}")
        return ""


def transcribe_audio_gcloud(path: str) -> str:
    if not GCLOUD_SPEECH_AVAILABLE:
        raise RuntimeError("Google Cloud Speech not available")
    try:
        speech_client = speech.SpeechClient()
        with open(path, "rb") as audio_file:
            content = audio_file.read()
        audio_obj = speech.RecognitionAudio(content=content)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            audio_channel_count=1,
            language_code="en-US",
            model="default",
            enable_automatic_punctuation=True,
        )
        response = speech_client.recognize(config=config, audio=audio_obj)
        transcripts = [
            result.alternatives[0].transcript
            for result in response.results
            if result.alternatives
        ]
        return " ".join(transcripts)
    except Exception as e:
        LOGGER.exception(f"Audio transcription failed: {e}")
        return ""


# ---------------- Red-flag detection ----------------
RED_FLAGS = ["fever", "bleeding", "pus", "severe pain", "faint", "shortness of breath",
             "bukhar", "khoon", "dard", "behoshi"]   # added Hindi variants
RED_FLAG_REGEX = re.compile(
    r"\b(" + "|".join(re.escape(rf) for rf in RED_FLAGS) + r")\b",
    flags=re.IGNORECASE
)

def detect_red_flag(text: str) -> Optional[str]:
    match = RED_FLAG_REGEX.search(text or "")
    return match.group(0).lower() if match else None


# ---------------- QR & Session handling ----------------
QR_PATIENT_PATTERN = re.compile(r"POSTOPPAL_PATIENT_(\w+)", re.IGNORECASE)

def init_session_db() -> None:
    conn = sqlite3.connect(SESSION_DB)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sessions(
            from_number TEXT PRIMARY KEY,
            patient_id TEXT,
            created_at TEXT
        )
    """)
    conn.commit()
    conn.close()


def save_session_db(from_number: str, patient_id: str) -> None:
    conn = sqlite3.connect(SESSION_DB)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT OR REPLACE INTO sessions(from_number, patient_id, created_at) VALUES (?,?,?)",
        (from_number, patient_id, datetime.datetime.now(datetime.timezone.utc).isoformat())
    )
    conn.commit()
    conn.close()


def get_session_db(from_number: str) -> Optional[str]:
    conn = sqlite3.connect(SESSION_DB)
    cursor = conn.cursor()
    cursor.execute("SELECT patient_id FROM sessions WHERE from_number = ?", (from_number,))
    row = cursor.fetchone()
    conn.close()
    return row[0] if row else None


init_session_db()

# ---------------- Flask app & webhook ----------------
APP = Flask(__name__)

@APP.route("/", methods=["GET"])
def home():
    return "Post-Op Pal Bot Running"


@APP.route("/whatsapp/incoming", methods=["POST"])
def whatsapp_incoming():
    """Handle incoming WhatsApp messages."""
    try:
        from_number = (request.values.get("From") or "").strip()
        incoming_text = (request.values.get("Body") or "").strip()
        media_url = request.values.get("MediaUrl0")
        num_media = int(request.values.get("NumMedia") or 0)

        LOGGER.info(
            f"Webhook hit. From={from_number} NumMedia={num_media} "
            f"Body={incoming_text[:120] if incoming_text else ''}"
        )

        # ── Detect language ONCE, use everywhere ──────────────────────
        lang = detect_language(incoming_text)
        LOGGER.info(f"Detected language: {lang} for message: {incoming_text[:60]}")
        lang_instr = language_instruction(lang)
        # ──────────────────────────────────────────────────────────────

        resp = MessagingResponse()
        msg = resp.message()

        # 1) Process media if present
        if num_media > 0 and media_url:
            try:
                local_path = download_media(media_url)
            except Exception as e:
                LOGGER.exception(f"Failed to download media: {e}")
                msg.body("⚠️ Couldn't download the media. Please try again.")
                return Response(str(resp), mimetype="application/xml")

            lower = local_path.lower()

            if lower.endswith(".pdf") and LC_AVAILABLE:
                try:
                    docs = PyPDFLoader(local_path).load()
                    index_documents(docs)
                    msg.body("📄 PDF indexed. Ask me anything from it.")
                except Exception as e:
                    LOGGER.exception(f"PDF processing failed: {e}")
                    msg.body("⚠️ Failed to process PDF.")
                return Response(str(resp), mimetype="application/xml")

            if lower.endswith((".png", ".jpg", ".jpeg")):
                if TESSERACT_AVAILABLE and LC_AVAILABLE:
                    try:
                        txt = ocr_image_to_text(local_path)
                        if txt.strip():
                            index_documents([LC_Document(page_content=txt)])
                            msg.body("🖼 Extracted text from image and indexed it.")
                        else:
                            msg.body("🖼 OCR ran but found no text.")
                    except Exception as e:
                        LOGGER.exception(f"OCR indexing failed: {e}")
                        msg.body("⚠️ OCR failed to extract text.")
                else:
                    msg.body("OCR or RAG not available on server.")
                return Response(str(resp), mimetype="application/xml")

            if lower.endswith((".wav", ".flac", ".mp3", ".m4a")):
                if GCLOUD_SPEECH_AVAILABLE and LC_AVAILABLE:
                    try:
                        transcript = transcribe_audio_gcloud(local_path)
                        if transcript:
                            index_documents([LC_Document(page_content=transcript)])
                            msg.body("🎧 Audio transcribed and indexed. Ask about it.")
                        else:
                            msg.body("🎧 Transcription didn't return text.")
                    except Exception as e:
                        LOGGER.exception(f"Audio transcription failed: {e}")
                        msg.body("⚠️ Audio transcription failed.")
                else:
                    msg.body("Audio transcription not available on server.")
                return Response(str(resp), mimetype="application/xml")

            msg.body("Media received and saved. If it's a PDF/image/audio, ensure server has required libs.")
            return Response(str(resp), mimetype="application/xml")

        # 2) Process text message
        if incoming_text:
            # Check for QR token
            match = QR_PATIENT_PATTERN.search(incoming_text)
            if match:
                patient_id = match.group(1)
                save_session_db(from_number, patient_id)
                msg.body(
                    f"✅ You're now connected to PostOpPal.\n"
                    f"Patient ID: {patient_id}\n"
                    f"You can ask: 'Is my pain normal?', 'When to take meds?', etc."
                )
                return Response(str(resp), mimetype="application/xml")

            # Check for existing session
            patient_id = get_session_db(from_number)
            if not patient_id:
                msg.body(
                    "Hello! Please scan your PostOpPal QR code first so I can "
                    "identify your record. It should send a message like "
                    "POSTOPPAL_PATIENT_1023."
                )
                return Response(str(resp), mimetype="application/xml")

            # Red flag detection
            red_flag = detect_red_flag(incoming_text)
            if red_flag:
                msg.body(
                    f"⚠️ I detected a possible emergency sign: '{red_flag}'. "
                    f"Please contact your doctor immediately or call emergency services."
                )
                return Response(str(resp), mimetype="application/xml")

            # Rate limit check
            if not can_call_ai(from_number):
                msg.body("⏳ Please wait a few seconds before asking again.")
                return Response(str(resp), mimetype="application/xml")

            # Retrieve context from FAISS
            context = retrieve_context(incoming_text)

            # ── Build prompt with language instruction injected ────────
            if context:
                prompt = f"""You are a medical assistant for post-operative patients.

{lang_instr}

Patient ID: {patient_id}
Question: {incoming_text}

Relevant information from patient's records:
{context}

Please provide a helpful, accurate, and safe response based on the context above.
If the context doesn't contain relevant information, say so and provide general advice.
Keep your response concise and easy to understand."""
            else:
                prompt = f"""You are a medical assistant for post-operative patients.

{lang_instr}

Patient ID: {patient_id}
Question: {incoming_text}

Provide helpful, accurate, and safe medical advice for post-operative care.
Keep your response concise and easy to understand."""
            # ──────────────────────────────────────────────────────────

            answer = gemini_generate_with_retry(prompt, model="gemini-2.5-flash")
            msg.body(safe_reply(answer))
            return Response(str(resp), mimetype="application/xml")

        # 3) No media and no text
        msg.body("Hello! Send a question or upload a PDF/image/audio for me to index.")
        return Response(str(resp), mimetype="application/xml")

    except Exception as e:
        LOGGER.exception(f"Server error in whatsapp_incoming: {e}")
        resp = MessagingResponse()
        resp.message("⚠️ Something went wrong on the server. Please try again later.")
        return Response(str(resp), mimetype="application/xml")


if __name__ == "__main__":
    LOGGER.info("=" * 60)
    LOGGER.info("PostOpPal Bot Starting")
    LOGGER.info("=" * 60)
    LOGGER.info(f"CLIENT_KIND: {CLIENT_KIND}")
    LOGGER.info(f"Gemini API Key configured: {'Yes' if GEMINI_API_KEY else 'No'}")

    if CLIENT_KIND == "generativeai" and GENAI_LEGACY is not None:
        try:
            models = GENAI_LEGACY.list_models()
            LOGGER.info("Available Gemini models:")
            for m in models:
                if 'generateContent' in m.supported_generation_methods:
                    LOGGER.info(f"  - {m.name}")
        except Exception as e:
            LOGGER.warning(f"Could not list models: {e}")

    port_str = os.getenv("PORT", "5000")
    PORT = int(port_str)
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    LOGGER.info(f"Starting server on 0.0.0.0:{PORT} (debug={DEBUG})")
    APP.run(host="0.0.0.0", port=PORT, debug=DEBUG)