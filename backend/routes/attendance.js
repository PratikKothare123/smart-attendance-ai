const express  = require('express');
const XLSX     = require('xlsx');
const Session  = require('../models/AttendanceSession');
const Attendance = require('../models/Attendance');
const Student  = require('../models/Student');
const { protect, facultyOnly } = require('../middleware/auth');
const router   = express.Router();

// Start session
router.post('/session/start', protect, facultyOnly, async (req,res) => {
  try {
    const { subject,subjectId,subjectCode,year,semester,section,department,timeSlot } = req.body;
    if(!subject||!year||!semester||!section||!department)
      return res.status(400).json({ message:'All fields required' });
    const date = new Date().toISOString().split('T')[0];
    const existing = await Session.findOne({ facultyId:req.user._id,subject,year,semester,section,date,isActive:true });
    if(existing) return res.json({ session:existing });
    const session = await Session.create({ facultyId:req.user._id,facultyName:req.user.name,subject,subjectId,subjectCode,year,semester,section,department,date,timeSlot });
    res.status(201).json({ session });
  } catch(e){ res.status(500).json({ message:e.message }); }
});

// End session
router.put('/session/:id/end', protect, facultyOnly, async (req,res) => {
  try {
    const s = await Session.findById(req.params.id);
    if(!s) return res.status(404).json({ message:'Not found' });
    s.isActive=false; await s.save();
    res.json({ message:'Session ended', session:s });
  } catch(e){ res.status(500).json({ message:e.message }); }
});

// Get session
router.get('/session/:id', protect, async (req,res) => {
  try {
    const session = await Session.findById(req.params.id);
    if(!session) return res.status(404).json({ message:'Not found' });
    const totalStudents = await Student.countDocuments({ year:session.year,semester:session.semester,section:session.section,department:session.department });
    res.json({ session, totalStudents });
  } catch(e){ res.status(500).json({ message:e.message }); }
});

// Mark attendance
router.post('/mark', protect, facultyOnly, async (req,res) => {
  try {
    const { sessionId, usn, name } = req.body;
    const session = await Session.findById(sessionId);
    if(!session||!session.isActive) return res.status(400).json({ message:'Session not active' });
    if(session.studentsPresent.some(s=>s.usn===usn.toUpperCase()))
      return res.json({ alreadyMarked:true, usn, name });
    session.studentsPresent.push({ usn:usn.toUpperCase(), name, markedAt:new Date() });
    await session.save();
    await Attendance.findOneAndUpdate(
      { usn:usn.toUpperCase(), sessionId:session._id },
      { usn:usn.toUpperCase(),studentName:name,subject:session.subject,subjectId:session.subjectId,
        sessionId:session._id,year:session.year,semester:session.semester,section:session.section,
        department:session.department,date:session.date,timeSlot:session.timeSlot,status:'Present',markedAt:new Date() },
      { upsert:true,new:true }
    );
    res.json({ message:'Marked present', usn:usn.toUpperCase(), name });
  } catch(e){ res.status(500).json({ message:e.message }); }
});

// Today's sessions
router.get('/sessions/today', protect, facultyOnly, async (req,res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    res.json(await Session.find({ facultyId:req.user._id,date:today }).sort({ createdAt:-1 }));
  } catch(e){ res.status(500).json({ message:e.message }); }
});

// History
router.get('/history', protect, facultyOnly, async (req,res) => {
  try { res.json(await Session.find({ facultyId:req.user._id }).sort({ createdAt:-1 }).limit(100)); }
  catch(e){ res.status(500).json({ message:e.message }); }
});

// Student attendance
router.get('/student/:usn', protect, async (req,res) => {
  try {
    const usn = req.params.usn.toUpperCase();
    if(req.user.role==='student' && req.user.usn!==usn)
      return res.status(403).json({ message:'Forbidden' });
    const student = await Student.findOne({ usn }).select('-faceImages -faceEncoding');
    if(!student) return res.status(404).json({ message:'Student not found' });
    const allSessions = await Session.find({ year:student.year,semester:student.semester,section:student.section,department:student.department });
    const presentRecs = await Attendance.find({ usn, status:'Present' });
    const map={};
    allSessions.forEach(s=>{
      if(!map[s.subject]) map[s.subject]={ total:0,present:0 };
      map[s.subject].total++;
    });
    presentRecs.forEach(r=>{
      if(!map[r.subject]) map[r.subject]={ total:0,present:0 };
      map[r.subject].present++;
    });
    const attendance = Object.entries(map).map(([subject,d])=>({
      subject, total:d.total, present:d.present, absent:d.total-d.present,
      percentage: d.total>0?Math.round((d.present/d.total)*100):0,
    }));
    res.json({ student, attendance, faceRegistered:student.faceRegistered });
  } catch(e){ res.status(500).json({ message:e.message }); }
});

// Report
router.get('/report', protect, facultyOnly, async (req,res) => {
  try {
    const { subject,year,semester,section,department } = req.query;
    const sessions = await Session.find({ facultyId:req.user._id,subject,year,semester,section,department }).sort({ date:-1 });
    const students = await Student.find({ year,semester,section,department }).select('-faceImages -faceEncoding');
    const report = students.map(s=>{
      const present = sessions.filter(sess=>sess.studentsPresent.some(p=>p.usn===s.usn)).length;
      return { usn:s.usn, name:s.name, total:sessions.length, present, absent:sessions.length-present,
               percentage:sessions.length>0?Math.round((present/sessions.length)*100):0 };
    });
    res.json({ subject,year,semester,section,totalSessions:sessions.length,sessions,report });
  } catch(e){ res.status(500).json({ message:e.message }); }
});

// Excel download
router.get('/report/excel', protect, facultyOnly, async (req,res) => {
  try {
    const { subject,year,semester,section,department } = req.query;
    const sessions = await Session.find({ facultyId:req.user._id,subject,year,semester,section,department }).sort({ date:1 });
    const students = await Student.find({ year,semester,section,department }).select('-faceImages -faceEncoding');

    // Build rows
    const rows = students.map(s=>{
      const present = sessions.filter(sess=>sess.studentsPresent.some(p=>p.usn===s.usn)).length;
      const pct = sessions.length>0?Math.round((present/sessions.length)*100):0;
      const row = { USN:s.usn, Name:s.name, Department:s.department, Year:s.year, Section:`Sec ${s.section}` };
      sessions.forEach((sess,i)=>{
        const isPresent = sess.studentsPresent.some(p=>p.usn===s.usn);
        row[`${sess.date} ${sess.timeSlot||''}`.trim()] = isPresent?'P':'A';
      });
      row['Total Lectures'] = sessions.length;
      row['Present']        = present;
      row['Absent']         = sessions.length - present;
      row['Percentage']     = `${pct}%`;
      row['Status']         = pct>=75?'Safe':pct>=60?'Low':'Critical';
      return row;
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = Object.keys(rows[0]||{}).map(()=>({ wch:18 }));
    XLSX.utils.book_append_sheet(wb, ws, subject.slice(0,31));

    // Summary sheet
    const summaryRows = [{
      'Subject':subject,'Year':year,'Semester':semester,'Section':section,
      'Total Sessions':sessions.length,'Total Students':students.length,
      'Generated On': new Date().toLocaleString('en-IN'),
      'Faculty': req.user.name,
    }];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryRows), 'Summary');

    const buf = XLSX.write(wb,{ type:'buffer', bookType:'xlsx' });
    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition',`attachment; filename="${subject}_${section}_${year}_attendance.xlsx"`);
    res.send(buf);
  } catch(e){ res.status(500).json({ message:e.message }); }
});

module.exports = router;
