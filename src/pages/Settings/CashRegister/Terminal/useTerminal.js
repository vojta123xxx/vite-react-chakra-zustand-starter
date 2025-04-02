import { useState, useEffect } from "react";
import axiosInstance from "../../../../api/axiosInstance";
import useToastNotification from "../../../../components/hooks/useToastNotification";

const useTerminal = (selectedCompanyId) => {
  const [terminals, setTerminals] = useState([]);
  const [cashRegisters, setCashRegisters] = useState([]);
  const [loading, setLoading] = useState(true);
  const showToast = useToastNotification();

  useEffect(() => {
    if (selectedCompanyId) {
      fetchTerminals();
      fetchCashRegisters();
    }
  }, [selectedCompanyId]);

  const fetchTerminals = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/terminal/company/${selectedCompanyId}`);
      setTerminals(response.data);
    } catch (error) {
      showToast({
        title: "Chyba při načítání terminálů",
        description: error.message || "Nepodařilo se načíst terminály.",
        status: "error",
      });
    }
    setLoading(false);
  };

  const fetchCashRegisters = async () => {
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
  };

  const handleAddTerminal = () => {
    const newTerminal = {
      id: Date.now(),
      terminal_name: "",
      sales_type: "xfact",
      cash_register_id: null,
      company_id: selectedCompanyId,
      isNew: true,
      selected: false,
    };
    setTerminals((prev) => [...prev, newTerminal]);
  };

  const handleSelectTerminal = (selectedId) => {
    setTerminals((prev) =>
      prev.map((terminal) => ({
        ...terminal,
        selected: terminal.id === selectedId,
        isDirty:
          terminal.isNew ? terminal.isDirty : terminal.id === selectedId || terminal.selected,
      }))
    );
  };

  const handleSaveAll = async () => {
    let allSuccess = true;
    const updatedTerminals = [...terminals];

    for (let i = 0; i < updatedTerminals.length; i++) {
      const terminal = updatedTerminals[i];
      try {
        if (terminal.isNew) {
          const response = await axiosInstance.post("/api/terminal", {
            terminal_name: terminal.terminal_name,
            sales_type: terminal.sales_type,
            cash_register_id: terminal.cash_register_id,
            company_id: selectedCompanyId,
            selected: terminal.selected ? 1 : 0,
          });
          updatedTerminals[i] = { ...terminal, id: response.data.id, isNew: false };
        } else if (terminal.isDirty) {
          await axiosInstance.put(`/api/terminal/${terminal.id}`, {
            terminal_name: terminal.terminal_name,
            sales_type: terminal.sales_type,
            cash_register_id: terminal.cash_register_id,
            selected: terminal.selected ? 1 : 0,
            company_id: selectedCompanyId,
          });
          updatedTerminals[i] = { ...terminal, isDirty: false };
        }
      } catch (error) {
        allSuccess = false;
        showToast({
          title: "Chyba při ukládání",
          description: error.response?.data?.msg || "Nepodařilo se uložit terminál.",
          status: "error",
        });
      }
    }

    setTerminals(updatedTerminals);
    showToast({
      title: allSuccess ? "Úspěch" : "Částečný úspěch",
      description: allSuccess
        ? "Všechny terminály byly úspěšně uloženy."
        : "Některé terminály se nepodařilo uložit.",
      status: allSuccess ? "success" : "warning",
    });
  };

  const handleRemoveTerminal = async (id, isNew = false) => {
    if (isNew) {
      setTerminals((prev) => prev.filter((terminal) => terminal.id !== id));
      showToast({
        title: "Úspěch",
        description: "Lokální položka byla odstraněna.",
        status: "success",
      });
      return;
    }
    try {
      await axiosInstance.delete(`/api/terminal/${id}?company_id=${selectedCompanyId}`);
      setTerminals((prev) => prev.filter((terminal) => terminal.id !== id));
      showToast({
        title: "Úspěch",
        description: "Terminál byl úspěšně smazán.",
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
    setTerminals((prev) =>
      prev.map((terminal) =>
        terminal.id === id
          ? { ...terminal, [field]: value, isDirty: !terminal.isNew || terminal.isDirty }
          : terminal
      )
    );
  };

  return {
    terminals,
    cashRegisters,
    loading,
    handleAddTerminal,
    handleSelectTerminal,
    handleSaveAll,
    handleRemoveTerminal,
    handleChange,
  };
};

export default useTerminal;
