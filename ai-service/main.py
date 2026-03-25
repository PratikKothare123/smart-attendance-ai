"""
SmartAttend AI Service — face_recognition HOG Edition for AWS EC2
Lightweight, no TensorFlow/DeepFace, memory-optimized with resize
Install: pip install -r requirements.txt
Run: python main.py  (or gunicorn -w 4 -b 0.0.0.0:5000 main:app)
EC2: security group TCP 5000, ufw allow 5000
"""
import io
import base64
import logging
import cv2
import numpy as np
import face_recognition
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

MODEL = 'hog'
THRESHOLD = 0.6  # Euclidean distance threshold for face_recognition
TOLERANCE_PX = 0.25  # Resize factor

def b64_to_cv2(b64_str):
    """Base64 to OpenCV image (BGR)"""
    if ',' in b64_str:
        b64_str = b64_str.split(',', 1)[1]
    img_data = base64.b64decode(b64_str)
    nparr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img

def process_image(img):
    """Resize + RGB convert for face_recognition"""
    if img is None:
        return None
    # ✅ Resize to avoid memory issues on EC2
    small_img = cv2.resize(img, (0, 0), fx=TOLERANCE_PX, fy=TOLERANCE_PX)
    rgb_img = cv2.cvtColor(small_img, cv2.COLOR_BGR2RGB)
    return rgb_img

def get_encoding(rgb_img):
    """Get 128D encoding with HOG model"""
    try:
        encodings = face_recognition.face_encodings(rgb_img, model=MODEL)
        if encodings:
            return encodings[0]  # First face
        return None
    except Exception as e:
        log.warning(f"Encoding failed: {e}")
        return None

@app.route('/', methods=['GET'])
def root():
    return jsonify({"status": "SmartAttend AI online (EC2-ready)", "model": MODEL})

@app.route('/encode-faces', methods=['POST'])
def encode_faces():
    data = request.json
    usn = data.get('usn')
    images = data.get('images', [])
    
    if not usn or len(images) == 0:
        return jsonify({"encoding": None, "message": "Missing USN or images"}), 400
    
    embeddings = []
    for i, b64 in enumerate(images):
        img = b64_to_cv2(b64)
        rgb_img = process_image(img)
        if rgb_img is not None:
            enc = get_encoding(rgb_img)
            if enc is not None:
                embeddings.append(enc)
                log.info(f"[{usn}] Photo {i+1} encoded ✓")
            else:
                log.warning(f"[{usn}] Photo {i+1} no face")
        else:
            log.warning(f"[{usn}] Photo {i+1} invalid image")
    
    if not embeddings:
        return jsonify({"encoding": None, "message": "No face detected. Ensure good lighting and look directly at camera."})
    
    avg_encoding = np.mean(embeddings, axis=0).tolist()
    return jsonify({
        "encoding": avg_encoding,
        "samples": len(embeddings),
        "message": f"Encoded from {len(embeddings)} photo(s) ✅"
    })

@app.route('/recognize', methods=['POST'])
def recognize():
    data = request.json
    image = data.get('image')
    known_faces = data.get('known_faces', [])
    
    if not image:
        return jsonify({"recognized": False, "message": "No probe image"}), 400
    if not known_faces:
        return jsonify({"recognized": False, "message": "No known faces"}), 400
    
    img = b64_to_cv2(image)
    rgb_img = process_image(img)
    if rgb_img is None:
        return jsonify({"recognized": False, "message": "Invalid image"})
    
    probe_enc = get_encoding(rgb_img)
    if probe_enc is None:
        return jsonify({"recognized": False, "message": "No face detected in camera frame. Try again."})
    
    best_dist = float('inf')
    best_match = None
    for kf in known_faces:
        if not kf.get('encoding'):
            continue
        kf_enc = np.array(kf['encoding'])
        dist = np.linalg.norm(probe_enc - kf_enc)
        if dist < best_dist:
            best_dist = dist
            best_match = kf
    
    if best_match is None or best_dist > THRESHOLD:
        return jsonify({
            "recognized": False,
            "message": f"Face not recognized (distance={best_dist:.3f})"
        })
    
    confidence = round((1.0 - (best_dist / THRESHOLD)) * 100, 1)
    log.info(f"✅ Recognized {best_match['usn']} ({best_match['name']}) dist={best_dist:.3f} conf={confidence}%")
    
    return jsonify({
        "recognized": True,
        "usn": best_match['usn'],
        "name": best_match['name'],
        "confidence": confidence
    })

if __name__ == '__main__':
    log.info("🚀 SmartAttend AI Service (EC2 HOG) starting...")
    log.info(f"📦 Preloading {MODEL} model...")
    # Preload to avoid first-request delay
    dummy_img = np.zeros((100, 100, 3), dtype=np.uint8)
    dummy_rgb = cv2.cvtColor(dummy_img, cv2.COLOR_BGR2RGB)
    face_recognition.face_encodings(dummy_rgb, model=MODEL)
    log.info("✅ Model loaded. Listening on 0.0.0.0:5000")
    
    # ✅ Flask host fix for EC2
    app.run(host="0.0.0.0", port=5000, debug=False, threaded=True)
