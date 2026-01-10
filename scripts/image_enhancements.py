# scripts/image_enhancements.py
import io
from PIL import Image
import numpy as np
import cv2

def _load_pil(image_bytes: bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return img

def make_thumbnail(image_bytes: bytes, size=(320, 240)):
    img = _load_pil(image_bytes)
    img.thumbnail(size, Image.LANCZOS)
    bio = io.BytesIO()
    img.save(bio, format="JPEG", quality=75)
    return bio.getvalue()

def redness_ratio(image_bytes: bytes, debug=False):
    """
    Returns fraction of pixels considered 'red' (0–1).
    Uses HSV thresholding.
    """
    img = _load_pil(image_bytes)
    arr = np.array(img)

    bgr = cv2.cvtColor(arr[:, :, ::-1], cv2.COLOR_RGB2BGR)
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)

    # Red HSV thresholds
    lower1 = np.array([0, 40, 40])
    upper1 = np.array([10, 255, 255])
    lower2 = np.array([160, 40, 40])
    upper2 = np.array([179, 255, 255])

    mask1 = cv2.inRange(hsv, lower1, upper1)
    mask2 = cv2.inRange(hsv, lower2, upper2)
    red_mask = cv2.bitwise_or(mask1, mask2)

    # central region to avoid clothes/background
    h, w = red_mask.shape
    cy0, cy1 = int(h*0.15), int(h*0.85)
    cx0, cx1 = int(w*0.15), int(w*0.85)
    central_mask = np.zeros_like(red_mask)
    central_mask[cy0:cy1, cx0:cx1] = 255
    red_center = cv2.bitwise_and(red_mask, central_mask)

    # cleanup morphology
    kernel = np.ones((5,5), np.uint8)
    clean = cv2.morphologyEx(red_center, cv2.MORPH_OPEN, kernel)
    clean = cv2.morphologyEx(clean, cv2.MORPH_CLOSE, kernel)

    red_px = np.count_nonzero(clean)
    area = (cy1 - cy0) * (cx1 - cx0)
    ratio = float(red_px) / float(area) if area else 0.0

    return ratio if not debug else (ratio, clean)

def rough_wound_segmentation(image_bytes: bytes):
    """
    Returns a binary mask (uint8) for rough wound segmentation
    using dark + red + edges.
    """
    img = _load_pil(image_bytes)
    arr = np.array(img)

    bgr = cv2.cvtColor(arr[:, :, ::-1], cv2.COLOR_RGB2BGR)
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)

    # aggressive red mask
    lower_red1 = np.array([0, 30, 30])
    upper_red1 = np.array([12, 255, 255])
    lower_red2 = np.array([160, 30, 30])
    upper_red2 = np.array([179, 255, 255])
    red_mask = cv2.inRange(hsv, lower_red1, upper_red1)
    red_mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
    red = cv2.bitwise_or(red_mask, red_mask2)

    # dark mask for necrosis
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    _, dark_mask = cv2.threshold(gray, 60, 255, cv2.THRESH_BINARY_INV)

    combined = cv2.bitwise_or(red, dark_mask)

    # edge-based refining
    edges = cv2.Laplacian(gray, cv2.CV_8U)
    _, ebin = cv2.threshold(edges, 20, 255, cv2.THRESH_BINARY)
    combined = cv2.bitwise_and(combined, cv2.bitwise_not(ebin))

    kernel = np.ones((7,7), np.uint8)
    combined = cv2.morphologyEx(combined, cv2.MORPH_CLOSE, kernel)
    combined = cv2.morphologyEx(combined, cv2.MORPH_OPEN, kernel)

    return combined

def severity_from_metrics(red_ratio: float, blip_conf: float, escalate_keywords_count: int = 0):
    """
    Combines redness + model confidence + matched escalation rules
    into a simple severity score 0–1.
    """
    score = 0.0

    # redness weight
    score += min(1.0, red_ratio / 0.15) * 0.6
    # blip confidence weight
    score += min(1.0, blip_conf) * 0.3
    # escalation keywords weight
    score += min(1.0, escalate_keywords_count / 3) * 0.2

    score = max(0.0, min(1.0, score))

    if score >= 0.75:
        level = "high"
    elif score >= 0.4:
        level = "moderate"
    else:
        level = "low"

    return level, float(score)
