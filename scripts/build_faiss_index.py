#!/usr/bin/env python3
"""
build_faiss_index.py

Reads all *_hf_embeddings.jsonl files in post_op/data_chunks/,
builds a single FAISS index (cosine similarity via normalized vectors),
and writes:
  - post_op/post_op_faiss.index        (FAISS index file)
  - post_op/post_op_faiss_meta.json    (metadata list in same order as index)
"""
import json
from pathlib import Path
import numpy as np
import faiss

BASE = Path(__file__).resolve().parent.parent
CHUNKS_DIR = BASE / "data_chunks"
OUT_INDEX = BASE / "post_op_faiss.index"
OUT_META = BASE / "post_op_faiss_meta.json"

def load_embeddings():
    meta = []
    vectors = []
    files = sorted(CHUNKS_DIR.glob("*_hf_embeddings.jsonl"))
    if not files:
        raise RuntimeError(f"No *_hf_embeddings.jsonl files found in {CHUNKS_DIR}")
    for f in files:
        print("Reading", f.name)
        with f.open("r", encoding="utf-8") as fin:
            for line in fin:
                obj = json.loads(line)
                emb = obj.get("embedding")
                if not emb:
                    continue
                # Save metadata we need for retrieval
                meta.append({
                    "id": obj.get("id"),
                    "source": obj.get("source"),
                    "text": obj.get("text")
                })
                vectors.append(emb)
    vectors = np.array(vectors, dtype="float32")
    print("Loaded vectors shape:", vectors.shape)
    return vectors, meta

def build_index(vectors):
    # Use cosine similarity via inner product on normalized vectors.
    # Normalize vectors to unit length
    norms = np.linalg.norm(vectors, axis=1, keepdims=True)
    norms[norms==0] = 1.0
    vectors = vectors / norms

    dim = vectors.shape[1]
    index = faiss.IndexFlatIP(dim)  # Inner product on normalized vectors = cosine
    index.add(vectors)
    print("FAISS index built. ntotal =", index.ntotal)
    return index

def save_index(index, meta):
    faiss.write_index(index, str(OUT_INDEX))
    OUT_META.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    print("Saved index ->", OUT_INDEX)
    print("Saved metadata ->", OUT_META)

def main():
    vectors, meta = load_embeddings()
    if vectors.size == 0:
        raise RuntimeError("No embeddings found.")
    index = build_index(vectors)
    save_index(index, meta)
    print("Done.")

if __name__ == "__main__":
    main()
