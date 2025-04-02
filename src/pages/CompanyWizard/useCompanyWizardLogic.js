import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import axiosInstance from "../../api/axiosInstance";

const useCompanyWizardLogic = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const firstName = searchParams.get("firstName") || "";
  const lastName = searchParams.get("lastName") || "";

  const [ico, setIco] = useState("");
  const [companyData, setCompanyData] = useState({
    name: `${firstName} ${lastName}`,
    street: "",
    city: "",
    zip: "",
    taxType: "Neplátce DPH",
    subjectType: "Fyzická osoba",
    registryNumber: "",
  });

  const fetchCompanyData = async () => {
  if (!ico) return;

  try {
    const response = await axiosInstance.get(`/company/fetch/${ico}`);
    setCompanyData(response.data);
  } catch (error) {
    console.error("❌ Chyba při načítání dat společnosti:", error);
    toast({
      title: "Chyba při načítání dat.",
      description: "Nepodařilo se načíst data společnosti.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }
};


const saveCompanyData = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Nejste přihlášený!",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    await axiosInstance.post(
      "/company/save",
      { ...companyData, ico },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast({
      title: "Firma úspěšně vytvořena.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    navigate('/dashboard');
  } catch (error) {
    console.error("Chyba při ukládání dat:", error);
    toast({
      title: "Chyba při ukládání dat.",
      description: "Nepodařilo se uložit data.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
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

export default useCompanyWizardLogic;
