import "./App.css";
import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth"; // Import our custom hook
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import QRScanner from "./pages/QRScanner";
import ProtectedRoute from "./components/ProtectedRoute";
import OnBoarding from "./pages/OnBoarding";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // Get user state from context

  useEffect(() => {
    // Define public routes
    const publicPaths = [
      "/",
      "/login/student",
      "/login/teacher",
      "/signup/student",
      "/signup/teacher",
    ];

    // If user is fully authenticated and onboarded, keep them away from public pages
    if (
      user?.token &&
      user?.isOnboarded &&
      publicPaths.includes(location.pathname)
    ) {
      navigate("/dash");
    }
  }, [user, navigate, location.pathname]);

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
      <Route path="/qrscanner" element={<QRScanner />} />
      <Route
        path="/onboard/teacher"
        element={<OnBoarding formType="login" type="teacher" />}
      />
      <Route
        path="/onboard/student"
        element={<OnBoarding formType="login" type="student" />}
      />
    </Routes>
  );
};

export default App;
