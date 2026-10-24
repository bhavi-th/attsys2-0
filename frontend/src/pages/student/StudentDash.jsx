import { useNavigate } from 'react-router-dom';
import '../../styles/student/StudentDash.css';

const StudentDash = () => {
    const navigate = useNavigate();

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
                </div>
            </div>
        </>
    );
};

export default StudentDash;
