import React, { useState } from "react";
import {
  Box,
  Flex,
  useBreakpointValue,
  useDisclosure,
  useColorMode,
  ColorModeScript,
} from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const { colorMode } = useColorMode();

  // Tato funkce přepíná stav sidebaru – pro mobilní režim využívá useDisclosure,
  // pro desktop je stav uložený v desktopSidebarOpen.
  const toggleSidebar = () => {
    if (isMobile) {
      isOpen ? onClose() : onOpen();
    } else {
      setDesktopSidebarOpen((prev) => !prev);
    }
  };

  return (
    <Box
      h="100vh"
      bg={colorMode === "dark" ? "gray.900" : "gray.50"}
      color={colorMode === "dark" ? "white" : "gray.800"}
    >
      <Flex h="100vh">
        {isMobile ? (
          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        ) : (
          <Sidebar isOpen={desktopSidebarOpen} toggleSidebar={toggleSidebar} />
        )}
        <Flex direction="column" flex="1">
          <Header
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isMobile ? isOpen : desktopSidebarOpen}
          />
          <Box p={6} flex="1" overflowY="auto">
            {children}
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Layout;
