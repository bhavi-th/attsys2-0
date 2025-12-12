import { Link } from "react-router-dom";
import "../styles/Form.css";

const Form = ({ formType, type }) => {
  return (
    <div className="Form">
      <Link className="logo" to="/">
        ATTSYS2-0
      </Link>
      <form className="form">
        <h1>{formType}</h1>
        <div className="input-holder">
          <input
            placeholder={type == "teacher" ? "Mail ID" : "USN"}
            type={type == "teacher" ? "email" : "text"}
            required
          />
          <input placeholder="Password" type="password" required />
        </div>
        <div className="button-holder">
          <button type="reset">Clear</button>
          <button type="submit">{formType}</button>
        </div>
        {(formType == "Log In") ? 
          <p>
            Don't have an account? Click <Link to={(type=="teacher") ? "/signup/teacher" : "/signup/student"}>here</Link> to signup
          </p>
        :
          <p>
            Already have an account? Click <Link to={(type=="teacher") ? "/login/teacher" : "/login/student"}>here</Link> to login
          </p>
        }
      </form>
    </div>
  );
};

export default Form;
