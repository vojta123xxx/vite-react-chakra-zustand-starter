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
  HStack,
  Icon,
} from "@chakra-ui/react";
import { FiEdit, FiTrash2, FiPlus, FiFileText } from "react-icons/fi";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import axiosInstance from "../../api/axiosInstance";
import DataTable from "../../components/ui/Datatable/DataTable";
import EmptyState from "../../components/ui/EmptyState"; // nebo podle vaší struktury složek
import { mdiFileDocumentOutline, mdiPlus,  } from "@mdi/js";
import PageHeader from "../../components/PageHeader"; // nebo podle vaší struktury složek

const InvoiceIssuedList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const savedCompanyId = localStorage.getItem("selectedCompanyId");
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  useEffect(() => {
    if (!savedCompanyId) {
      setLoading(false);
      return;
    }

    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get(`/invoices-issued/${savedCompanyId}`);
        setInvoices(response.data);
      } catch (err) {
        // Pokud je chyba jakákoliv, nastavíme prázdné pole faktur
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [savedCompanyId]);

  const handleDelete = async () => {
    if (!invoiceToDelete) return;

    try {
      await axiosInstance.delete(`/invoices-issued/${invoiceToDelete}`);

      setInvoices((prev) => prev.filter((i) => i.id !== invoiceToDelete));
      toast({
        title: "Faktura smazána",
        description: "Faktura byla úspěšně odstraněna.",
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
      setInvoiceToDelete(null);
      onClose();
    }
  };

  const openDeleteDialog = (e, id) => {
    e.stopPropagation();
    setInvoiceToDelete(id);
    onOpen();
  };

  const renderPaymentStatus = (isPaid) => {
    return isPaid === 1 ? (
      <Badge colorScheme="green" px={2} py={1} borderRadius="full">
        <HStack spacing={1}>
          <Icon as={CheckCircleIcon} boxSize={3} />
          <Text fontSize="sm">Zaplaceno</Text>
        </HStack>
      </Badge>
    ) : (
      <Badge colorScheme="orange" px={2} py={1} borderRadius="full">
        <HStack spacing={1}>
          <Icon as={WarningIcon} boxSize={3} />
          <Text fontSize="sm">Nezaplaceno</Text>
        </HStack>
      </Badge>
    );
  };

  const formatCurrency = (value) => {
    if (!value) return "Nevyplněno";
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Definice sloupců pro DataTable
  const invoiceColumns = [
    {
      key: "invoice_number",
      header: "Číslo faktury",
      render: (value) => value || "—",
    },
    { key: "issue_date", header: "Datum vystavení" },
    { key: "due_date", header: "Datum splatnosti" },
    {
      key: "contact_company_name",
      header: "Odběratel",
      render: (value) => value || "—",
    },
    {
      key: "total_after_discount",
      header: "Celková částka",
      align: "right",
      render: (value) => formatCurrency(value),
    },
    {
      key: "is_paid",
      header: "Stav",
      render: (value) => renderPaymentStatus(value),
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
                navigate(`/my/sales/invoicesissued/edit/${row.id}`);
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
<PageHeader
  title="Vydané faktury"
  iconPath={mdiFileDocumentOutline}
  buttonLabel="Nová faktura"
  onClick={() => navigate("/my/sales/invoicesissued/create")}
/>
 
     {!savedCompanyId ? (
        <Card variant="outline">
        
        </Card>
      ) : loading ? (
        <Flex direction="column" align="center" justify="center" minH="200px">
          <Spinner size="xl" thickness="4px" color="brand.500" />
          <Text mt={4} fontSize="lg">
            Načítání faktur...
          </Text>
        </Flex>
      ) : invoices.length === 0 ? (
      <EmptyState
  icon={mdiFileDocumentOutline}
  heading="Žádné faktury nenalezeny"
  message="Detailní a aktuální přehled všech vystavených faktur."
  buttonText="Vytvořit první fakturu"
  buttonAction={() => navigate("/my/sales/invoicesissued/create")}
  buttonIcon={mdiPlus}
/>
      ) : (
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="sm">
          <DataTable
            columns={invoiceColumns}
            data={invoices}
            onRowClick={(row) =>
              navigate(`/my/sales/invoicesissued/edit/${row.id}`)
            }
          />
        </Box>
      )}

      {/* Dialog pro potvrzení smazání */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Smazat fakturu
            </AlertDialogHeader>
            <AlertDialogBody>
              Opravdu chcete tuto fakturu smazat? Tato akce je nevratná.
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

export default InvoiceIssuedList;