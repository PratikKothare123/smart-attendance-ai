@echo off
echo Setting up AI service...
cd /d %~dp0
rmdir /s /q venv
python -m venv venv
call venv\Scripts\activate.bat
pip install --upgrade pip setuptools wheel
pip install tensorflow-cpu deepface opencv-python-headless pillow numpy fastapi uvicorn[standard] python-multipart gunicorn mtcnn
echo Setup complete! Run: call venv\Scripts\activate.bat ^&^& python main.py
pause
