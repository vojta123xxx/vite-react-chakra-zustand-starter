import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import ContactForm from "./ContactForm";
import axiosInstance from "../../api/axiosInstance";

export default function ContactCreate({ onContactCreated, onClose }) {
  const toast = useToast();
  const savedCompanyId = localStorage.getItem("selectedCompanyId");

  const [formData, setFormData] = useState({
    company_name: "",
    contact_firstname: "",
    contact_lastname: "",
    contact_mobile: "",
    email: "",
    note: "",
    street: "",
    postal_code: "",
    city: "",
    ico: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!savedCompanyId) {
    toast({
      title: "Chyba",
      description: "Není vybrána žádná společnost.",
      status: "error",
    });
    return;
  }

  try {
    const response = await axiosInstance.post("/contacts", {
      ...formData,
      company_id: savedCompanyId,
    });

    const data = response.data;
    console.log("API response:", data);

    toast({
      title: "Úspěch",
      description: data.msg,
      status: "success",
    });

    const newContact = data.createdContact || { id: data.id, ...formData };
    if (onContactCreated) onContactCreated(newContact);
    if (onClose) onClose();
  } catch (error) {
    console.error("❌ Chyba při odesílání kontaktu:", error);
    toast({
      title: "Chyba",
      description: "Nepodařilo se odeslat kontakt.",
      status: "error",
    });
  }
};

  return (
    <ContactForm
      formData={formData}
      setFormData={setFormData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      isEditing={false}
    />
  );
}
