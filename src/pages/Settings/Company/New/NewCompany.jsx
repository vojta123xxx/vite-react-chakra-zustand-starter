import {
  Box,
  Input,
  Button,
  Heading,
  Tooltip,
  VStack,
  HStack,
  Container,
  FormLabel,
  FormHelperText,
  FormControl,
  Text,
  Icon,
  InputGroup,
  InputRightElement,
  Divider
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { CustomSelect } from "../../../../components/CustomSelect";
import FCard from "../../Card";
import useNewCompanyLogic from "./NewCompanyLogic";

const NewCompany = () => {
  const { ico, setIco, companyData, setCompanyData, fetchCompanyData, saveCompanyData } = useNewCompanyLogic();
  const accentColor = "teal.500";

  const taxOptions = [
    { value: "neplatce_dph", label: "Neplátce DPH" },
    { value: "platce_dph", label: "Plátce DPH" }
  ];

  return (
    <FCard maxW="1400px" mx="auto">
        <VStack spacing={8}>
          <Box textAlign="center" w="full">
            <Heading as="h1" size="lg" color={accentColor} mb={2}>
              Nová firma
            </Heading>
            <Text>Vyplňte základní údaje o vaší společnosti</Text>
          </Box>

          <VStack spacing={6} w="full">
            {/* Company Name */}
            <FormControl id="companyName" isRequired>
              <FormLabel fontWeight="medium">Firma/Jméno</FormLabel>
              <Input
                size="lg"
                placeholder="Zadejte název firmy nebo jméno"
                value={companyData.name}
                onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                focusBorderColor={accentColor}
                _hover={{ borderColor: "gray.300" }}
              />
            </FormControl>

            {/* ICO */}
            <FormControl id="ico" isRequired>
              <FormLabel fontWeight="medium">IČO</FormLabel>
              <InputGroup size="lg">
                <Input
                  placeholder="Zadejte IČO"
                  value={ico}
                  onChange={(e) => setIco(e.target.value)}
                  onBlur={fetchCompanyData}
                  focusBorderColor={accentColor}
                  _hover={{ borderColor: "gray.300" }}
                />
                <InputRightElement>
                  <Tooltip
                    label="Pokud zadáte IČO, automaticky doplníme dostupné údaje 😊"
                    placement="top"
                    hasArrow
                  >
                    <Icon as={InfoIcon} color="gray.400" w={5} h={5} />
                  </Tooltip>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Divider />

            {/* Address Section */}
            <Box w="full">
              <Heading as="h2" size="md" mb={4} color={accentColor}>
                Sídlo společnosti
              </Heading>
              <VStack spacing={4}>
                <FormControl id="street" isRequired>
                  <FormLabel fontWeight="medium">Ulice a číslo popisné</FormLabel>
                  <Input
                    size="lg"
                    placeholder="Např. Hlavní 123"
                    value={companyData.street}
                    onChange={(e) => setCompanyData({ ...companyData, street: e.target.value })}
                    focusBorderColor={accentColor}
                    _hover={{ borderColor: "gray.300" }}
                  />
                </FormControl>

                <HStack w="full" spacing={4}>
                  <FormControl id="city" isRequired>
                    <FormLabel fontWeight="medium">Město</FormLabel>
                    <Input
                      size="lg"
                      placeholder="Zadejte město"
                      value={companyData.city}
                      onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
                      focusBorderColor={accentColor}
                      _hover={{ borderColor: "gray.300" }}
                    />
                  </FormControl>

                  <FormControl id="zip" isRequired>
                    <FormLabel fontWeight="medium">PSČ</FormLabel>
                    <Input
                      size="lg"
                      placeholder="Zadejte PSČ"
                      value={companyData.zip}
                      onChange={(e) => setCompanyData({ ...companyData, zip: e.target.value })}
                      focusBorderColor={accentColor}
                      _hover={{ borderColor: "gray.300" }}
                    />
                  </FormControl>
                </HStack>
              </VStack>
            </Box>

            <Divider />

            {/* Contact Section */}
            <Box w="full">
              <Heading as="h2" size="md" mb={4} color={accentColor}>
                Kontaktní údaje
              </Heading>
              <VStack spacing={4}>
                <HStack w="full" spacing={4}>
                  <FormControl id="phone">
                    <FormLabel fontWeight="medium">Telefon</FormLabel>
                    <Input
                      size="lg"
                      placeholder="Např. +420 123 456 789"
                      value={companyData.phone}
                      onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                      focusBorderColor={accentColor}
                      _hover={{ borderColor: "gray.300" }}
                    />
                  </FormControl>

                  <FormControl id="mobile">
                    <FormLabel fontWeight="medium">Mobil</FormLabel>
                    <Input
                      size="lg"
                      placeholder="Např. +420 987 654 321"
                      value={companyData.mobile}
                      onChange={(e) => setCompanyData({ ...companyData, mobile: e.target.value })}
                      focusBorderColor={accentColor}
                      _hover={{ borderColor: "gray.300" }}
                    />
                  </FormControl>
                </HStack>

                <FormControl id="website">
                  <FormLabel fontWeight="medium">Web</FormLabel>
                  <Input
                    size="lg"
                    placeholder="Např. www.example.com"
                    value={companyData.website}
                    onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                    focusBorderColor={accentColor}
                    _hover={{ borderColor: "gray.300" }}
                  />
                </FormControl>
              </VStack>
            </Box>

            <Divider />

            {/* Subject Type */}
            <FormControl id="subjectType" isRequired>
              <FormLabel fontWeight="medium">Typ subjektu</FormLabel>
              <CustomSelect
                options={[
                  { value: "fyz_osoba", label: "Fyzická osoba" },
                  { value: "prav_osoba", label: "Právnická osoba" }
                ]}
                value={{
                  value: companyData.subjectType,
                  label: companyData.subjectType === "prav_osoba" ? "Právnická osoba" : "Fyzická osoba"
                }}
                onChange={(option) =>
                  setCompanyData({ ...companyData, subjectType: option.value })
                }
              />
              <FormHelperText>
                Vyberte, zda jste fyzická nebo právnická osoba
              </FormHelperText>
            </FormControl>

            {/* Tax Information */}
            <Box w="full">
              <Heading as="h2" size="md" mb={4} color={accentColor}>
                Účetní údaje
              </Heading>
              <FormControl id="taxType" isRequired>
                <FormLabel fontWeight="medium">Typ daně</FormLabel>
                <CustomSelect
                  options={taxOptions}
                  value={taxOptions.find(option => option.value === companyData.taxType)}
                  onChange={(option) =>
                    setCompanyData({ ...companyData, taxType: option.value })
                  }
                />
                <FormHelperText>Vyberte, zda jste plátce DPH</FormHelperText>
              </FormControl>
            </Box>
          </VStack>

          <Button
            colorScheme="teal"
            size="lg"
            width="full"
            onClick={saveCompanyData}
            _hover={{ transform: "translateY(-1px)" }}
            transition="all 0.2s"
          >
            Uložit údaje
          </Button>
        </VStack>
      </FCard>
  );
};

export default NewCompany;
