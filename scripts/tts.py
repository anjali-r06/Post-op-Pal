from TTS.api import TTS
import uuid
import os

# Hindi TTS model (works for Hinglish too)
tts_model = TTS(
    model_name="tts_models/hi/vits",
    progress_bar=False,
    gpu=False
)

def text_to_speech(text: str) -> str:
    """
    Converts text (Hindi / Hinglish) to speech.
    Returns path to generated audio file.
    """

    filename = f"tts_output_{uuid.uuid4().hex}.wav"
    output_path = os.path.join("temp", filename)

    os.makedirs("temp", exist_ok=True)

    tts_model.tts_to_file(
        text=text,
        file_path=output_path
    )

    return output_path
