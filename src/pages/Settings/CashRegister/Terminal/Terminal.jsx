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
  Radio,
  RadioGroup,
  Stack,
  Spinner,
  Text,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import useTerminals from "./useTerminal";

const Terminal = ({ selectedCompanyId }) => {
  const {
    terminals,
    cashRegisters,
    loading,
    handleAddTerminal,
    handleSelectTerminal,
    handleSaveAll,
    handleRemoveTerminal,
    handleChange,
  } = useTerminals(selectedCompanyId);

  const selectedTerminalBg = useColorModeValue("green.50", "green.900");

  return (
    <Container maxW="1200px" py={10}>
      <Card
        bg={useColorModeValue("white", "gray.800")}
        boxShadow="lg"
        borderRadius="xl"
      >
        <CardBody p={8}>
          <VStack spacing={6} align="stretch">
            <Heading as="h1" size="lg" textAlign="center">
              Terminály
            </Heading>
            {loading ? (
              <Spinner size="xl" />
            ) : terminals.length === 0 ? (
              <Text textAlign="center">Žádné terminály nenalezeny.</Text>
            ) : (
              terminals.map((terminal) => (
                <Box
                  key={terminal.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  bg={terminal.selected ? selectedTerminalBg : "transparent"}
                >
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Název terminálu</FormLabel>
                      <Input
                        value={terminal.terminal_name}
                        onChange={(e) =>
                          handleChange(terminal.id, "terminal_name", e.target.value)
                        }
                        placeholder="Zadejte název terminálu"
                      />
                    </FormControl>

                    <FormControl as="fieldset">
                      <FormLabel as="legend">Typ prodeje</FormLabel>
                      <RadioGroup
                        onChange={(value) =>
                          handleChange(terminal.id, "sales_type", value)
                        }
                        value={terminal.sales_type}
                      >
                        <Stack direction="row">
                          <Radio value="xfact">Přímo z Xfact</Radio>
                          <Radio value="extern">Mimo Xfact</Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>

                    {/* Výběr pokladny je nyní vždy dostupný, label se mění podle volby */}
                    <FormControl isRequired>
                      <FormLabel>
                     Propojení pokladny
                      </FormLabel>
                      <Select
                        placeholder="Vyberte pokladnu"
                        value={terminal.cash_register_id || ""}
                        onChange={(e) =>
                          handleChange(terminal.id, "cash_register_id", e.target.value)
                        }
                      >
                        {cashRegisters.map((cr) => (
                          <option key={cr.id} value={cr.id}>
                            {cr.cash_register_name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <HStack justify="space-between">
                      <Button
                        size="sm"
                        colorScheme="teal"
                        onClick={() => handleSelectTerminal(terminal.id)}
                      >
                        Nastavit jako výchozí
                      </Button>
                      <IconButton
                        aria-label="Odstranit terminál"
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        size="sm"
                        onClick={() =>
                          handleRemoveTerminal(terminal.id, terminal.isNew)
                        }
                      />
                    </HStack>
                  </VStack>
                </Box>
              ))
            )}

            <Divider />

            <HStack spacing={4} justify="center">
              <Button colorScheme="teal" onClick={handleAddTerminal}>
                Přidat terminál
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

export default Terminal;
