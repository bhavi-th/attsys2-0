import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import "../styles/QRScanner.css";

function QRScanner() {
  const [scanResult, setScanResult] = useState("");

  return (
    <div className="qrscanner-container" id="qrscanner-container">
      <h2 className="qrscanner-title">QR Scanner (Mobile)</h2>

      <div className="scanner-wrapper">
        <Scanner
          onDecode={(result) => setScanResult(result)}
          onError={(error) => console.error(error)}
          constraints={{ facingMode: "environment" }}
        />
      </div>

      <p className="qrscanner-result">
        <strong>Scanned Code:</strong>{" "}
        {scanResult || "Point your camera at a QR code"}
      </p>
    </div>
  );
}

export default QRScanner;
