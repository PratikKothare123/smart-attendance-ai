const mongoose = require('mongoose');
const s = new mongoose.Schema({
  name:String, code:String, department:String, semester:String, year:String
},{ timestamps:true });
module.exports = mongoose.model('Subject', s);
