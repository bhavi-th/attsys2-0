import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/teacher/AttendanceHistory.css';

const AttendanceHistory = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { branch, subject: encodedSubject, section, semester } = useParams();
    const subject = decodeURIComponent(encodedSubject);

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const API_BASE_URL = import.meta.env.VITE_PORT
                    ? `${import.meta.env.VITE_URL}:${import.meta.env.VITE_PORT}`
                    : import.meta.env.VITE_URL;
                const response = await fetch(
                    `${API_BASE_URL}/api/attendance/history/${user?.id}/${branch}/${subject}/${section}/${semester}`,
                );
                const data = await response.json();

                if (response.ok) {
                    setHistory(data);
                } else {
                    setError(data.error || 'Failed to fetch history');
                }
            } catch (err) {
                console.error('Connection error fetching history:', err);
                setError('Server connection failed');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user?.id, branch, subject, section, semester]);

    if (loading) return <div className="AttendanceHistory">Loading History...</div>;

    if (error) return <div className="AttendanceHistory error">{error}</div>;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata',
        });
    };

    return (
        <div className="AttendanceHistory">
            <div className="history-container">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Back
                </button>

                <div className="history-header">
                    <h1 className="history-title">Attendance History</h1>
                    <div className="history-subtitle">
                        <span>{subject}</span>
                        <span>•</span>
                        <span>Section {section}</span>
                        <span>•</span>
                        <span>Semester {semester}</span>
                    </div>
                </div>

                {history.length === 0 ? (
                    <div className="no-history">
                        <p>No attendance records found</p>
                    </div>
                ) : (
                    <div className="history-list">
                        {history.map((session, index) => (
                            <div key={session.sessionId || session.date || index} className="history-session">
                                <div className="session-header">
                                    <h2 className="session-date">{formatDate(session.date)}</h2>
                                    <span className="session-count">{session.count} students</span>
                                </div>

                                <div className="session-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>S.No</th>
                                                <th>USN</th>
                                                <th>Name</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {session.records.map((record, idx) => (
                                                <tr key={idx}>
                                                    <td>{idx + 1}</td>
                                                    <td>{record.usn}</td>
                                                    <td>{record.studentName}</td>
                                                    <td className={`status ${record.status.toLowerCase()}`}>
                                                        {record.status}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceHistory;
