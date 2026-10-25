import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
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

    // Calculate overall statistics
    const calculateStats = () => {
        if (attendanceData.length === 0) return null;

        const totalAttended = attendanceData.reduce((sum, subject) => sum + subject.attended, 0);
        const totalSessions = attendanceData.reduce((sum, subject) => sum + subject.total, 0);
        const overallPercentage = totalSessions > 0 ? (totalAttended / totalSessions) * 100 : 0;

        const bestSubject = attendanceData.reduce((best, current) =>
            current.percentage > best.percentage ? current : best
        );
        const worstSubject = attendanceData.reduce((worst, current) =>
            current.percentage < worst.percentage ? current : worst
        );

        const criticalSubjects = attendanceData.filter((s) => s.percentage < 75);

        return {
            overallPercentage,
            totalAttended,
            totalSessions,
            bestSubject,
            worstSubject,
            criticalSubjects: criticalSubjects.length,
        };
    };

    const stats = calculateStats();

    // Prepare data for pie chart
    const pieData = stats
        ? [
              { name: 'Attended', value: stats.totalAttended, color: '#00fff2' },
              { name: 'Absent', value: stats.totalSessions - stats.totalAttended, color: '#ff4757' },
          ]
        : [];

    // Prepare data for bar chart
    const barData = attendanceData.map((subject) => ({
        subject: subject.subject.substring(0, 8),
        percentage: subject.percentage,
        attended: subject.attended,
        total: subject.total,
    }));

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
                        OVERVIEW
                    </span>

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
                        <>
                            {/* Statistics Cards */}
                            <div className="stats-grid">
                                <div className="stat-card overall-card">
                                    <div className="stat-icon overall-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                        </svg>
                                    </div>
                                    <div className="stat-content">
                                        <p className="stat-label">Overall Attendance</p>
                                        <p
                                            className="stat-value"
                                            style={{ color: getAttendanceColor(stats.overallPercentage) }}
                                        >
                                            {stats.overallPercentage.toFixed(1)}%
                                        </p>
                                        <p className="stat-sub">
                                            {stats.totalAttended}/{stats.totalSessions} classes
                                        </p>
                                    </div>
                                </div>

                                <div className="stat-card best-card">
                                    <div className="stat-icon best-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    </div>
                                    <div className="stat-content">
                                        <p className="stat-label">Best Subject</p>
                                        <p className="stat-value">{stats.bestSubject.subject}</p>
                                        <p className="stat-sub">{stats.bestSubject.percentage.toFixed(1)}%</p>
                                    </div>
                                </div>

                                <div className="stat-card critical-card">
                                    <div className="stat-icon critical-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="stat-content">
                                        <p className="stat-label">Needs Attention</p>
                                        <p className="stat-value">{stats.criticalSubjects}</p>
                                        <p className="stat-sub">subjects below 75%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Charts Section */}
                            <div className="charts-section">
                                <div className="chart-container pie-chart-container">
                                    <h3 className="chart-title">Attendance Distribution</h3>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={70}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgba(10, 10, 18, 0.9)',
                                                    border: '1px solid rgba(0, 255, 242, 0.2)',
                                                    borderRadius: '8px',
                                                    color: '#fff',
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="pie-legend">
                                        <div className="legend-item">
                                            <span className="legend-dot" style={{ backgroundColor: '#00fff2' }}></span>
                                            <span>Attended</span>
                                        </div>
                                        <div className="legend-item">
                                            <span className="legend-dot" style={{ backgroundColor: '#ff4757' }}></span>
                                            <span>Absent</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="chart-container bar-chart-container">
                                    <h3 className="chart-title">Subject-wise Attendance</h3>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={barData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                            <XAxis
                                                dataKey="subject"
                                                stroke="rgba(255,255,255,0.6)"
                                                fontSize={12}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                stroke="rgba(255,255,255,0.6)"
                                                fontSize={12}
                                                tickLine={false}
                                                domain={[0, 100]}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgba(10, 10, 18, 0.9)',
                                                    border: '1px solid rgba(0, 255, 242, 0.2)',
                                                    borderRadius: '8px',
                                                    color: '#fff',
                                                }}
                                                formatter={(value) => `${value.toFixed(1)}%`}
                                            />
                                            <Bar dataKey="percentage" fill="#00fff2" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <span className="dash-section" style={{ marginTop: '6vmin' }}>
                                ATTENDANCE HISTORY
                            </span>

                            <div className="attendance-history">
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
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default StudentDash;
