import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Must match your User model name exactly
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Must match your User model name exactly
    required: true,
  },
  date: { type: Date, default: Date.now },
  status: { type: String, default: "Present" },
});

export default mongoose.model("Attendance", attendanceSchema);
