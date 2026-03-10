# 🎓 SmartAttend - AI-Powered Face Recognition Attendance System

## 📋 Project Overview

SmartAttend is a complete full-stack web application that uses **Artificial Intelligence (AI)** for automatic face recognition-based attendance marking. The system eliminates manual attendance processes and provides real-time tracking with Excel report generation.

---3

## 🛠️ Technologies Used

### 1. Frontend (User Interface)
| Technology | Purpose |
|------------|---------|
| **React.js** | Modern UI framework for building user interface |
| **React Router** | Navigation between different pages |
| **Axios** | HTTP client for API calls |
| **XLSX** | Excel file generation for reports |
| **CSS** | Styling and responsive design |

### 2. Backend (Server)
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime for server |
| **Express.js** | Web framework for REST APIs |
| **MongoDB** | NoSQL database for data storage |
| **Mongoose** | MongoDB object modeling |
| **JWT** | JSON Web Token for authentication |
| **Bcryptjs** | Password hashing for security |
| **CORS** | Cross-origin resource sharing |
| **Multer** | File handling |

### 3. AI Service (Face Recognition)
| Technology | Purpose |
|------------|---------|
| **Python** | Programming language for AI |
| **FastAPI** | Python web framework for API |
| **DeepFace** | Face recognition library |
| **TensorFlow/Keras** | Deep learning backend |
| **NumPy** | Numerical computations |
| **Pillow** | Image processing |
| **UVicorn** | ASGI server |

