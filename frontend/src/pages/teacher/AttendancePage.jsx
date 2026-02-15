import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import Table from "../../components/Table";
import "../../styles/teacher/AttendancePage.css";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AttendancePage = () => {
  const { user } = useAuth();
  const { sectionName } = useParams();
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
      if (user?.role === "teacher" && user?.id && sectionName) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_URL}:5000/api/attendance/list/${user.id}/${sectionName}`,
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
  }, [user, sectionName]);

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
      `${import.meta.env.VITE_URL}:5001/qr?teacherId=${user.id}&section=${sectionName}&time=${Date.now()}`,
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
    <>
      <div className="AttendancePage">
        {user?.role === "teacher" && (
          <div className="scanner-holder">
            <h1>Section {sectionName} Attendance</h1>
            {qr ? <img src={qr} className="qr-generator" /> : <div className="qr-generator" />}
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
              : "Session Inactive"}
          </div>

          <Table data={sortedAttendance} />

          <button
            className="pdf-btn"
            onClick={downloadPDF}
            disabled={attendanceList.length === 0}
          >
            Download Report (PDF)
          </button>
        </div>
      </div>
    </>
  );
};

export default AttendancePage;
