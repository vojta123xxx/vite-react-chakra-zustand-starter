import * as React from "react";
import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  ChakraProvider,
  ColorModeScript,
  Spinner,
  Box,
  useColorMode,
} from "@chakra-ui/react";

// Import vlastního theme
import theme from "./components/ui/theme";

// Import stránek
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import Dashboard from "./pages/Dashboard";
import CompanyWizard from "./pages/CompanyWizard/CompanyWizard";
import Contacts from "./pages/Contacts/ContactList";
import MyCompany from "./pages/Settings/Company/MyCompany";
import Sales from "./pages/Settings/Sales/Sales";
import MyCashRegister from "./pages/Settings/CashRegister/MyCashRegister";
import Layout from "./components/Layout";
import PrivateRoute from "./PrivateRoute";
import InvoicesIssuedList from "./pages/InvoicesIssued/InvoicesIssuedList";
import InvoicesIssuedCreate from "./pages/InvoicesIssued/Create/InvoicesIssuedCreate";
import InvoicesIssuedEdit from "./pages/InvoicesIssued/Edit/InvoicesIssuedEdit";
import ContactCreate from "./pages/Contacts/ContactCreate";
import ContactEdit from "./pages/Contacts/ContactEdit";
import MySalesDefault from "./pages/SaleTemplates/Templates/Main";
import SaleTemplateCreate from "./pages/SaleTemplates/Templates/SaleTemplateCreate";
import SaleTemplateEdit from "./pages/SaleTemplates/Templates/SaleTemplateEdit";

// Import NotificationProvider
import { NotificationProvider } from "./components/hooks/ToastContext";

// Vytvoření routeru
const router = createBrowserRouter([
  { path: "/verify/:token", element: <Verify /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Layout>
          <Dashboard />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/my/contacts",
    element: (
      <PrivateRoute>
        <Layout>
          <Contacts />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/settings/my/sales",
    element: (
      <PrivateRoute>
        <Layout>
          <Sales />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/my/contacts/create",
    element: (
      <PrivateRoute>
        <Layout>
          <ContactCreate />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/my/contacts/edit/:id",
    element: (
      <PrivateRoute>
        <Layout>
          <ContactEdit />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/my/company",
    element: (
      <PrivateRoute>
        <Layout>
          <MyCompany />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/my/sales/templates",
    element: (
      <PrivateRoute>
        <Layout>
          <MySalesDefault selectedId={undefined} />
        </Layout>
      </PrivateRoute>
    ),
  },
 
  {
    path: "/my/sales/templates/edit/:id",
    element: (
      <PrivateRoute>
        <Layout>
          <SaleTemplateEdit />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/my/sales/templates/create",
    element: (
      <PrivateRoute>
        <Layout>
          <SaleTemplateCreate />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/my/sales/invoicesissued/list",
    element: (
      <PrivateRoute>
        <Layout>
          <InvoicesIssuedList />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/my/sales/invoicesissued/create",
    element: (
      <PrivateRoute>
        <Layout>
          <InvoicesIssuedCreate />
        </Layout>
      </PrivateRoute>
    ),
  },
{
  path: "/my/sales/invoicesissued/edit/:invoiceId",
  element: (
    <PrivateRoute>
      <Layout>
        <InvoicesIssuedEdit />
      </Layout>
    </PrivateRoute>
  ),
},


  {
    path: "/my/CashRegister",
    element: (
      <PrivateRoute>
        <Layout>
          <MyCashRegister />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/test",
    element: (
      <PrivateRoute>
        <Layout>
          <CompanyWizard />
        </Layout>
      </PrivateRoute>
    ),
  },
]);

// Hlavní komponenta
const App = () => {
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulujeme kratší načítání
    setTimeout(() => setLoading(false), 500);
  }, []);

  return (
    <>
      {loading && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          bg={colorMode === "dark" ? "gray.900" : "gray.50"}
          zIndex="9999"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner
            size="xl"
            thickness="6px"
            speed="0.65s"
            color="teal.300"
            emptyColor="gray.200"
          />
        </Box>
      )}
      <RouterProvider router={router} />
    </>
  );
};

// Připojení do DOM
const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = createRoot(container);

root.render(
  <>
    {/* Tohle musí být první – hned na začátku DOMu */}
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </ChakraProvider>
    </React.StrictMode>
  </>
);