### 4. Database
| Technology | Purpose |
|------------|---------|
| **MongoDB Atlas** | Cloud database (user's choice) |
| **Collections** | users, students, subjects, attendances, attendancesessions |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SMARTATTEND SYSTEM                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│   │   FRONTEND   │────▶│   BACKEND    │────▶│   DATABASE    │    │
│   │   (React)    │     │  (Node.js)   │     │  (MongoDB)    │    │
│   └──────────────┘     └──────────────┘     └──────────────┘    │
│         │                     │                                     │
│         │                    AI                                     │
│         │                     │                                     │
│         ▼                     ▼                                     │
│   ┌──────────────────────────────────┐                            │
│   │         AI SERVICE               │                            │
│   │     (Python + DeepFace)          │                            │
│   │   Face Encoding & Recognition     │                            │
│   └──────────────────────────────────┘                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 💻 How Each Component Works

### 1. FRONTEND (React.js)

**Location:** `d:/Desktop/SBJain/frontend/`

**What it does:**
- Displays login/registration pages
- Shows dashboards for Admin, Faculty, and Students
- Provides camera interface for face capture
- Displays attendance reports and charts

**Key Files:**
- `src/pages/Login.jsx` - Login page with role selection
- `src/pages/StudentRegister.jsx` - Student registration
- `src/pages/student/RegisterFace.jsx` - Face registration
- `src/pages/faculty/LiveScan.jsx` - Live face scanning
- `src/api.js` - API communication layer

**How it connects to backend:**
```javascript
// Frontend makes API calls like this:
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ identifier, password, role })
});
```

---

### 2. BACKEND (Node.js + Express)

**Location:** `d:/Desktop/SBJain/backend/`

**What it does:**
- Handles all API requests
- Manages database operations
- Handles authentication (JWT)
- Coordinates between frontend and AI service

**Server Entry Point:** `server.js`

**API Routes:**

| Route | Purpose |
|-------|---------|
| `/api/auth/*` | Login, Register, Authentication |
| `/api/students/*` | Student management, Face encoding |
| `/api/faculty/*` | Faculty management |
| `/api/subjects/*` | Subject management |
| `/api/attendance/*` | Attendance sessions & marking |

**How it starts:**
```bash
cd d:/Desktop/SBJain/backend
npm start
# or
node server.js
# Server runs on http://localhost:5000
```

---

### 3. AI SERVICE (Python + DeepFace)

**Location:** `d:/Desktop/SBJain/ai-service/`

**What it does:**
- Encodes face images into mathematical representations (embeddings)
- Compares captured faces with registered faces
- Returns recognition results with confidence percentage

**Key Endpoints:**

| Endpoint | Purpose |
|----------|---------|
| `POST /encode-faces` | Convert face images to numerical encoding |
| `POST /recognize` | Compare face with known faces |

**How Face Recognition Works:**

```
1. Student takes photos → Converted to base64
2. Send to AI service → DeepFace analyzes facial features
3. AI converts face to 128-dimensional vector (embedding)
4. Store this vector in database
5. During attendance: Capture face → Compare with stored vectors
6. Find closest match → If within threshold, mark attendance
```

**How to start AI service:**
```bash
cd d:/Desktop/SBJain/ai-service
pip install -r requirements.txt
python main.py
# AI service runs on http://localhost:5001
```

---

## 🗄️ Database Structure (MongoDB)

### Connection String:
```
mongodb+srv://kotharepratik129_db_user:V4XMVxTXa9c4FQX6@cluster0.tzauzme.mongodb.net/sbjain_attendance
```

### Collections:

#### 1. **users** - Stores all user accounts
```javascript
{
  _id: ObjectId,
  name: String,           // Full name
  email: String,         // Email (unique)
  usn: String,           // University Seat Number (students only)
  password: String,       // Hashed password
  role: String,          // 'student', 'faculty', or 'admin'
  department: String,
  year: String,
  semester: String,
  section: String,
  assignedSubjects: [{    // For faculty
    subjectId: ObjectId,
    subjectName: String,
    code: String,
    year, semester, section, department
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. **students** - Additional student details & face data
```javascript
{
  _id: ObjectId,
  userId: ObjectId,       // Reference to users collection
  usn: String,           // USN (unique)
  name: String,
  email: String,
  department: String,
  year: String,
  semester: String,
  section: String,
  phone: String,
  faceEncoding: [Number], // 128-dim array of face features
  faceImages: [String],   // Base64 images (stored)
  faceRegistered: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. **subjects** - Course/subject information
```javascript
{
  _id: ObjectId,
  name: String,          // Subject name (e.g., "Data Structures")
  code: String,          // Subject code (e.g., "CS301")
  department: String,
  semester: String,
  year: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. **attendancesessions** - Active attendance sessions
```javascript
{
  _id: ObjectId,
  facultyId: ObjectId,   // Reference to users
  facultyName: String,
  subject: String,
  subjectId: ObjectId,
  subjectCode: String,
  year: String,
  semester: String,
  section: String,
  department: String,
  date: String,          // Format: "YYYY-MM-DD"
  timeSlot: String,
  isActive: Boolean,
  studentsPresent: [{
    usn: String,
    name: String,
    markedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### 5. **attendances** - Individual attendance records
```javascript
{
  _id: ObjectId,
  usn: String,
  studentName: String,
  studentId: ObjectId,
  subject: String,
  subjectId: ObjectId,
  sessionId: ObjectId,
  year: String,
  semester: String,
  section: String,
  department: String,
  date: String,
  timeSlot: String,
  status: String,        // "Present" or "Absent"
  markedAt: Date,
  createdAt: Date
}
// Index: { usn: 1, sessionId: 1 } (unique)
```

---

## 🔐 Authentication System

### How JWT Authentication Works:

```
1. User logs in with email/usn + password
2. Backend verifies credentials against database
3. Backend generates JWT token containing user ID
4. Token sent back to frontend
5. Frontend stores token in localStorage
6. All subsequent requests include token in header
7. Backend verifies token on each protected route
8. If token valid, request proceeds; otherwise, 401 error
```

### Token Format:
```javascript
// Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload
{
  "id": "user_id_from_database",
  "exp": "expiration_timestamp"
}

// Signature
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), SECRET_KEY)
```

### Protected Routes:
All routes under `/api/students`, `/api/faculty`, `/api/subjects`, `/api/attendance` require authentication token in header:
```
Authorization: Bearer <jwt_token>
```

---

## 📸 How Face Data is Stored

### Process Flow:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  User takes    │     │  Convert to     │     │  Send to AI     │
│  photos        │────▶│  Base64         │────▶│  Service        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Store in       │◀────│  Store encoding │◀────│  AI returns     │
│  Database       │     │  array          │     │  128-dim vector │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### What gets stored:

1. **Face Encoding (Mathematical representation):**
   - 128 numbers representing facial features
   - Cannot be converted back to actual image
   - Used only for comparison
   - Stored in `students.faceEncoding` field

2. **Face Images (Optional - for reference):**
   - Base64 encoded images
   - Stored in `students.faceImages` field
   - Limited to 3 images per student
   - Only stored if needed for debugging

### Why this approach?
- **Privacy**: Original images not stored, only mathematical representation
- **Storage**: 128 numbers take minimal space vs full images
- **Security**: Face encoding cannot be reverse-engineered to original image
- **Speed**: Comparing number arrays is faster than image comparison

---

## 🔗 How Everything Connects

### Complete Request Flow (Student Registration):

```
1. FRONTEND: Student fills registration form
                 ↓
2. FRONTEND: Send to backend API
   POST /api/auth/register-student
   { name, usn, email, password, department, year, semester, section }
                 ↓
3. BACKEND: 
   - Validate all fields
   - Check if USN/email already exists
   - Hash password with bcrypt
   - Create user in 'users' collection
   - Create student record in 'students' collection
   - Generate JWT token
                 ↓
4. FRONTEND: 
   - Store JWT in localStorage
   - Redirect to student dashboard
```

### Complete Request Flow (Face Registration):

```
1. FRONTEND: Open camera, capture 3-5 photos
                 ↓
2. FRONTEND: Convert images to base64
                 ↓
3. FRONTEND: Send to backend
   POST /api/students/face/encode
   { usn: "CS22B101", images: ["base64...", "base64..."] }
                 ↓
4. BACKEND: 
   - Verify student exists
   - Forward to AI service
   POST http://localhost:5001/encode-faces
   { usn: "CS22B101", images: [...] }
                 ↓
5. AI SERVICE:
   - Process each image with DeepFace
   - Extract 128-dimensional embedding
   - Return average encoding
                 ↓
6. BACKEND:
   - Save encoding to students collection
   - Update faceRegistered: true
                 ↓
7. FRONTEND: Show success message
```

### Complete Request Flow (Taking Attendance):

```
1. FACULTY: Start attendance session
   POST /api/attendance/session/start
   { subject, year, semester, section, department }
                 ↓
2. BACKEND: Create session in 'attendancesessions' collection
                 ↓
3. FACULTY: Open live camera scan page
                 ↓
4. FACULTY: Click "Scan Face" button
                 ↓
5. FRONTEND:
   - Capture frame from video
   - Convert to base64
   - Send to backend
   POST /api/students/face/recognize
   { image, year, semester, section, department }
                 ↓
6. BACKEND:
   - Get all students with registered faces
   - Send to AI service for comparison
   POST http://localhost:5001/recognize
   { image, known_faces: [...] }
                 ↓
7. AI SERVICE:
   - Extract face encoding from image
   - Compare with all known faces
   - Return best match if within threshold
                 ↓
8. BACKEND:
   - If recognized: Save to attendance collection
   - Return result to frontend
                 ↓
9. FRONTEND: Display student name, USN, confidence %
```

---

## 🚀 How to Run the Project

### Prerequisites:
- Node.js (v14+)
- Python (v3.8+)
- MongoDB Atlas account (already configured)

### Step 1: Start Backend

```bash
# Open terminal
cd d:/Desktop/SBJain/backend

# Install dependencies (if not already)
npm install

# Start the server
npm start
# or
node server.js
```

**Expected Output:**
```
✅ MongoDB connected
🚀 Backend → http://localhost:5000
```

### Step 2: Start AI Service

```bash
# Open new terminal
cd d:/Desktop/SBJain/ai-service

# Install Python dependencies
pip install -r requirements.txt

# Start AI service
python main.py
```

**Expected Output:**
```
🚀 SmartAttend AI Service starting...
⚠  First request will download Facenet model (~90MB) — be patient!
```

### Step 3: Start Frontend

```bash
# Open new terminal
cd d:/Desktop/SBJain/frontend

# Install dependencies (if not already)
npm install

# Start React app
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view smartattend-frontend in the browser.
http://localhost:3000
```

### Step 4: Access the Application

1. Open browser to **http://localhost:3000**
2. Login with default admin account:
   - **Email:** admin@sbjain.edu
   - **Password:** Admin@123

---

## 📊 Default Data (After Seeding)

### Admin Account:
```
Email: admin@sbjain.edu
Password: Admin@123
```

### Subjects (Pre-loaded):
| Name | Code | Department | Semester |
|------|------|------------|----------|
| Data Structures | CS301 | CSE | Sem 5 |
| DBMS | CS302 | CSE | Sem 5 |
| Operating Systems | CS303 | CSE | Sem 5 |
| Machine Learning | CS401 | CSE | Sem 6 |
| Computer Networks | CS402 | CSE | Sem 6 |
| Web Technologies | CS403 | CSE | Sem 6 |
| Software Engineering | CS404 | CSE | Sem 6 |
| Digital Electronics | EC301 | ECE | Sem 5 |
| Engineering Maths | MA101 | CSE | Sem 1 |

---

## 🔧 Key Features

### For Admin:
- ✅ Create/manage faculty accounts
- ✅ Add/view subjects
- ✅ Assign subjects to faculty
- ✅ View all students

### For Faculty:
- ✅ View assigned subjects
- ✅ Start attendance sessions
- ✅ Live face scan for attendance
- ✅ View attendance history
- ✅ Download Excel reports

### For Students:
- ✅ Register face for recognition
- ✅ View personal attendance
- ✅ Track attendance percentage

---

## 🔍 API Documentation

### Authentication API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register-student` | Register new student |
| GET | `/api/auth/me` | Get current user |

### Students API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students |
| POST | `/api/students/face/encode` | Register face |
| POST | `/api/students/face/recognize` | Recognize face |

### Faculty API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/faculty` | Get all faculty |
| POST | `/api/faculty` | Create faculty |
| DELETE | `/api/faculty/:id` | Delete faculty |

### Subjects API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subjects` | Get all subjects |
| POST | `/api/subjects` | Create subject |
| POST | `/api/subjects/assign` | Assign to faculty |

### Attendance API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/attendance/session/start` | Start session |
| PUT | `/api/attendance/session/:id/end` | End session |
| POST | `/api/attendance/mark` | Mark attendance |
| GET | `/api/attendance/history` | Session history |
| GET | `/api/attendance/report` | Get attendance report |
| GET | `/api/attendance/report/excel` | Download Excel |

---

## 🎯 How Face Recognition Works (Deep Details)

### Step 1: Face Detection
```
Input Image → DeepFace.detectFace() → Face ROI (Region of Interest)
```

### Step 2: Feature Extraction
```
Face ROI → DeepFace.represent() → 128-dimensional vector
```

The 128 numbers represent:
- Eye position
- Nose shape
- Mouth shape
- Jaw line
- Cheekbones
- Face proportions
- And 120+ other measurements

### Step 3: Comparison
```
New Face Vector [128 numbers]
       vs
Stored Face Vector [128 numbers]
       =
Cosine Distance (0 to 1)
```

- **Distance < 0.40** = Match (Same person)
- **Distance > 0.40** = No match (Different person)

### Why Facenet Model?
- Lightweight (~90MB)
- Fast inference
- High accuracy
- Works well with various lighting conditions

---

## 🔒 Security Considerations

1. **Passwords**: Hashed with bcrypt (10 rounds)
2. **JWT Tokens**: Expire after 7 days
3. **Face Data**: Only mathematical encoding stored, not images
4. **API Security**: CORS configured for localhost only
5. **MongoDB**: Credentials in environment variables

---

## 📁 Project Structure

```
SBJain/
├── README.md                 # Basic project info
├── PRESENTATION.md           # This file
├── backend/
│   ├── server.js             # Express server entry
│   ├── seed.js               # Database seeder
│   ├── package.json          # Node dependencies
│   ├── .env                  # Environment variables
│   ├── models/
│   │   ├── User.js           # User schema
│   │   ├── Student.js       # Student schema
│   │   ├── Subject.js        # Subject schema
│   │   ├── Attendance.js     # Attendance schema
│   │   └── AttendanceSession.js
│   ├── routes/
│   │   ├── auth.js           # Auth routes
│   │   ├── students.js       # Student routes
│   │   ├── faculty.js       # Faculty routes
│   │   ├── subjects.js      # Subject routes
│   │   └── attendance.js    # Attendance routes
│   └── middleware/
│       └── auth.js           # JWT authentication
├── frontend/
│   ├── package.json          # React dependencies
│   ├── src/
│   │   ├── App.jsx           # Main app component
│   │   ├── api.js            # API calls
│   │   ├── index.js          # Entry point
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ui.jsx
│   │   └── pages/
│   │       ├── Login.jsx
│   │       ├── StudentRegister.jsx
│   │       ├── admin/
│   │       ├── faculty/
│   │       └── student/
│   └── public/
│       └── index.html
└── ai-service/
    ├── main.py               # FastAPI server
    └── requirements.txt      # Python dependencies
```

---

## 🆘 Troubleshooting

### Camera not working?
1. Check browser permissions (camera icon in address bar)
2. Close other apps using camera (Zoom, Teams, etc.)
3. Try a different browser (Chrome recommended)

### AI service not responding?
1. Make sure Python is running
2. Check port 5001 is not blocked
3. First request takes time (downloading model)

### MongoDB connection error?
1. Check internet connection
2. Verify MongoDB Atlas credentials
3. Check firewall settings

### Backend not starting?
1. Delete node_modules and run npm install again
2. Check .env file exists
3. Verify MongoDB URI is correct

---

## 📞 Support

For any issues or questions:
1. Check browser console (F12) for error messages
2. Check terminal outputs for backend/AI errors
3. Verify all services are running on correct ports

---

## ✅ Conclusion

This SmartAttend system demonstrates:
- ✅ Full-stack development (React + Node.js)
- ✅ AI/ML integration (Face Recognition)
- ✅ Cloud database (MongoDB Atlas)
- ✅ REST API design
- ✅ JWT Authentication
- ✅ Real-time data processing
- ✅ Excel report generation

**Project Status:** Fully functional and ready to use! 🎉
