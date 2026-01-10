#!/usr/bin/env python3
"""
query_faiss_boost.py

Search FAISS but boost chunks that belong to a given patient_id (if provided).
Usage:
  python scripts/query_faiss_boost.py "when can i shower?" --k 5 --patient patient_001
"""

import argparse, json
from pathlib import Path
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

BASE = Path(__file__).resolve().parent.parent
INDEX_PATH = BASE / "post_op_faiss.index"
META_PATH = BASE / "post_op_faiss_meta.json"

EMBED_MODEL = "all-MiniLM-L6-v2"

def load_index_and_meta():
    if not INDEX_PATH.exists() or not META_PATH.exists():
        raise RuntimeError("Index or meta file missing.")
    index = faiss.read_index(str(INDEX_PATH))
    meta = json.loads(META_PATH.read_text(encoding="utf-8"))
    return index, meta

def embed_query(text, model):
    emb = model.encode([text])[0].astype("float32")
    norm = np.linalg.norm(emb)
    if norm != 0:
        emb = emb / norm
    return emb

def search(index, q_emb, top_k=50):
    q = np.array([q_emb]).astype("float32")
    D, I = index.search(q, top_k)
    return D[0], I[0]

def rerank_with_boost(distances, indices, meta, patient_id=None, boost_factor=1.2, out_k=5):
    results = []
    for score, idx in zip(distances, indices):
        if idx < 0 or idx >= len(meta):
            continue
        item = meta[idx].copy()
        item["score"] = float(score)
        item["boosted"] = False

        source = (item.get("source") or "").lower()

        if patient_id and patient_id.lower() in source:
            item["score"] *= boost_factor
            item["boosted"] = True

        results.append(item)

    results = sorted(results, key=lambda x: x["score"], reverse=True)
    return results[:out_k]

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("query", type=str)
    parser.add_argument("--k", type=int, default=5)
    parser.add_argument("--patient", type=str, default=None)
    parser.add_argument("--boost", type=float, default=1.25)
    args = parser.parse_args()

    index, meta = load_index_and_meta()
    model = SentenceTransformer(EMBED_MODEL)
    q_emb = embed_query(args.query, model)

    distances, indices = search(index, q_emb, top_k=50)
    results = rerank_with_boost(
        distances,
        indices,
        meta,
        patient_id=args.patient,
        boost_factor=args.boost,
        out_k=args.k,
    )

    print(f"\nTop {len(results)} results:")
    for i, r in enumerate(results, start=1):
        snippet = (r.get("text") or "").replace("\n", " ")[:350]
        print(f"\n[{i}] score={r['score']:.4f} boosted={r['boosted']} source={r.get('source')}")
        print("Snippet:", snippet)

if __name__ == "__main__":
    main()
