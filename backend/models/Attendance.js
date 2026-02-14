import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  date: { type: Date, default: Date.now },
  status: { type: String, default: "Present" },
});

export default mongoose.model("Attendance", attendanceSchema);
