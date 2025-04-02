import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import ContactForm from "./ContactForm";
import CustomTabs from "./Tabs";
import axiosInstance from "../../api/axiosInstance";

export default function ContactEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);

  // Stav pro formulář
  const [formData, setFormData] = useState({
    company_name: "",
    contact_firstname: "",
    contact_lastname: "",
    email: "",
    contact_mobile: "",
    note: "",
    street: "",
    city: "",
    postal_code: "",
    country: "",
    ico: "",
    dic: "",
  });

  // Stav pro dodací adresy
  const [deliveryAddresses, setDeliveryAddresses] = useState([]);
  // Stav pro vybranou adresu
  const [selectedDeliveryAddressId, setSelectedDeliveryAddressId] = useState(null);

  useEffect(() => {
    const savedCompanyId = localStorage.getItem("selectedCompanyId");
    if (!savedCompanyId) {
      toast({
        title: "Chyba",
        description: "Není vybrána žádná společnost.",
        status: "error",
      });
      navigate("/my/contacts");
      return;
    }

 const fetchContact = async () => {
  try {
    const response = await axiosInstance.get(`/contacts/edit/${id}`);
    const data = response.data;

    if (Number(savedCompanyId) !== data.company_id) {
      toast({
        title: "Chyba",
        description: "Kontakt nepatří vybrané společnosti.",
        status: "error",
      });
      navigate("/my/contacts");
      return;
    }

    if (data && data.id) {
      setFormData({
        ...data,
        company_name: data.company_name || "",
      });

      if (data.delivery_addresses) {
        setDeliveryAddresses(data.delivery_addresses);
        const selected = data.delivery_addresses.find(addr => addr.isselected === 1);
        if (selected) {
          setSelectedDeliveryAddressId(selected.id);
        }
      }
    } else {
      toast({
        title: "Chyba",
        description: "Kontakt nenalezen",
        status: "error",
      });
      navigate("/my/contacts");
    }
  } catch (error) {
    console.error("❌ Chyba při načítání kontaktu:", error);
    toast({
      title: "Chyba",
      description: error.message,
      status: "error",
    });
    navigate("/my/contacts");
  } finally {
    setLoading(false);
  }
};


    fetchContact();
  }, [id, navigate, toast]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, newSelectedAddressId) => {
  if (e) e.preventDefault();
  const selectedId = newSelectedAddressId !== undefined ? newSelectedAddressId : selectedDeliveryAddressId;
  try {
    const payload = {
      ...formData,
      selected_delivery_address_id: selectedId,
    };
    const response = await axiosInstance.put(`/contacts/${id}`, payload);
    const data = response.data;

    toast({
      title: "Úspěch",
      description: data.msg,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  } catch (error) {
    console.error("❌ Chyba při aktualizaci kontaktu:", error);
    toast({
      title: "Chyba",
      description: "Chyba při aktualizaci",
      status: "error",
    });
  }
};


 const saveAddressToServer = async (address) => {
  try {
    if (address.id) {
      const response = await axiosInstance.put(
        `/contacts/${id}/delivery-address/${address.id}`,
        address
      );
      const data = response.data;

      setDeliveryAddresses(prev =>
        prev.map(addr => (addr.id === address.id ? { ...addr, ...address } : addr))
      );
      toast({
        title: "Úspěch",
        description: data.msg,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      const response = await axiosInstance.post(
        `/contacts/${id}/delivery-address`,
        address
      );
      const data = response.data;

      setDeliveryAddresses(prev => [...prev, { ...address, id: data.id }]);
      toast({
        title: "Úspěch",
        description: data.msg,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  } catch (error) {
    console.error("❌ Chyba při ukládání adresy:", error);
    toast({
      title: "Chyba",
      description: "Chyba při ukládání adresy",
      status: "error",
    });
  }
};


  if (loading) return <h1>Načítání...</h1>;

  const contactFormComponent = (
    <ContactForm
      formData={formData}
      setFormData={setFormData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      deliveryAddresses={deliveryAddresses}
      setDeliveryAddresses={setDeliveryAddresses}
      isEditing={true}
    />
  );

  return (
    <CustomTabs
      contactFormComponent={contactFormComponent}
      deliveryAddresses={deliveryAddresses}
      onAddAddress={saveAddressToServer}  // předáváme funkci pro přidání i editaci
      // Po změně vybrané adresy zavoláme handleSubmit s novým id
      onSelectAddress={(id) => {
        setSelectedDeliveryAddressId(id);
        handleSubmit(null, id);
      }}
      selectedAddressId={selectedDeliveryAddressId}
      onDeleteAddress={(addressId) => {
        // Původní funkce mazání zůstává stejná
     (async () => {
  try {
    const response = await axiosInstance.delete(
      `/contacts/${id}/delivery-address/${addressId}`
    );
    const data = response.data;
    setDeliveryAddresses(prev => prev.filter(addr => addr.id !== addressId));
    toast({
      title: "Úspěch",
      description: data.msg,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  } catch (error) {
    console.error("❌ Chyba při mazání dodací adresy:", error);
    toast({
      title: "Chyba",
      description: "Chyba při mazání dodací adresy",
      status: "error",
    });
  }
})();

      }}
    />
  );
}
