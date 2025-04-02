import React, { useEffect, useState, Suspense } from "react";
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
import { mdiCardAccountDetails, mdiMapMarker } from "@mdi/js";
import Icon from "@mdi/react";
import ContactDeliveryAdresses from "./DeliveryAdresses/ContactDeliveryAdresses";

const MotionTab = motion(Tab);

const DeliveryAddressesList = ({ deliveryAddresses, onAddAddress, onSelectAddress, selectedAddressId, onDeleteAddress }) => {
  if (!deliveryAddresses || deliveryAddresses.length === 0) {
    return <div>Žádné dodací adresy nenalezeny.</div>;
  }
  return (
    <ContactDeliveryAdresses 
      deliveryAddresses={deliveryAddresses} 
      onAddAddress={onAddAddress}
      onSelectAddress={onSelectAddress}
      selectedAddressId={selectedAddressId}
      onDeleteAddress={onDeleteAddress}  // předáme funkci dál
    />
  );
};

const CustomTabs = ({ contactFormComponent, deliveryAddresses, onAddAddress, onSelectAddress, selectedAddressId, onDeleteAddress }) => {
  const textColor = useColorModeValue("gray.800", "white");
  const panelBg = useColorModeValue("gray.100", "gray.800");
  const tabBg = useColorModeValue("gray.200", "gray.700");
  const tabSelectedBg = useColorModeValue("black", "white");
  const tabSelectedColor = useColorModeValue("white", "black");

  const tabItems = [
    {
      label: "Kontakt",
      icon: mdiCardAccountDetails,
      component: contactFormComponent,
    },
    {
      label: "Dodací adresy",
      icon: mdiMapMarker,
      component: (
        <DeliveryAddressesList 
          deliveryAddresses={deliveryAddresses} 
          onAddAddress={onAddAddress}
          onSelectAddress={onSelectAddress}
          selectedAddressId={selectedAddressId}
          onDeleteAddress={onDeleteAddress}  // předání prop zde
        />
      ),
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
    <Tabs variant="unstyled" align="center" index={selectedTab} onChange={handleTabChange}>
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
                {item.component}
              </Suspense>
            </Box>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default CustomTabs;
