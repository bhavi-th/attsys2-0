import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.js";
import Table from "../components/Table";
import "../styles/HomePage.css";

const HomePage = () => {
  const { user } = useAuth();
  const [qr, setQr] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);

  // Fetch live attendance data from the backend
  useEffect(() => {
    const fetchAttendance = async () => {
      // Only fetch if we have a logged-in teacher
      if (user?.role === "teacher" && user?.userId) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_URL}:5000/api/attendance/list/${user.userId}`
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
      `${import.meta.env.VITE_URL}:5001/qr?teacherId=${user.userId}&time=${Date.now()}`
    );
  };

  return (
    <div className="HomePage">
      {/* Teacher View: QR Generator Section */}
      {user?.role === "teacher" && (
        <div className="scanner-holder">
          {qr ? (
            <img src={qr} alt="Live QR Code" className="qr-generator" />
          ) : (
            <div className="qr-placeholder">
              <p>No active session</p>
              <span>Click generate to start taking attendance</span>
            </div>
          )}
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
        <Table data={attendanceList.length > 0 ? attendanceList : []} />
        
        {attendanceList.length === 0 && (
          <p className="no-data">No attendance records found for this session.</p>
        )}

        <button className="pdf-btn">Download Report (PDF)</button>
      </div>
    </div>
  );
};

export default HomePage;
