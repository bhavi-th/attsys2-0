import express from "express";
import path from "path";
import { generateQR } from "./generateQR.js";

const app = express();
const PORT = 5000;

app.get("/qr", async (req, res) => {
  try {
    const filePath = path.join(process.cwd(), "qr.png");
    await generateQR(filePath);
    res.sendFile(filePath); // send the PNG to frontend
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating QR");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

