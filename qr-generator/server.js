import express from "express";
import qrcode from "qrcode";
import crypto from "crypto";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// 1. Setup Environment
dotenv.config({ path: path.join(process.cwd(), "..", "backend", ".env") });

const app = express();
const PORT = 5001;

// 2. Connect to DB
const mongoURI = process.env.MONGO_URI; 
mongoose.connect(mongoURI)
  .then(() => console.log("✅ DB Connected"))
  .catch(err => console.error("❌ DB Connection Error:", err));

// 3. Define Schema locally to avoid import/path issues
const sessionSchema = new mongoose.Schema({
  passkey: { type: String, required: true, unique: true },
  teacherId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 60 } 
});

// Check if the model exists, otherwise create it
const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);

app.get("/qr", async (req, res) => {
  try {
    const { teacherId } = req.query;

    if (!teacherId) {
      return res.status(400).send("Missing teacherId");
    }

    const passkey = crypto.randomBytes(16).toString("hex");

    // 4. Save the passkey
    await Session.create({
      passkey,
      teacherId
    });

    // 5. Stream the QR code image
    res.setHeader("Content-Type", "image/png");
    await qrcode.toFileStream(res, passkey);
    
    console.log(`Successfully generated QR for: ${teacherId}`);
  } catch (err) {
    console.error("Internal Server Error Detail:", err);
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 QR Generator running on http://localhost:${PORT}`);
});
