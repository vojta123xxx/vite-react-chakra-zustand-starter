// components/hooks/ToastContext.js
import React, { createContext, useContext, useState } from "react";
import useToastNotification from "./useToastNotification"; // Import your custom hook

const NotificationContext = createContext({
  setPendingToast: () => {},
  pendingToast: null,
});

export const NotificationProvider = ({ children }) => {
  const [pendingToast, setPendingToast] = useState(null);
  const showToast = useToastNotification();

  // Effect to show the toast when pendingToast changes
  React.useEffect(() => {
    if (pendingToast) {
      showToast(pendingToast);
      setPendingToast(null);
    }
  }, [pendingToast, showToast]);

  return (
    <NotificationContext.Provider value={{ pendingToast, setPendingToast }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);