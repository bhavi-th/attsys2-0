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
          onDecode={(result) => {
            if (result) {
              // Handle both string and object results
              const text =
                typeof result === "string" ? result : result.rawValue;
              setScanResult(text);
            }
          }}
          onError={(error) => console.error("Scanner error:", error)}
          constraints={{ video: { facingMode: { exact: "environment" } } }}
          components={{
            // Optional overlay guides
            tracker: true,
          }}
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
