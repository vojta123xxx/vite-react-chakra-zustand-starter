// src/pages/contacts/ContactList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Spinner,
  Text,
  Button,
  IconButton,
  Flex,
  useToast,
  Badge,
  Tooltip,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Card,
} from "@chakra-ui/react";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import axiosInstance from "../../api/axiosInstance";
import DataTable from "../../components/ui/Datatable/DataTable";
import EmptyState from "../../components/ui/EmptyState"; // nebo podle vaší struktury složek
import { mdiAccountGroup } from "@mdi/js";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const savedCompanyId = localStorage.getItem("selectedCompanyId");
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [contactToDelete, setContactToDelete] = useState(null);
  const cancelRef = React.useRef();

  useEffect(() => {
    if (!savedCompanyId) return;
    const fetchContacts = async () => {
      try {
        const response = await axiosInstance.get(`/contacts/${savedCompanyId}`);
        const data = response.data;
        setContacts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Chyba při načítání kontaktů:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [savedCompanyId]);

  const handleDelete = async () => {
    if (!contactToDelete) return;
    try {
      await axiosInstance.delete(`/contacts/${contactToDelete}`);
      setContacts((prev) => prev.filter((c) => c.id !== contactToDelete));
      toast({
        title: "Kontakt smazán",
        description: "Kontakt byl úspěšně odstraněn.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      const msg = err.response?.data?.msg || err.message;
      toast({
        title: "Chyba",
        description: msg,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setContactToDelete(null);
      onClose();
    }
  };

  const openDeleteDialog = (e, id) => {
    e.stopPropagation();
    setContactToDelete(id);
    onOpen();
  };

  // Definice sloupců pro DataTable
  const contactColumns = [
    { key: "company_name", header: "Jméno/Firma" },
    {
      key: "ico",
      header: "IČO/DIČ",
      render: (value, row) => (
        <>
          {row.ico && <Text>IČO: {row.ico}</Text>}
          {row.dic && <Text>DIČ: {row.dic}</Text>}
        </>
      ),
    },
    {
      key: "contact_person",
      header: "Kontaktní osoba",
      render: (value, row) =>
        row.contact_firstname || row.contact_lastname ? (
          <Text>
            {row.contact_firstname} {row.contact_lastname}
            {row.contact_title && `, ${row.contact_title}`}
          </Text>
        ) : (
          <Badge colorScheme="gray">Nevyplněno</Badge>
        ),
    },
    {
      key: "contact",
      header: "Kontakt",
      render: (value, row) => (
        <>
          {row.email && <Text>{row.email}</Text>}
          {row.phone && <Text>{row.phone}</Text>}
        </>
      ),
    },
    {
      key: "actions",
      header: "Akce",
      align: "right",
      render: (_, row) => (
        <Flex justify="flex-end" gap={2} onClick={(e) => e.stopPropagation()}>
          <Tooltip label="Upravit" placement="top">
            <IconButton
              icon={<FiEdit />}
              aria-label="Upravit"
              colorScheme="blue"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/my/contacts/edit/${row.id}`);
              }}
            />
          </Tooltip>
          <Tooltip label="Smazat" placement="top">
            <IconButton
              icon={<FiTrash2 />}
              aria-label="Smazat"
              colorScheme="red"
              variant="outline"
              size="sm"
              onClick={(e) => openDeleteDialog(e, row.id)}
            />
          </Tooltip>
        </Flex>
      ),
    },
  ];

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="xl">Kontakty</Heading>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="brand"
          onClick={() => navigate("/my/contacts/create")}
        >
          Nový kontakt
        </Button>
      </Flex>

      {!savedCompanyId ? (
        <Box
          p={6}
          bg="red.50"
          _dark={{ bg: "red.900", borderColor: "red.700" }}
          borderRadius="md"
          borderWidth="1px"
          borderColor="red.100"
        >
          <Heading size="md" color="red.600" _dark={{ color: "red.300" }}>
            Nebyla vybrána žádná společnost
          </Heading>
          <Text mt={2}>Pro zobrazení kontaktů prosím vyberte společnost.</Text>
        </Box>
      ) : loading ? (
        <Flex direction="column" align="center" justify="center" minH="200px">
          <Spinner size="xl" thickness="4px" color="brand.500" />
          <Text mt={4} fontSize="lg">
            Načítání kontaktů...
          </Text>
        </Flex>
      ) : error ? (
        <Box
          p={6}
          bg="red.50"
          _dark={{ bg: "red.900", borderColor: "red.700" }}
          borderRadius="md"
          borderWidth="1px"
          borderColor="red.100"
        >
          <Heading size="md" color="red.600" _dark={{ color: "red.300" }}>
            {error}
          </Heading>
        </Box>
      ) : contacts.length === 0 ? (
  <Flex direction="column"  >
    <EmptyState
      icon={mdiAccountGroup}
      heading="Žádné kontakty nenalezeny"
      message="Seznam vašich odběratelů na jednom místě. Umožňuje zaznamenat i další informace, které nejsou nezbytné pro fakturaci."
      buttonText="Vytvořit první kontakt"
      buttonAction={() => navigate("/my/contacts/create")}
      buttonIcon={FiPlus}
    />
  </Flex>
) : (
  <Box
    borderWidth="1px"
    borderRadius="lg"
    overflow="hidden"
    boxShadow="sm"
    _dark={{ borderColor: "gray.600" }}
  >
    <DataTable
      columns={contactColumns}
      data={contacts}
      onRowClick={(row) => navigate(`/my/contacts/edit/${row.id}`)}
    />
  </Box>
)}


      {/* Dialog pro potvrzení smazání */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Smazat kontakt
            </AlertDialogHeader>
            <AlertDialogBody>
              Opravdu chcete tento kontakt smazat? Tato akce je nevratná.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Zrušit
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Smazat
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ContactList;
