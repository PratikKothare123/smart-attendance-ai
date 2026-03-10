const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');
const router  = express.Router();

const genToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn:'7d' });

const userObj = u => ({
  id:u._id, name:u.name, role:u.role, usn:u.usn, email:u.email,
  department:u.department, year:u.year, semester:u.semester, section:u.section,
  assignedSubjects: u.assignedSubjects||[],
});

// POST /api/auth/login
router.post('/login', async (req,res) => {
  try {
    const { identifier, password, role } = req.body;
    if(!identifier||!password||!role) return res.status(400).json({ message:'All fields required' });
    const query = role==='student'
      ? { usn:identifier.toUpperCase(), role:'student' }
      : { email:identifier.toLowerCase(), role };
    const user = await User.findOne(query);
    if(!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message:'Invalid credentials' });
    res.json({ token:genToken(user._id), user:userObj(user) });
  } catch(e){ res.status(500).json({ message:e.message }); }
});

// POST /api/auth/register-student
router.post('/register-student', async (req,res) => {
  try {
    const { name,usn,email,password,department,year,semester,section,phone } = req.body;
    if(!name||!usn||!email||!password||!department||!year||!semester||!section)
      return res.status(400).json({ message:'All fields required' });
    const usnU = usn.toUpperCase();
    if(await User.findOne({ $or:[{usn:usnU},{email:email.toLowerCase()}] }))
      return res.status(400).json({ message:'USN or Email already registered' });
    const user = await User.create({ name,usn:usnU,email:email.toLowerCase(),password,role:'student',department,year,semester,section });
    await Student.create({ userId:user._id,usn:usnU,name,email:email.toLowerCase(),department,year,semester,section,phone });
    res.status(201).json({ token:genToken(user._id), user:userObj(user) });
  } catch(e){ res.status(500).json({ message:e.message }); }
});

// GET /api/auth/me
router.get('/me', protect, (req,res) => res.json({ user:userObj(req.user) }));

module.exports = router;
