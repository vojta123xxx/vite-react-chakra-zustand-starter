import React from "react";
import {
  VStack,
  Heading,
  Textarea,
  FormControl,
  FormLabel,
  Select,
  Divider,
  Button
} from "@chakra-ui/react";
import FCard from "../../Card";
import useCompanyDetailLogic from "./useCompanyDetailLogic";

const AccountingData = ({ companyData }) => {
  const { editableData, handleChange, handleUpdate } = useCompanyDetailLogic(companyData);
  const accentColor = "teal.500";

  return (
    <FCard maxW="600px" mx="auto">
      <Heading as="h2" size="md" mb={4} color={accentColor}>
        Účetní údaje
      </Heading>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel fontWeight="medium">Typ daně</FormLabel>
          <Select
            name="tax_type"
            value={editableData.tax_type || ""}
            onChange={handleChange}
            focusBorderColor={accentColor}
            disabled
          >
            <option value="plátce">Plátce DPH</option>
            <option value="neplátce">Neplátce DPH</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="medium">Typ subjektu</FormLabel>
          <Select
            name="subject_type"
            value={editableData.subject_type || ""}
            onChange={handleChange}
            focusBorderColor={accentColor}
            disabled
          >
            <option value="fo">Fyzická osoba</option>
            <option value="po">Právnická osoba</option>
          </Select>
        </FormControl>

        <FormControl id="registryNumber">
          <FormLabel fontWeight="medium">spis znacka</FormLabel>
          <Textarea
            name="registryNumber"
            value={editableData.registryNumber || ""}
            onChange={handleChange}
            focusBorderColor={accentColor}
            size="lg"
            resize="vertical"
          />
        </FormControl>
      </VStack>
      <Divider mt={6} />
      <Button colorScheme="teal" size="lg" width="full" mt={4} onClick={handleUpdate}>
        Uložit změny
      </Button>
    </FCard>
  );
};

export default AccountingData;
