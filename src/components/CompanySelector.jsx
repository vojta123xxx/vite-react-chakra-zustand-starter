import { useState, useEffect } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  Tooltip,
  Flex,
  Spinner,
  Box,
} from "@chakra-ui/react";
import { ChevronDownIcon, CheckIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const CompanySelector = ({ onCompanySelect }) => {
  const [selectedCompany, setSelectedCompany] = useState(
    () => localStorage.getItem("selectedCompany") || "Vyberte firmu"
  );
  const [selectedId, setSelectedId] = useState(() => {
    const saved = localStorage.getItem("selectedCompanyId");
    return saved ? Number(saved) : null;
  });
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    try {
      const response = await axiosInstance.get("/company");
      const data = response.data;
      if (Array.isArray(data)) {
        setCompanies(data);
        if (data.length === 1 && !selectedId) {
          handleCompanySelect(data[0].label, data[0].value, false);
        }
      }
    } catch (error) {
      console.error("❌ Chyba při načítání firem:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCompanySelect = (label, id, manual = false) => {
    setSelectedCompany(label);
    setSelectedId(id);
    localStorage.setItem("selectedCompany", label);
    localStorage.setItem("selectedCompanyId", id);
    if (onCompanySelect) onCompanySelect(id); // Voláme callback pro aktualizaci vybrané firmy

    if (manual) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        navigate("/dashboard");
      }, 1000);
    }
  };

  // Pouze aktualizuje seznam firem z API, nemění vybranou firmu
  const refreshCompanies = async () => {
    try {
      const response = await axiosInstance.get("/company");
      const data = response.data;
      if (Array.isArray(data)) {
        setCompanies(data);
      }
    } catch (error) {
      console.error("❌ Chyba při aktualizaci seznamu firem:", error);
    }
  };

  return {
    companies,
    selectedCompany,
    selectedId,
    handleCompanySelect,
    refreshCompanies, // Nová funkce pouze pro aktualizaci seznamu
    renderSelector: () => (
      <Flex align="center" justify="flex-end" gap={4}>
        <Menu>
          <Tooltip label="Vyberte firmu" hasArrow>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {selectedCompany}
            </MenuButton>
          </Tooltip>
          <MenuList>
            {companies.map((company) => (
              <MenuItem
                key={company.value}
                onClick={() =>
                  handleCompanySelect(company.label, company.value, true)
                }
                bg={selectedId === company.value ? "blue.100" : "transparent"}
                _hover={{
                  bg: selectedId === company.value ? "blue.200" : "gray.100",
                }}
              >
                <Flex align="center" justify="space-between" width="100%">
                  {company.label}
                  {selectedId === company.value && (
                    <Box color="blue.500" ml={2}>
                      <CheckIcon />
                    </Box>
                  )}
                </Flex>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        {isLoading && <Spinner size="sm" speed="0.6s" color="blue.500" />}
      </Flex>
    ),
  };
};

export default CompanySelector;