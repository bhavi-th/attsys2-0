import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.js";
import Table from "../components/Table";
import "../styles/HomePage.css";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const HomePage = () => {
  const { user } = useAuth();
  const [qr, setQr] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);

  const downloadPDF = () => {
    if (!attendanceList || attendanceList.length === 0) return;

    // Create document
    const doc = new jsPDF("p", "pt", "a4"); // 'pt' (points) is often more stable for autotable

    // Prepare data
    const columns = Object.keys(attendanceList[0]).map((key) => ({
      header: key.toUpperCase(),
      dataKey: key,
    }));

    const rows = attendanceList;

    // CALL AUTOTABLE
    autoTable(doc, {
      columns: columns,
      body: rows,
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

  // Fetch live attendance data from the backend
  useEffect(() => {
    const fetchAttendance = async () => {
      // Only fetch if we have a logged-in teacher
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

    // Poll every 5 seconds for live updates
    const interval = setInterval(fetchAttendance, 5000);
    fetchAttendance(); // Initial fetch

    return () => clearInterval(interval);
  }, [user]);

  const generateQR = () => {
    // Port 5001 handles the QR generation and Session creation
    setQr(
      `${import.meta.env.VITE_URL}:5001/qr?teacherId=${user.userId}&time=${Date.now()}`,
    );
  };

  const getSortedData = () => {
    if (!attendanceList || attendanceList.length === 0) return [];

    return [...attendanceList].sort((a, b) => {
      // 1. Extract the group code (e.g., "BY" from "1BY24CS075")
      const groupA = (a.usn || "").slice(1, 3).toUpperCase();
      const groupB = (b.usn || "").slice(1, 3).toUpperCase();

      // 2. Primary Sort: Compare the group codes (BY vs TD)
      if (groupA < groupB) return -1;
      if (groupA > groupB) return 1;

      // 3. Secondary Sort: If in the same group, sort by Name alphabetically
      const nameA = (a.name || "").toLowerCase();
      const nameB = (b.name || "").toLowerCase();

      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;

      return 0;
    });
  };

  const sortedAttendance = getSortedData();

  return (
    <div className="HomePage">
      {user?.role === "teacher" && (
        <div className="scanner-holder">
          <img src={qr} className="qr-generator" />
          <div className="button-holder">
            <button className="generate-btn" onClick={generateQR}>
              Generate QR
            </button>
            <button className="stop-btn" onClick={() => setQr(null)}>
              Stop Session
            </button>
          </div>
        </div>
      )}

      {/* Shared View: Data Table */}
      <div className="student-timer">
        <div className="timer">
          {user?.role === "teacher"
            ? "Live Classroom Attendance"
            : "Your Attendance Status"}
        </div>

        {/* We now pass the dynamic attendanceList instead of sampleData */}
        <Table data={sortedAttendance.length > 0 ? sortedAttendance : []} />

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
