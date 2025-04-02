// Dashboard.js
import React, { useEffect, useState } from "react";
import { Container, Heading, Spinner, Box, Text } from "@chakra-ui/react";
import { getProfile } from "../services/authService";
import { useNotification } from "../components/hooks/ToastContext";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setPendingToast } = useNotification();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    
    // Check for pending toast in localStorage
    const storedToast = localStorage.getItem('pendingToast');
    if (storedToast) {
      try {
        const toastData = JSON.parse(storedToast);
        setPendingToast(toastData);
        // Clear the stored toast after setting it
        localStorage.removeItem('pendingToast');
      } catch (error) {
        console.error("Error parsing stored toast:", error);
      }
    }
  }, [setPendingToast]);

  return (
    <Container>
      <Heading as="h4" size="lg" mt={4}>
        Welcome to your Dashboard!
      </Heading>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <Spinner />
        </Box>
      ) : user ? (
        <Box mt={3}>
          <Text fontSize="lg">User ID: {user.id}</Text>
          <Text fontSize="lg">Email: {user.email}</Text>
        </Box>
      ) : (
        <Text fontSize="lg" color="red.500">
          Failed to load user data.
        </Text>
      )}
    </Container>
  );
};

export default Dashboard;