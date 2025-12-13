import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import QRScanner from "./pages/QRScanner";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/student" element={<LoginPage type="student" />} />
        <Route path="/login/teacher" element={<LoginPage type="teacher" />} />
        <Route path="/signup/student" element={<SignUp type="student" />} />
        <Route path="/signup/teacher" element={<SignUp type="teacher" />} />
        <Route
          path="/dash"
          element={
            <>
              <NavBar />
              <HomePage />
            </>
          }
        />
        <Route path="/qrscanner" element={<QRScanner />} />
      </Routes>
    </Router>
  );
};

export default App;
