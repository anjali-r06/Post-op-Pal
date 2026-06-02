#!/usr/bin/env python3
"""
run_pipeline.py

One-command runner for the text pipeline:
  1) extract text (PDF/TXT/MD)
  2) chunk text
  3) create HF embeddings
  4) build FAISS index

Usage:
  python scripts/run_pipeline.py
"""

import argparse
import subprocess
import sys
from pathlib import Path
import shutil
import datetime

ROOT = Path(__file__).resolve().parent.parent  # project root (post_op)
SCRIPTS = ROOT / "scripts"
POSTOP = ROOT / "postop_data"

LOG_FILE = ROOT / f"pipeline_run_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.log"

def log(msg):
    print(msg)
    with LOG_FILE.open("a", encoding="utf-8") as f:
        f.write(msg + "\n")

def run_cmd(cmd, fail_ok=False):
    log(f">>> Running: {cmd}")
    try:
        subprocess.check_call(cmd, shell=True)
    except subprocess.CalledProcessError as e:
        log(f"ERROR: command failed: {cmd}")
        log(str(e))
        if not fail_ok:
            log("Aborting pipeline due to error.")
            sys.exit(1)

def main():
    log("=== PostOp pipeline run started ===")
    log(f"Working dir: {ROOT}")
    log(f"Log file: {LOG_FILE}")

    # Step 1: extract
    extract_general = SCRIPTS / "extract_text.py"
    extract_patient = SCRIPTS / "extract_patient_data.py"

    if extract_patient.exists():
        run_cmd(f'python "{extract_patient}"')
    elif extract_general.exists():
        run_cmd(f'python "{extract_general}"')
    else:
        log("No extractor found.")

    # Step 2: chunk
    chunker = SCRIPTS / "chunk_text.py"
    if chunker.exists():
        run_cmd(f'python "{chunker}"')
    else:
        log("chunk_text.py not found.")

    # Step 3: embeddings
    emb = SCRIPTS / "create_hf_embeddings.py"
    if emb.exists():
        run_cmd(f'python "{emb}"')
    else:
        log("create_hf_embeddings.py not found.")

    # Step 4: build faiss
    faiss = SCRIPTS / "build_faiss_index.py"
    if faiss.exists():
        run_cmd(f'python "{faiss}"')
    else:
        log("build_faiss_index.py not found.")

    log("=== Pipeline run completed ===")
    log(f"See log file: {LOG_FILE}")

if __name__ == "__main__":
    main()
