import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Heading,
  Spinner,
  Text,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useColorModeValue
} from '@chakra-ui/react';
import axiosInstance from '../../../api/axiosInstance'; // uprav dle struktury

const MyCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(localStorage.getItem('selectedCompanyId'));
    const hoverBg = useColorModeValue('gray.100', 'gray.700');

    useEffect(() => {
      const fetchCompanies = async () => {
  try {
    const response = await axiosInstance.get('/company');
    const data = response.data;

    if (Array.isArray(data) && data.length > 0) {
      setCompanies(data);

      if (data.length === 1 && !selectedId) {
        handleCompanySelect(data[0].label, data[0].value);
      }
    }
  } catch (error) {
    console.error('❌ Chyba při načítání firem:', error);
  } finally {
    setLoading(false);
  }
};


        fetchCompanies();
    }, [selectedId]);

    const handleCompanySelect = (label, value) => {
        localStorage.setItem('selectedCompanyId', value);
        setSelectedId(value);
        console.log(`✅ Vybraná společnost: ${label} (ID: ${value})`);
    };

    return (
        <ChakraProvider>
            <Box p={4}>
                <Heading size="lg" mb={4}>Seznam společností</Heading>
                {loading ? (
                    <>
                        <Spinner mt={2} />
                        <Text>Načítání...</Text>
                    </>
                ) : companies.length === 0 ? (
                    <Text>Žádné společnosti nenalezeny.</Text>
                ) : (
                    <TableContainer
                        border="1px"
                        borderColor={useColorModeValue("gray.200", "gray.700")}
                        borderRadius="md"
                        mb={4}
                    >
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Název společnosti</Th>
                                    <Th>Možnosti</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {companies.map((company) => (
                                    <Tr
                                        key={company.value}
                                        _hover={{ bg: hoverBg, cursor: "pointer" }}
                                    >
                                        <Td>{company.label}</Td>
                                        <Td>
                                            <Button
                                                size="sm"
                                                colorScheme="blue"
                                                onClick={() => handleCompanySelect(company.label, company.value)}
                                            >
                                                Vybrat
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </ChakraProvider>
    );
};

export default MyCompanies;
