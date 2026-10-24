import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../../styles/student/StudentDash.css';

const StudentDash = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAttendanceData();
    }, [id]);

    const fetchAttendanceData = async () => {
        try {
            const API_BASE_URL =
                import.meta.env.VITE_PORT && import.meta.env.VITE_PORT !== 'undefined'
                    ? `${import.meta.env.VITE_URL}:${import.meta.env.VITE_PORT}`
                    : import.meta.env.VITE_URL;

            const response = await fetch(`${API_BASE_URL}/api/attendance/student/attendance/${id}`);
            const data = await response.json();

            if (response.ok) {
                setAttendanceData(data.attendance || []);
            } else {
                setError(data.error || 'Failed to fetch attendance data');
            }
        } catch (err) {
            setError('Cannot connect to server');
            console.error('Error fetching attendance:', err);
        } finally {
            setLoading(false);
        }
    };

    const getAttendanceColor = (percentage) => {
        if (percentage >= 75) return '#00fff2';
        if (percentage >= 60) return '#ffa500';
        return '#ff4757';
    };

    const getAttendanceStatus = (percentage) => {
        if (percentage >= 75) return 'Good';
        if (percentage >= 60) return 'Warning';
        return 'Critical';
    };

    return (
        <>
            <div className="StudentDash">
                <div className="dashboard-container">
                    <span className="dash-section">QUICK ACTIONS</span>

                    <div className="actions">
                        <button
                            className="scanner-btn"
                            onClick={() => navigate('/qrscanner')}
                        >
                            Scan Attendance
                        </button>
                    </div>

                    <span className="dash-section" style={{ marginTop: '6vmin' }}>
                        ATTENDANCE HISTORY
                    </span>

                    <div className="attendance-history">
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Loading attendance data...</p>
                            </div>
                        ) : error ? (
                            <div className="error-state">
                                <p>{error}</p>
                            </div>
                        ) : attendanceData.length === 0 ? (
                            <div className="empty-state">
                                <p>No attendance records found</p>
                            </div>
                        ) : (
                            <div className="attendance-list">
                                {attendanceData.map((subject, index) => (
                                    <div key={index} className="attendance-card">
                                        <div className="subject-info">
                                            <h3 className="subject-name">{subject.subject}</h3>
                                            <p className="subject-details">
                                                {subject.section} • Sem {subject.semester}
                                            </p>
                                        </div>
                                        <div className="attendance-stats">
                                            <div className="percentage-container">
                                                <span
                                                    className="percentage"
                                                    style={{ color: getAttendanceColor(subject.percentage) }}
                                                >
                                                    {subject.percentage.toFixed(1)}%
                                                </span>
                                                <span
                                                    className="status-badge"
                                                    style={{
                                                        backgroundColor: `${getAttendanceColor(subject.percentage)}20`,
                                                        color: getAttendanceColor(subject.percentage),
                                                    }}
                                                >
                                                    {getAttendanceStatus(subject.percentage)}
                                                </span>
                                            </div>
                                            <div className="progress-bar-container">
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill"
                                                        style={{
                                                            width: `${Math.min(subject.percentage, 100)}%`,
                                                            backgroundColor: getAttendanceColor(subject.percentage),
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="attendance-details">
                                                <span className="attended">
                                                    Attended: {subject.attended}
                                                </span>
                                                <span className="total">
                                                    Total: {subject.total}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentDash;
