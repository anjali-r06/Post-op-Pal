import re
from langdetect import detect

def detect_language(text: str) -> str:
    """
    Returns:
    - 'hi' for Hindi (Devanagari)
    - 'hinglish' for Hinglish
    - 'en' for English
    """

    if not text or not text.strip():
        return "en"

    # 1️⃣ Check for Hindi (Devanagari script)
    if re.search(r'[\u0900-\u097F]', text):
        return "hi"

    # 2️⃣ Try language detection
    try:
        lang = detect(text)
    except:
        return "en"

    # 3️⃣ Hinglish detection (Roman Hindi + English)
    if lang == "en":
        hinglish_keywords = [
            "hai", "ho", "raha", "rahi", "kya", "kyun",
            "dard", "pain", "doctor", "normal", "problem",
            "surgery", "baad", "abhi", "theek", "nahi"
        ]

        text_lower = text.lower()
        if any(word in text_lower for word in hinglish_keywords):
            return "hinglish"

    return "en"
