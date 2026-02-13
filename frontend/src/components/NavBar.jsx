import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import "../styles/NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogOut() {
    logout(); 
    
    alert("Logged Out successfully");
    
    navigate("/");
  }

  return (
    <div className="NavBar">
      <div className="nav-logo">
        AttSys2-0
      </div>
      <button
        id="logout"
        onClick={handleLogOut}
      >
        Logout
      </button>
    </div>
  );
};

export default NavBar;
