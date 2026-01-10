# scripts/image_vision_blip.py
import io
from PIL import Image
import torch
from transformers import BlipProcessor, BlipForConditionalGeneration

# load model once (global)
# Use 'base' for faster load; 'large' gives better captions if you can afford it
_processor = None
_model = None
_device = "cuda" if torch.cuda.is_available() else "cpu"

def _load_model():
    global _processor, _model, _device
    if _processor is None or _model is None:
        _processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
        _model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base").to(_device)
    return _processor, _model

def describe_image(image_bytes: bytes, max_new_tokens: int = 60):
    """
    Input: image bytes
    Output: dict { findings (caption), recommendation (heuristic), confidence (float 0-1), raw_caption }
    """
    processor, model = _load_model()
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # optional: resize to reasonable dimensions to speed up inference
    img.thumbnail((1024, 1024), Image.LANCZOS)

    inputs = processor(images=img, return_tensors="pt").to(_device)
    # generate caption
    with torch.no_grad():
        out = model.generate(**inputs, max_new_tokens=max_new_tokens)
    caption = processor.decode(out[0], skip_special_tokens=True)

    # Heuristic recommendation: simple template based on keywords
    caption_lower = caption.lower()
    rec = "This is an automated observation. If you have severe pain, fever, heavy bleeding, or difficulty breathing, contact emergency services."
    confidence = 0.6  # BLIP doesn't output confidence — use a conservative default

    # Simple heuristics to create next step text
    if any(k in caption_lower for k in ["pus", "purulent", "yellow", "green", "foul"]):
        rec = "Signs of possible infection are visible (discharge). Please contact your clinician or visit a clinic immediately."
        confidence = 0.75
    elif any(k in caption_lower for k in ["bleeding", "blood", "hemorrhage", "heavy bleed"]):
        rec = "Excessive bleeding is visible. Apply direct pressure and seek urgent medical attention or call emergency services."
        confidence = 0.9
    elif any(k in caption_lower for k in ["red", "redness", "inflamed", "swelling", "swollen"]):
        rec = "Redness and swelling are visible. Clean the area gently with saline, keep the dressing dry, and monitor. If it worsens, contact your clinician."
        confidence = 0.65

    return {
        "findings": caption,
        "recommendation": rec,
        "confidence": float(confidence),
        "raw_caption": caption
    }
