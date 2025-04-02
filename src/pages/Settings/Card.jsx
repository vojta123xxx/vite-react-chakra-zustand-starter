import React from "react";
import { Card, CardBody, useColorModeValue } from "@chakra-ui/react";

const FCard = ({ children, ...rest }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Card
      bg={bgColor}
      boxShadow="lg"
      borderRadius="xl"
      borderWidth="1px"
      borderColor={borderColor}
      {...rest}
    >
      <CardBody p={8}>{children}</CardBody>
    </Card>
  );
};

export default FCard;
