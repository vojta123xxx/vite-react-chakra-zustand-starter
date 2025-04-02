import React, { useState, useEffect } from "react";
import {
  Flex,
  IconButton,
  HStack,
  Tooltip,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  useColorModeValue,
  Box,
  Text,
  Badge,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
} from "@chakra-ui/react";
import {
  mdiMenu,
  mdiBellOutline,
  mdiMoonWaningCrescent,
  mdiWhiteBalanceSunny,
  mdiAccountCircleOutline,
  mdiCogOutline,
  mdiLogoutVariant,
  mdiChevronDown,
} from "@mdi/js";
import Icon from "@mdi/react";
import CompanySelector from "./CompanySelector";

const NotificationsDrawer = ({ isOpen, onClose }) => {
  const bg = useColorModeValue("white", "gray.800");

  return (
    <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
      <DrawerContent bg={bg} maxW="400px">
        <DrawerBody p={0}>
          <Box p={4} borderBottomWidth="1px">
            <Text fontSize="lg" fontWeight="semibold">
              Notifikace
            </Text>
          </Box>
          <Box p={4}>
            <Text >Žádné nové notifikace</Text>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [companyId, setCompanyId] = useState(
    localStorage.getItem("selectedCompanyId") || null
  );

  const onNotificationsOpen = () => setIsNotificationsOpen(true);
  const onNotificationsClose = () => setIsNotificationsOpen(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const { colorMode, toggleColorMode } = useColorMode();

  // Definování barvy pozadí pro Header
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const iconColor = useColorModeValue("gray.600", "gray.300");

  // Vytvořit instanci CompanySelectoru a získat jeho metody a UI
  const companySelector = CompanySelector({
    onCompanySelect: (id) => setCompanyId(id),
  });

  // Vystavit metodu pro aktualizaci seznamu firem globálně
  useEffect(() => {
    window.refreshCompanies = companySelector.refreshCompanies;
  }, []);

  return (
    <Flex
      as="header"
      bg={bg}
      borderBottom="1px"
      borderColor={borderColor}
      px={{ base: 3, md: 6 }}
      h="16"
      align="center"
      justify="space-between"
      transition="all 0.2s ease"
      boxShadow="sm"
      position="sticky"
      top="0"
      zIndex="sticky"
    >
      <HStack spacing={{ base: 2, md: 4 }}>
        <IconButton
          variant="ghost"
          onClick={toggleSidebar}
          icon={<Icon path={mdiMenu} size={1} />}
          aria-label="Toggle Sidebar"
          color={iconColor}
          _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
        />

      
      </HStack>

      <HStack spacing={{ base: 2, md: 4 }}>
        <Tooltip label="Notifikace" hasArrow placement="bottom">
          <Box position="relative">
            <IconButton
              variant="ghost"
              icon={<Icon path={mdiBellOutline} size={1} />}
              onClick={onNotificationsOpen}
              aria-label="Notifications"
              color={iconColor}
              _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
            />
            <Badge
              colorScheme="red"
              borderRadius="full"
              boxSize="8px"
              position="absolute"
              top="10px"
              right="10px"
            />
          </Box>
        </Tooltip>

        {companySelector.renderSelector()}
        
        <Tooltip label={colorMode === "light" ? "Tmavý režim" : "Světlý režim"} hasArrow placement="bottom">
          <IconButton
            variant="ghost"
            icon={
              <Icon
                path={colorMode === "light" ? mdiMoonWaningCrescent : mdiWhiteBalanceSunny}
                size={1}
              />
            }
            onClick={toggleColorMode}
            aria-label="Toggle Color Mode"
            color={iconColor}
            _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
          />
        </Tooltip>

        <Menu>
          <MenuButton
            as={IconButton}
            variant="ghost"
            _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
            _active={{ bg: useColorModeValue("gray.200", "gray.600") }}
          >
            <HStack spacing={3} cursor="pointer">
              <Avatar
                size="sm"
                name="Jan Novák"
                src="https://bit.ly/dan-abramov"
                bg="teal.500"
                color="white"
              />
              <Icon path={mdiChevronDown} size={0.8} color={iconColor} />
            </HStack>
          </MenuButton>
          <MenuList
            minW="200px"
            boxShadow="xl"
            borderColor={useColorModeValue("gray.200", "gray.600")}
          >
            <MenuItem icon={<Icon path={mdiAccountCircleOutline} size={0.8} />} _hover={{ bg: useColorModeValue("teal.50", "teal.800") }}>
              <Text fontSize="sm">Můj profil</Text>
            </MenuItem>
            <MenuItem icon={<Icon path={mdiCogOutline} size={0.8} />} _hover={{ bg: useColorModeValue("teal.50", "teal.800") }}>
              <Text fontSize="sm">Nastavení</Text>
            </MenuItem>
            <MenuItem icon={<Icon path={mdiLogoutVariant} size={0.8} />} _hover={{ bg: useColorModeValue("teal.50", "teal.800") }} color={useColorModeValue("red.500", "red.300")}>
              <Text fontSize="sm">Odhlásit se</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      <NotificationsDrawer isOpen={isNotificationsOpen} onClose={onNotificationsClose} />
    </Flex>
  );
};

export default Header;
