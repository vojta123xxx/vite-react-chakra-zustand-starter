import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Heading, Button, Flex, Divider, useColorMode } from "@chakra-ui/react";
import SaleTemplateForm from "./SaleTemplateForm";
import TemplateItems from "./TemplateItems";
import useToastNotification from "../../../components/hooks/useToastNotification";
import { useNotification } from "../../../components/hooks/ToastContext";
import axiosInstance from "../../../api/axiosInstance";

export default function SaleTemplateEdit() {
  const { id } = useParams();
  const showToast = useToastNotification();
  const navigate = useNavigate();
  const { setPendingToast } = useNotification();
  const { colorMode } = useColorMode();

  const [initialData, setInitialData] = useState(null);
  const savedCompanyId = localStorage.getItem("selectedCompanyId");

  const [formData, setFormData] = useState({});
  const [templateItemsData, setTemplateItemsData] = useState({
    items: [],
    discountPercentage: 0,
    totalBeforeDiscount: 0,
    discountValue: 0,
    finalTotal: 0,
  });

  // Uloží data z formuláře
  const handleFormChange = useCallback((data) => {
    setFormData(data);
  }, []);

  // Načtení dat z API
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axiosInstance.get(`/sale-templates/edit/${id}`);
        const data = response.data;

        setInitialData(data);
        setTemplateItemsData({
          items: data.items || [],
          discountPercentage: parseFloat(data.discount) || 0,
          totalBeforeDiscount: parseFloat(data.total_before_discount) || 0,
          discountValue: parseFloat(data.discount_value) || 0,
          finalTotal: parseFloat(data.total_after_discount) || 0,
        });
      } catch (error) {
        showToast({
          title: "Chyba",
          description: error.message,
          status: "error",
        });
      }
    };

    fetchTemplate();
  }, [id, showToast]);

  // Uložení na server
  const handleEdit = async () => {
    const updatedData = {
      ...formData,
      company_id: parseInt(savedCompanyId, 10),
      order_number: parseInt(formData.order_number, 10) || 0,
      contact_id: parseInt(formData.contact_id, 10),
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

      // Dodací adresa
      isDifferentAddress: formData.useDifferentDeliveryAddress ? 1 : 0,
      differentDeliveryaddress: formData.selectedDeliveryAddress
        ? formData.selectedDeliveryAddress.value
        : null,
    };

    try {
      await axiosInstance.put(`/sale-templates/edit/${id}`, updatedData);

      showToast({
        title: "Úspěch",
        description: "Šablona byla úspěšně aktualizována.",
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

  return (
    <Box p={4} bg={colorMode === "dark" ? "gray.800" : "white"}>
      <Heading size="lg" mb={4} color={colorMode === "dark" ? "white" : "gray.800"}>
        Upravit šablonu prodeje
      </Heading>
      {initialData && (
        <>
          <SaleTemplateForm
            initialData={initialData}
            onFormChange={handleFormChange}
            companyId={savedCompanyId}
          />
          <Divider my={6} borderColor={colorMode === "dark" ? "gray.600" : "gray.200"} />
          <TemplateItems
            initialData={{
              items: templateItemsData.items,
              discountPercentage: templateItemsData.discountPercentage,
              totalBeforeDiscount: templateItemsData.totalBeforeDiscount,
              discountValue: templateItemsData.discountValue,
              finalTotal: templateItemsData.finalTotal,
            }}
            onChange={(data) => setTemplateItemsData(data)}
          />
          <Flex justify="flex-end" mt={6}>
            <Button variant="solid" colorScheme="teal" onClick={handleEdit}>
              Uložit změny
            </Button>
          </Flex>
        </>
      )}
    </Box>
  );
}
