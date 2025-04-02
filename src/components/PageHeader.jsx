import React from "react";
import { Flex, HStack, Heading, Button, useToken } from "@chakra-ui/react";
import Icon from "@mdi/react";

const PageHeader = ({ title, iconPath, iconComponent, buttonLabel, buttonIcon, onClick }) => {
  const teal500 = useToken("colors", "teal.500");

  return (
    <Flex justify="space-between" align="center" mb={6} mt={4}>
      <HStack spacing={4}>
        {iconPath && <Icon path={iconPath} size={1.2} color={teal500} />}
        {iconComponent && React.cloneElement(iconComponent, { size: 32, color: teal500 })}
        <Heading size="xl">{title}</Heading>
      </HStack>
      <Button
        leftIcon={buttonIcon}
        colorScheme="teal"
        onClick={onClick}
      >
        {buttonLabel}
      </Button>
    </Flex>
  );
};

export default PageHeader;
