import React, { useCallback } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Textarea,
  Box,
  Select,
  Divider,
  Heading,
  Switch,
} from "@chakra-ui/react";
import AdresarSelect from "../../components/AdresarSelect";

export default function InvoiceIssuedForm({ formData, onFormChange, companyId, isEdit, isOriginallyPaid, contactData }) {
  // Obecná funkce pro změny v poli formuláře
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFormChange({ [name]: value });
  };

  const handleNumberChange = (name, value) => {
    onFormChange({ [name]: value });
  };

  // Úprava pro switch "Uhrazeno" – při zapnutí automaticky nastavíme dnešní datum, při vypnutí vymažeme datum platby
  const handleSwitchChange = () => {
    if (formData.is_paid) {
      onFormChange({ is_paid: false, payment_date: "" });
    } else {
      const today = new Date().toISOString().split("T")[0];
      onFormChange({ is_paid: true, payment_date: formData.payment_date || today });
    }
  };

  // Předávání změny kontaktu – kontakt se ukládá do formData.contact_id
  const handleContactChange = useCallback(
    (contact) => {
      onFormChange({ contact_id: contact ? contact.value : "" });
    },
    [onFormChange]
  );

  return (
    <Box p={4} maxW="600px" mx="auto">
      <Heading size="md">Odběratel</Heading>
      <AdresarSelect
        companyId={companyId}
        initialContactId={formData.contact_id}
        initialContactData={contactData}
        onContactChange={handleContactChange}
      />

      <Divider my={4} />

      <FormControl mb={3}>
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
          value={formData.description || ""}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl mb={3}>
        <FormLabel>Text před položkami</FormLabel>
        <Textarea
          name="text_before_items"
          value={formData.text_before_items || ""}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl mb={3}>
        <FormLabel>Text za položkami</FormLabel>
        <Textarea
          name="text_after_items"
          value={formData.text_after_items || ""}
          onChange={handleChange}
        />
      </FormControl>

      <Divider my={4} />
      <Heading size="md">Datumy</Heading>

      <FormControl mb={3}>
        <FormLabel>Vystaveno</FormLabel>
        <Input
          type="date"
          name="issue_date"
          value={formData.issue_date || ""}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl mb={3}>
        <FormLabel>Splatnost</FormLabel>
        <Input
          type="date"
          name="due_date"
          value={formData.due_date || ""}
          onChange={handleChange}
        />
      </FormControl>

      <Divider my={4} />

      <FormControl mb={3}>
        <FormLabel>Způsob úhrady</FormLabel>
        <Select
          name="payment_method"
          value={formData.payment_method || ""}
          onChange={handleChange}
        >
          <option value="">Vyberte způsob úhrady</option>
          <option value="bank_prevod">Bankovní převod</option>
          <option value="hotovost">Hotovost</option>
          <option value="kartou">Kartou</option>
        </Select>
      </FormControl>

      <Heading size="md">Jazyk tiskové sestavy</Heading>
      
      <FormControl mb={3}>
        <FormLabel>Jazyk tiskové sestavy</FormLabel>
        <Select
          name="print_language"
          value={formData.print_language}
          onChange={handleChange}
          placeholder="Vyberte jazyk tiskové sestavy"
        >
          <option value="cz">Čeština</option>
          <option value="en">Angličtina</option>
          <option value="sk">Slovenština</option>
        </Select>
      </FormControl>

      <FormControl display="flex" alignItems="center" mb={3}>
        <FormLabel mb="0">Uhrazeno</FormLabel>
        <Switch isChecked={Boolean(formData.is_paid)} onChange={handleSwitchChange} />
      </FormControl>

      {formData.is_paid && (
        <FormControl mb={3}>
          <FormLabel>Datum platby</FormLabel>
          <Input
            type="date"
            name="payment_date"
            value={formData.payment_date || ""}
            onChange={handleChange}
          />
        </FormControl>
      )}

      <FormControl mb={3}>
        <FormLabel>Variabilní symbol</FormLabel>
        <NumberInput
          min={1}
          value={formData.variable_symbol || ""}
          onChange={(val) => handleNumberChange("variable_symbol", val)}
        >
          <NumberInputField name="variable_symbol" />
        </NumberInput>
      </FormControl>

      <FormControl mb={3}>
        <FormLabel>Konstantní symbol</FormLabel>
        <NumberInput
          min={1}
          value={formData.constant_symbol || ""}
          onChange={(val) => handleNumberChange("constant_symbol", val)}
        >
          <NumberInputField name="constant_symbol" />
        </NumberInput>
      </FormControl>

      <Divider my={4} />
      <Heading size="md">Měna a Poznámky</Heading>

      <FormControl mb={3}>
        <FormLabel>Měna</FormLabel>
        <Select
          name="currency"
          value={formData.currency || ""}
          onChange={handleChange}
        >
          <option value="">Vyberte měnu</option>
          <option value="CZK">Kč</option>
          <option value="EUR">€</option>
          <option value="USD">$</option>
        </Select>
      </FormControl>

      <FormControl mb={3}>
        <FormLabel>Poznámka pro mě</FormLabel>
        <Textarea
          name="private_note"
          value={formData.private_note || ""}
          onChange={handleChange}
        />
      </FormControl>
    </Box>
  );
}