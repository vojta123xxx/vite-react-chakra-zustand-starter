import React from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  Divider,
  Spinner,
  Button
} from "@chakra-ui/react";
import FCard from "../../Card";
import useCompanyDetailLogic from "./useCompanyDetailLogic";

const SelectedCompanyDetail = ({ companyData, loadingCompany }) => {
  const { editableData, handleChange, handleUpdate } = useCompanyDetailLogic(companyData);
  const accentColor = "teal.500";

  return (
    <FCard maxW="1400px" mx="auto">
      <VStack spacing={6} w="full">
        <Box textAlign="center" w="full">
          <Heading as="h1" size="lg" color={accentColor} mb={2}>
            Základní nastavení firmy
          </Heading>
          <Text>Podrobné informace o společnosti</Text>
        </Box>

        {loadingCompany ? (
          <Spinner size="lg" />
        ) : editableData && editableData.id ? (
          <VStack spacing={4} w="full">
            <Heading as="h1" size="md" color="gray.600" mb={2}>
              ID (DB): {editableData.id}
            </Heading>
            <Divider />
            <FormControl id="name">
              <FormLabel fontWeight="medium">Firma/Jméno</FormLabel>
              <Input
                size="lg"
                value={editableData.name || ""}
                onChange={handleChange}
                focusBorderColor={accentColor}
              />
            </FormControl>

            <FormControl id="ico">
              <FormLabel fontWeight="medium">IČO</FormLabel>
              <Input
                size="lg"
                value={editableData.ico || ""}
                onChange={handleChange}
                focusBorderColor={accentColor}
                disabled
              />
            </FormControl>

            <Divider />

            <Box w="full">
              <Heading as="h2" size="md" mb={4} color={accentColor}>
                Sídlo společnosti
              </Heading>
              <VStack spacing={4}>
                <FormControl id="street">
                  <FormLabel fontWeight="medium">Ulice a číslo popisné</FormLabel>
                  <Input
                    size="lg"
                    value={editableData.street || ""}
                    onChange={handleChange}
                    focusBorderColor={accentColor}
                  />
                </FormControl>
                <FormControl id="city">
                  <FormLabel fontWeight="medium">Město</FormLabel>
                  <Input
                    size="lg"
                    value={editableData.city || ""}
                    onChange={handleChange}
                    focusBorderColor={accentColor}
                  />
                </FormControl>
                <FormControl id="zip">
                  <FormLabel fontWeight="medium">PSČ</FormLabel>
                  <Input
                    size="lg"
                    value={editableData.zip || ""}
                    onChange={handleChange}
                    focusBorderColor={accentColor}
                  />
                </FormControl>
              </VStack>
            </Box>

            <Divider />

            <Box w="full">
              <Heading as="h2" size="md" mb={4} color={accentColor}>
                Kontaktní údaje
              </Heading>
              <VStack spacing={4}>
                <FormControl id="phone">
                  <FormLabel fontWeight="medium">Telefon</FormLabel>
                  <Input
                    size="lg"
                    value={editableData.phone || ""}
                    onChange={handleChange}
                    focusBorderColor={accentColor}
                  />
                </FormControl>
                <FormControl id="mobile">
                  <FormLabel fontWeight="medium">Mobil</FormLabel>
                  <Input
                    size="lg"
                    value={editableData.mobile || ""}
                    onChange={handleChange}
                    focusBorderColor={accentColor}
                  />
                </FormControl>
                <FormControl id="website">
                  <FormLabel fontWeight="medium">Web</FormLabel>
                  <Input
                    size="lg"
                    value={editableData.website || ""}
                    onChange={handleChange}
                    focusBorderColor={accentColor}
                  />
                </FormControl>
                <FormControl id="registryNumber">
                  <FormLabel fontWeight="medium">spis znacka</FormLabel>
                  <Input
                    size="lg"
                    value={editableData.registryNumber || ""}
                    onChange={handleChange}
                    focusBorderColor={accentColor}
                  />
                </FormControl>
              </VStack>
            </Box>

            <Divider />

            <Button
              colorScheme="teal"
              size="lg"
              width="full"
              onClick={handleUpdate}
            >
              Uložit změny
            </Button>
          </VStack>
        ) : (
          <Text>Není vybraná žádná firma.</Text>
        )}
      </VStack>
    </FCard>
  );
};

export default SelectedCompanyDetail;
