import json
import os
import shutil
import subprocess
import uuid

import whisper
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
model = whisper.load_model("base")  # You can use "tiny", "small", etc.

# Allow access from your phone
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/transcribe/")
async def transcribe(file: UploadFile = File(...)):
    temp_input = f"temp_{uuid.uuid4().hex}.m4a"
    temp_output = temp_input.replace(".m4a", ".wav")

    try:
        # Save the uploaded file to disk
        with open(temp_input, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Convert to WAV using ffmpeg
        print("🔄 Converting M4A to WAV...")
        subprocess.run(["ffmpeg", "-y", "-i", temp_input, temp_output], check=True)

        # Transcribe the WAV file
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
