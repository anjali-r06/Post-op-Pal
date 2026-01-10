#!/usr/bin/env python3
"""
create_hf_embeddings.py
Reads *_chunks.jsonl from post_op/data_chunks and writes *_hf_embeddings.jsonl
in the same folder. Uses sentence-transformers (all-MiniLM-L6-v2 by default).
"""
import json
from pathlib import Path
from sentence_transformers import SentenceTransformer

# CONFIG
MODEL_NAME = "all-MiniLM-L6-v2"   # small, fast, good quality for retrieval
BASE = Path(__file__).resolve().parent.parent
CHUNKS_DIR = BASE / "data_chunks"

def embed_file(input_path: Path, model):
    out_path = input_path.with_name(input_path.stem + "_hf_embeddings.jsonl")
    print(f"Embedding {input_path.name} -> {out_path.name}")
    with input_path.open("r", encoding="utf-8") as fin, out_path.open("w", encoding="utf-8") as fout:
        for line in fin:
            obj = json.loads(line)
            text = obj.get("text", "")
            # model.encode returns numpy array
            emb = model.encode(text).tolist()
            obj["embedding"] = emb
            fout.write(json.dumps(obj, ensure_ascii=False) + "\n")
    print("Wrote:", out_path.name)

def main():
    model = SentenceTransformer(MODEL_NAME)
    files = sorted(CHUNKS_DIR.glob("*_chunks.jsonl"))
    if not files:
        print("No *_chunks.jsonl files found in", CHUNKS_DIR)
        return
    for f in files:
        embed_file(f, model)
    print("All done. Embeddings saved to data_chunks/")

if __name__ == "__main__":
    main()
