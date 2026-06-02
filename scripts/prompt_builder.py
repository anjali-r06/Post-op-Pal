def build_prompt(user_text: str, language: str) -> str:
    """
    Builds a language-aware prompt so the LLM
    replies in the SAME language as the user.
    """

    if language == "hi":
        language_instruction = (
            "उत्तर हिंदी में दें। भाषा सरल और स्पष्ट रखें।"
        )
    elif language == "hinglish":
        language_instruction = (
            "Reply in Hinglish (Hindi + English mix). "
            "Use simple, friendly language."
        )
    else:
        language_instruction = (
            "Reply in English using simple and polite language."
        )

    prompt = f"""
User message:
{user_text}

Instructions:
- {language_instruction}
- Keep medical explanations simple and reassuring
- Do NOT use complex medical jargon
- If the situation sounds serious, advise consulting a doctor

Answer:
"""
    return prompt
