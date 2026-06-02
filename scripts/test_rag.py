import traceback

try:
    from scripts import rag_faiss as rf
    ctx, chunks = rf.get_context_for_query("when can i eat after surgery", k=3)
    print("=== CONTEXT ===")
    print(ctx)
    print("=== CHUNKS ===")
    print(chunks)
except Exception as e:
    print("EXCEPTION:")
    traceback.print_exc()
