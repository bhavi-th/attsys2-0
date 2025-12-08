import { Link } from "react-router-dom";
import "../styles/FormPage.css";

const FormPage = ({ formType }) => {
  return (
    <div className="FormPage">
      <Link className="logo" to="/">ATTSYS2-0</Link>
      <form className="login-form">
        <h1>{formType}</h1>
        <div className="input-holder">
          <input placeholder="Mail ID" type="email" required />
          <input placeholder="Password" type="password" required />
          {formType == "Sign Up" ?
            <input placeholder="Your UID" type="text" required />
            :
            <></>
          }
        </div>
        <div className="button-holder">
          <button type="reset">Clear</button>
          <button type="submit">{formType}</button>
        </div>
      </form>
    </div>
  );
};

export default FormPage;
