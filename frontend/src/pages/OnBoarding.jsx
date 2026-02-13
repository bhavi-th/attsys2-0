import "../styles/OnBoarding.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const OnBoarding = ({ type }) => {
  const [name, setName] = useState("");
  const [USNSubject, setUSNSubject] = useState("");
  const [section, setSection] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    const idToUpdate = user?.userId || localStorage.getItem("onboardingUserId");
    const token = user?.token;

    if (!idToUpdate) {
      alert("Session error. Please try signing up again.");
      return;
    }

    const sectionsArr =
      type === "teacher" ? section.trim().split(/\s+/) : [section];

    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}:5000/api/onboarding/${idToUpdate}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            name,
            USNSubject,
            sections: sectionsArr,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem("onboardingUserId");

        if (user) {
          localStorage.setItem("isOnboarded", "true");
          setUser({ ...user, isOnboarded: true });
          const target = user.role === "student" ? "/qrscanner" : "/dash";
          navigate(target);
        } else {
          alert("Profile Setup Complete! Please Login.");
          navigate(`/login/${type}`);
        }
      } else {
        alert(data.error || "Update failed");
      }
    } catch (err) {
      console.error("Connection error:", err);
    }
  }

  return (
    <>
      <div className="Form blue-background">
        <div className="greetings">
          <h1>Welcome on Board</h1>
          <p>To get started, Please fill in your personal information.</p>
        </div>
        <Link className="logo" to="/">
          ATTSYS2-0
        </Link>
        <form className="form personal-info" onSubmit={handleSubmit}>
          <h1>Personal Info</h1>
          <div className="input-holder input-holder-info">
            <input
              placeholder="Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder={type == "student" ? "USN" : "Subject"}
              type="text"
              required
              value={USNSubject}
              onChange={(e) => setUSNSubject(e.target.value)}
            />
            <input
              placeholder={type === "student" ? "Section" : "Sections"}
              type="text"
              required
              value={section}
              onChange={(e) => {
                let value = e.target.value;

                if (type === "student") {
                  value = value.replace(/\s+/g, "");
                }

                setSection(value);
              }}
            />
          </div>
          <div className="button-holder">
            <button
              type="reset"
              onClick={() => {
                setName("");
                setUSNSubject("");
                setSection("");
              }}
            >
              Clear
            </button>
            <button type="submit">Log In</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default OnBoarding;
