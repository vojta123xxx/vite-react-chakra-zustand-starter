import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Box,
  Text,
  Flex,
  IconButton,
  Switch,
  useToast,
  useColorMode,
  useTheme,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import Select from "react-select";
import ContactCreateModal from "../pages/Contacts/ContactCreateModal";
import axiosInstance from "../api/axiosInstance";

export default function AdresarSelect({
  companyId,
  initialContactId,
  initialContactData,
  onContactChange,
  initialDeliveryAddressData, // Pokud existuje, chceme ji zobrazit jako default
}) {
  const toast = useToast();
  const { colorMode } = useColorMode();
  const theme = useTheme();

  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [loadingContacts, setLoadingContacts] = useState(true);
  // Pokud máme "initialContactData", chováme se, jako by byl read-only, dokud to neupravíme.
  const [isReadOnly, setIsReadOnly] = useState(!!initialContactData);

  // Switch pro použití jiné (dodací) adresy
  const [useDifferentDeliveryAddress, setUseDifferentDeliveryAddress] = useState(
    !!initialDeliveryAddressData
  );
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState(null);

  // --- 1) Načteme seznam kontaktů z API ---
  const fetchContacts = async () => {
    try {
      const response = await axiosInstance.get(`/contacts/${companyId}`);
      const data = response.data;
      const formattedContacts = data.map((contact) => ({
        value: Number(contact.id),
        label:
          contact.company_name ||
          `${contact.contact_firstname} ${contact.contact_lastname}`,
        address: `${contact.street || ""}, ${contact.postal_code || ""} ${
          contact.city || ""
        }`,
        ico: contact.ico,
        dic: contact.dic,
        contactData: contact,
      }));
      setContacts(formattedContacts);
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodařilo se načíst kontakty.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoadingContacts(false);
    }
  };

  // --- 2) Když se změní companyId, znovu načteme kontakty ---
  useEffect(() => {
    if (companyId) {
      fetchContacts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  // --- 3) Po načtení kontaktů i initial props zkusíme nastavit selectedContact a selectedDeliveryAddress ---
  useEffect(() => {
    // a) Pokud máme kompletní data o kontaktu (např. z API: initialContactData)
    if (initialContactData && Object.keys(initialContactData).length > 0) {
      const formattedContact = {
        value: Number(initialContactId),
        label:
          initialContactData.company_name ||
          `${initialContactData.contact_firstname} ${initialContactData.contact_lastname}`,
        address: `${initialContactData.street || ""}, ${
          initialContactData.postal_code || ""
        } ${initialContactData.city || ""}`,
        ico: initialContactData.ico,
        dic: initialContactData.dic,
        contactData: initialContactData,
      };
      setSelectedContact(formattedContact);

      // Nastavíme i dodací adresu, pokud existuje:
      if (initialDeliveryAddressData) {
        setSelectedDeliveryAddress({
          value: Number(initialDeliveryAddressData.id),
          label: initialDeliveryAddressData.name,
          address: `${initialDeliveryAddressData.street}, ${initialDeliveryAddressData.postal_code} ${initialDeliveryAddressData.city}`,
        });
        // Switch zapneme
        setUseDifferentDeliveryAddress(true);
      }
    }
    // b) Pokud nemáme full data, ale aspoň ID a seznam kontaktů:
    else if (initialContactId && contacts.length > 0) {
      const found = contacts.find((c) => c.value === Number(initialContactId));
      setSelectedContact(found || null);
      // Switch zapneme, pokud z parenta přišlo isDifferentAddress === 1 (viz. Form)
      // (popř. to už řeší Form -> a tady by to bylo podle initialDeliveryAddressData)
      if (initialDeliveryAddressData) {
        setSelectedDeliveryAddress({
          value: Number(initialDeliveryAddressData.id),
          label: initialDeliveryAddressData.name,
          address: `${initialDeliveryAddressData.street}, ${initialDeliveryAddressData.postal_code} ${initialDeliveryAddressData.city}`,
        });
        setUseDifferentDeliveryAddress(true);
      }
    }
  }, [
    initialContactData,
    initialContactId,
    contacts,
    initialDeliveryAddressData,
  ]);

  // --- 4) Kdykoli se nám mění vnitřní stavy, dáme to parentu ---
  useEffect(() => {
    if (onContactChange) {
      onContactChange({
        contact_id: selectedContact ? selectedContact.value : null,
        useDifferentDeliveryAddress,
        selectedDeliveryAddress,
      });
    }
  }, [selectedContact, useDifferentDeliveryAddress, selectedDeliveryAddress, onContactChange]);

  // --- 5) Stylizace pro react-select + identifikace "value" a "label" ---
  const customSelectProps = {
    getOptionValue: (option) => option.value,
    getOptionLabel: (option) => option.label,
    styles: {
      control: (provided, state) => ({
        ...provided,
        backgroundColor: colorMode === "dark" ? theme.colors.gray[700] : theme.colors.white,
        borderColor: state.isFocused
          ? colorMode === "dark"
            ? theme.colors.blue[300]
            : theme.colors.blue[500]
          : colorMode === "dark"
          ? theme.colors.gray[600]
          : theme.colors.gray[300],
        pointerEvents: isReadOnly ? "none" : "auto",
        opacity: isReadOnly ? 0.6 : 1,
        boxShadow: `0 0 0 1px ${theme.colors.teal[500]}`,
        "&:hover": {
          borderColor: theme.colors.teal[600],
        },
      }),
      menu: (provided) => ({
        ...provided,
        backgroundColor: colorMode === "dark" ? theme.colors.gray[800] : theme.colors.white,
        color: colorMode === "dark" ? theme.colors.white : theme.colors.black,
      }),
      singleValue: (provided) => ({
        ...provided,
        color: colorMode === "dark" ? theme.colors.white : theme.colors.black,
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused
          ? theme.colors.teal[500]
          : colorMode === "dark"
          ? theme.colors.gray[800]
          : theme.colors.white,
        color: state.isFocused
          ? theme.colors.white
          : colorMode === "dark"
          ? theme.colors.white
          : theme.colors.black,
        "&:active": {
          backgroundColor: theme.colors.teal[600],
        },
      }),
    },
  };

  // --- 6) Sestavíme pole možností pro dodací adresy ---
  let deliveryAddressOptions = [];
  if (
    selectedContact &&
    selectedContact.contactData &&
    Array.isArray(selectedContact.contactData.delivery_addresses)
  ) {
    deliveryAddressOptions = selectedContact.contactData.delivery_addresses.map((addr) => ({
      value: Number(addr.id),
      label: addr.name,
      address: `${addr.street}, ${addr.postal_code} ${addr.city}`,
    }));
  }

  // Pokud vybranou (selectedDeliveryAddress) v array nenajdeme, ručně ji tam přihodíme.
  if (
    selectedDeliveryAddress &&
    !deliveryAddressOptions.some((opt) => opt.value === selectedDeliveryAddress.value)
  ) {
    deliveryAddressOptions.unshift(selectedDeliveryAddress);
  }

  // --- RENDER ---
  return (
    <FormControl isRequired mb={3}>
      <FormLabel>Vyberte kontakt z adresáře</FormLabel>
      <Flex alignItems="center">
        <Box flex="1">
          <Select
            {...customSelectProps}
            options={contacts}
            isLoading={loadingContacts}
            placeholder="Vyberte kontakt z adresáře..."
            isClearable={!isReadOnly}
            value={selectedContact}
            onChange={(selected) => {
              setSelectedContact(selected || null);
              // Při změně kontaktu reset dodací adresy
              setUseDifferentDeliveryAddress(false);
              setSelectedDeliveryAddress(null);
            }}
            isDisabled={isReadOnly}
          />
        </Box>

        {/* Tlačítko pro "odemknutí" read-only a znovu-nahrání kontaktů */}
        {isReadOnly ? (
          <IconButton
            aria-label="Upravit kontakt"
            icon={<EditIcon />}
            size="sm"
            ml={2}
            onClick={async () => {
              setIsReadOnly(false);
              setSelectedContact(null);
              await fetchContacts();
            }}
          />
        ) : (
          <Box ml={2}>
            <ContactCreateModal
              onContactCreated={(newContact) => {
                const formattedContact = {
                  value: Number(newContact.id),
                  label:
                    newContact.company_name ||
                    `${newContact.contact_firstname || ""} ${newContact.contact_lastname || ""}`,
                  address: `${newContact.street || ""}, ${newContact.postal_code || ""} ${
                    newContact.city || ""
                  }`,
                  ico: newContact.ico,
                  dic: newContact.dic,
                  contactData: newContact,
                };
                setContacts((prev) => [...prev, formattedContact]);
                setSelectedContact(formattedContact);
              }}
            />
          </Box>
        )}
      </Flex>

      {/* Switch pro odlišnou dodací adresu */}
      <Box mt={3}>
        <Flex alignItems="center">
          <FormLabel htmlFor="delivery-address-switch" mb={0}>
            Dodací adresa je jiná, než fakturační
          </FormLabel>
          <Switch
            id="delivery-address-switch"
            ml={2}
            isChecked={useDifferentDeliveryAddress}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setUseDifferentDeliveryAddress(isChecked);
              if (!isChecked) {
                setSelectedDeliveryAddress(null);
              }
            }}
          />
        </Flex>
      </Box>

      {/* Zobrazení detailů vybraného kontaktu */}
      {selectedContact && (
        <Box
          mt={3}
          p={2}
          border="1px"
          borderColor={colorMode === "dark" ? "gray.600" : "gray.200"}
          borderRadius="md"
        >
          <Text fontWeight="bold">Sídlo:</Text>
          <Text>{selectedContact.address}</Text>
          <Text fontWeight="bold" mt={2}>
            IČO:
          </Text>
          <Text>{selectedContact.ico}</Text>
          {selectedContact.dic && (
            <>
              <Text fontWeight="bold" mt={2}>
                DIČ:
              </Text>
              <Text>{selectedContact.dic}</Text>
            </>
          )}
        </Box>
      )}

      {/* Select pro výběr dodací adresy, pokud je switch zapnutý */}
      {useDifferentDeliveryAddress && (
        <Box mt={3}>
          <FormLabel>Vyberte dodací adresu</FormLabel>
          <Select
            {...customSelectProps}
            options={deliveryAddressOptions}
            placeholder="Vyberte dodací adresu..."
            value={selectedDeliveryAddress}
            onChange={(selected) => setSelectedDeliveryAddress(selected || null)}
          />
        </Box>
      )}
    </FormControl>
  );
}
