import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  HStack,
  Text,
  Flex,
  InputGroup,
  InputRightAddon,
  IconButton,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

const TemplateItems = ({ onChange, initialData }) => {
  const [items, setItems] = useState(
    initialData && initialData.items && initialData.items.length > 0
      ? initialData.items
      : [{ id: Date.now(), name: "", price: "", quantity: "", unit: "", total: 0 }]
  );
  const [discountPercentage, setDiscountPercentage] = useState(
    initialData ? initialData.discountPercentage : 0
  );
  const [isDirty, setIsDirty] = useState(false);
  const [totals, setTotals] = useState({
    totalBeforeDiscount: initialData?.totalBeforeDiscount || 0,
    discountValue: initialData?.discountValue || 0,
    finalTotal: initialData?.finalTotal || 0,
  });

  const formatCurrency = (value) => {
    return parseFloat(value).toLocaleString("cs-CZ", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    if (isDirty) {
      const computedTotalBeforeDiscount = items.reduce((acc, item) => acc + Number(item.total), 0);
      const computedDiscountValue = parseFloat((computedTotalBeforeDiscount * discountPercentage / 100).toFixed(2));
      const roundingAdjustment = 0;
      const computedFinalTotal = computedTotalBeforeDiscount - computedDiscountValue + roundingAdjustment;
      setTotals({
        totalBeforeDiscount: computedTotalBeforeDiscount,
        discountValue: computedDiscountValue,
        finalTotal: computedFinalTotal,
      });
    }
  }, [items, discountPercentage, isDirty]);

  useEffect(() => {
    if (onChange) {
      onChange({
        items,
        discountPercentage,
        totalBeforeDiscount: totals.totalBeforeDiscount,
        discountValue: totals.discountValue,
        roundingAdjustment: 0,
        finalTotal: totals.finalTotal,
      });
    }
  }, [items, discountPercentage, totals, onChange]);

  const handleItemChange = (id, field, value) => {
    setIsDirty(true);
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          const price = parseFloat(updatedItem.price) || 0;
          const quantity = parseFloat(updatedItem.quantity) || 0;
          updatedItem.total = price * quantity;
          return updatedItem;
        }
        return item;
      })
    );
  };

  const addNewItem = () => {
    setIsDirty(true);
    setItems((prevItems) => [
      ...prevItems,
      { id: Date.now(), name: "", price: "", quantity: "", unit: "", total: 0 },
    ]);
  };

  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <Box bg={bgColor} p={4} borderRadius="md" shadow="md">
      <Table variant="simple" size="md" mt={4}>
        <Thead>
          <Tr>
            <Th>Položka</Th>
            <Th>Cena</Th>
            <Th>Množství</Th>
            <Th>Jednotka</Th>
            <Th>Celkem</Th>
            <Th>Akce</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item) => (
            <Tr key={item.id}>
              <Td><Input placeholder="Název položky" value={item.name} onChange={(e) => handleItemChange(item.id, "name", e.target.value)} /></Td>
              <Td><Input placeholder="0.00" type="number" value={item.price} onChange={(e) => handleItemChange(item.id, "price", e.target.value)} /></Td>
              <Td><Input placeholder="0" type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, "quantity", e.target.value)} /></Td>
              <Td><Input placeholder="ks" value={item.unit} onChange={(e) => handleItemChange(item.id, "unit", e.target.value)} /></Td>
              <Td>{formatCurrency(item.total)} Kč</Td>
              <Td>
                <IconButton
                  icon={<DeleteIcon />}
                  size="sm"
                  aria-label="Odstranit položku"
                  variant="ghost"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex justify="flex-end" mt={4}>
        <Button onClick={addNewItem} variant="solid" colorScheme="teal" mr={4}>Nový řádek</Button>
        <Button variant="outline">Přidat položku z ceníku</Button>
      </Flex>
<Flex justify="flex-end" mt={6}>
  <Box w="200px">
    <Flex justify="space-between" align="center">
      <Text>Sleva (%):</Text>
      <Input
        type="number"
        value={discountPercentage}
        onChange={(e) => {
          setIsDirty(true);
          setDiscountPercentage(parseFloat(e.target.value) || 0);
        }}
      />
    </Flex>
  </Box>
</Flex>

      <Flex justify="space-between" mt={4}>
        <Text>Cena před slevou:</Text>
        <Text>{formatCurrency(totals.totalBeforeDiscount)} Kč</Text>
      </Flex>
      <Flex justify="space-between" color="red.500">
        <Text>Sleva:</Text>
        <Text>-{formatCurrency(totals.discountValue)} Kč</Text>
      </Flex>
      <Flex justify="space-between">
        <Text>Zaokrouhlení:</Text>
        <Text>{formatCurrency(0)} Kč</Text>
      </Flex>
      <Flex justify="space-between" fontWeight="bold" mt={4}>
        <Text>Cena celkem:</Text>
        <Text>{formatCurrency(totals.finalTotal)} Kč</Text>
      </Flex>
    </Box>
  );
};

export default TemplateItems;
