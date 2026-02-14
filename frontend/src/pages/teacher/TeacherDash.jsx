import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "../../styles/teacher/TeacherDash.css";

const TeacherDash = () => {

  const navigate = useNavigate();

  const { id } = useParams();
  const [userName, setUserName] = useState("Loading...");
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
          setUserName(data.name);
          setSubject(data.USNSubject);
          setSections(data.sections);
        } else {
          setUserName("User");
          console.error("Profile fetch error:", data.error);
        }
      } catch (error) {
        setUserName("User");
        console.error("Connection error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, [id]);

  return (
    <>
      <NavBar userName={userName} />
      <div className="TeacherDash">
        <div className="dashboard-container">
          <h2 className="subject-title">{subject}</h2>

          <div className="section-grid">
            {sections && sections.length > 0 ? (
              sections.map((sec, index) => (
                <button
                  key={index}
                  className="attendance-btn"
                  onClick={() => navigate(`/attendance/${sec}`)}
                >
                  Take attendance of section {sec}
                </button>
              ))
            ) : (
              <p>No sections found for this teacher.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherDash;
