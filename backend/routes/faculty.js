const express = require("express");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.get("/", protect, async (_, res) => {
  try {
    res.json(await User.find({ role: "faculty" }).select("-password"));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { name, email, password, department } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });
    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(400).json({ message: "Email already used" });
    const f = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: "faculty",
      department,
    });
    res
      .status(201)
      .json({
        message: "Faculty created",
        faculty: { id: f._id, name: f.name, email: f.email, department },
      });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


router.delete("/:id", protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
