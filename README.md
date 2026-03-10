# 🎓 SmartAttend — AI Face Recognition Attendance System

### SB Jain Institute Nagpur | Developed by Pratik Kothare

---

## 🚀 Quick Start (Windows)

### Step 1 — Prerequisites (install once)
1. **Node.js v18+** → https://nodejs.org
2. **Python 3.11** → https://python.org (check ✅ Add to PATH)

### Step 2 — Setup (run once)
```
Double-click: setup.bat
```

### Step 3 — Run (every time)
```
Double-click: start.bat
```

Opens browser at **http://localhost:3000**

---

## 🔐 Default Login
| Role  | Email/USN              | Password   |
|-------|------------------------|------------|
| Admin | admin@sbjain.edu       | Admin@123  |

---

## 📋 First Time Setup (in order)
1. Login as **Admin**
2. **Admin → Manage Faculty** → Add faculty (name, email, password, dept)
3. **Admin → Subjects** → Add subjects → Assign to faculty with section
4. Student **Registers** → fills USN + details
5. Student → **Register Face** → takes 5 photos
6. Faculty → **Take Attendance** → selects subject → opens camera → scans students
7. **Student** can view attendance % → **Faculty** can download Excel report

---

## 🏗️ Project Structure
```
SBJain/
├── backend/           ← Node.js + Express + MongoDB API server
├── ai-service/        ← Python FastAPI + DeepFace AI service
├── frontend/          ← React.js User Interface
├── PRESENTATION.md    ← Complete technical documentation
├── setup.bat          ← Install all dependencies
└── start.bat          ← Start all 3 services
```

---

## ⚙️ Tech Stack

### Frontend (User Interface)
| Technology | Purpose |
|------------|---------|
| React.js 18 | UI Framework |
| React Router DOM | Page Navigation |
| Axios | HTTP API Calls |
| XLSX | Excel Report Generation |

### Backend (API Server)
| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript Runtime |
| Express.js | Web Framework |
| MongoDB Atlas | Cloud Database |
| Mongoose | MongoDB ORM |
| JWT | Authentication |
| Bcryptjs | Password Hashing |

### AI Service (Face Recognition)
| Technology | Purpose |
|------------|---------|
| Python 3.11 | Programming Language |
| FastAPI | Python Web Framework |
| DeepFace | Face Recognition Library |
| TensorFlow/Keras | Deep Learning |
| Facenet Model | Face Embedding Model |

---

## 🔗 How the System Works

### Architecture Diagram
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  FRONTEND   │────▶│   BACKEND   │────▶│  DATABASE   │
│   (React)   │     │  (Node.js)  │     │  (MongoDB)  │
│  localhost: │     │ localhost:  │     │   Cloud     │
│    3000     │     │    5000     │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       │                  AI
       │                   │
       ▼                   ▼
