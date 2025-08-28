
import React, { useState, useEffect, createContext, useContext } from 'react';

interface ClientModules {
  purchaseOrder: boolean;
  goodsReceiptNote: boolean;
  poRequest: boolean;
}

interface ClientModulesContextType {
  enabledModules: ClientModules;
  updateModules: (modules: ClientModules) => void;
  loading: boolean;
}

const ClientModulesContext = createContext<ClientModulesContextType | undefined>(undefined);

export const ClientModulesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enabledModules, setEnabledModules] = useState<ClientModules>({
    purchaseOrder: true,
    goodsReceiptNote: true,
    poRequest: true,
  });
  const [loading, setLoading] = useState(false);

  const updateModules = (modules: ClientModules) => {
    setEnabledModules(modules);
    // Here you would save to backend
    localStorage.setItem('clientModules', JSON.stringify(modules));
  };

  useEffect(() => {
    // Load from localStorage or API
    const saved = localStorage.getItem('clientModules');
    if (saved) {
      setEnabledModules(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  return (
    <ClientModulesContext.Provider value={{ enabledModules, updateModules, loading }}>
      {children}
    </ClientModulesContext.Provider>
  );
};

export const useClientModules = () => {
  const context = useContext(ClientModulesContext);
  if (!context) {
    throw new Error('useClientModules must be used within a ClientModulesProvider');
  }
  return context;
};
