import React, { useState } from "react";
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Radio,
    useColorModeValue,
    Button,
    useDisclosure,
} from "@chakra-ui/react";
import AddressModal from "./AddressModal";

const ContactDeliveryAdresses = ({
    deliveryAddresses,
    onAddAddress,
    onSelectAddress,
    selectedAddressId,
    onDeleteAddress,
}) => {
    const bg = useColorModeValue("white", "gray.800");
    const hoverBg = useColorModeValue("gray.100", "gray.600");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [editingAddress, setEditingAddress] = useState(null);

    const handleDeleteAddress = (address) => {
        if (address.is_primary === 1) {
            alert("Primární dodací adresu nelze smazat.");
            return;
        }
        if (window.confirm("Opravdu chcete smazat tuto dodací adresu?")) {
            onDeleteAddress(address.id);
        }
    };

    return (
        <Box>
            <Button onClick={() => { setEditingAddress(null); onOpen(); }} mb={4}>
                Přidat novou adresu
            </Button>
            {!deliveryAddresses || deliveryAddresses.length === 0 ? (
                <Box>Žádné dodací adresy nenalezeny.</Box>
            ) : (
                <Box bg={bg} p={4} borderRadius="md" boxShadow="sm">
                    <TableContainer>
                        <Table  colorScheme="gray">
                            <Thead>
                                <Tr>
                                    <Th>Název</Th>
                                    <Th>Ulice</Th>
                                    <Th>PSČ</Th>
                                    <Th>Město</Th>
                                    <Th>Země</Th>
                                    <Th>Vybrat</Th>
                                    <Th>Akce</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {deliveryAddresses.map((addr, index) => (
                                    <Tr
                                        key={index}
                                        cursor="pointer"
                                        _hover={{ bg: hoverBg }}
                                        onClick={() => {
                                            if (selectedAddressId !== addr.id) {
                                                onSelectAddress(addr.id);
                                            }
                                        }}
                                    >
                                        <Td>{addr.name}</Td>
                                        <Td>{addr.street}</Td>
                                        <Td>{addr.postal_code}</Td>
                                        <Td>{addr.city}</Td>
                                        <Td>{addr.country}</Td>
                                        <Td>
                                            <Radio
                                                isChecked={selectedAddressId === addr.id}
                                                onChange={() => {
                                                    if (selectedAddressId !== addr.id) {
                                                        onSelectAddress(addr.id);
                                                    }
                                                }}
                                            />
                                        </Td>
                                        <Td>
                                            {addr.is_primary !== 1 && (
                                                <Button
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingAddress(addr);
                                                        onOpen();
                                                    }}
                                                >
                                                    Upravit
                                                </Button>
                                            )}
                                            {addr.is_primary !== 1 && (
                                                <Button
                                                    colorScheme="red"
                                                    size="sm"
                                                    ml={2}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteAddress(addr);
                                                    }}
                                                >
                                                    Smazat
                                                </Button>
                                            )}
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            <AddressModal
                isOpen={isOpen}
                onClose={onClose}
                onSave={(address) => {
                    if (editingAddress) {
                        onAddAddress({ ...editingAddress, ...address });
                    } else {
                        onAddAddress(address);
                    }
                }}
                initialData={editingAddress}
            />
        </Box>
    );
};

export default ContactDeliveryAdresses;
