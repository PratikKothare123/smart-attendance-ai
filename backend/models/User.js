const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const assignedSubSchema = new mongoose.Schema({
  subjectId:   { type: mongoose.Schema.Types.ObjectId, ref:'Subject' },
  subjectName: String, code: String,
  year: String, semester: String, section: String, department: String
},{ _id:false });

const userSchema = new mongoose.Schema({
  name:     { type:String, required:true, trim:true },
  email:    { type:String, unique:true, sparse:true, lowercase:true },
  usn:      { type:String, unique:true, sparse:true, uppercase:true },
  password: { type:String, required:true },
  role:     { type:String, enum:['student','faculty','admin'], default:'student' },
  department: String, year: String, semester: String, section: String,
  assignedSubjects: [assignedSubSchema],
},{ timestamps:true });

userSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10); next();
});
userSchema.methods.comparePassword = function(p){ return bcrypt.compare(p, this.password); };

module.exports = mongoose.model('User', userSchema);
