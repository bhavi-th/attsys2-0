import express from "express";
import Attendance from "../models/Attendance.js";
import { Session } from "../models/Session.js"; 
import "../models/User.js"; 

const router = express.Router();

router.post("/verify", async (req, res) => {
  const { passkey, studentId } = req.body;

  try {
    const activeSession = await Session.findOne({ passkey });
    if (!activeSession) {
      return res.status(400).json({ error: "Invalid or expired QR code" });
    }

    const alreadyMarked = await Attendance.findOne({
      studentId,
      teacherId: activeSession.teacherId,
    });

    if (alreadyMarked) {
      return res.status(400).json({ error: "Attendance already recorded for this session" });
    }

    await Attendance.create({
      studentId,
      teacherId: activeSession.teacherId,
      status: "Present"
    });

    res.status(200).json({ message: "Attendance marked successfully!" });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

router.get("/list/:teacherId", async (req, res) => {
  try {
    const { teacherId } = req.params;

    const records = await Attendance.find({ teacherId })
      .populate("studentId", "name USNSubject")
      .sort({ date: -1 });

    const formattedData = records.map((rec, index) => ({
      Sno: (index + 1).toString().padStart(2, '0'),
      Name: rec.studentId?.name || "Unknown Student",
      USN: rec.studentId?.USNSubject || "N/A", 
      Status: rec.status || "Present"
    }));

    res.status(200).json(formattedData);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch list" });
  }
});

export default router;
