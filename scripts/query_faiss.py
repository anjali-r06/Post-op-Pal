#!/usr/bin/env python3
"""
query_faiss.py

Demo: embed a user query (locally using sentence-transformers),
search the FAISS index, and print top-k matches with metadata.

Usage:
  python scripts/query_faiss.py "how much should i walk after surgery?" --k 5
"""
import argparse
import json
from pathlib import Path
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

BASE = Path(__file__).resolve().parent.parent
INDEX_PATH = BASE / "post_op_faiss.index"
META_PATH = BASE / "post_op_faiss_meta.json"
EMBED_MODEL = "all-MiniLM-L6-v2"  # same model you used for embeddings

def load_index_and_meta():
    if not INDEX_PATH.exists() or not META_PATH.exists():
        raise RuntimeError("Index or meta file missing. Run build_faiss_index.py first.")
    index = faiss.read_index(str(INDEX_PATH))
    meta = json.loads(META_PATH.read_text(encoding="utf-8"))
    return index, meta

def embed_query(text, model):
    emb = model.encode([text])[0].astype("float32")
    norm = np.linalg.norm(emb)
    if norm == 0:
        return emb
    return emb / norm  # normalize to match index

def search(index, q_emb, k=5):
    q = np.array([q_emb]).astype("float32")
    D, I = index.search(q, k)
    return D[0], I[0]

def main():
    p = argparse.ArgumentParser()
    p.add_argument("query", type=str, help="Query text in quotes")
    p.add_argument("--k", type=int, default=5, help="Top k results")
    args = p.parse_args()

    print("Loading index and metadata...")
    index, meta = load_index_and_meta()

    print("Loading embedding model...")
    model = SentenceTransformer(EMBED_MODEL)

    print("Embedding query...")
    q_emb = embed_query(args.query, model)

    print("Searching FAISS...")
    distances, idxs = search(index, q_emb, k=args.k)

    print("\nTop results:")
    for rank, (score, idx) in enumerate(zip(distances, idxs), start=1):
        if idx < 0 or idx >= len(meta):
            continue
        item = meta[idx]
        print(f"\n[{rank}] score={float(score):.4f} id={item.get('id')} source={item.get('source')}")
        snippet = item.get("text","").strip().replace("\n"," ")[:500]
        print("Snippet:", snippet)

if __name__ == "__main__":
    main()