import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Text } from '@chakra-ui/react';
import InvoiceForm from './InvoiceForm';

const InvoiceModal = ({ isOpen, onClose, handleSave, handleCancel, tempInvoiceNumber, setTempInvoiceNumber, tempInvoiceDate, setTempInvoiceDate, borderColor, textColor, labelColor, generatedInvoiceNumber }) => {
    return (
        <Modal isOpen={isOpen} onClose={handleCancel}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader color={labelColor}>Upravit doklad </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <InvoiceForm
                        invoiceNumber={tempInvoiceNumber}
                        invoiceDate={tempInvoiceDate}
                        setInvoiceNumber={setTempInvoiceNumber}
                        setInvoiceDate={setTempInvoiceDate}
                        borderColor={borderColor}
                        textColor={textColor}
                        labelColor={labelColor}
                    />
                    {/* Zobrazení generovaného čísla dokladu */}
                    <Text mt={4} fontSize="lg" fontWeight="bold" color={textColor}>
                        Nové číslo dokladu: {generatedInvoiceNumber}
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <Button mr={3} onClick={handleSave} bg="brand.300" _hover={{ bg: 'brand.400' }}>
                        Uložit
                    </Button>
                    <Button variant="ghost" onClick={handleCancel}>
                        Zrušit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default InvoiceModal;
