import {
  Box,
  Input,
  Select,
  Button,
  Heading,
  VStack,
  HStack,
  Container,
  FormLabel,
  FormControl,
  Card,
  CardBody,
  useColorModeValue,
  IconButton,
  Divider,
  Spinner,
  Text,
  Radio,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import useCashRegisters from "./useCashRegisters";

const CashRegisters = ({ selectedCompanyId }) => {
  const {
    cashRegisters,
    loading,
    handleAddRegister,
    handleSelectRegister,
    handleSaveAll,
    handleRemoveRegister,
    handleChange,
  } = useCashRegisters(selectedCompanyId);

  const selectedRegisterBg = useColorModeValue("green.50", "green.900"); // Define background color based on color mode


  return (
    <Container maxW="1200px" py={10}>
      <Card bg={useColorModeValue("white", "gray.800")} boxShadow="lg" borderRadius="xl">
        <CardBody p={8}>
          <VStack spacing={6} align="stretch">
            <Heading as="h1" size="lg" textAlign="center">
              Pokladny pro vybranou společnost
            </Heading>
            {loading ? (
              <Spinner size="xl" />
            ) : cashRegisters.length === 0 ? (
              <Text textAlign="center">Žádné pokladny nenalezeny.</Text>
            ) : (
              cashRegisters.map((register) => (
                <Box
                  key={register.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  bg={register.selected === 1 ? selectedRegisterBg : "transparent"} // Use the color mode aware background color
                >
                  <HStack spacing={4}>
                    {/* Radio pro výběr hlavní pokladny */}
                    <Radio
                      isChecked={register.selected === 1}
                      onChange={() => handleSelectRegister(register.id)}
                    />
                    <FormControl isRequired>
                      <FormLabel>Název pokladny</FormLabel>
                      <Input
                        value={register.cash_register_name}
                        onChange={(e) =>
                          handleChange(register.id, "cash_register_name", e.target.value)
                        }
                        placeholder="Zadejte název pokladny"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Měna</FormLabel>
                      <Select
                        value={register.currency}
                        onChange={(e) =>
                          handleChange(register.id, "currency", e.target.value)
                        }
                      >
                        <option value="CZK">CZK</option>
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                      </Select>
                    </FormControl>

                    <IconButton
                      aria-label="Odstranit pokladnu"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => handleRemoveRegister(register.id, register.isNew)}
                    />
                  </HStack>
                </Box>
              ))
            )}

            <Divider />

            <HStack spacing={4} justify="center">
              <Button colorScheme="teal" onClick={handleAddRegister}>
                Přidat další pokladnu
              </Button>
              <Button colorScheme="blue" onClick={handleSaveAll}>
                Uložit změny
              </Button>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );

};

export default CashRegisters;
