import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth.js";
import Table from "../components/Table";
import "../styles/HomePage.css";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const HomePage = () => {
  const { user } = useAuth();
  const [qr, setQr] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);

  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  const downloadPDF = () => {
    if (!attendanceList || attendanceList.length === 0) return;
    const doc = new jsPDF("p", "pt", "a4");
    const columns = Object.keys(attendanceList[0]).map((key) => ({
      header: key.toUpperCase(),
      dataKey: key,
    }));

    autoTable(doc, {
      columns: columns,
      body: attendanceList,
      startY: 40,
      margin: { top: 40 },
      didDrawPage: () => {
        doc.text("Attendance Report", 40, 30);
      },
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 },
    });

    doc.save(`Attendance_${Date.now()}.pdf`);
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      if (user?.role === "teacher" && user?.userId) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_URL}:5000/api/attendance/list/${user.userId}`,
          );
          if (response.ok) {
            const data = await response.json();
            setAttendanceList(data);
          }
        } catch (err) {
          console.error("Failed to fetch attendance:", err);
        }
      }
    };

    const interval = setInterval(fetchAttendance, 5000);
    fetchAttendance();

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  const generateQR = () => {
    setQr(
      `${import.meta.env.VITE_URL}:5001/qr?teacherId=${user.userId}&time=${Date.now()}`,
    );
    setTimeLeft(10);
  };

  const stopSession = () => {
    setQr(null);
    setTimeLeft(0);
  };

  const getSortedData = () => {
    if (!attendanceList || attendanceList.length === 0) return [];
    return [...attendanceList].sort((a, b) => {
      const groupA = (a.usn || "").slice(1, 3).toUpperCase();
      const groupB = (b.usn || "").slice(1, 3).toUpperCase();
      if (groupA !== groupB) return groupA.localeCompare(groupB);
      return (a.name || "")
        .toLowerCase()
        .localeCompare((b.name || "").toLowerCase());
    });
  };

  const sortedAttendance = getSortedData();

  return (
    <div className="HomePage">
      {user?.role === "teacher" && (
        <div className="scanner-holder">
          {qr && <img src={qr} className="qr-generator" alt="QR Code" />}
          <div className="button-holder">
            <button className="generate-btn" onClick={generateQR}>
              Generate QR
            </button>
            <button className="stop-btn" onClick={stopSession}>
              Stop Session
            </button>
          </div>
        </div>
      )}

      <div className="student-timer">
        <div className="timer">
          {timeLeft > 0
            ? `QR Expires in: ${timeLeft}s`
            : user?.role === "teacher"
              ? "Session Inactive"
              : "Your Attendance Status"}
        </div>

        <Table data={sortedAttendance} />

        {attendanceList.length === 0 && (
          <p className="no-data">
            No attendance records found for this session.
          </p>
        )}

        <button
          className="pdf-btn"
          onClick={downloadPDF}
          disabled={attendanceList.length === 0}
        >
          Download Report (PDF)
        </button>
      </div>
    </div>
  );
};

export default HomePage;
