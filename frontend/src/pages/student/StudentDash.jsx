import { useParams } from "react-router-dom";
import NavBar from "../../components/NavBar";
import QRScanner from "./QRScanner";

const StudentDash = () => {
  const { id } = useParams();

  return (
    <>
      <NavBar id={id} />
      <div className="StudentDash">
        <QRScanner />
      </div>
    </>
  );
};

export default StudentDash;