┌─────────────────────────────────────┐
│         AI SERVICE (Python)         │
│      localhost:5001                 │
│   Face Encoding & Recognition        │
└─────────────────────────────────────┘
```

### Complete Data Flow

#### 1. Student Registration Flow
```
Frontend Form → Backend API → Create User → Create Student Record → Return JWT Token
```

#### 2. Face Registration Flow
```
Frontend Camera → Capture Photos → Convert to Base64 → 
Backend API → AI Service (encode) → Store Face Encoding in Database
```

#### 3. Attendance Taking Flow
```
Faculty Start Session → Open Camera → Capture Face →
Backend API → AI Service (recognize) → Match Face →
Mark Attendance in Database → Update Session →
Faculty View Live Results
```

---

## 🗄️ Database Collections

### MongoDB Atlas Connection
```
mongodb+srv://kotharepratik129_db_user:V4XMVxTXa9c4FQX6@cluster0.tzauzme.mongodb.net/sbjain_attendance
```

### Collections in Database:

#### 1. users
All user accounts (students, faculty, admin)
- name, email, usn, password (hashed), role, department, year, semester, section, assignedSubjects

#### 2. students
Student details with face data
- userId, usn, name, email, department, year, semester, section, phone
- faceEncoding (128-dim array), faceImages, faceRegistered

#### 3. subjects
Course/subject information
- name, code, department, semester, year

#### 4. attendancesessions
Active attendance sessions
- facultyId, subject, date, timeSlot, isActive, studentsPresent[]

#### 5. attendances
Individual attendance records
- usn, studentName, subject, sessionId, date, status, markedAt

---

## 🔐 Authentication System

### JWT (JSON Web Token) Flow
```
1. User sends credentials
2. Backend verifies password
3. Backend generates JWT with user ID
4. Frontend stores JWT in localStorage
5. All requests include: Authorization: Bearer <token>
6. Backend validates token on each protected request
```

### Password Security
- Passwords hashed with bcrypt (10 salt rounds)
- Never stored as plain text
- Only hash comparison for login

---

## 📸 How Face Data is Stored

### What is stored:
1. **Face Encoding** (128 numbers) - Mathematical representation of face
2. **Face Images** (optional, 3 images max) - Base64 encoded

### Privacy:
- Original photos NOT stored
- Only mathematical embeddings stored
- Cannot reverse-engineer face from encoding

### How it works:
```
Photo → DeepFace → 128-dimensional vector → Store in MongoDB
```

---

## 📡 API Endpoints

### Authentication (/api/auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /login | User login |
| POST | /register-student | Student registration |
| GET | /me | Get current user |

### Students (/api/students)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get all students |
| POST | /face/encode | Register face |
| POST | /face/recognize | Recognize face |

### Faculty (/api/faculty)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get all faculty |
| POST | / | Create faculty |
| DELETE | /:id | Delete faculty |

### Subjects (/api/subjects)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get all subjects |
| POST | / | Create subject |
| POST | /assign | Assign to faculty |

### Attendance (/api/attendance)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /session/start | Start session |
| PUT | /session/:id/end | End session |
| POST | /mark | Mark attendance |
| GET | /history | Session history |
| GET | /report | Attendance report |
| GET | /report/excel | Download Excel |

---

## 🎯 Key Features

### Admin Features
- ✅ Create faculty accounts
- ✅ Add and manage subjects
- ✅ Assign subjects to faculty (year, semester, section)
- ✅ View all students

### Faculty Features
- ✅ View assigned subjects
- ✅ Start attendance sessions
- ✅ Live face scan for marking
- ✅ View attendance history
- ✅ Download Excel reports

### Student Features
- ✅ Register with USN
- ✅ Register face for recognition
- ✅ View personal attendance percentage
- ✅ Track attendance by subject

---

## 🧪 Testing the System

### 1. Start Backend
```bash
cd d:/Desktop/SBJain/backend
npm start
# Output: ✅ MongoDB connected, 🚀 Backend → http://localhost:5000
```

### 2. Start AI Service
```bash
cd d:/Desktop/SBJain/ai-service
python main.py
# Output: 🚀 SmartAttend AI Service starting...
```

### 3. Start Frontend
```bash
cd d:/Desktop/SBJain/frontend
npm start
# Output: Compiled successfully! http://localhost:3000
```

---

## 🐛 Troubleshooting

| Problem | Fix |
|---------|-----|
| Camera not working | Allow camera in browser address bar |
| Camera light blinking but no video | Refresh page, check browser console |
| AI service slow | First time downloads 90MB model |
| MongoDB error | Check internet, verify credentials |
| Port in use | Restart terminal or computer |
| Login not working | Check credentials, verify database connected |
| Face not recognized | Ensure good lighting, face clearly visible |

---

## 📁 File Descriptions

### Backend Files
- `server.js` - Express server entry point
- `seed.js` - Database seeder (admin, subjects)
- `.env` - Environment variables (MongoDB URI, JWT secret)

### Backend Models
- `models/User.js` - User schema
- `models/Student.js` - Student schema
- `models/Subject.js` - Subject schema
- `models/Attendance.js` - Attendance schema
- `models/AttendanceSession.js` - Session schema

### Backend Routes
- `routes/auth.js` - Authentication routes
- `routes/students.js` - Student & face routes
- `routes/faculty.js` - Faculty management
- `routes/subjects.js` - Subject management
- `routes/attendance.js` - Attendance operations

### Frontend Pages
- `pages/Login.jsx` - Login page
- `pages/StudentRegister.jsx` - Student registration
- `pages/admin/Faculty.jsx` - Admin faculty management
- `pages/admin/Subjects.jsx` - Admin subject management
- `pages/faculty/TakeAttendance.jsx` - Start session
- `pages/faculty/LiveScan.jsx` - Face scanning
- `pages/student/RegisterFace.jsx` - Face registration
- `pages/student/MyAttendance.jsx` - View attendance

### AI Service
- `main.py` - FastAPI server with DeepFace
- `requirements.txt` - Python dependencies

---

## 🔧 Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb+srv://kotharepratik129_db_user:V4XMVxTXa9c4FQX6@cluster0.tzauzme.mongodb.net/sbjain_attendance
JWT_SECRET=sbjain_smartattend_secret_key_2024_secure
COLLEGE_NAME=S.B. Jain College
AI_SERVICE_URL=http://localhost:5001
PORT=5000
```

---

## 📊 Pre-loaded Data

### Default Admin
- Email: admin@sbjain.edu
- Password: Admin@123

### Pre-loaded Subjects
| Subject | Code | Dept | Semester |
|---------|------|------|----------|
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

## 👨‍💻 Developer

**Pratik Kothare**  
SB Jain Institute Nagpur

---

## 📖 More Information

For complete technical documentation including:
- Detailed API specifications
- Database schema diagrams
- Face recognition algorithm explanation
- Complete troubleshooting guide
- Development setup instructions

**See: PRESENTATION.md**

