import { useState } from "react";
import { login } from "../services/authService";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  Link,
  Alert,
  AlertIcon,
  VStack,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { AtSignIcon, LockIcon } from "@chakra-ui/icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Chyba při přihlášení");
    } finally {
      setLoading(false);
    }
  };

  const boxBg = useColorModeValue("white", "gray.800");

  return (
    <Box
      maxW="sm"
      mx="auto"
      mt={20}
      p={8}
      bg={boxBg}
      borderRadius="xl"
      boxShadow="2xl"
    >
      <Heading as="h2" size="xl" textAlign="center" mb={6}>
        Přihlášení
      </Heading>

      {error && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <form onSubmit={handleLogin}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>E-mail</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <AtSignIcon color="gray.400" />
              </InputLeftElement>
              <Input
                type="email"
                placeholder="např. jan.novak@email.cz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Heslo</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <LockIcon color="gray.400" />
              </InputLeftElement>
              <Input
                type="password"
                placeholder="Zadejte heslo"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            size="lg"
            fontWeight="bold"
            isLoading={loading}
            loadingText="Přihlašuji..."
          >
            Přihlásit se
          </Button>
        </VStack>
      </form>

      <Text mt={6} textAlign="center" fontSize="sm">
        Nemáte účet?{" "}
        <Link as={RouterLink} to="/register" color="teal.500" fontWeight="medium">
          Zaregistrujte se
        </Link>
      </Text>
    </Box>
  );
};

export default Login;
