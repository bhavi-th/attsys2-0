import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import ProfilePic from "../assets/profile.svg";
import "../styles/NavBar.css";

const NavBar = ({ userName }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [showLogout, setShowLogout] = useState(false);

  function handleLogOut() {
    logout();
    alert("Logged Out successfully");
    navigate("/");
  }

  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  return (
    <div className="NavBar">
      <div className="nav-logo">AttSys2-0</div>

      <img
        src={ProfilePic}
        onClick={toggleLogout}
        style={{ cursor: "pointer" }}
        alt="Profile"
      />

      {showLogout && (
        <div id="nav-menu">
          <p>Hi, {userName}</p>
          <button id="logout" onClick={handleLogOut}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
