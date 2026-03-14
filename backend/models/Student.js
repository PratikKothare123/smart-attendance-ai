const mongoose = require("mongoose");
const s = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    usn: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true },
    email: String,
    department: String,
    year: String,
    semester: String,
    section: String,
    phone: String,
    faceEncoding: { type: [Number], default: [] },
    faceImages: { type: [String], default: [] },
    faceRegistered: { type: Boolean, default: false },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Student", s);
