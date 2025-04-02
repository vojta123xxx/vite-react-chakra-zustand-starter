import { useState, useEffect } from "react";
import useToastNotification from "../../../../components/hooks/useToastNotification"; // Uprav cestu dle umístění souboru
import axiosInstance from "../../../../api/axiosInstance"; // přizpůsob cestu

const useCompanyDetailLogic = (companyData) => {
  const [editableData, setEditableData] = useState({});
  const showToast = useToastNotification();

  useEffect(() => {
    if (companyData) {
      setEditableData(companyData);
    }
  }, [companyData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setEditableData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleUpdate = async () => {
  if (!editableData.id) {
    showToast({
      title: "Chyba při aktualizaci.",
      description: "ID firmy chybí.",
      status: "error",
    });
    return;
  }

  try {
    await axiosInstance.put(`/company/update/${editableData.id}`, editableData);

    showToast({
      title: "Úspěch.",
      description: "Údaje firmy byly úspěšně aktualizovány!",
      status: "success",
    });
  } catch (error) {
    console.error("❌ Chyba při ukládání dat:", error);
    showToast({
      title: "Chyba při ukládání dat.",
      description: "Nepodařilo se uložit data.",
      status: "error",
    });
  }
};


  return { editableData, handleChange, handleUpdate };
};

export default useCompanyDetailLogic;
