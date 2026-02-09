import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js"; // Import the hook
import "../styles/NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Destructure the logout function

  function handleLogOut() {
    // 1. Call the global logout function (this clears storage AND resets state)
    logout(); 
    
    // 2. Feedback to user
    alert("Logged Out successfully");
    
    // 3. Redirect to landing page
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
