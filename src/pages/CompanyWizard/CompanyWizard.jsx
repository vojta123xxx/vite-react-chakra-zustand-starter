import {
  Box,
  Input,
  Select,
  Button,
  Heading,
  Tooltip,
  VStack,
  HStack,
  Container,
  FormLabel,
  FormHelperText,
  FormControl,
  Card,
  CardBody,
  Text,
  useColorModeValue,
  Icon,
  InputGroup,
  InputRightElement,
  Divider
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";

import useCompanyWizardLogic from "./useCompanyWizardLogic";

const CompanyWizard = () => {
  const { ico, setIco, companyData, setCompanyData, fetchCompanyData, saveCompanyData } = useCompanyWizardLogic();
  
  // Custom colors for light/dark mode
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = 'teal.500';
  
  return (
    <Container maxW="700px" py={10}>
      <Card
        bg={bgColor}
        boxShadow="lg"
        borderRadius="xl"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <CardBody p={8}>
          <VStack spacing={8}>
            <Box textAlign="center" w="full">
              <Heading
                as="h1"
                size="lg"
                color={accentColor}
                mb={2}
              >
                Vytvořte si první firmu
              </Heading>
              <Text >
                Vyplňte základní údaje o vaší společnosti
              </Text>
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
                  _hover={{ borderColor: 'gray.300' }}
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
                    _hover={{ borderColor: 'gray.300' }}
                  />
                  <InputRightElement>
                    <Tooltip
                      label="Pokud zadáte IČO, automaticky doplníme dostupné údaje"
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
                      _hover={{ borderColor: 'gray.300' }}
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
                        _hover={{ borderColor: 'gray.300' }}
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
                        _hover={{ borderColor: 'gray.300' }}
                      />
                    </FormControl>
                  </HStack>
                </VStack>
              </Box>

              <Divider />

              {/* Tax Information */}
              <Box w="full">
                <Heading as="h2" size="md" mb={4} color={accentColor}>
                  Účetní údaje
                </Heading>
                <FormControl id="taxType" isRequired>
                  <FormLabel fontWeight="medium">Typ daně</FormLabel>
                  <Select
                    size="lg"
                    placeholder="Vyberte možnost"
                    value={companyData.taxType}
                    onChange={(e) => setCompanyData({ ...companyData, taxType: e.target.value })}
                    focusBorderColor={accentColor}
                    _hover={{ borderColor: 'gray.300' }}
                  >
                    <option value="Neplátce DPH">Neplátce DPH</option>
                    <option value="Plátce DPH">Plátce DPH</option>
                  </Select>
                  <FormHelperText>
                    Vyberte, zda jste plátce DPH
                  </FormHelperText>
                </FormControl>
              </Box>
            </VStack>

     <Button
  colorScheme="teal"
  size="lg"
  width="full"
  onClick={saveCompanyData}
  _hover={{ transform: 'translateY(-1px)' }}
  transition="all 0.2s"
>
  Uložit údaje
</Button>

          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};

export default CompanyWizard;