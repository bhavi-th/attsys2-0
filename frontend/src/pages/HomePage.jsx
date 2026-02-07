import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import "../styles/HomePage.css";

const sampleData = [
  { Sno: "01", Name: "ZZZ", USN: "1TD24CS025", Status: "Present" },
  { Sno: "02", Name: "WWW", USN: "1TD24CS030", Status: "Absent" },
  { Sno: "03", Name: "YYY", USN: "1TD24CS028", Status: "Present" },
  { Sno: "01", Name: "ZZZ", USN: "1TD24CS025", Status: "Present" },
  { Sno: "02", Name: "WWW", USN: "1TD24CS030", Status: "Absent" },
  { Sno: "03", Name: "YYY", USN: "1TD24CS028", Status: "Present" },
  { Sno: "01", Name: "ZZZ", USN: "1TD24CS025", Status: "Present" },
  { Sno: "02", Name: "WWW", USN: "1TD24CS030", Status: "Absent" },
  { Sno: "03", Name: "YYY", USN: "1TD24CS028", Status: "Present" },
  { Sno: "01", Name: "ZZZ", USN: "1TD24CS025", Status: "Present" },
  { Sno: "02", Name: "WWW", USN: "1TD24CS030", Status: "Absent" },
  { Sno: "03", Name: "YYY", USN: "1TD24CS028", Status: "Present" },
  { Sno: "01", Name: "ZZZ", USN: "1TD24CS025", Status: "Present" },
  { Sno: "02", Name: "WWW", USN: "1TD24CS030", Status: "Absent" },
  { Sno: "03", Name: "YYY", USN: "1TD24CS028", Status: "Present" },
];

const HomePage = () => {
  const [isValidating, setIsValidating] = useState(true);
  const [qr, setQr] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initPage = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login/student");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/verify", {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          localStorage.clear();
          navigate("/login/student");
        } else {
          // 1. Verification passed
          setIsValidating(false);
          // 2. ONLY NOW generate the QR code
          setQr(`http://localhost:5000/qr?${Date.now()}`);
        }
      } catch (error) {
        console.error("Verification failed:", error);
        navigate("/login/student");
      }
    };

    initPage();
  }, [navigate]);

  const generateQR = () => {
    setQr(`http://localhost:5000/qr?${Date.now()}`);
  };

  // If we are still checking the token, show a clean loading screen
  // This prevents the "break dance"
  if (isValidating) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h2>Verifying Session...</h2>
      </div>
    );
  }

  return (
    <div className="HomePage">
      <div className="scanner-holder">
        {qr && <img src={qr} alt="QR Code" className="qr-generator" />}
        <div className="button-holder">
          <button onClick={generateQR}>Generate</button>
          <button>Stop</button>
        </div>
      </div>
      <div className="student-timer">
        <div className="timer">Time left 10s</div>
        <Table data={sampleData} />
        <button className="pdf-btn">PDF</button>
      </div>
    </div>
  );
};
export default HomePage;
