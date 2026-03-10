const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req,res,next) => {
  const auth = req.headers.authorization;
  if(!auth?.startsWith('Bearer ')) return res.status(401).json({ message:'No token' });
  try {
    const { id } = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    req.user = await User.findById(id).select('-password');
    if(!req.user) return res.status(401).json({ message:'User not found' });
    next();
  } catch { res.status(401).json({ message:'Invalid token' }); }
};

const facultyOnly = (req,res,next) => {
  if(!['faculty','admin'].includes(req.user.role)) return res.status(403).json({ message:'Faculty only' });
  next();
};
const adminOnly = (req,res,next) => {
  if(req.user.role!=='admin') return res.status(403).json({ message:'Admin only' });
  next();
};

module.exports = { protect, facultyOnly, adminOnly };
