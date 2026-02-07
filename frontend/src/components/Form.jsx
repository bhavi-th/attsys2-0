import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Form.css";

const Form = ({ formType, type }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page reload

    // Determine the correct URL based on the formType
    const endpoint = formType === "Log In" ? "/login" : "/register";

    try {
      const response = await fetch(`http://localhost:5000/api${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: type }), // Sending role (student/teacher) too!
      });

      const data = await response.json();

      if (response.ok) {
        if (formType === "Log In") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userRole", data?.user?.role || "");
          console.log("Saved to storage : ", data.user.role);
          alert("Login Successful!");
        } else {
          alert("Registration Successful!");
        }

        navigate("/dash"); // Send user to dashboard on success
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Cannot connect to server. Is it running?");
    }
  };

  return (
    <div className="Form">
      <Link className="logo" to="/">
        ATTSYS2-0
      </Link>
      <form className="form" onSubmit={handleSubmit}>
        <h1>{formType}</h1>
        <div className="input-holder">
          <input
            placeholder="Mail ID"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="button-holder">
          <button
            type="reset"
            onClick={() => {
              setEmail("");
              setPassword("");
            }}
          >
            Clear
          </button>
          <button type="submit">{formType}</button>
        </div>
        {formType == "Log In" ? (
          <p>
            Don't have an account? Click{" "}
            <Link
              to={type == "teacher" ? "/signup/teacher" : "/signup/student"}
            >
              here
            </Link>{" "}
            to signup
          </p>
        ) : (
          <p>
            Already have an account? Click{" "}
            <Link to={type == "teacher" ? "/login/teacher" : "/login/student"}>
              here
            </Link>{" "}
            to login
          </p>
        )}
      </form>
    </div>
  );
};

export default Form;
