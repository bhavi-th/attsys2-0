const QRCode = require("qrcode");
const crypto = require("crypto");

async function generateQR() {
    const passkey = crypto.randomBytes(16).toString("hex");
    console.log("Generated Passkey:", passkey);

    await QRCode.toFile("qr.png", passkey);

    console.log("QR saved as qr.png");
}

generateQR();

