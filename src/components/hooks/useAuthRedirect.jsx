import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
const checkUser = async () => {
  try {
    await axiosInstance.get("/auth/profile");
  } catch (error) {
    if (error.response && error.response.data.msg === "No token provided") {
      navigate("/login");
    }
  }
};


    checkUser();
  }, [navigate]);

  return null;
};

export default useAuthRedirect;
