import React, { Suspense, useEffect, useState } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  mdiCogOutline,
  mdiPaletteOutline,
  mdiNumeric,
} from "@mdi/js";
import Icon from "@mdi/react";
import DefaultSettings from "./DefaultSettings";

const MotionTab = motion(Tab);

const CustomTabs = ({ selectedId }) => {
  const textColor = useColorModeValue("gray.800", "white");
  const panelBg = useColorModeValue("gray.100", "gray.800");
  const tabBg = useColorModeValue("gray.200", "gray.700");
  const tabSelectedBg = useColorModeValue("black", "white");
  const tabSelectedColor = useColorModeValue("white", "black");

  const tabItems = [
    {
      label: "Defaultní nastavení",
      icon: mdiCogOutline,
      component: <DefaultSettings />,
    },
    {
      label: "Vzhled",
      icon: mdiPaletteOutline,
    },
    {
      label: "Číslování dokladu",
      icon: mdiNumeric,
    },
  ];

  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const savedTab = localStorage.getItem("selectedTab");
    if (savedTab !== null) {
      setSelectedTab(Number(savedTab));
    }
  }, []);

  const handleTabChange = (index) => {
    setSelectedTab(index);
    localStorage.setItem("selectedTab", index);
  };

  return (
    <Tabs
      variant="unstyled"
      align="center"
      index={selectedTab}
      onChange={handleTabChange}
    >
      <TabList mb={6} overflowX="auto" flexWrap="wrap" justifyContent="center">
        {tabItems.map((item, index) => (
          <MotionTab
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            px={6}
            py={3}
            mx={2}
            borderRadius="xl"
            fontWeight="semibold"
            display="flex"
            alignItems="center"
            gap={2}
            bg={tabBg}
            color={textColor}
            _selected={{
              bg: tabSelectedBg,
              color: tabSelectedColor,
            }}
          >
            <Icon path={item.icon} size={1} />
            {item.label}
          </MotionTab>
        ))}
      </TabList>
      <TabPanels>
        {tabItems.map((item, index) => (
          <TabPanel key={index}>
            <Box p={8} borderRadius="xl" bg={panelBg} textAlign="center">
              <Suspense fallback={<Spinner size="lg" />}>
                {item.component &&
                  React.cloneElement(item.component, {
                    selectedCompanyId: selectedId,
                  })}
              </Suspense>
            </Box>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default CustomTabs;
