import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate, Link as RouterLink } from "react-router-dom";
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
} from "@chakra-ui/react";
import { AtSignIcon, LockIcon, CheckCircleIcon } from "@chakra-ui/icons";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await register(email, password);
      setSuccess("Registrace úspěšná! Nyní se můžete přihlásit.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || "Chyba při registraci");
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
        Registrace
      </Heading>

      {error && (
        <Alert status="error" mb={4} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {success && (
        <Alert status="success" mb={4} borderRadius="md">
          <AlertIcon as={CheckCircleIcon} />
          {success}
        </Alert>
      )}

      <form onSubmit={handleRegister}>
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
                placeholder="Zvolte heslo"
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
          >
            Registrovat
          </Button>
        </VStack>
      </form>

      <Text mt={6} textAlign="center" fontSize="sm">
        Už máte účet?{" "}
        <Link as={RouterLink} to="/login" color="teal.500" fontWeight="medium">
          Přihlaste se
        </Link>
      </Text>
    </Box>
  );
};

export default Register;
