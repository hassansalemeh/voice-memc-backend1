import json
import os
import shutil
import subprocess
import uuid

import whisper
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
model = whisper.load_model("tiny")  # You can use "tiny", "small", etc.

# Allow access from your phone
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/transcribe/")
async def transcribe(file: UploadFile = File(...)):
    temp_input = f"temp_{uuid.uuid4().hex}.m4a"
    temp_output = temp_input.replace(".m4a", ".wav")

    try:
    # Save uploaded file to disk
        with open(temp_input, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print("📁 Uploaded file saved as:", temp_input)

    # Run ffmpeg and capture stderr
        print("🔄 Running ffmpeg to convert audio...")
        ffmpeg_result = subprocess.run(
            ["ffmpeg", "-y", "-i", temp_input, temp_output],
            capture_output=True,
            text=True
        )

        if ffmpeg_result.returncode != 0:
            print("❌ FFMPEG failed")
            print("FFMPEG STDERR:", ffmpeg_result.stderr)
            raise Exception("FFMPEG conversion failed")

        print("✅ FFMPEG succeeded. Converted to:", temp_output)

        # Run Whisper transcription
        result = model.transcribe(temp_output)
        print("📝 Transcript:", result["text"])

        return {"transcript": result["text"]}

    
    except Exception as e:
        print("❌ Error during transcription:", str(e))
        return {"error": str(e)}
    
    finally:
        # Cleanup files
        if os.path.exists(temp_input):
            os.remove(temp_input)
        if os.path.exists(temp_output):
            os.remove(temp_output)
