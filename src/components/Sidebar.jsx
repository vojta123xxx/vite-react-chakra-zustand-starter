import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  VStack,
  Text,
  Tooltip,
  Collapse,
  Drawer,
  DrawerOverlay,
  DrawerBody,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  IconButton,
  Divider,
  useColorMode,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Icon from '@mdi/react';
import {
  mdiHome,
  mdiCartOutline,
  mdiFileDocument,
  mdiChevronRight,
  mdiContacts,
  mdiCog,
  mdiOfficeBuilding,
  mdiCashRegister,
  mdiLogout,
  mdiViewDashboardOutline,
  mdiMenu,
  mdiClose,
  mdiThemeLightDark
} from '@mdi/js';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Konfigurace navigačního menu
const menuItems = [
  { id: 'dashboard', icon: mdiHome, label: 'Přehled', path: '/dashboard' },
  { id: 'contacts', icon: mdiContacts, label: 'Adresář', path: '/my/contacts' },
  {
    id: 'sales',
    icon: mdiCartOutline,
    label: 'Prodej',
    path: '/sales',
    submenu: [
      { id: 'newSale', icon: mdiFileDocument, label: 'Vydané faktury', path: '/my/sales/invoicesissued/list' },
      { id: 'saletemplates', icon: mdiViewDashboardOutline, label: 'Šablony', path: '/my/sales/templates/' },
    ],
  },
  {
    id: 'settings',
    icon: mdiCog,
    label: 'Nastavení',
    path: '/settings',
    submenu: [
      { id: 'company', icon: mdiOfficeBuilding, label: 'Společnost', path: '/my/company' },
      { id: 'cashRegister', icon: mdiCashRegister, label: 'Pokladna', path: '/my/CashRegister' },
      { id: 'sales', icon: mdiCartOutline, label: 'Prodej', path: '/settings/my/sales/' },
    ],
  },
];

