"""
SmartAttend AI Service — DeepFace Edition
No dlib, no CMake, no Visual Studio needed!
Install: pip install deepface tf-keras fastapi uvicorn pillow numpy
Run:     python main.py
"""
import io, base64, logging
import numpy as np
from PIL import Image
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from deepface import DeepFace

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

app = FastAPI(title="SmartAttend AI Service", version="2.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

MODEL    = "Facenet"
DETECTOR = "opencv"
THRESHOLD = 0.40   # Cosine distance threshold (lower = stricter)

def b64_to_array(b64: str):
    if "," in b64: b64 = b64.split(",", 1)[1]
    img = Image.open(io.BytesIO(base64.b64decode(b64))).convert("RGB")
    return np.array(img)

def get_embedding(arr) -> list:
    res = DeepFace.represent(img_path=arr, model_name=MODEL, detector_backend=DETECTOR, enforce_detection=True)
    return res[0]["embedding"]

def cosine_dist(a, b) -> float:
    a, b = np.array(a), np.array(b)
    return float(1 - np.dot(a,b) / (np.linalg.norm(a)*np.linalg.norm(b) + 1e-10))

class EncodeReq(BaseModel):
    usn: str
    images: List[str]

class KnownFace(BaseModel):
    usn: str
    name: str
    encoding: List[float]

class RecognizeReq(BaseModel):
    image: str
    known_faces: List[KnownFace]

@app.get("/")
def root():
    return {"status": "SmartAttend AI online", "model": MODEL}

@app.post("/encode-faces")
def encode_faces(req: EncodeReq):
    embeddings = []
    for i, b64 in enumerate(req.images):
        try:
            emb = get_embedding(b64_to_array(b64))
            embeddings.append(emb)
            log.info(f"[{req.usn}] Photo {i+1} encoded ✓")
        except Exception as e:
            log.warning(f"[{req.usn}] Photo {i+1} skipped: {e}")
    if not embeddings:
        return {"encoding": None, "message": "No face detected. Ensure good lighting and look directly at camera."}
    avg = np.mean(embeddings, axis=0).tolist()
    return {"encoding": avg, "samples": len(embeddings), "message": f"Encoded from {len(embeddings)} photo(s) ✅"}

@app.post("/recognize")
def recognize(req: RecognizeReq):
    if not req.known_faces:
        raise HTTPException(400, "No known faces provided")
    try:
        probe = get_embedding(b64_to_array(req.image))
    except Exception as e:
        log.warning(f"Probe failed: {e}")
        return {"recognized": False, "message": "No face detected in camera frame. Try again."}

    best_dist, best_idx = float("inf"), -1
    for i, p in enumerate(req.known_faces):
        if not p.encoding: continue
        d = cosine_dist(probe, p.encoding)
        if d < best_dist: best_dist, best_idx = d, i

    if best_idx == -1 or best_dist > THRESHOLD:
        return {"recognized": False, "message": f"Face not recognized (distance={best_dist:.3f})"}

    m = req.known_faces[best_idx]
    confidence = round((1.0 - best_dist) * 100, 1)
    log.info(f"✅ Recognized {m.usn} ({m.name}) confidence={confidence}%")
    return {"recognized": True, "usn": m.usn, "name": m.name, "confidence": confidence}

if __name__ == "__main__":
    log.info("🚀 SmartAttend AI Service starting...")
    log.info("⚠  First request will download Facenet model (~90MB) — be patient!")
    uvicorn.run("main:app", host="0.0.0.0", port=5001, reload=False)
