# Placeholder / compatibility wrapper for FAISS RAG retriever.
# Keeps a simple query_vectorstore() (existing) and adds
# retrieve() and get_context_for_query() so other code can call them.

from typing import List, Tuple, Dict

def query_vectorstore(query_text: str, patient_id: str = None):
    """
    Existing placeholder kept for compatibility.
    Later: replace with real FAISS search that returns chunk dicts.
    Expected return currently (example):
    {
      "chunks": [
         {"id":"c1","text":"...","source":"doc.pdf","score":0.9},
         ...
      ],
      "source": "not implemented"
    }
    """
    return {
        "chunks": [],
        "source": "not implemented"
    }

def retrieve(query: str, k: int = 5, patient_id: str = None) -> List[Dict]:
    """
    Use the lower-level query_vectorstore to return a list of chunk dicts.
    This is a compatibility layer so higher code can call `retrieve(...)`.
    """
    res = query_vectorstore(query, patient_id=patient_id) or {}
    chunks = res.get("chunks", []) if isinstance(res, dict) else []
    # ensure each chunk has id/text/source/score keys
    out = []
    for i, c in enumerate(chunks[:k]):
        out.append({
            "id": c.get("id", str(i)),
            "text": c.get("text", c.get("chunk", "")),
            "source": c.get("source", c.get("doc_id", None)),
            "score": float(c.get("score", 0.0))
        })
    return out

def get_context_for_query(query: str, k: int = 5, prefix: str = None) -> Tuple[str, List[Dict]]:
    """
    Returns (context_string, chunks_list)
    context_string is concatenation of top-k chunks with citation markers.
    """
    chunks = retrieve(query, k=k)
    if not chunks:
        return ("", [])
    context_parts = []
    for idx, c in enumerate(chunks, start=1):
        src = c.get("source") or c.get("id")
        text = (c.get("text") or "").strip()
        context_parts.append(f"[{idx}] ({src}) {text}")
    context = "\n\n".join(context_parts)
    if prefix:
        context = prefix.strip() + "\n\n" + context
    return context, chunks

# Backwards-compatible top-level names (optional)
__all__ = ["query_vectorstore", "retrieve", "get_context_for_query"]
