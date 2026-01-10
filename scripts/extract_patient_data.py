#!/usr/bin/env python3
"""
extract_patient_data.py – handles .pdf, .txt, and mixed .md (JSON metadata + human text).

Saves plain text files into ./data_raw/ named: <orig_stem>_raw.txt
If a .md has JSON metadata at the top, this script also saves a metadata JSON file:
    <orig_stem>_meta.json
"""
from pathlib import Path
import PyPDF2
import re
import json

BASE = Path(__file__).resolve().parent.parent  # post_op/
DATA_FOLDER = BASE / "postop_data"
RAW_FOLDER = BASE / "data_raw"

def extract_text_from_pdf(pdf_path: Path) -> str:
    parts = []
    with pdf_path.open("rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                parts.append(page_text)
    return "\n".join(parts)

def extract_text_from_txt(txt_path: Path) -> str:
    try:
        return txt_path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return txt_path.read_text(encoding="latin-1")

def extract_from_md(md_path: Path):
    """
    Returns (metadata_dict_or_None, human_text_str).
    Assumes first ```json ... ``` block contains JSON metadata.
    """
    text = md_path.read_text(encoding="utf-8")
    pattern = r"```json\s*(\{[\s\S]*?\})\s*```"
    match = re.search(pattern, text)

    meta = None
    if match:
        try:
            meta = json.loads(match.group(1))
        except Exception:
            meta = None
        human = text[match.end():].strip()
    else:
        human = text

    return meta, human

def save_text(text: str, out_path: Path):
    out_path.write_text(text, encoding="utf-8")
    print(f"Saved: {out_path.name}")

def ensure_folders():
    if not DATA_FOLDER.exists():
        raise FileNotFoundError(f"Input folder not found: {DATA_FOLDER}")
    RAW_FOLDER.mkdir(parents=True, exist_ok=True)

def main():
    ensure_folders()

    for p in sorted(DATA_FOLDER.iterdir()):
        if p.is_dir():
            continue

        suffix = p.suffix.lower()

        try:
            if suffix == ".pdf":
                print(f"Extracting PDF: {p.name}")
                txt = extract_text_from_pdf(p)
                out = RAW_FOLDER / (p.stem + "_raw.txt")
                save_text(txt, out)

            elif suffix == ".txt":
                print(f"Copying TXT: {p.name}")
                txt = extract_text_from_txt(p)
                out = RAW_FOLDER / (p.stem + "_raw.txt")
                save_text(txt, out)

            elif suffix == ".md":
                print(f"Processing MD: {p.name}")
                meta, human = extract_from_md(p)

                out = RAW_FOLDER / (p.stem + "_raw.txt")
                save_text(human, out)

                if meta is not None:
                    meta_path = RAW_FOLDER / (p.stem + "_meta.json")
                    meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
                    print(f"Saved metadata: {meta_path.name}")

            else:
                print(f"Skipping unsupported file: {p.name}")

        except Exception as e:
            print(f"ERROR processing {p.name}: {e}")

    print("Extraction completed. Check data_raw/")

if __name__ == "__main__":
    main()
