from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse

app = FastAPI()

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    # Placeholder response
    return JSONResponse(content={"transcript": "Use pip instead of Poetry on Render"})
