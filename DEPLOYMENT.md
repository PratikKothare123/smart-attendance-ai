# SmartAttend Deployment Guide

## Project Overview

This project has 3 components:
1. **Backend** - Node.js/Express API (Already deployed on Render) ✅
2. **AI Service** - FastAPI face recognition (To be deployed on Render)
3. **Frontend** - React app (To be deployed on Vercel)

---

## Changes Made to Prepare for Deployment

### 1. Updated `ai-service/requirements.txt`
- Updated to use `tensorflow-cpu` instead of `tensorflow` (lighter for cloud)
- Added required dependencies: `uvicorn[standard]`, `fastapi`, `python-multipart`, `pillow`, `tf-keras`

### 2. Created `ai-service/Procfile`
- Required for Render to know how to run the AI service
- Maps Render's `$PORT` environment variable to the application

### 3. Created `vercel.json` (root directory)
- Configures Vercel to proxy API requests to your backend

### 4. Updated `frontend/src/api.js`
- Added comments about production configuration

---

## Step-by-Step Deployment Procedure

### STEP 1: Deploy AI Service on Render

**Prerequisite:** You need a Render account. If you don't have one, sign up at https://render.com

#### 1.1 Prepare GitHub Repository
Make sure all changes are pushed to GitHub:
```bash
git add .
git commit -m "Update for cloud deployment"
git push origin main
```

#### 1.2 Create a New Web Service on Render

1. Log in to Render dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name:** `smartattend-ai` (or any name you prefer)
   - **Root Directory:** `ai-service` (IMPORTANT!)
   - **Build Command:** (leave empty)
   - **Start Command:** (leave empty - Procfile will handle this)
   
5. Click **"Create Web Service"**

#### 1.3 Configure Environment Variables

After the service is created, go to **"Environment"** tab and add:

| Variable | Value | Example |
|----------|-------|---------|
| `PORT` | Auto-assigned by Render | (leave blank, Render provides it) |
| `PYTHON_VERSION` | `3.10` | |

#### 1.4 Get Your AI Service URL

Once deployed, Render will give you a URL like:
```
https://smartattend-ai.onrender.com
```

**Note this URL down - you will need it!**

---

### STEP 2: Update Backend Environment Variables

Your backend on Render needs to know where the AI service is running.

#### 2.1 Go to Your Backend Service on Render

1. Navigate to your backend service on Render dashboard
2. Go to **"Environment"** tab
3. Add or update these variables:

| Variable | Value | Example |
|----------|-------|---------|
| `AI_SERVICE_URL` | Your AI service URL | `https://smartattend-ai.onrender.com` |

**IMPORTANT:** Remove `http://localhost:5001` or any local URL and replace with the actual Render URL.

#### 2.2 Redeploy Backend

After updating environment variables, click **"Deploy"** to restart your backend service.

---

### STEP 3: Deploy Frontend on Vercel

**Prerequisite:** You need a Vercel account. Sign up at https://vercel.com

#### 3.1 Connect GitHub to Vercel

1. Go to https://vercel.com and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** `Create React App` (or Vercel should auto-detect)
   - **Build Command:** `npm run build` (or leave empty)
   - **Output Directory:** `frontend/build` (or `build`)

#### 3.2 Configure Environment Variables

In Vercel project settings, add:

| Variable | Value |
|----------|-------|
| `REACT_APP_API_URL` | Your backend URL (e.g., `https://your-backend.onrender.com`) |

#### 3.3 Deploy

Click **"Deploy"**. Vercel will build and deploy your frontend.

---

### STEP 4: Update Frontend API Configuration (If Needed)

After deployment, you may need to update the frontend to point to your backend URL.

#### Option A: Using vercel.json (Recommended)

The `vercel.json` in the root directory proxies `/api` requests. Make sure your backend URL is correct.

#### Option B: Direct API URL

If you want the frontend to call your backend directly:

1. Edit `frontend/src/api.js`
2. Change:
```javascript
const api = axios.create({ baseURL: '/api' });
```
To:
```javascript
const api = axios.create({ baseURL: 'https://your-backend.onrender.com/api' });
```

Then rebuild and redeploy.

---

## Testing Your Deployment

### 1. Test AI Service
Visit your AI service URL:
```
https://smartattend-ai.onrender.com/
```
Should return: `{"status":"SmartAttend AI online","model":"Facenet"}`

### 2. Test Backend
Visit your backend URL:
```
https://your-backend.onrender.com/api/health
```
Should return: `{"ok":true,"college":"Your College Name"}`

### 3. Test Frontend
Visit your Vercel URL and try logging in.

### 4. Test Face Recognition
- Register a student's face
- Try taking attendance with face recognition

---

## Troubleshooting

### Issue: AI Service Not Connecting
**Symptom:** "AI service offline" error
**Solution:** 
1. Check that `AI_SERVICE_URL` is set correctly in backend
2. Verify AI service is running on Render
3. Check AI service logs on Render

### Issue: CORS Errors
**Symptom:** Cross-origin errors in browser console
**Solution:** 
1. Ensure backend has CORS configured for your Vercel domain
2. Update CORS in `backend/server.js`:
```javascript
app.use(cors({ 
  origin: ['https://your-frontend.vercel.app'], 
  credentials: true 
}));
```

### Issue: Face Recognition Not Working
**Solution:**
1. Ensure good lighting when capturing faces
2. Check AI service logs for errors
3. Make sure `tensorflow` models are downloading properly

### Issue: MongoDB Connection Failed
**Solution:** Ensure `MONGO_URI` is correctly set in backend environment variables on Render.

---

## Environment Variables Summary

### Backend (Render)
| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT tokens |
| `AI_SERVICE_URL` | URL of your AI service on Render |
| `COLLEGE_NAME` | Your college name |

### AI Service (Render)
| Variable | Description |
|----------|-------------|
| `PORT` | Provided by Render automatically |

### Frontend (Vercel)
| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | Your backend URL (optional if using vercel.json proxy) |

---

## Files Modified for Deployment

1. `ai-service/requirements.txt` - Updated dependencies
2. `ai-service/Procfile` - Created for Render startup command
3. `vercel.json` - Created for API proxying
4. `frontend/src/api.js` - Added comments for production config

---

## Need Help?

If you encounter any issues during deployment:
1. Check the logs in Render dashboard (for backend/AI service)
2. Check the logs in Vercel dashboard (for frontend)
3. Ensure all environment variables are correctly set
4. Make sure ports are correctly configured (PORT env var on Render)

