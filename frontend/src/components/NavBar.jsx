import { Link } from "react-router-dom";
import "../styles/NavBar.css";

const NavBar = () => {
  return (
    <div className="NavBar">
      <Link to="/" className="nav-logo">AttSys2-0</Link>
    </div>
  );
};

export default NavBar;
