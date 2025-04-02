import React, { useState, useEffect } from "react";
import {
  Heading,
  Box,
  Divider,
  useColorModeValue,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import useToastNotification from "../../../components/hooks/useToastNotification";
import { useNotification } from "../../../components/hooks/ToastContext";
import axiosInstance from "../../../api/axiosInstance";

// Importy komponent
import SaleTemplateForm from "../InvoiceIssuedForm";
import TemplateItems from "../InvoicesIssuedItems";

export default function InvoicesIssuedEdit() {
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const showToast = useToastNotification();
  const { setPendingToast } = useNotification();
  const savedCompanyId = localStorage.getItem("selectedCompanyId");

  // Stav pro formulář (hlavičku, data faktury)
  const [formData, setFormData] = useState({
    order_number: "",
    contact_id: "",
    description: "",
    text_before_items: "",
    text_after_items: "",
    payment_method: "",
    print_language: "",
    issue_date: "",
    due_date: "",
    variable_symbol: "",
    constant_symbol: "",
    currency: "",
    private_note: "",
    is_paid: false,
    payment_date: "",
  });

  // Stav pro položky (items, sleva, součty…)
  const [itemsData, setItemsData] = useState({
    items: [],
    discountPercentage: 0,
    totalBeforeDiscount: 0,
    discountValue: 0,
    finalTotal: 0,
  });

  // Přidáme nový stav pro uložení contact dat z odpovědi API
  const [contactData, setContactData] = useState(null);

  // Stav původního uhrazení, který určí, zda byla faktura při načtení uhrazena
  const [originallyPaid, setOriginallyPaid] = useState(false);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const url = `/invoices-issued/${savedCompanyId}/${invoiceId}`;
        const res = await axiosInstance.get(url);
        const data = res.data;

        // Uložíme data kontaktu z odpovědi
        setContactData(data.contact || null);

        // Nastavení dat z faktury – použití invoice_contact_id
        setFormData({
          order_number: data.invoice.order_number || "",
          contact_id: data.invoice.invoice_contact_id ? Number(data.invoice.invoice_contact_id) : "",
          description: data.invoice.description || "",
          text_before_items: data.invoice.text_before_items || "",
          text_after_items: data.invoice.text_after_items || "",
          payment_method: data.invoice.payment_option || "",
          print_language: data.invoice.print_language || "",
          variable_symbol: data.invoice.variable_symbol || "",
          constant_symbol: data.invoice.constant_symbol || "",
          currency: data.invoice.currency || "",
          issue_date: data.invoice.issue_date || "",
          due_date: data.invoice.due_date || "",
          private_note: data.invoice.note || "",
          is_paid: !!data.invoice.is_paid,
          payment_date: data.invoice.payment_date || "",
        });

        setOriginallyPaid(!!data.invoice.is_paid);

        let totalBeforeDiscount = 0;
        (data.items || []).forEach((item) => {
          totalBeforeDiscount += Number(item.total) || 0;
        });
        const discountValue =
          (Number(data.invoice.discount || 0) / 100) * totalBeforeDiscount;
        const finalTotal = totalBeforeDiscount - discountValue;

        setItemsData({
          items: data.items || [],
          discountPercentage: Number(data.invoice.discount || 0),
          totalBeforeDiscount,
          discountValue,
          finalTotal,
        });
      } catch (error) {
        showToast({
          title: "Chyba",
          description: error.message,
          status: "error",
        });
      }
    };

    fetchInvoiceData();
  }, [invoiceId, savedCompanyId, showToast]);

  const handleFormChange = (changes) => {
    setFormData((prev) => ({ ...prev, ...changes }));
  };

  const handleItemsChange = (updatedItemsData) => {
    setItemsData(updatedItemsData);
  };

  const handleSave = async () => {
    const dataToSend = {
      ...formData,
      company_id: parseInt(savedCompanyId, 10),
      order_number: parseInt(formData.order_number, 10) || 0,
      contact_id: parseInt(formData.contact_id, 10) || null,
      discount: parseFloat(itemsData.discountPercentage) || 0,
      items: itemsData.items || [],
      payment_option: formData.payment_method,
      note: formData.private_note,
    };

    try {
      await axiosInstance.put(`/invoices-issued/${invoiceId}`, dataToSend);

      showToast({
        title: "Úspěch",
        description: "Faktura byla úspěšně aktualizována.",
        status: "success",
      });

      navigate("/my/sales/invoicesissued/list");
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
        Upravit fakturu
      </Heading>

      <SaleTemplateForm
        formData={formData}
        onFormChange={handleFormChange}
        companyId={savedCompanyId}
        isEdit={true}
        isOriginallyPaid={originallyPaid}
        contactData={contactData}
      />

      <Divider my={6} borderColor="gray.300" />

      <TemplateItems itemsData={itemsData} onChange={handleItemsChange} />

      <Flex justify="flex-end" mt={6}>
        <Button variant="solid" colorScheme="teal" onClick={handleSave}>
          Uložit změny
        </Button>
      </Flex>
    </Box>
  );
}