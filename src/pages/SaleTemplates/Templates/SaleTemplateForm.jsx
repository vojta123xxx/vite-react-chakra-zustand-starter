import React, { useState, useEffect, useCallback } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Textarea,
  Box,
  Divider,
  Heading,
} from "@chakra-ui/react";
import AdresarSelect from "../../../components/AdresarSelect";
import { CustomSelect } from "../../../components/CustomSelect";

const invoiceOptions = [
  { value: "faktura_vydana", label: "Faktura vydaná" },
  { value: "zalohova_faktura", label: "Zálohová faktura" },
  { value: "cenova_nabidka", label: "Cenová nabídka" },
];

export default function SaleTemplateForm({ initialData, onFormChange, companyId }) {
  const [formData, setFormData] = useState({
    name: "",
    order_number: "",
    contact_id: "",
    maturity_days: "",
    description: "",
    invoice_type: "",
    text_before_items: "",
    text_after_items: "",
    print_language: "",
    payment_option: "",
    currency: "",
    constant_symbol: "",
    variable_symbol: "",
    // Pro odlišnou dodací adresu
    useDifferentDeliveryAddress: false,
    selectedDeliveryAddress: null,
  });

  const defaultTexts = {
    faktura_vydana: {
      before: "Toto je faktura za poskytnuté služby.",
      after: "Děkujeme za Vaši objednávku a důvěru."
    },
    zalohova_faktura: {
      before: "Toto je zálohová faktura. Prosíme o úhradu předem.",
      after: "Po přijetí platby Vám bude zaslána konečná faktura."
    },
    cenova_nabidka: {
      before: "Toto je cenová nabídka, platná do 30 dnů.",
      after: "Neváhejte nás kontaktovat s případnými dotazy."
    }
  };

  // Po načtení initialData nastavíme defaulty do formData
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        name: initialData.name || "",
        order_number: initialData.order_number || "",
        contact_id: initialData.contact_id || "",
        maturity_days: initialData.maturity_days || "",
        payment_option: initialData.payment_option || "",
        description: initialData.description || "",
        invoice_type: initialData.invoice_type || "",
        text_before_items: initialData.text_before_items || "",
        text_after_items: initialData.text_after_items || "",
        print_language: initialData.print_language || "",
        constant_symbol: initialData.constant_symbol || "",
        variable_symbol: initialData.variable_symbol || "",
        currency: initialData.currency || "",
        useDifferentDeliveryAddress: initialData.isDifferentAddress === 1,
        // Pokud existuje `deliveryAddressData`, vygenerujeme z ní structure (value,label,...)
        selectedDeliveryAddress: initialData.deliveryAddressData
          ? {
              value: Number(initialData.deliveryAddressData.id),
              label: initialData.deliveryAddressData.name,
              address: `${initialData.deliveryAddressData.street}, ${initialData.deliveryAddressData.postal_code} ${initialData.deliveryAddressData.city}`
            }
          : null,
      }));
    }
  }, [initialData]);

  // Vždy když se formData změní, zavoláme onFormChange
  useEffect(() => {
    onFormChange?.(formData);
  }, [formData, onFormChange]);

  // Handler pro změnu textových inputů
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "invoice_type") {
      // Změna typu faktury => nasetujeme i defaultní texty
      setFormData((prev) => ({
        ...prev,
        invoice_type: value,
        text_before_items: defaultTexts[value]?.before || "",
        text_after_items: defaultTexts[value]?.after || ""
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handler pro NumberInput (např. order_number, maturity_days)
  const handleNumberChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Callback pro změnu kontaktu z AdresarSelect
  const handleContactChange = useCallback((adresarData) => {
    setFormData((prev) => ({
      ...prev,
      contact_id: adresarData?.contact_id ?? "",
      useDifferentDeliveryAddress: adresarData.useDifferentDeliveryAddress,
      selectedDeliveryAddress: adresarData.selectedDeliveryAddress || null
    }));
  }, []);

  // Pro react-select typ faktury
  const handleInvoiceTypeChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setFormData((prev) => ({
      ...prev,
      invoice_type: value,
      text_before_items: defaultTexts[value]?.before || "",
      text_after_items: defaultTexts[value]?.after || ""
    }));
  };

  return (
    <Box p={4} maxW="600px" mx="auto">
      {/* Typ faktury */}
      <FormControl isRequired mb={3}>
        <FormLabel>Typ faktury</FormLabel>
        <CustomSelect
          options={invoiceOptions}
          value={invoiceOptions.find((opt) => opt.value === formData.invoice_type) || null}
          onChange={handleInvoiceTypeChange}
          placeholder="Vyberte typ faktury"
        />
      </FormControl>

      <Heading size="md">Odběratel</Heading>
      {/* AdresarSelect s předáním initialContactId a initialDeliveryAddressData */}
      <AdresarSelect
        companyId={companyId}
        initialContactId={initialData?.contact_id}
        initialContactData={initialData?.contact} 
          // POZOR: pokud API vrací contactData uvnitř initialData jinak, 
          //   musíte předat "contact" nebo "initialContactData" správně
        initialDeliveryAddressData={initialData?.deliveryAddressData}
        onContactChange={handleContactChange}
      />

      <Divider my={4} />

      <FormControl isRequired mb={3}>
        <FormLabel>Název šablony</FormLabel>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl isRequired mb={3}>
        <FormLabel>Číslo objednávky</FormLabel>
        <NumberInput
          min={1}
          value={formData.order_number || ""}
          onChange={(val) => handleNumberChange("order_number", val)}
        >
          <NumberInputField name="order_number" />
        </NumberInput>
      </FormControl>

      <FormControl mb={3}>
        <FormLabel>Popis</FormLabel>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl mb={3}>
        <FormLabel>Text před položkami</FormLabel>
        <Textarea
          name="text_before_items"
          value={formData.text_before_items}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl mb={3}>
        <FormLabel>Text za položkami</FormLabel>
        <Textarea
          name="text_after_items"
          value={formData.text_after_items}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl isRequired mb={3}>
        <FormLabel>Splatnost (dny)</FormLabel>
        <NumberInput
          min={1}
          value={formData.maturity_days || ""}
          onChange={(val) => handleNumberChange("maturity_days", val)}
        >
          <NumberInputField name="maturity_days" />
        </NumberInput>
      </FormControl>

      <Divider my={4} />

      <Heading size="md">Měna a symboly</Heading>

      <FormControl mb={3}>
        <FormLabel>Měna</FormLabel>
        <Input
          as="select"
          name="currency"
          value={formData.currency || ""}
          onChange={handleChange}
        >
          <option value="CZK">CZK</option>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
        </Input>
      </FormControl>

      <FormControl mb={3}>
        <FormLabel>Konstantní symbol</FormLabel>
        <Input
          name="constant_symbol"
          value={formData.constant_symbol || ""}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl mb={3}>
        <FormLabel>Variabilní symbol</FormLabel>
        <Input
          name="variable_symbol"
          value={formData.variable_symbol || ""}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl mb={3}>
        <FormLabel>Způsob úhrady</FormLabel>
        <Input
          as="select"
          name="payment_option"
          value={formData.payment_option || ""}
          onChange={handleChange}
        >
          <option value="">Vyberte způsob úhrady</option>
          <option value="bank_prevod">Bankovní převod</option>
          <option value="hotovost">Hotovost</option>
          <option value="kartou">Kartou</option>
        </Input>
      </FormControl>

      <Divider my={4} />

      <Heading size="md">Jazyk tiskové sestavy</Heading>
      <FormControl mb={3}>
        <FormLabel>Jazyk tiskové sestavy</FormLabel>
        <Input
          as="select"
          name="print_language"
          value={formData.print_language || ""}
          onChange={handleChange}
        >
          <option value="cz">Čeština</option>
          <option value="en">Angličtina</option>
          <option value="sk">Slovenština</option>
        </Input>
      </FormControl>
    </Box>
  );
}
