import React, { useState, useEffect } from 'react';
import { 
  Container, Heading, FormControl, FormLabel, Select, Button, Box, VStack, 
  NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, 
  useColorModeValue 
} from '@chakra-ui/react';
import useToastNotification from '../../../components/hooks/useToastNotification'; // Import hooku
import axiosInstance from "../../../api/axiosInstance";

const DefaultSettings = ({ selectedCompanyId }) => {
  const [settings, setSettings] = useState({
    rounding: 'nezaokrouhlovat',
    paymentMethod: 'dobírka',
    invoiceDue: 14,
    offerValidity: 30,
    constantSymbol: ''
  });
  const [loading, setLoading] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const showToast = useToastNotification(); // Získání funkce pro toast

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

 useEffect(() => {
  if (!selectedCompanyId) return;
  setLoading(true);
  axiosInstance
    .get(`/api/settings/${selectedCompanyId}`)
    .then(res => {
      const data = res.data;
      if (data) {
        setSettings({
          rounding: data.rounding || 'nezaokrouhlovat',
          paymentMethod: data.paymentMethod || 'dobírka',
          invoiceDue: data.invoiceDue || 14,
          offerValidity: data.offerValidity || 30,
          constantSymbol: data.constantSymbol || ''
        });
        if (data.id) {
          setSavedId(data.id);
        }
      }
    })
    .catch(err => console.error("Chyba při načítání nastavení:", err))
    .finally(() => setLoading(false));
}, [selectedCompanyId]);


  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

 const handleSave = () => {
  if (!selectedCompanyId) {
    showToast({
      title: "Chyba",
      description: "Nejprve vyberte firmu!",
      status: "error",
    });
    return;
  }

  axiosInstance
    .post("/api/settings", {
      ...settings,
      company_id: selectedCompanyId
    })
    .then(res => {
      const data = res.data;
      if (data.id) {
        setSavedId(data.id);
      }
      showToast({
        title: "Úspěch",
        description: "Nastavení bylo úspěšně uloženo.",
        status: "success",
      });
    })
    .catch(err => {
      console.error("Chyba při ukládání nastavení:", err);
      showToast({
        title: "Chyba",
        description: "Nepodařilo se uložit nastavení.",
        status: "error",
      });
    });
};

  if (loading) return <div>Načítání nastavení...</div>;

  return (
    <Container maxW="lg" py={8} px={6} borderRadius="lg" boxShadow="lg" bg={bgColor} borderColor={borderColor} borderWidth="1px">
      <Heading size="lg" mb={6} textAlign="center">Nastavení</Heading>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="md" mb={3}>Cena</Heading>
          <FormControl>
            <FormLabel>Zaokrouhlení</FormLabel>
            <Select value={settings.rounding} onChange={(e) => handleChange('rounding', e.target.value)}>
              <option value="nezaokrouhlovat">Nezaokrouhlovat</option>
              <option value="zaokrouhlovat">Zaokrouhlovat vždy</option>
            </Select>
          </FormControl>
        </Box>

        <Box>
          <Heading size="md" mb={3}>Platební údaje</Heading>
          <FormControl>
            <FormLabel>Způsob úhrady</FormLabel>
            <Select value={settings.paymentMethod} onChange={(e) => handleChange('paymentMethod', e.target.value)}>
              <option value="dobírka">Dobírka</option>
              <option value="převodem">Převodem</option>
              <option value="kartou">Kartou</option>
              <option value="hotově">Hotově</option>
            </Select>
          </FormControl>
        </Box>

        <FormControl>
          <FormLabel>Splatnost faktur (dní)</FormLabel>
          <NumberInput min={1} max={365} value={settings.invoiceDue} onChange={(value) => handleChange('invoiceDue', Number(value))}>
            <NumberInputField bg={bgColor} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Platnost cenových nabídek (dní)</FormLabel>
          <NumberInput min={1} max={365} value={settings.offerValidity} onChange={(value) => handleChange('offerValidity', Number(value))}>
            <NumberInputField bg={bgColor} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Konstantní symbol</FormLabel>
          <NumberInput min={0} value={settings.constantSymbol} onChange={(value) => handleChange('constantSymbol', value)}>
            <NumberInputField bg={bgColor} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <Box mt={5} textAlign="center">
          <Button 
            colorScheme="teal" 
            size="lg" 
            width="full" 
            _hover={{ transform: 'scale(1.02)' }}
            onClick={handleSave}
          >
            Uložit nastavení
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default DefaultSettings;