const NavItem = ({ item, isSidebarOpen, isActive, textColor, hoverBg, onSubmenuToggle }) => {
  const { isOpen: isSubmenuOpen, onToggle } = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();

  const hasSubmenu = Array.isArray(item.submenu) && item.submenu.length > 0;
  const submenuActive = hasSubmenu && item.submenu.some((sub) => location.pathname.startsWith(sub.path));
  const isChecked = isActive || submenuActive;

  const hoverProps = isChecked
    ? {
        bg: 'teal.600',
        color: 'white',
      }
    : {
        bg: hoverBg,
        color: textColor,
      };

  // Automatically open submenu if active
  useEffect(() => {
    if (submenuActive) {
      onToggle();
    }
  }, [submenuActive]);

  const handleClick = () => {
    if (hasSubmenu) {
      onToggle();
      onSubmenuToggle(item.id);
      
      // If the submenu is being opened and there's no active submenu item,
      // navigate to the first submenu item
      if (!isSubmenuOpen && !submenuActive && item.submenu.length > 0) {
        navigate(item.submenu[0].path);
      }
    }
  };

  return (
    <Box w="full">
      <Tooltip 
        label={!isSidebarOpen ? item.label : ''} 
        placement="right" 
        hasArrow
        bg="teal.500"
        color="white"
      >
        <Flex
          as={hasSubmenu ? 'button' : Link}
          to={!hasSubmenu ? item.path : undefined}
          onClick={handleClick}
          w="full"
          p={3}
          borderRadius="lg"
          cursor="pointer"
          align="center"
          bg={isChecked ? 'teal.500' : 'transparent'}
          color={isChecked ? 'white' : textColor}
          _hover={hoverProps}
          transition="all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)"
          position="relative"
          overflow="hidden"
        >
          {isChecked && (
            <Box
              position="absolute"
              left="0"
              top="0"
              bottom="0"
              w="4px"
              bg="teal.300"
              borderRadius="full"
            />
          )}
          <Icon path={item.icon} size={1} />
          {isSidebarOpen && (
            <Flex justify="space-between" align="center" w="full" ml={3}>
              <Text fontWeight="medium" fontSize="sm">{item.label}</Text>
              {hasSubmenu && (
                <Icon
                  path={mdiChevronRight}
                  size={0.8}
                  style={{
                    transform: isSubmenuOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              )}
            </Flex>
          )}
        </Flex>
      </Tooltip>
      {hasSubmenu && isSidebarOpen && (
        <Collapse in={isSubmenuOpen} animateOpacity>
          <VStack
            spacing={1}
            pl={8}
            mt={1}
            align="stretch"
          >
            {item.submenu.map((subItem) => {
              const isSubActive = location.pathname === subItem.path;
              const subHoverProps = isSubActive
                ? {
                    bg: 'teal.600',
                    color: 'white',
                  }
                : {
                    bg: hoverBg,
                    color: textColor,
                  };

              return (
                <Link key={subItem.id} to={subItem.path}>
                  <Flex
                    w="full"
                    p={2}
                    pl={4}
                    borderRadius="md"
                    cursor="pointer"
                    align="center"
                    bg={isSubActive ? 'teal.500' : 'transparent'}
                    color={isSubActive ? 'white' : textColor}
                    _hover={subHoverProps}
                    transition="all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)"
                  >
                    <Icon path={subItem.icon} size={0.8} />
                    <Text ml={3} fontSize="sm">
                      {subItem.label}
                    </Text>
                  </Flex>
                </Link>
              );
            })}
          </VStack>
        </Collapse>
      )}
    </Box>
  );
};

const SidebarContent = ({
  isOpen,
  toggleSidebar,
  bgColor,
  borderColor,
  textColor,
  handleLogout,
  hoverBg,
}) => {
  const { toggleColorMode } = useColorMode();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  
  const handleSubmenuToggle = (id) => {
    setOpenSubmenu(openSubmenu === id ? null : id);
  };
  
  return (
    <MotionBox
      as="nav"
      bg={bgColor}
      borderRightRadius={{ base: 'none', lg: 'lg' }}
      w={{ base: '100%', lg: isOpen ? '240px' : '72px' }}
      h="100vh"
      borderRight="1px"
      borderColor={borderColor}
      transition="width 0.3s ease, transform 0.3s ease"
      overflow="hidden"
      position="relative"
      boxShadow="md"
      zIndex="docked"
    >
      {/* Mobile header */}
      <Flex 
        display={{ base: 'flex', lg: 'none' }}
        h="16" 
        align="center" 
        justify="space-between"
        px={4}
        borderBottom="1px"
        borderColor={borderColor}
      >
        <Text fontSize="xl" fontWeight="bold" color="teal.500">
          Faktura7
        </Text>
        <IconButton
          icon={<Icon path={mdiClose} size={1} />}
          onClick={toggleSidebar}
          variant="ghost"
          aria-label="Close sidebar"
        />
      </Flex>

      {/* Logo section */}
      <Flex 
        h="16" 
        align="center" 
        justify={isOpen ? 'space-between' : 'center'} 
        px={4}
        display={{ base: 'none', lg: 'flex' }}
      >
        {isOpen ? (
          <MotionFlex
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Text fontSize="xl" fontWeight="bold" color="teal.500">
              Faktura7
            </Text>
          </MotionFlex>
        ) : (
          <Text fontSize="xl" fontWeight="bold" color="teal.500">
            f
          </Text>
        )}
      </Flex>

      <Divider borderColor={borderColor} />

      {/* Menu items */}
      <Box overflowY="auto" h="calc(100vh - 150px)" py={2} px={2}>
        <VStack spacing={1} align="stretch">
          {menuItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isSidebarOpen={isOpen}
              isActive={useLocation().pathname.startsWith(item.path)}
              textColor={textColor}
              hoverBg={hoverBg}
              onSubmenuToggle={handleSubmenuToggle}
            />
          ))}
        </VStack>
      </Box>

      {/* Bottom section */}
      <Box position="absolute" bottom="0" left="0" right="0" px={2} pb={4}>
        <VStack spacing={1} align="stretch">
          <Tooltip label={!isOpen ? 'Tmavý/světlý režim' : ''} placement="right" hasArrow>
            <Flex
              as="button"
              onClick={toggleColorMode}
              p={3}
              borderRadius="lg"
              cursor="pointer"
              align="center"
              color={textColor}
              _hover={{
                bg: hoverBg,
              }}
              transition="all 0.2s ease"
            >
              <Icon path={mdiThemeLightDark} size={1} />
              {isOpen && <Text ml={3} fontSize="sm">Tmavý režim</Text>}
            </Flex>
          </Tooltip>
          
          <Tooltip label={!isOpen ? 'Odhlásit se' : ''} placement="right" hasArrow>
            <Flex
              as="button"
              onClick={handleLogout}
              p={3}
              borderRadius="lg"
              cursor="pointer"
              align="center"
              color={textColor}
              _hover={{
                bg: hoverBg,
              }}
              transition="all 0.2s ease"
            >
              <Icon path={mdiLogout} size={1} />
              {isOpen && <Text ml={3} fontSize="sm">Odhlásit se</Text>}
            </Flex>
          </Tooltip>
        </VStack>
      </Box>
    </MotionBox>
  );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  const handleLogout = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  if (isMobile) {
    return (
      <Drawer 
        isOpen={isOpen} 
        placement="left" 
        onClose={toggleSidebar}
        size="full"
      >
        <DrawerOverlay bg="blackAlpha.600">
          <DrawerBody p={0}>
            <SidebarContent
              isOpen={true}
              toggleSidebar={toggleSidebar}
              bgColor={bgColor}
              borderColor={borderColor}
              textColor={textColor}
              handleLogout={handleLogout}
              hoverBg={hoverBg}
            />
          </DrawerBody>
        </DrawerOverlay>
      </Drawer>
    );
  }

  return (
    <SidebarContent
      isOpen={isOpen}
      toggleSidebar={toggleSidebar}
      bgColor={bgColor}
      borderColor={borderColor}
      textColor={textColor}
      handleLogout={handleLogout}
      hoverBg={hoverBg}
    />
  );
};

export default Sidebar;