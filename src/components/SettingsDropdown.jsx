import { Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, VStack, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { mdiOfficeBuilding, mdiTranslate, mdiCog } from "@mdi/js";
import Icon from "@mdi/react";
import SidebarItem from "./SidebarItem";

const SettingsDropdown = ({ isOpen }) => {
  const bgHover = useColorModeValue("blue.50", "whiteAlpha.100");
  const activeColor = useColorModeValue("blue.500", "blue.200");

  const settingsItems = [
    { icon: mdiOfficeBuilding, label: "Firma", to: "/my/company" },
    { icon: mdiTranslate, label: "Jazyk", to: "/settings/language" }
  ];

  return (
    <Box width="full">
      <Accordion allowToggle>
        <AccordionItem border="none">
          <AccordionButton as={Box} p={0} width="full">
            <Box width="full">
              <SidebarItem icon={mdiCog} label="Nastavení" isOpen={isOpen}>
                {isOpen && <AccordionPanel pb={2} pl={8} pr={2}>
                  <VStack align="stretch" spacing={1}>
                    {settingsItems.map((item) => (
                      <Link key={item.to} to={item.to}>
                        <Flex
                          align="center"
                          p={2.5}
                          borderRadius="lg"
                          transition="all 0.2s"
                          _hover={{ bg: bgHover, color: activeColor, transform: "translateX(3px)" }}
                          cursor="pointer"
                        >
                          <Icon path={item.icon} size={0.8} />
                          <Text ml={3} fontSize="sm" fontWeight="medium">
                            {item.label}
                          </Text>
                        </Flex>
                      </Link>
                    ))}
                  </VStack>
                </AccordionPanel>}
              </SidebarItem>
            </Box>
          </AccordionButton>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default SettingsDropdown;
