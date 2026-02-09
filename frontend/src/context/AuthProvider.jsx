import { useState } from "react";
import { AuthContext } from "./AuthContext.js";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    return {
      token,
      role: localStorage.getItem("userRole"),
      isOnboarded: localStorage.getItem("isOnboarded") === "true",
      userId: localStorage.getItem("userId"),
    };
  });

  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("userRole", userData.role);
    localStorage.setItem("isOnboarded", userData.isOnboarded);
    localStorage.setItem("userId", userData.id);
    
    setUser({ 
      token: userData.token, 
      role: userData.role, 
      isOnboarded: userData.isOnboarded,
      userId: userData.id 
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
