import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Select } from "@chakra-ui/react";
import axiosInstance from "../../api/axiosInstance"; // uprav dle cesty

const SalesTemplatesDropdownSelect = ({ savedCompanyId, invoiceType, onSelect }) => {
  const [saleTemplates, setSaleTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  useEffect(() => {
    const fetchSaleTemplates = async () => {
      try {
        let url = `/sale-templates/${savedCompanyId}`;
        if (invoiceType) {
          url += `?invoice_type=${invoiceType}`;
        }

        const response = await axiosInstance.get(url);
        const data = response.data;
        setSaleTemplates(Array.isArray(data) ? data : []);
      } catch (err) {
        // Při chybě nastavíme prázdný seznam a nic víc
        setSaleTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleTemplates();
  }, [savedCompanyId, invoiceType]);

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Select
        size="sm"
        placeholder="Vyberte šablonu"
        value={selectedTemplate}
        onChange={(e) => {
          const value = e.target.value;
          setSelectedTemplate(value);
          onSelect?.(value);
        }}
      >
        {saleTemplates.map((template) => (
          <option key={template.id} value={template.id}>
            {template.name}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default SalesTemplatesDropdownSelect;