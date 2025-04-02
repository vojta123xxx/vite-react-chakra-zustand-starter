import React, { useState, useEffect } from "react";
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    useDisclosure,
} from "@chakra-ui/react";

const AddressModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [address, setAddress] = useState({
        name: "",
        street: "",
        postal_code: "",
        city: "",
        country: "Česká republika",
    });

    useEffect(() => {
        if (initialData) {
            setAddress(initialData);
        } else {
            setAddress({
                name: "",
                street: "",
                postal_code: "",
                city: "",
                country: "Česká republika",
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        const { name, street, postal_code, city, country } = address;
        if (!name || !street || !postal_code || !city || !country) {
            alert("Všechna pole jsou povinná.");
            return;
        }
        onSave(address);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{initialData ? "Upravit adresu" : "Přidat novou adresu"}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mb={3}>
                        <FormLabel>Název</FormLabel>
                        <Input name="name" value={address.name} onChange={handleChange} placeholder="Název adresy" />
                    </FormControl>
                    <FormControl mb={3}>
                        <FormLabel>Ulice</FormLabel>
                        <Input name="street" value={address.street} onChange={handleChange} placeholder="Ulice" />
                    </FormControl>
                    <FormControl mb={3}>
                        <FormLabel>PSČ</FormLabel>
                        <Input name="postal_code" value={address.postal_code} onChange={handleChange} placeholder="PSČ" />
                    </FormControl>
                    <FormControl mb={3}>
                        <FormLabel>Město</FormLabel>
                        <Input name="city" value={address.city} onChange={handleChange} placeholder="Město" />
                    </FormControl>
                    <FormControl mb={3}>
                        <FormLabel>Země</FormLabel>
                        <Input name="country" value={address.country} readOnly placeholder="Země" />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                        Uložit
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Zrušit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddressModal;