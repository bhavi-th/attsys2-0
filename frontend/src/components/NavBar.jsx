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
      <Link to="/" className="nav-logo">
        AttSys2-0
      </Link>
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
