// src/pages/MyCompany.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import CustomTabs from "./Tabs"; // upravte si cestu podle potřeby
import axiosInstance from "../api/../../../api/axiosInstance";

const MyCashRegister = () => {
  const bgColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.800", "white");

  const [selectedCompany, setSelectedCompany] = useState("Vyberte firmu");
  const [selectedId, setSelectedId] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(false);

  useEffect(() => {
    const savedCompany = localStorage.getItem("selectedCompany");
    const savedCompanyId = localStorage.getItem("selectedCompanyId");

    if (savedCompany && savedCompanyId) {
      setSelectedCompany(savedCompany);
      setSelectedId(Number(savedCompanyId));
      fetchCompanyData(Number(savedCompanyId));
    }
  }, []);

  const fetchCompanyData = async (id) => {
    setLoadingCompany(true);
    try {
      const response = await axiosInstance.get(`/company/fetch/${id}`);
      setCompanyData(response.data);
    } catch (error) {
      console.error("❌ Chyba při načítání údajů o firmě:", error);
    } finally {
      setLoadingCompany(false);
    }
  };

  return (
    <Container maxW="100%">
      <Heading mb={8} textAlign="center" color={textColor} fontSize="2xl">
        Pokladna
      </Heading>
      <Box bg={bgColor} borderRadius="xl" boxShadow="xl" p={6}>
        <Flex justify="center" mb={6}>
          {selectedCompany !== "Vyberte firmu" ? (
            <Text fontSize="lg">{selectedCompany}</Text>
          ) : (
            <Text fontSize="lg" color="red.500">
              Nebyla vybrána žádná společnost.
            </Text>
          )}
        </Flex>
        <CustomTabs
          companyData={companyData}
          loadingCompany={loadingCompany}
          selectedId={selectedId}
        />
      </Box>
    </Container>
  );
};

export default MyCashRegister;
