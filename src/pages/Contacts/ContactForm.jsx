import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  SimpleGrid,
  VStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Card,
  CardHeader,
  CardBody,
  Stack,
  useToast,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AresAutocomplete from "../../components/AresAutocomplete/AresAutocomplete";

export default function ContactForm({
  formData,
  setFormData,
  handleChange,
  handleSubmit,
  setDeliveryAddresses,
  isEditing,
  errors = {},
}) {
  const toast = useToast();
  const navigate = useNavigate();

  const handleSelectFromAres = (item) => {
    const updatedData = {
      ...formData,
      company_name: item.obchodniJmeno || "",
      street: item.sidlo?.textovaAdresa || "",  // zde přidáme textovou adresu
      city: item.sidlo?.nazevObce || "",
      postal_code: item.sidlo?.psc || "",
      country: item.sidlo?.nazevStatu || "",
      ico: item.ico || "",
      dic: item.dic || "",
    };
    setFormData(updatedData);

    if (setDeliveryAddresses) {
      setDeliveryAddresses((prevAddresses) =>
        prevAddresses.map((addr) =>
          addr.is_primary === 1
            ? {
                ...addr,
                name: updatedData.company_name,
                street: updatedData.street,
                postal_code: updatedData.postal_code,
                city: updatedData.city,
                country: updatedData.country,
              }
            : addr
        )
      );
    }

    toast({
      title: "Data načtena z ARES",
      description: "Údaje byly automaticky vyplněny.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box maxW="container.xl" mx="auto" p={4}>
      <Button
        leftIcon={<FiArrowLeft />}
        variant="outline"
        mb={6}
        onClick={() => navigate(-1)}
      >
        Zpět
      </Button>

      <Heading as="h1" size="xl" mb={8}>
        {isEditing ? "Upravit kontakt" : "Vytvořit nový kontakt"}
      </Heading>

      {Object.keys(errors).length > 0 && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon />
          <Box>
            <Heading size="sm">Opravte prosím následující chyby:</Heading>
            {Object.values(errors).map((error, index) => (
              <Text key={index}>• {error}</Text>
            ))}
          </Box>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <VStack spacing={8} align="stretch">
          {/* Základní informace */}
          <Card>
            <CardHeader>
              <Heading size="md">Základní informace</Heading>
            </CardHeader>
            <CardBody>
              <FormControl isRequired isInvalid={errors.company_name}>
                <FormLabel>Jméno/Firma</FormLabel>
                <AresAutocomplete 
                  onSelect={handleSelectFromAres} 
                  value={formData.company_name} 
                  onChange={(newValue) =>
                    setFormData({ ...formData, company_name: newValue })
                  }
                />
              </FormControl>
            </CardBody>
          </Card>

          {/* Adresa */}
          <Card>
            <CardHeader>
              <Heading size="md">Adresa</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl>
                  <FormLabel>Ulice</FormLabel>
                  <Input
                    name="street"
                    value={formData.street || ""}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Město</FormLabel>
                  <Input
                    name="city"
                    value={formData.city || ""}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>PSČ</FormLabel>
                  <Input
                    name="postal_code"
                    value={formData.postal_code || ""}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Stát</FormLabel>
                  <Input
                    name="country"
                    value={formData.country || ""}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>IČO</FormLabel>
                  <Input
                    name="ico"
                    value={formData.ico || ""}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>DIČ</FormLabel>
                  <Input
                    name="dic"
                    value={formData.dic || ""}
                    onChange={handleChange}
                  />
                </FormControl>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Kontaktní osoba */}
          <Card>
            <CardHeader>
              <Heading size="md">Kontaktní osoba</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl>
                  <FormLabel>Jméno</FormLabel>
                  <Input
                    name="contact_firstname"
                    value={formData.contact_firstname || ""}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Příjmení</FormLabel>
                  <Input
                    name="contact_lastname"
                    value={formData.contact_lastname || ""}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Titul</FormLabel>
                  <Input
                    name="contact_title"
                    value={formData.contact_title || ""}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Mobil</FormLabel>
                  <Input
                    name="contact_mobile"
                    value={formData.contact_mobile || ""}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Telefonní číslo</FormLabel>
                  <Input
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                  />
                </FormControl>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Fakturační údaje */}
          <Card>
            <CardHeader>
              <Heading size="md">Fakturační údaje</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl>
                  <FormLabel>Webová stránka</FormLabel>
                  <Input
                    name="website"
                    value={formData.website || ""}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Splatnost dnů</FormLabel>
                  <NumberInput
                    min={0}
                    value={formData.payment_terms || 0}
                    onChange={(valueString) =>
                      handleChange({
                        target: { name: "payment_terms", value: valueString },
                      })
                    }
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>Sleva (%)</FormLabel>
                  <NumberInput
                    min={0}
                    max={100}
                    value={formData.discount || 0}
                    onChange={(valueString) =>
                      handleChange({
                        target: { name: "discount", value: valueString },
                      })
                    }
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </SimpleGrid>
              <FormControl mt={6}>
                <FormLabel>Poznámka</FormLabel>
                <Textarea
                  name="note"
                  value={formData.note || ""}
                  onChange={handleChange}
                  rows={4}
                />
              </FormControl>
            </CardBody>
          </Card>

          {/* Bankovní údaje */}
          <Card>
            <CardHeader>
              <Heading size="md">Bankovní údaje</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl>
                  <FormLabel>Číslo účtu</FormLabel>
                  <Input
                    name="bank_account_number"
                    value={formData.bank_account_number || ""}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Kód banky</FormLabel>
                  <Input
                    name="bank_code"
                    value={formData.bank_code || ""}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>IBAN</FormLabel>
                  <Input
                    name="iban"
                    value={formData.iban || ""}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>SWIFT</FormLabel>
                  <Input
                    name="swift"
                    value={formData.swift || ""}
                    onChange={handleChange}
                  />
                </FormControl>
              </SimpleGrid>
            </CardBody>
          </Card>

          <Stack direction="row" spacing={4} justify="flex-end" mt={8}>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Zrušit
            </Button>
            <Button
              leftIcon={<FiSave />}
              colorScheme="brand"
              type="submit"
            >
              {isEditing ? "Uložit změny" : "Vytvořit kontakt"}
            </Button>
          </Stack>
        </VStack>
      </form>
    </Box>
  );
}