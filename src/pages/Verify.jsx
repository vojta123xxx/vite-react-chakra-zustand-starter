import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, useToast } from "@chakra-ui/react";
import axiosInstance from "../api/axiosInstance";

const Verify = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const toast = useToast();

 useEffect(() => {
  axiosInstance
    .get(`/auth/verify/${token}`)
    .then(() => {
      toast({
        title: "Email successfully verified!",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      setTimeout(() => navigate("/dashboard"), 2000);
    })
    .catch(() => {
      toast({
        title: "Verification failed. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    })
    .finally(() => setLoading(false));
}, [token, navigate, toast]);


  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      {loading ? (
        <>
          <CircularProgress isIndeterminate />
          <p>Verifying...</p>
        </>
      ) : null}
    </Box>
  );
};

export default Verify;
