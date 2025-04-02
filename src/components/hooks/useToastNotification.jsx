import { useToast, Box, Text } from "@chakra-ui/react";
import { useCallback } from "react";

const useToastNotification = () => {
  const toast = useToast();

  const showToast = useCallback(
    ({
      title,
      description,
      status,
      duration = 5000,
      isClosable = true,
      position = "bottom",
    }) => {
      toast({
        position,
        duration,
        isClosable,
        render: () => (
          <Box
            color="white"
            p={4}
            bg={
              status === "error"
                ? "rgba(229,62,62,0.7)"
                : status === "success"
                ? "rgba(76,175,80,0.7)"
                : status === "warning"
                ? "rgba(255,152,0,0.7)"
                : "rgba(33,150,243,0.7)"
            }
            borderRadius="md"
            boxShadow="lg"
            backdropFilter="blur(10px)"
            border="1px solid rgba(255,255,255,0.2)"
          >
            {title && (
              <Text fontWeight="bold" mb={2} fontSize="lg">
                {title}
              </Text>
            )}
            {description && <Text fontSize="md">{description}</Text>}
          </Box>
        ),
      });
    },
    [toast]
  );

  return showToast;
};

export default useToastNotification;
