import React, { useState, useEffect, useRef } from "react";
import {
  Input,
  Box,
  List,
  ListItem,
  Text,
  InputGroup,
  InputLeftElement,
  Spinner,
  Flex,
  useColorModeValue,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import axiosInstance from "../../api/axiosInstance";

function AresAutocomplete({
  onSelect,
  value = "",
  onChange,
  placeholder = "Hledejte podle názvu...",
}) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stavDph, setStavDph] = useState(null);
  const ref = useRef();

  const bgColor = useColorModeValue("white", "gray.800");
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.300", "gray.600");

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    let isMounted = true;
    setError(null);

    if (query.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const fetchAres = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/autocomplete/search-ares`, {
          params: { q: query },
        });
        const data = res.data;
        if (isMounted) {
          setResults(data);
          setShowDropdown(isTyping);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Chyba při volání search-ares:", err);
        if (isMounted) {
          setError("Nastala chyba při načítání dat");
          setIsLoading(false);
        }
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchAres();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(debounceTimer);
    };
  }, [query, isTyping]);

  const handleSelect = async (item) => {
    const selectedName = item.obchodniJmeno || "";
    setQuery(selectedName);
    onChange(selectedName);
    onSelect(item);
    setIsTyping(false);
    setShowDropdown(false);
    setStavDph(null); // reset stavu před kontrolou

    if (item.dic) {
      try {
        const res = await axiosInstance.get(`/autocomplete/check-dph`, {
          params: { dic: item.dic },
        });
        setStavDph(res.data.stav);
      } catch (err) {
        console.error("Chyba při načítání DPH stavu:", err);
        setStavDph("chyba");
      }
    } else {
      setStavDph(null);
    }
  };

  return (
    <Box position="relative" ref={ref} width="100%">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          {isLoading ? <Spinner size="sm" /> : <SearchIcon />}
        </InputLeftElement>
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsTyping(true);
            onChange(e.target.value);
          }}
          onBlur={() => {
            setTimeout(() => setShowDropdown(false), 200);
          }}
          placeholder={placeholder}
          borderRadius="md"
          bg={bgColor}
          borderColor={borderColor}
        />
      </InputGroup>

      {showDropdown && isTyping && (
        <Box
          position="absolute"
          zIndex="1"
          width="100%"
          mt="2"
          bg={bgColor}
          boxShadow="md"
          borderRadius="md"
          border="1px solid"
          borderColor={borderColor}
        >
          {error && <Box p={3} color="red.500">{error}</Box>}
          {results.length === 0 && !isLoading && !error && (
            <Box p={3}>Nenalezeny žádné výsledky</Box>
          )}
          <List spacing={0}>
            {results.map((item, index) => (
              <ListItem
                key={index}
                py={2}
                px={4}
                cursor="pointer"
                _hover={{ bg: hoverBgColor }}
                onClick={() => handleSelect(item)}
              >
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="medium">{item.obchodniJmeno}</Text>
                    {item.sidlo && item.sidlo.textovaAdresa && (
                      <Text fontSize="sm">{item.sidlo.textovaAdresa}</Text>
                    )}
                  </Box>
                </Flex>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {stavDph && (
        <Box mt={2}>
          <Tag
            size="md"
            colorScheme={
              stavDph.includes("Spolehlivý")
                ? "green"
                : stavDph.includes("Nespolehlivý")
                ? "red"
                : "gray"
            }
          >
            <TagLabel>{stavDph}</TagLabel>
          </Tag>
        </Box>
      )}
    </Box>
  );
}

export default AresAutocomplete;
