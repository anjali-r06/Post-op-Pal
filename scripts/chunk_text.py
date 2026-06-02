#!/usr/bin/env python3
"""
chunk_text.py

Reads *_raw.txt files from ./data_raw/, splits each into chunks
(with overlap), and writes JSONL files into ./data_chunks/.
"""
import json
from pathlib import Path

# CONFIG (tune sizes here)
RAW_FOLDER = Path("../data_raw")      # relative to scripts/
CHUNKS_FOLDER = Path("../data_chunks")
CHARS_PER_CHUNK = 1000                # chunk size in characters
CHARS_OVERLAP = 200                   # overlap between chunks

def chunk_text(text, size=CHARS_PER_CHUNK, overlap=CHARS_OVERLAP):
    if size <= 0:
        raise ValueError("size must be > 0")
    if overlap >= size:
        raise ValueError("overlap must be smaller than size")
    chunks = []
    start = 0
    text_length = len(text)
    while start < text_length:
        end = start + size
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start = end - overlap
    return chunks

def main():
    scripts_dir = Path(__file__).parent
    raw_dir = (scripts_dir / RAW_FOLDER).resolve()
    out_dir = (scripts_dir / CHUNKS_FOLDER).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    files = sorted([p for p in raw_dir.iterdir() if p.suffix.lower() == ".txt"])
    if not files:
        print(f"No raw .txt files found in {raw_dir}")
        return

    for src in files:
        text = src.read_text(encoding="utf-8")
        chunks = chunk_text(text)
        out_path = out_dir / (src.stem + "_chunks.jsonl")
        with out_path.open("w", encoding="utf-8") as w:
            for i, c in enumerate(chunks, start=1):
                obj = {
                    "id": f"{src.stem}_chunk_{i}",
                    "text": c,
                    "source": src.name
                }
                w.write(json.dumps(obj, ensure_ascii=False) + "\n")
        print(f"Wrote {len(chunks)} chunks -> {out_path.name}")

    print("Chunking completed. Check data_chunks/")

if __name__ == "__main__":
    main()
