const express = require('express');
const Subject = require('../models/Subject');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');
const router  = express.Router();

router.get('/', protect, async (req,res) => {
  try {
    const q={};
    ['department','semester','year'].forEach(k=>{ if(req.query[k]) q[k]=req.query[k]; });
    res.json(await Subject.find(q).sort({ name:1 }));
  } catch(e){ res.status(500).json({ message:e.message }); }
});

router.post('/', protect, async (req,res) => {
  try {
    const { name,code,department,semester,year } = req.body;
    if(!name||!department||!semester||!year) return res.status(400).json({ message:'Required fields missing' });
    res.status(201).json(await Subject.create({ name,code,department,semester,year }));
  } catch(e){ res.status(500).json({ message:e.message }); }
});

router.delete('/:id', protect, async (req,res) => {
  try { await Subject.findByIdAndDelete(req.params.id); res.json({ message:'Deleted' }); }
  catch(e){ res.status(500).json({ message:e.message }); }
});

router.post('/assign', protect, async (req,res) => {
  try {
    const { facultyId,subjectId,year,semester,section,department } = req.body;
    const [f,s] = await Promise.all([User.findById(facultyId), Subject.findById(subjectId)]);
    if(!f||!s) return res.status(404).json({ message:'Faculty or subject not found' });
    const dup = f.assignedSubjects.some(a=>a.subjectId?.toString()===subjectId && a.section===section && a.year===year);
    if(dup) return res.status(400).json({ message:'Already assigned' });
    f.assignedSubjects.push({ subjectId:s._id,subjectName:s.name,code:s.code,year,semester,section,department });
    await f.save();
    res.json({ message:'Assigned successfully' });
  } catch(e){ res.status(500).json({ message:e.message }); }
});

router.delete('/assign/:facultyId/:idx', protect, async (req,res) => {
  try {
    const f = await User.findById(req.params.facultyId);
    f.assignedSubjects.splice(Number(req.params.idx),1);
    await f.save(); res.json({ message:'Removed' });
  } catch(e){ res.status(500).json({ message:e.message }); }
});

module.exports = router;
