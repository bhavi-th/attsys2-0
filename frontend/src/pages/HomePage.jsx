import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import Table from "../components/Table";
import "../styles/HomePage.css";

const sampleData = [
  { Sno: "01", Name: "ZZZ", USN: "1TD24CS025", Status: "Present" },
  { Sno: "02", Name: "WWW", USN: "1TD24CS030", Status: "Absent" },
  { Sno: "03", Name: "YYY", USN: "1TD24CS028", Status: "Present" },
  // ... rest of your data
];

const HomePage = () => {
  const { user } = useAuth();
  const [qr, setQr] = useState(null);

  const generateQR = () => {
    // Usually, the QR should contain the teacher's ID or a specific session ID
    setQr(
      `http://localhost:5001/qr?teacherId=${user.userId}&time=${Date.now()}`,
    );
  };

  return (
    <div className="HomePage">
      {/* Teacher View: Scanner/Generator */}
      {user?.role === "teacher" && (
        <div className="scanner-holder">
          <img src={qr} alt="QR Code" className="qr-generator" />
          <div className="button-holder">
            <button onClick={generateQR}>Generate</button>
            <button onClick={() => setQr(null)}>Stop</button>
          </div>
        </div>
      )}

      {/* Shared View: Attendance List */}
      <div className="student-timer">
        <div className="timer">
          {user?.role === "teacher"
            ? "Live Attendance"
            : "Your Attendance Status"}
        </div>
        <Table data={sampleData} />
        <button className="pdf-btn">Download PDF</button>
      </div>
    </div>
  );
};

export default HomePage;
