import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  passkey: { type: String, required: true },
  teacherId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 60 } // Session expires in 60s
});

export const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);
