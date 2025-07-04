import json
import os
import shutil
import subprocess
import uuid
import time 

import whisper
from fastapi import FastAPI, File, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
print("🚀 Loading Whisper model (tiny)...")
model = whisper.load_model("tiny")  # You can change to "base" or "small" if needed
print("✅ Whisper model loaded")

# Allow access from your phone
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/transcribe/")
async def transcribe(request: Request, file: UploadFile = File(...)):
    start = time.time()  # 🕒 Add this to start timing
    print("🌐 Incoming request headers:", dict(request.headers))
    temp_input = f"temp_{uuid.uuid4().hex}.m4a"
    temp_output = temp_input.replace(".m4a", ".wav")

    try:
        print("📥 Received file:", file.filename)

        # Save uploaded file
        with open(temp_input, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        print(f"📁 File saved to disk: {temp_input}")

        # Convert with ffmpeg
        print("🔄 Running ffmpeg to convert audio to WAV...")
        ffmpeg_result = subprocess.run(
            ["ffmpeg", "-y", "-i", temp_input, temp_output],
            capture_output=True,
            text=True
        )

        if ffmpeg_result.returncode != 0:
            print("❌ FFMPEG failed")
            print("FFMPEG STDERR:", ffmpeg_result.stderr)
            raise Exception("FFMPEG conversion failed")

        print(f"✅ FFMPEG succeeded. WAV saved to {temp_output}")

        # Transcribe
        
        print("🧠 Starting transcription with Whisper...")
        result = model.transcribe(temp_output)
        print("📝 Transcription completed:", result["text"])

        duration = time.time() - start
        print(f"⏱️ Total transcription time: {duration:.2f} seconds")

        return {"transcript": result["text"]}

    except Exception as e:
        print("❌ Error during transcription:", str(e))
        return {"error": str(e)}

    finally:
        # Clean up temp files
        if os.path.exists(temp_input):
            os.remove(temp_input)
            print(f"🧹 Deleted: {temp_input}")
        if os.path.exists(temp_output):
            os.remove(temp_output)
            print(f"🧹 Deleted: {temp_output}")
