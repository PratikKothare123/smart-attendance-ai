const express = require("express");
const axios = require("axios");
const Student = require("../models/Student");
const { protect, facultyOnly } = require("../middleware/auth");
const router = express.Router();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:5001";

router.get("/", protect, async (req, res) => {
  try {
    const q = {};
    ["year", "semester", "section", "department"].forEach((k) => {
      if (req.query[k]) q[k] = req.query[k];
    });
    res.json(await Student.find(q).select("-faceImages -faceEncoding"));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/my-profile", protect, async (req, res) => {
  try {
    const s = await Student.findOne({ usn: req.user.usn }).select(
      "-faceImages -faceEncoding",
    );
    res.json(s);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/face/encode", protect, async (req, res) => {
  try {
    const { usn, images } = req.body;
    if (!usn || !images?.length)
      return res.status(400).json({ message: "USN and images required" });
    const student = await Student.findOne({ usn: usn.toUpperCase() });
    if (!student) return res.status(404).json({ message: "Student not found" });
    if (req.user.role === "student" && req.user.usn !== usn.toUpperCase())
      return res.status(403).json({ message: "Forbidden" });
    const aiRes = await axios.post(
      `${AI_SERVICE_URL}/encode-faces`,
      { usn: usn.toUpperCase(), images },
      { timeout: 60000 },
    );
    if (!aiRes.data.encoding)
      return res
        .status(400)
        .json({ message: aiRes.data.message || "No face detected" });
    student.faceEncoding = aiRes.data.encoding;
    student.faceImages = images.slice(0, 3);
    student.faceRegistered = true;
    await student.save();
    res.json({ message: "Face registered!", faceRegistered: true });
  } catch (e) {
    if (e.code === "ECONNREFUSED")
      return res
        .status(503)
        .json({ message: "AI service offline. Start python main.py first." });
    res.status(500).json({ message: e.message });
  }
});

router.post("/face/recognize", protect, facultyOnly, async (req, res) => {
  try {
    const { image, year, semester, section, department } = req.body;
    if (!image) return res.status(400).json({ message: "Image required" });
    const students = await Student.find({
      year,
      semester,
      section,
      department,
      faceRegistered: true,
    }).select("usn name faceEncoding");
    if (!students.length)
      return res
        .status(400)
        .json({
          message: "No students with registered faces in this section.",
        });
    const known = students.map((s) => ({
      usn: s.usn,
      name: s.name,
      encoding: s.faceEncoding,
    }));
    const aiRes = await axios.post(
      `${AI_SERVICE_URL}/recognize`,
      { image, known_faces: known },
      { timeout: 20000 },
    );
    res.json(aiRes.data);
  } catch (e) {
    if (e.code === "ECONNREFUSED")
      return res.status(503).json({ message: "AI service offline." });
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
