import "../styles/LandingPage.css";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <>
      <div class="background"></div>
      <div className="LandingPage">
        <h1>ATTSYS2-0</h1>
        <div className="button-holder">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
