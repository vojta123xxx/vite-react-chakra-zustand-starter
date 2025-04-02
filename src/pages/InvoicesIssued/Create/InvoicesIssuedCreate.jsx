import React, { useState } from "react";
import {
  Heading,
  Box,
  Divider,
  useColorModeValue,
  Button,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import useToastNotification from "../../../components/hooks/useToastNotification";
// Importované komponenty
import SaleTemplateForm from "../InvoiceIssuedForm";
import TemplateItems from "../InvoicesIssuedItems";
import useInvoiceRequest from "../models/useInvoiceRequest";
import SaleTemplateDropdown from "../SalesTemplatesDropdownSelect";
import InvoiceModal from "../../../components/ui/Modals/Invoice/InvoiceModal"; // Upravte cestu dle umístění
import axiosInstance from "../../../api/axiosInstance";

export default function InvoicesIssuedCreate() {
  const navigate = useNavigate();
  const showToast = useToastNotification();
  const savedCompanyId = localStorage.getItem("selectedCompanyId");

  // Stav pro hlavičku faktury
  const [formData, setFormData] = useState({
    order_number: "",
    contact_id: "",
    description: "",
    text_before_items: "",
    text_after_items: "",
    payment_date: "",
    payment_method: "",
    print_language: "",
    issue_date: new Date().toISOString().split("T")[0],
    due_date: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 14);
      return d.toISOString().split("T")[0];
    })(),
    variable_symbol: "",
    constant_symbol: "",
    currency: "",
    private_note: "",
  });

  // Stav pro položky faktury (items, sleva, součty)
  const [itemsData, setItemsData] = useState({
    items: [],
    discountPercentage: 0,
    totalBeforeDiscount: 0,
    discountValue: 0,
    finalTotal: 0,
  });

  // Stav pro InvoiceModal (úpravu dokladu)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempInvoiceNumber, setTempInvoiceNumber] = useState(formData.order_number || 0);
  const [tempInvoiceDate, setTempInvoiceDate] = useState(formData.issue_date || new Date().toISOString().split("T")[0]);

  const labelColor = useColorModeValue("gray.700", "gray.300");

  const { saveInvoice } = useInvoiceRequest();

 const handleTemplateSelect = async (templateId) => {
  if (!templateId) {
    setFormData((prev) => ({ ...prev }));
    setItemsData({
      items: [],
      discountPercentage: 0,
      totalBeforeDiscount: 0,
      discountValue: 0,
      finalTotal: 0,
    });
    return;
  }

  try {
    const url = `/sale-templates/${savedCompanyId}/detail/${templateId}`;
    const res = await axiosInstance.get(url);
    const template = res.data;

    setFormData((prev) => ({
      ...prev,
      order_number: template.order_number || "",
      contact_id: template.contact_id || "",
      description: template.description || "",
      text_before_items: template.text_before_items || "",
      text_after_items: template.text_after_items || "",
      payment_date: template.payment_date || "",
      payment_method: template.payment_option || "",
      print_language: template.print_language || "",
      variable_symbol: template.variable_symbol || "",
      constant_symbol: template.constant_symbol || "",
      currency: template.currency || "",
    }));

    let totalBeforeDiscount = 0;
    (template.items || []).forEach((item) => {
      totalBeforeDiscount += Number(item.total) || 0;
    });
    const discountValue = (Number(template.discount || 0) / 100) * totalBeforeDiscount;
    const finalTotal = totalBeforeDiscount - discountValue;

    setItemsData({
      items: template.items || [],
      discountPercentage: Number(template.discount || 0),
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


  /**
   * Aktualizace dat ve formuláři.
   */
  const handleFormChange = (changes) => {
    setFormData((prev) => ({ ...prev, ...changes }));
  };

  /**
   * Aktualizace položek faktury.
   */
  const handleItemsChange = (updatedItemsData) => {
    setItemsData(updatedItemsData);
  };

React.useEffect(() => {
  const fetchInvoiceNumber = async () => {
    try {
      const response = await axiosInstance.get(`/invoices-issued/next-number/${savedCompanyId}`);
      const data = response.data;
      setFormData((prev) => ({ ...prev, invoice_number: data.invoice_number }));
      setTempInvoiceNumber(data.invoice_number);
    } catch (error) {
      showToast({
        title: "Chyba",
        description: error.message,
        status: "error",
      });
    }
  };

  if (savedCompanyId) {
    fetchInvoiceNumber();
  }
}, [savedCompanyId, showToast]);

  /**
   * Odeslání nové faktury.
   */
  const handleCreate = async () => {
  const dataToSend = {
    ...formData,
    company_id: parseInt(savedCompanyId, 10),
    order_number: parseInt(formData.order_number, 10) || 0,
    invoice_number: parseInt(formData.invoice_number, 10) || 0,
    contact_id: parseInt(formData.contact_id, 10) || null,
    discount: parseFloat(itemsData.discountPercentage) || 0,
    items: itemsData.items || [],
    payment_option: formData.payment_method,
    note: formData.private_note,
  };

  try {
    await axiosInstance.post("/invoices-issued", dataToSend);

    showToast({
      title: "Úspěch",
      description: "Faktura byla úspěšně vytvořena.",
      status: "success",
    });

    navigate("/my/sales/invoicesissued/list");
  } catch (error) {
    const msg = error.response?.data?.msg || error.message;
    showToast({
      title: "Chyba",
      description: msg,
      status: "error",
    });
  }
};



  // Handlery pro InvoiceModal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleModalSave = () => {
    setFormData((prev) => ({
      ...prev,
      invoice_number: tempInvoiceNumber,
      issue_date: tempInvoiceDate,
    }));
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const bg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("black", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box p={4} bg={bg} color={textColor}>
      <Heading size="lg" mb={4}>
        Vytvořit novou fakturu
      </Heading>

      <Flex alignItems="center" gap={2} mb={4}>
        <Heading size="lg">
          Nová faktura vydaná č. {formData.invoice_number}
        </Heading>
        <IconButton
          icon={<EditIcon />}
          onClick={openModal}
          aria-label="Upravit doklad"
          variant="outline"
        />
      </Flex>

      <Flex mb={4} alignItems="center">
        <SaleTemplateDropdown
          savedCompanyId={savedCompanyId}
          invoiceType="faktura_vydana"
          showToast={showToast}
          onSelect={handleTemplateSelect}
        />
      </Flex>

      {/* Zobrazení modálního okna */}
      {isModalOpen && (
        <InvoiceModal
          isOpen={isModalOpen}
          onClose={handleModalCancel}
          handleSave={handleModalSave}
          handleCancel={handleModalCancel}
          tempInvoiceNumber={tempInvoiceNumber}
          setTempInvoiceNumber={setTempInvoiceNumber}
          tempInvoiceDate={tempInvoiceDate}
          setTempInvoiceDate={setTempInvoiceDate}
          borderColor={borderColor}
          textColor={textColor}
          labelColor={labelColor}
          generatedInvoiceNumber={tempInvoiceNumber} // Lze upravit logiku generování čísla
        />
      )}

      <SaleTemplateForm
        formData={formData}
        onFormChange={handleFormChange}
        companyId={savedCompanyId}
      />

      <Divider my={6} borderColor="gray.300" />

      <TemplateItems itemsData={itemsData} onChange={handleItemsChange} />

      <Flex justify="flex-end" mt={6}>
        <Button variant="solid" colorScheme="teal"  onClick={handleCreate}>
          Uložit fakturu
        </Button>
      </Flex>
    </Box>
  );
}
