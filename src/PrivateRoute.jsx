import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "./api/axiosInstance";

// Hook pro ověření přihlášení
const useAuthRedirect = () => {
  useEffect(() => {
    const checkUser = async () => {
      try {
        await axiosInstance.get("/auth/profile");
      } catch (error) {
        if (error.response && error.response.data.msg === "No token provided") {
          window.location.href = "/login";
        }
      }
    };
    checkUser();
  }, []);
};

// Komponenta PrivateRoute, která obaluje chráněné komponenty
const PrivateRoute = ({ children }) => {
  useAuthRedirect(); // Zavolání hooku pro ověření přihlášení
  return children ? children : <Navigate to="/login" />; // Pokud je přihlášený, vykreslí obsah
};

export default PrivateRoute;
