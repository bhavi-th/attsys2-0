import express from "express";
import Attendance from "../models/Attendance.js";
import { Session } from "../models/Session.js"; 
import "../models/User.js"; 

const router = express.Router();

/**
 * @route   POST /api/attendance/verify
 * @desc    Verify QR passkey and mark student present
 */
router.post("/verify", async (req, res) => {
  const { passkey, studentId } = req.body;

  try {
    // 1. Validate Session exists in the sessions collection (from QR Generator)
    const activeSession = await Session.findOne({ passkey });
    if (!activeSession) {
      return res.status(400).json({ error: "Invalid or expired QR code" });
    }

    // 2. Prevent duplicate attendance for the same teacher/session
    const alreadyMarked = await Attendance.findOne({
      studentId,
      teacherId: activeSession.teacherId,
    });

    if (alreadyMarked) {
      return res.status(400).json({ error: "Attendance already recorded for this session" });
    }

    // 3. Create the Record in the Attendance collection
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

/**
 * @route   GET /api/attendance/list/:teacherId
 * @desc    Get all students who marked attendance for a specific teacher
 */
router.get("/list/:teacherId", async (req, res) => {
  try {
    const { teacherId } = req.params;

    const records = await Attendance.find({ teacherId })
      .populate("studentId", "name USNSubject") // Use the new field name here
      .sort({ date: -1 });

    const formattedData = records.map((rec, index) => ({
      Sno: (index + 1).toString().padStart(2, '0'),
      Name: rec.studentId?.name || "Unknown Student",
      // Map the repurposed field to the USN column
      USN: rec.studentId?.USNSubject || "N/A", 
      Status: rec.status || "Present"
    }));

    res.status(200).json(formattedData);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch list" });
  }
});

export default router;
