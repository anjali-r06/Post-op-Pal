import os
import PyPDF2

# FOLDERS
DATA_FOLDER = "./postop_data"
RAW_FOLDER = "./data_raw"

def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

def extract_text_from_txt(txt_path):
    with open(txt_path, "r", encoding="utf-8") as file:
        return file.read()

def save_text(text, output_path):
    with open(output_path, "w", encoding="utf-8") as file:
        file.write(text)

def main():
    if not os.path.exists(DATA_FOLDER):
        print(f"Data folder not found: {DATA_FOLDER}")
        return

    os.makedirs(RAW_FOLDER, exist_ok=True)

    for filename in os.listdir(DATA_FOLDER):
        file_path = os.path.join(DATA_FOLDER, filename)

        if filename.lower().endswith(".pdf"):
            print(f"Extracting PDF: {filename}")
            text = extract_text_from_pdf(file_path)
            output_path = os.path.join(RAW_FOLDER, filename.replace(".pdf", "_raw.txt"))
            save_text(text, output_path)

        elif filename.lower().endswith(".txt"):
            print(f"Copying TXT: {filename}")
            text = extract_text_from_txt(file_path)
            output_path = os.path.join(RAW_FOLDER, filename.replace(".txt", "_raw.txt"))
            save_text(text, output_path)

    print("Extraction Completed! Check data_raw/ folder.")

if __name__ == "__main__":
    main()
