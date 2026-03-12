require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const app      = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://smart-attendance-ai.vercel.app',
'https://smart-attendance-ai-git-main-pratiks-projects-7b933d8c.vercel.app', 'https://smart-attendance-ai-*.vercel.app',
    'https://smart-attendance-ai-1.vercel.app' // update with your exact domain
  ],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(e  => console.error('❌ MongoDB:', e.message));

app.use('/api/auth',       require('./routes/auth'));
app.use('/api/students',   require('./routes/students'));
app.use('/api/faculty',    require('./routes/faculty'));
app.use('/api/subjects',   require('./routes/subjects'));
app.use('/api/attendance', require('./routes/attendance'));

app.get('/api/health', (_,res) => res.json({ ok:true, college: process.env.COLLEGE_NAME }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend → http://localhost:${PORT}`));
