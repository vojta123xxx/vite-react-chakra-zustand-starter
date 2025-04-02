// src/pages/sales/templates/SaleTemplatesList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Spinner,
  Button,
  Flex,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import Icon from "@mdi/react"; // DŮLEŽITÉ: Ikonu importujeme z "@mdi/react"
import axiosInstance from "../../../api/axiosInstance";
import DataTable from "../../../components/ui/Datatable/DataTable";
import EmptyState from "../../../components/ui/EmptyState";
import PageHeader from "../../../components/PageHeader";
import {
  mdiViewDashboardOutline,
  mdiFileDocumentOutline,
  mdiPlus,
} from "@mdi/js";

export default function SaleTemplatesList({ invoiceType }) {
  const [saleTemplates, setSaleTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const savedCompanyId = localStorage.getItem("selectedCompanyId");
  const navigate = useNavigate();
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    if (!savedCompanyId) {
      setError("Žádná společnost nebyla vybrána.");
      setLoading(false);
      return;
    }

    const fetchSaleTemplates = async () => {
      try {
        let url = `/sale-templates/${savedCompanyId}`;
        if (invoiceType) {
          url += `?invoice_type=${invoiceType}`;
        }

        const response = await axiosInstance.get(url);
        setSaleTemplates(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleTemplates();
  }, [savedCompanyId, invoiceType]);

  // Definice sloupců pro DataTable
  const templateColumns = [
    {
      key: "name",
      header: "Název šablony",
    },
    {
      key: "invoice_type",
      header: "Typ",
      render: (value) => {
        if (value === "faktura_vydana") return "Faktura vydaná";
        if (value === "zalohova_faktura") return "Zálohová faktura";
        if (value === "cenova_nabidka") return "Cenová nabídka";
        return "Nevyplněno";
      },
    },
    {
      key: "order_number",
      header: "Číslo objednávky",
      render: (value) => value || "Nevyplněno",
    },
    {
      key: "company_name",
      header: "Název společnosti",
      render: (value) => value || "Nevyplněno",
    },
    {
      key: "maturity_days",
      header: "Splatnost",
      render: (value) => value || "Nevyplněno",
    },
    {
      key: "total_after_discount",
      header: "Cena",
      render: (value) => value || "Nevyplněno",
    },
    {
      key: "discount",
      header: "Sleva",
      render: (value) => (value ?? "0") + "%",
    },
    {
      key: "actions",
      header: "Možnosti",
      align: "right",
      render: (_, row) => (
        <Button
          size="sm"
          colorScheme="blue"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/my/sales/templates/edit/${row.id}`);
          }}
        >
          Upravit
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="200px">
        <Spinner />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box p={6}>
        <Heading size="md" color="red.500">
          Chyba: {error}
        </Heading>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <PageHeader
        title={
          invoiceType === "zalohova_faktura"
            ? "Zálohové faktury"
            : "Faktury vydané"
        }
        iconPath={mdiFileDocumentOutline}
        buttonLabel="Nová šablona"
        onClick={() => navigate("/my/sales/templates/create")}
      />

      {saleTemplates.length === 0 ? (
        <EmptyState
          icon={mdiViewDashboardOutline}
          heading="Žádné šablony nenalezeny"
          message="Detailní a aktuální přehled všech šablon pro doklady."
          buttonText="Vytvořit první šablonu"
          buttonAction={() => navigate("/my/sales/templates/create")}
          buttonIcon={mdiPlus}
        />
      ) : (
        <DataTable
          columns={templateColumns}
          data={saleTemplates}
          onRowClick={(row) => navigate(`/my/sales/templates/edit/${row.id}`)}
        />
      )}
    </Box>
  );
}
