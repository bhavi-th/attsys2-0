import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/teacher/TeacherDash.css';

const TeacherDash = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();

    const [courses, setCourses] = useState([]);
    const [branch, setBranch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!id) return;

            try {
                const API_BASE_URL = import.meta.env.VITE_PORT
                    ? `${import.meta.env.VITE_URL}:${import.meta.env.VITE_PORT}`
                    : import.meta.env.VITE_URL;
                const response = await fetch(`${API_BASE_URL}/api/profile/${id}`);
                const data = await response.json();

                if (response.ok) {
                    setCourses(data.courses || []);
                    setBranch(data.branch);
                } else {
                    console.error('Profile fetch error:', data.error);
                }
            } catch (error) {
                console.error('Connection error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [id]);

    const totalSections = courses.reduce((acc, course) => acc + (course.sections?.length || 0), 0);

    if (loading) return <div className="TeacherDash loading">Loading Dashboard...</div>;

    return (
        <div className="TeacherDash">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div className="header-info">
                        <h1 className="welcome-title">Welcome back, {user?.name || 'Teacher'}</h1>
                        <p className="branch-info">{branch} Branch</p>
                    </div>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <span className="stat-number">{courses.length}</span>
                            <span className="stat-label">Subjects</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">{totalSections}</span>
                            <span className="stat-label">Sections</span>
                        </div>
                    </div>
                </div>

                <span className="dash-section">SUBJECTS</span>

                <div className="subjects">
                    {courses.length > 0 ? (
                        courses.map((course, courseIndex) => (
                            <div className="subject" key={courseIndex}>
                                <div className="subject-header">
                                    <h2 className="subject-title">{course.subject}</h2>
                                    <span className="semester-badge">Sem {course.semester}</span>
                                </div>
                                <span className="section-count">{course.sections?.length || 0} sections</span>

                                <div className="section-grid">
                                    {course.sections && course.sections.length > 0 ? (
                                        course.sections.map((sec, secIndex) => (
                                            <div key={secIndex} className="section-box">
                                                <div className="section-header">
                                                    <span className="section-label">Section {sec}</span>
                                                </div>
                                                <div className="section-actions">
                                                    <button
                                                        className="attendance-btn"
                                                        onClick={() =>
                                                            navigate(
                                                                `/attendance/${branch}/${course.subject}/${sec}/${course.semester}`,
                                                            )
                                                        }
                                                    >
                                                        <span className="btn-icon">📊</span>
                                                        Mark Attendance
                                                    </button>
                                                    <button
                                                        className="history-btn"
                                                        onClick={() =>
                                                            navigate(
                                                                `/history/${id}/${branch}/${course.subject}/${sec}/${course.semester}`,
                                                            )
                                                        }
                                                    >
                                                        <span className="btn-icon">📋</span>
                                                        View History
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-sections">No sections assigned</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-data">
                            <div className="no-data-icon">📚</div>
                            <p>No subjects found. Please complete your onboarding.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherDash;
