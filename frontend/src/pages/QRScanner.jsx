import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "../styles/QRScanner.css";

function QRScanner() {
  const [scanResult, setScanResult] = useState("");

  useEffect(() => {
    // Create scanner instance
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,        // scans per second
      qrbox: 250,     // size of the scanning box
    });

    // Render scanner with success and error callbacks
    scanner.render(
      (decodedText) => {
        console.log("Decoded QR:", decodedText);
        setScanResult(decodedText);
      },
      (errorMessage) => {
        // Errors are common when no QR is in view — safe to ignore
        console.warn("Scan error:", errorMessage);
      }
    );

    // Cleanup on unmount
    return () => {
      scanner.clear().catch((err) => console.error("Failed to clear scanner:", err));
    };
  }, []);

  return (
    <div className="qrscanner-container" id="qrscanner-container">
      <h2 className="qrscanner-title">QR Scanner (Mobile)</h2>

      {/* Scanner renders into this div */}
      <div id="qr-reader" className="scanner-wrapper"></div>

      <p className="qrscanner-result">
        <strong>Scanned Code:</strong>{" "}
        {scanResult || "Point your camera at a QR code"}
      </p>
    </div>
  );
}

export default QRScanner;
