import "./App.css";
import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import QRScanner from "./pages/QRScanner";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (token) {
      // If they are logged in and trying to go to landing/login, send to dash
      const publicPaths = ["/", "/login/student", "/login/teacher"];
      if (publicPaths.includes(location.pathname)) {
        navigate("/dash");
      }
    }


    // If they have a token and are trying to access the login/landing page...
    const publicPaths = [
      "/",
      "/login/student",
      "/login/teacher",
      "/signup/student",
      "/signup/teacher",
    ];

    if (token && role && publicPaths.includes(location.pathname)) {
      // ...automatically send them to their dashboard
      navigate("/dash");
    }
  }, [navigate, location]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login/student" element={<LoginPage type="student" />} />
      <Route path="/login/teacher" element={<LoginPage type="teacher" />} />
      <Route path="/signup/student" element={<SignUp type="student" />} />
      <Route path="/signup/teacher" element={<SignUp type="teacher" />} />
      <Route
        path="/dash"
        element={
          <ProtectedRoute>
            <NavBar />
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/qrscanner"
        element={
          <ProtectedRoute>
            <QRScanner />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
