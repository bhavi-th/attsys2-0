import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "../styles/QRScanner.css";

function QRScanner() {
  const [scanResult, setScanResult] = useState("");
  const [isScanning, setIsScanning] = useState(true); // To prevent double-taps
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    const onScanSuccess = async (decodedText) => {
      if (!isScanning) return; // Exit if already processing a scan

      setIsScanning(false); 
      setScanResult(decodedText);
      console.log("Passkey found:", decodedText);

      try {
        // Send to your MAIN backend (use your Laptop's IP for mobile testing)
        const response = await fetch(`${import.meta.env.VITE_URL}:5000/api/attendance/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            passkey: decodedText,
            studentId: user?.userId, // Sending the student ID
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Attendance marked successfully!");
          scanner.clear(); // Shut down camera
          navigate("/dash"); // Send them back to their dashboard
        } else {
          alert(data.error || "Verification failed");
          setIsScanning(true); // Allow them to try again
        }
      } catch (err) {
        console.error("Verification Error:", err);
        alert("Cannot connect to server. Check your network/IP.");
        setIsScanning(true);
      }
    };

    scanner.render(onScanSuccess, (err) => {
      // Ignore routine scan errors
      console.log("Error : ", err);
    });

    return () => {
      scanner.clear().catch((e) => console.log("Scanner cleanup", e));
    };
  }, [user, navigate, isScanning]);

  return (
    <div className="qrscanner-container">
      <h2 className="qrscanner-title">Scan QR Code</h2>
      <div id="qr-reader" className="scanner-wrapper"></div>
      
      <div className="status-box">
        {scanResult ? (
          <p className="success-msg">Verifying code...</p>
        ) : (
          <p>Align the QR code within the frame</p>
        )}
      </div>
    </div>
  );
}

export default QRScanner;
