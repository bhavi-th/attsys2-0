// generateQR.js
import qrcode from "qrcode";
import crypto from "crypto";

export async function generateQR(filePath = "qr.png") {
  const passkey = crypto.randomBytes(16).toString("hex");
  console.log("Generated Passkey:", passkey);

  await qrcode.toFile(filePath, passkey);

  console.log("QR saved as", filePath);
  return passkey; // return so backend can use it
}
