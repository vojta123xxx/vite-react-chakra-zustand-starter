import React from "react";
import {
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,

} from "@chakra-ui/react";
import { FaUserPlus } from "react-icons/fa"; // Import ikony
import ContactCreate from "./ContactCreate";

export default function ContactCreateModal({ onContactCreated }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
    
        <IconButton
                colorScheme="teal"
                icon={<FaUserPlus />} // Ikona pro vytvoření uživatele
                onClick={onOpen}
                aria-label="Vytvořit kontakt"
            />
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Vytvořit kontakt</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <ContactCreate onContactCreated={onContactCreated} onClose={onClose} />
                    </ModalBody>
               
                </ModalContent>
            </Modal>
        </>
    );
}
