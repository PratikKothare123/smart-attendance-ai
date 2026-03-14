🧠 SmartAttend AI
AI-Powered Face Recognition Attendance System

SmartAttend AI is a cloud-based AI attendance system that automatically marks student attendance using face recognition and deep learning.

The system uses DeepFace with FaceNet embeddings to identify students in real time through a camera interface.

🌐 Live Application

🚀 Open the Application

👉 https://smart-attendance-ai.vercel.app

The system runs completely online and automatically connects to the backend and AI recognition services.

🧩 System Architecture
Student Camera
      │
      ▼
Frontend (React - Vercel)
      │
      ▼
Backend API (Node.js - Render)
      │
      ▼
AI Recognition Service (FastAPI + DeepFace)
      │
      ▼
MongoDB Atlas Database

The system uses a microservice architecture where the AI model runs separately from the backend.

🧠 AI & Deep Learning

The AI module uses FaceNet, a deep convolutional neural network trained for face recognition.

Instead of storing images, the model converts faces into embedding vectors.

Example embedding:

[0.132, -0.553, 0.912, ... 512 dimensions]

Faces belonging to the same person produce similar vectors.

Recognition is done using cosine similarity between embeddings.

🔬 Face Recognition Pipeline

1️⃣ Capture face image from camera
2️⃣ Convert image to Base64
3️⃣ Send image to AI service
4️⃣ Detect face using OpenCV
5️⃣ Generate FaceNet embedding
6️⃣ Compare with stored embeddings
7️⃣ If similarity > threshold → student recognized

🛠 Technology Stack
Frontend

React.js

Axios

Responsive UI

Vercel Deployment

Backend

Node.js

Express.js

JWT Authentication

REST APIs

AI Service

Python

FastAPI

DeepFace

TensorFlow / Keras

FaceNet Model

Database

MongoDB Atlas

Cloud Deployment

Vercel

Render

MongoDB Atlas

📸 Screenshots
Login Page
<img src="screenshots/login.png" width="800">
Student Dashboard
<img src="screenshots/student-dashboard.png" width="800">
Face Registration
<img src="screenshots/face-registration.png" width="800">
Attendance Scan
<img src="screenshots/attendance-scan.png" width="800">
Attendance Report
<img src="screenshots/attendance-report.png" width="800">
📂 Project Structure
smart-attendance-ai
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   └── api.js
│
├── backend
│   ├── models
│   ├── routes
│   ├── middleware
│   └── server.js
│
├── ai-service
│   ├── main.py
│   ├── requirements.txt
│   └── Procfile
│
└── README.md
✨ Features

✔ AI-based automatic attendance
✔ Face recognition using deep learning
✔ Secure authentication system
✔ Student and faculty dashboards
✔ Cloud-deployed microservice architecture
✔ Real-time face scanning

🔐 Security

JWT authentication

Face embeddings stored instead of images

Secure database connection

Token-based API access

📈 Future Improvements

Liveness detection (anti-spoofing)

Multi-face attendance

Attendance analytics dashboard

GPU acceleration for faster recognition

Mobile optimization

👨‍💻 Author

Pratik Kothare
Computer Science Student

GitHub
https://github.com/PratikKothare123

⭐ Support

If you like this project, please star the repository ⭐