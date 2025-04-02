// NewCompanyLogic.js
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/../../../../api/axiosInstance";
import { useNotification } from "../../../../components/hooks/ToastContext"; // Updated import path

const NewCompanyLogic = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setPendingToast } = useNotification();

  const firstName = searchParams.get("firstName") || "";
  const lastName = searchParams.get("lastName") || "";

  const [ico, setIco] = useState("");
const [companyData, setCompanyData] = useState({
  name: `${firstName} ${lastName}`,
  street: "",
  city: "",
  zip: "",
  taxType: "neplatce_dph",
  subjectType: "fyz_osoba",
  registryNumber: "",
  phone: "",
  mobile: "",
  website: "",
});


  const fetchCompanyData = async () => {
    if (!ico) return;
    try {
      const response = await axiosInstance.get(`/company/fetch/ares/${ico}`);
      if (!response.data || Object.keys(response.data).length === 0) {
        throw new Error("Firma nebyla nalezena v ARES.");
      }
      setCompanyData(response.data);
    } catch (error) {
      console.error("❌ Chyba při načítání dat společnosti:", error);
      setPendingToast({
        title: "Chyba při načítání dat.",
        description: "Nepodařilo se načíst data z ARES, prosím zkontrolujte si IČO.",
        status: "error",
      });
    }
  };

  const saveCompanyData = async () => {
    try {
      const response = await axiosInstance.post("/company/save", { ...companyData, ico });
      
      // Set toast in localStorage before navigation
      localStorage.setItem('pendingToast', JSON.stringify({
        title: "Firma úspěšně vytvořena.",
        status: "success",
      }));
      
      // Navigate to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("❌ Chyba při ukládání dat:", error);
      const errorMsg = error.response?.data?.msg || "Nepodařilo se uložit data.";
      
      // Set error toast in localStorage before navigation
      localStorage.setItem('pendingToast', JSON.stringify({
        title: "Chyba při ukládání dat.",
        description: errorMsg,
        status: "error",
      }));
      
      // Navigate to dashboard
      navigate("/dashboard");
    }
  };

  return {
    ico,
    setIco,
    companyData,
    setCompanyData,
    fetchCompanyData,
    saveCompanyData,
  };
};

export default NewCompanyLogic;