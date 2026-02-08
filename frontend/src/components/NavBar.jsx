import { Link, useNavigate } from "react-router-dom";
import "../styles/NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();

  function handleLogOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    alert("Logged Out successful");
    navigate("/");
  }

  return (
    <div className="NavBar">
      <div className="nav-logo">
        AttSys2-0
      </div>
      <button
        id="logout"
        onClick={() => {
          handleLogOut();
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default NavBar;
