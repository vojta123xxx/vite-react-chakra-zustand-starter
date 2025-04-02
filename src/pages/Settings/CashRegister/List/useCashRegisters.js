import { useState, useEffect } from "react";
import axiosInstance from "../../../../api/axiosInstance";
import useToastNotification from "../../../../components/hooks/useToastNotification";

const useCashRegisters = (selectedCompanyId) => {
  const [cashRegisters, setCashRegisters] = useState([]);
  const [loading, setLoading] = useState(true);
  const showToast = useToastNotification();

  useEffect(() => {
    if (selectedCompanyId) {
      fetchCashRegisters();
    }
  }, [selectedCompanyId]);

  const fetchCashRegisters = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/cashRegister/company/${selectedCompanyId}`);
      setCashRegisters(response.data);
    } catch (error) {
      showToast({
        title: "Chyba při načítání pokladen",
        description: error.message || "Nepodařilo se načíst pokladny.",
        status: "error",
      });
    }
    setLoading(false);
  };

  const handleAddRegister = () => {
    const newRegister = {
      id: Date.now(),
      cash_register_name: "",
      currency: "CZK",
      company_id: selectedCompanyId,
      isNew: true,
      selected: 0,
    };
    setCashRegisters((prev) => [...prev, newRegister]);
  };

  const handleSelectRegister = (selectedId) => {
    setCashRegisters((prev) =>
      prev.map((register) => ({
        ...register,
        selected: register.id === selectedId ? 1 : 0,
        isDirty: register.isNew ? register.isDirty : register.id === selectedId || register.selected === 1,
      }))
    );
  };

  const handleSaveAll = async () => {
    let allSuccess = true;
    const updatedRegisters = [...cashRegisters];

    for (let i = 0; i < updatedRegisters.length; i++) {
      const register = updatedRegisters[i];
      try {
        if (register.isNew) {
          const response = await axiosInstance.post("/api/cashRegister", {
            cash_register_name: register.cash_register_name,
            currency: register.currency,
            company_id: selectedCompanyId,
            selected: register.selected,
          });
          updatedRegisters[i] = { ...register, id: response.data.id, isNew: false };
        } else if (register.isDirty) {
          await axiosInstance.put(`/api/cashRegister/${register.id}`, {
            cash_register_name: register.cash_register_name,
            currency: register.currency,
            selected: register.selected,
            company_id: selectedCompanyId,
          });
          updatedRegisters[i] = { ...register, isDirty: false };
        }
      } catch (error) {
        allSuccess = false;
        showToast({
          title: "Chyba při ukládání",
          description: error.response?.data?.msg || "Nepodařilo se uložit změny.",
          status: "error",
        });
      }
    }

    setCashRegisters(updatedRegisters);
    showToast({
      title: allSuccess ? "Úspěch" : "Částečný úspěch",
      description: allSuccess
        ? "Všechny pokladny byly úspěšně uloženy."
        : "Některé pokladny se nepodařilo uložit.",
      status: allSuccess ? "success" : "warning",
    });
  };

  const handleRemoveRegister = async (id, isNew = false) => {
    if (isNew) {
      setCashRegisters((prev) => prev.filter((register) => register.id !== id));
      showToast({
        title: "Úspěch",
        description: "Lokální položka byla odstraněna.",
        status: "success",
      });
      return;
    }

    try {
      await axiosInstance.delete(`/api/cashRegister/${id}?company_id=${selectedCompanyId}`);
      setCashRegisters((prev) => prev.filter((register) => register.id !== id));
      showToast({
        title: "Úspěch",
        description: "Pokladna byla úspěšně smazána.",
        status: "success",
      });
    } catch (error) {
      showToast({
        title: "Chyba při mazání",
        description: error.response?.data?.msg || "Mazání se nezdařilo.",
        status: "error",
      });
    }
  };

  const handleChange = (id, field, value) => {
    setCashRegisters((prev) =>
      prev.map((register) =>
        register.id === id
          ? { ...register, [field]: value, isDirty: !register.isNew || register.isDirty }
          : register
      )
    );
  };

  return {
    cashRegisters,
    loading,
    handleAddRegister,
    handleSelectRegister,
    handleSaveAll,
    handleRemoveRegister,
    handleChange,
  };
};

export default useCashRegisters;
