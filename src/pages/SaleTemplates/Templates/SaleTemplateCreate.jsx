import React, { useState, useCallback } from "react";
import {
  Heading,
  Box,
  Divider,
  useColorModeValue,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useToastNotification from "../../../components/hooks/useToastNotification";
import { useNotification } from "../../../components/hooks/ToastContext";
import SaleTemplateForm from "./SaleTemplateForm";
import TemplateItems from "./TemplateItems";
import axiosInstance from "../../../api/axiosInstance";

export default function SaleTemplateCreate() {
  const navigate = useNavigate();
  const showToast = useToastNotification();
  const { setPendingToast } = useNotification();
  const savedCompanyId = localStorage.getItem("selectedCompanyId");

  // Stav formuláře, do kterého se budou předávat i data z AdresarSelect (včetně contact_id)
  const [formData, setFormData] = useState({});
  const [templateItemsData, setTemplateItemsData] = useState({
    items: [],
    discountPercentage: 0,
  });

  // Callback, který obdržíme z SaleTemplateForm a v něm i z AdresarSelect
  const handleFormChange = useCallback((data) => {
    setFormData(data);
  }, []);

  const handleTemplateItemsChange = useCallback((data) => {
    setTemplateItemsData(data);
  }, []);

  const handleCreate = async () => {
    const dataToSend = {
      ...formData,
      company_id: parseInt(savedCompanyId, 10),
      order_number: parseInt(formData.order_number, 10) || 0,
      contact_id: parseInt(formData.contact_id, 10), // zde musí být platné ID
      maturity_days: parseInt(formData.maturity_days, 10) || 0,
      payment_option: formData.payment_option,
      discount: parseFloat(templateItemsData.discountPercentage) || 0,
      items: templateItemsData.items || [],
      description: formData.description,
      name: formData.name,
      invoice_type: formData.invoice_type,
      text_before_items: formData.text_before_items,
      text_after_items: formData.text_after_items,
      print_language: formData.print_language,
      currency: formData.currency,
      constant_symbol: formData.constant_symbol,
      variable_symbol: formData.variable_symbol,
      isDifferentAddress: formData.useDifferentDeliveryAddress ? 1 : 0,
      differentDeliveryaddress:
        formData.useDifferentDeliveryAddress && formData.selectedDeliveryAddress
          ? formData.selectedDeliveryAddress.value
          : null,
    };

    try {
      await axiosInstance.post("/sale-templates", dataToSend);

      showToast({
        title: "Úspěch",
        description: "Šablona byla úspěšně vytvořena.",
        status: "success",
      });

      navigate("/my/sales/templates/");
    } catch (error) {
      showToast({
        title: "Chyba",
        description: error.message,
        status: "error",
      });
    }
  };

  const bg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("black", "white");

  return (
    <Box p={4} bg={bg} color={textColor}>
      <Heading size="lg" mb={4}>
        Vytvořit novou šablonu prodeje
      </Heading>

      {/* Zobrazení contact_id vybraného v AdresarSelect */}
      <h1>
        {formData.contact_id
          ? `Selected Contact ID: ${formData.contact_id}`
          : "No contact selected"}
      </h1>

      <SaleTemplateForm companyId={savedCompanyId} onFormChange={handleFormChange} />

      <Divider my={6} borderColor="gray.300" />

      <TemplateItems onChange={handleTemplateItemsChange} />

      <Flex justify="flex-end" mt={6}>
        <Button colorScheme="purple" onClick={handleCreate}>
          Uložit šablonu
        </Button>
      </Flex>
    </Box>
  );
}
