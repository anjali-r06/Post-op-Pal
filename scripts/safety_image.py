# scripts/safety_image.py

ESCALATION_KEYWORDS = [
    "pus", "purulent", "green", "yellow discharge", "foul smell", "foul",
    "excessive bleeding", "heavy bleeding", "bleeding", "open wound",
    "dehiscence", "necrosis", "black tissue", "exposed", "bone", "not breathing",
    "deep wound", "vomit blood", "vomiting blood"
]

def image_safety_check(model_result: dict):
    """
    model_result: dict from describe_image()
    returns: dict { escalate: bool, matched_rules: list }
    """
    text = (model_result.get("findings") or "") + " " + (model_result.get("recommendation") or "")
    text = text.lower()
    matched = [kw for kw in ESCALATION_KEYWORDS if kw in text]
    escalate = False
    if matched:
        escalate = True
    # Also escalate if model confidence is high for danger-like recs (if you implement)
    return {"escalate": escalate, "matched_rules": matched}
