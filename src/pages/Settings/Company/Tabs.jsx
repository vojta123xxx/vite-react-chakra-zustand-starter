// src/components/CustomTabs.jsx
import React, { lazy, Suspense, useEffect, useState } from "react";
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
  mdiOfficeBuilding,
  mdiCog,
  mdiFinance,
  mdiSignature,
  mdiDomain,
} from "@mdi/js";
import Icon from "@mdi/react";
import SelectedCompanyDetail from "./CompanyDetail/SelectedCompanyDetail";
import MyCompanies from "./MyCompanies";

import AccountingData from "./CompanyDetail/AccountingData";

const NewCompany = lazy(() => import("./New/NewCompany"));

const MotionTab = motion(Tab);

const CustomTabs = ({ companyData, loadingCompany, selectedId }) => {
  const textColor = useColorModeValue("gray.800", "white");
  const panelBg = useColorModeValue("gray.100", "gray.800");
  const tabBg = useColorModeValue("gray.200", "gray.700");
  const tabSelectedBg = useColorModeValue("black", "white");
  const tabSelectedColor = useColorModeValue("white", "black");

  const tabItems = [
    {
      label: "Nová firma",
      icon: mdiOfficeBuilding,
      component: <NewCompany />,
    },
    {
      label: "Základní nastavení firmy",
      icon: mdiCog,
      component: (
        <SelectedCompanyDetail
          companyData={companyData}
          loadingCompany={loadingCompany}
          selectedId={selectedId}
        />
      ),
    },
    {
      label: "Účetní údaje",
      icon: mdiFinance,
      component: <AccountingData companyData={companyData} />,
    },
    {
      label: "Logo a podpis",
      icon: mdiSignature,
      component: <p>Logo a podpis – obsah.</p>,
    },
    {
      label: "Správa firem",
      icon: mdiDomain,
      component:<MyCompanies />,
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
            <Box p={8} borderRadius="xl"  textAlign="center">
              <Suspense fallback={<Spinner size="lg" />}>{item.component}</Suspense>
            </Box>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default CustomTabs;