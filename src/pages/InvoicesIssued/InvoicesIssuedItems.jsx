import React from "react";
import {
  Box,
  Button,
  Input,
  Text,
  Flex,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  NumberInput,

  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Stack,
  HStack,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";

const InvoicesIssuedItems = ({ itemsData, onChange }) => {
  const { items, discountPercentage, totalBeforeDiscount, discountValue, finalTotal } = itemsData;
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const highlightColor = useColorModeValue("brand.500", "brand.300");

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value || 0);
  };

  const recalcTotals = (newItems, newDiscount) => {
    const computedTotalBeforeDiscount = newItems.reduce((acc, item) => acc + Number(item.total || 0), 0);
    const computedDiscountValue = parseFloat((computedTotalBeforeDiscount * newDiscount / 100).toFixed(2));
    const roundingAdjustment = 0;
    const computedFinalTotal = computedTotalBeforeDiscount - computedDiscountValue + roundingAdjustment;

    return {
      items: newItems,
      discountPercentage: newDiscount,
      totalBeforeDiscount: computedTotalBeforeDiscount,
      discountValue: computedDiscountValue,
      finalTotal: computedFinalTotal,
    };
  };

  const handleItemChange = (id, field, value) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        const price = parseFloat(updated.price) || 0;
        const quantity = parseFloat(updated.quantity) || 0;
        updated.total = (price * quantity).toFixed(2);
        return updated;
      }
      return item;
    });

    onChange(recalcTotals(updatedItems, discountPercentage));
  };

  const handleDiscountChange = (newValue) => {
    const newDiscount = newValue === "" ? 0 : parseFloat(newValue);
    onChange(recalcTotals(items, isNaN(newDiscount) ? 0 : newDiscount));
  };

  const addNewItem = () => {
    const newItem = {
      id: Date.now(),
      name: "",
      price: "",
      quantity: 1,
      unit: "ks",
      total: 0,
    };
    onChange(recalcTotals([...items, newItem], discountPercentage));
  };

  const removeItem = (id) => {
    onChange(recalcTotals(items.filter((item) => item.id !== id), discountPercentage));
  };

  return (
    <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} boxShadow="sm">
      <CardHeader>
        <Heading size="md">Položky faktury</Heading>
      </CardHeader>
      <CardBody>
        <Stack spacing={6}>
          <Box overflowX="auto">
            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  <Th>Položka</Th>
                  <Th textAlign="right">Cena</Th>
                  <Th textAlign="right">Množství</Th>
                  <Th textAlign="right">Jednotka</Th>
                  <Th textAlign="right">Celkem</Th>
                  <Th width="50px"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {items.map((item) => (
                  <Tr key={item.id} _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}>
                    <Td>
                      <Input
                        placeholder="Název položky"
                        value={item.name}
                        onChange={(e) => handleItemChange(item.id, "name", e.target.value)}
                        variant="flushed"
                        focusBorderColor={highlightColor}
                      />
                    </Td>
                    <Td>
                      <NumberInput
                        value={item.price}
                        onChange={(value) => handleItemChange(item.id, "price", value)}
                        precision={2}
                        min={0}
                      >
                        <NumberInputField textAlign="right" variant="flushed" focusBorderColor={highlightColor} />
                      </NumberInput>
                    </Td>
                    <Td>
                      <NumberInput
                        value={item.quantity}
                        onChange={(value) => handleItemChange(item.id, "quantity", value)}
                        min={0}
                        step={1}
                      >
                        <NumberInputField textAlign="right" variant="flushed" focusBorderColor={highlightColor} />
                      </NumberInput>
                    </Td>
                    <Td>
                      <Input
                        value={item.unit}
                        onChange={(e) => handleItemChange(item.id, "unit", e.target.value)}
                        textAlign="right"
                        variant="flushed"
                        focusBorderColor={highlightColor}
                        width="70px"
                      />
                    </Td>
                    <Td textAlign="right" fontWeight="medium">
                      {formatCurrency(item.total)}
                    </Td>
                    <Td textAlign="right">
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        aria-label="Odstranit položku"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => removeItem(item.id)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          <Flex justify="space-between" mt={4}>
            <HStack spacing={4}>
              <Button
                onClick={addNewItem}
                leftIcon={<AddIcon />}
                colorScheme="brand"
                size="sm"
              >
                Přidat řádek
              </Button>
              <Button
                variant="outline"
                size="sm"
                colorScheme="brand"
              >
                Přidat z ceníku
              </Button>
            </HStack>
          </Flex>

          <Box mt={8} ml="auto" width={{ base: "100%", md: "300px" }}>
            <Stack spacing={3}>
              <Flex justify="space-between" align="center">
                <Text>Sleva:</Text>
                <HStack width="120px">
                  <NumberInput
                    value={discountPercentage}
                    onChange={handleDiscountChange}
                    min={0}
                    max={100}
                    precision={2}
                  >
                    <NumberInputField textAlign="right" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text>%</Text>
                </HStack>
              </Flex>

              <Divider borderColor={borderColor} />

              <Flex justify="space-between">
                <Text color={textColor}>Cena před slevou:</Text>
                <Text>{formatCurrency(totalBeforeDiscount)}</Text>
              </Flex>

              <Flex justify="space-between" color="red.500">
                <Text>Sleva:</Text>
                <Text>-{formatCurrency(discountValue)}</Text>
              </Flex>

              <Flex justify="space-between">
                <Text color={textColor}>Zaokrouhlení:</Text>
                <Text>{formatCurrency(0)}</Text>
              </Flex>

              <Divider borderColor={borderColor} />

              <Flex justify="space-between" fontWeight="bold" fontSize="lg">
                <Text>Celkem k úhradě:</Text>
                <Text color={highlightColor}>{formatCurrency(finalTotal)}</Text>
              </Flex>
            </Stack>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default InvoicesIssuedItems;