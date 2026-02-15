import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../styles/teacher/TeacherDash.css";

const TeacherDash = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [subject, setSubject] = useState("Loading...");
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!id) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_URL}:5000/api/profile/${id}`,
        );
        const data = await response.json();

        if (response.ok) {
          setSubject(data.USNSubject);
          setSections(data.sections);
        } else {
          console.error("Profile fetch error:", data.error);
        }
      } catch (error) {
        console.error("Connection error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, [id]);

  return (
    <>
      <div className="TeacherDash">
        <div className="dashboard-container">
          <div className="subject">
            <h2 className="subject-title">{subject}</h2>
            <div className="section-grid">
              {sections && sections.length > 0 ? (
                sections.map((sec, index) => (
                  <button
                    key={index}
                    className="attendance-btn"
                    onClick={() => navigate(`/attendance/${sec}`)}
                  >
                    Section {sec}
                  </button>
                ))
              ) : (
                <p>No sections found for this teacher.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherDash;
