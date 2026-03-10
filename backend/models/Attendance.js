const mongoose = require('mongoose');
const s = new mongoose.Schema({
  usn:String, studentName:String, studentId:{ type:mongoose.Schema.Types.ObjectId, ref:'User' },
  subject:String, subjectId:{ type:mongoose.Schema.Types.ObjectId, ref:'Subject' },
  sessionId:{ type:mongoose.Schema.Types.ObjectId, ref:'AttendanceSession' },
  year:String, semester:String, section:String, department:String,
  date:String, timeSlot:String, status:{ type:String, enum:['Present','Absent'], default:'Present' },
  markedAt:{ type:Date, default:Date.now },
},{ timestamps:true });
s.index({ usn:1, sessionId:1 },{ unique:true });
module.exports = mongoose.model('Attendance', s);
