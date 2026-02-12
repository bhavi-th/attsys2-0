import "../styles/LandingPage.css";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <>
      <div className="background"></div>
      <div className="LandingPage blue-background">
        <h1>ATTSYS2-0</h1>
        <div className="button-holder">
          <Link className="btn" to="/login/teacher">
            Teacher
          </Link>
          <Link className="btn" to="/login/student">
            Student
          </Link>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
