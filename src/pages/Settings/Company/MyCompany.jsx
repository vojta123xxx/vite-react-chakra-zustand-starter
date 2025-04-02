import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import CustomTabs from "./Tabs";
import axiosInstance from "../../../api/axiosInstance"; // přizpůsob cestu podle umístění

const MyCompany = () => {
  const bgColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.800", "white");

  const [companyData, setCompanyData] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const savedCompanyId = localStorage.getItem("selectedCompanyId");

    if (savedCompanyId) {
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


  useEffect(() => {
    if (selectedId) fetchCompanyData(selectedId);
  }, [selectedId]);

  return (
    <Container maxW="100%">
      <Heading mb={8} textAlign="center" color={textColor} fontSize="2xl">
        Nastavení firmy
      </Heading>
      <Box bg={bgColor} borderRadius="xl" boxShadow="xl" p={6}>
        <Flex justify="center" mb={6} />

        <CustomTabs
          companyData={companyData}
          loadingCompany={loadingCompany}
          selectedId={selectedId}
        />
      </Box>
    </Container>
  );
};

export default MyCompany;
