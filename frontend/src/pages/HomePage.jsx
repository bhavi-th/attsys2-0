import { useEffect, useState } from "react";
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
  // const [qr, setQr] = useState(`http://localhost:5000/qr?${Date.now()}`);
  const [qr, setQr] = useState(null);

  const generateQR = () => {
    setQr(`http://localhost:5000/qr?${Date.now()}`);
  };

  useEffect(() => {
    generateQR();
  }, []);

  return (
    <div className="HomePage">
      <div className="scanner-holder">
        <img src={qr} alt="QR Code" className="qr-generator" />
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
