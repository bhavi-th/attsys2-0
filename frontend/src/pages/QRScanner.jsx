import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

function QRScanner() {
  const [scanResult, setScanResult] = useState("");

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>QR Scanner (Mobile)</h2>

      <Scanner
        onDecode={(result) => setScanResult(result)}
        onError={(error) => console.error(error)}
        constraints={{ facingMode: "environment" }} // back camera on mobile
        style={{
          width: "100%",
          maxWidth: "400px",
          margin: "auto",
          border: "2px solid #333",
          borderRadius: "8px",
        }}
      />

      <p style={{ marginTop: "20px" }}>
        <strong>Scanned Code:</strong>{" "}
        {scanResult || "Point your camera at a QR code"}
      </p>
    </div>
  );
}

export default QRScanner;
