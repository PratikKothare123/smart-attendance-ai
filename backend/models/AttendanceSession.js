const mongoose = require("mongoose");
const presentSchema = new mongoose.Schema(
  {
    usn: String,
    name: String,
    markedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  },
);


const s = new mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    facultyName: String,
    subject: String,
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    subjectCode: String,
    year: String,
    semester: String,
    section: String,
    department: String,
    date: String,
    timeSlot: String,
    isActive: { type: Boolean, default: true },
    studentsPresent: [presentSchema],
  },
  { timestamps: true },
);
module.exports = mongoose.model("AttendanceSession", s);
