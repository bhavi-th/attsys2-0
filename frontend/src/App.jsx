import "./App.css";
import { useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
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
  const { user } = useAuth();

  useEffect(() => {
    const publicPaths = [
      "/",
      "/login/student",
      "/login/teacher",
      "/signup/student",
      "/signup/teacher",
    ];

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
            {user?.role === "teacher" ? (
              <HomePage />
            ) : (
              <Navigate to="/qrscanner" />
            )}
          </ProtectedRoute>
        }
      />
      <Route
        path="/qrscanner"
        element={
          <ProtectedRoute>
            <NavBar />
            <QRScanner />
          </ProtectedRoute>
        }
      />
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
