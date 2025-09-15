import React, { createContext, useContext, useState, ReactNode } from 'react';

// Configuration settings interface
interface ConfigSettings {
  isRequestorEditable: boolean;
  // Add other settings as needed in the future
  maxFileSize: number;
  allowedFileTypes: string[];
  defaultCurrency: string;
  dateFormat: string;
  timeFormat: string;
}

// Context interface
interface ConfigContextType {
  settings: ConfigSettings;
  updateSettings: (newSettings: Partial<ConfigSettings>) => void;
}

// Default settings
const defaultSettings: ConfigSettings = {
  isRequestorEditable: false, // Default to false for security
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.png'],
  defaultCurrency: 'USD',
  dateFormat: 'MM/dd/yyyy',
  timeFormat: '12h'
};

// Create context
const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

// Provider component
interface ConfigProviderProps {
  children: ReactNode;
  initialSettings?: Partial<ConfigSettings>;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ 
  children, 
  initialSettings = {} 
}) => {
  const [settings, setSettings] = useState<ConfigSettings>({
    ...defaultSettings,
    ...initialSettings
  });

  const updateSettings = (newSettings: Partial<ConfigSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  return (
    <ConfigContext.Provider value={{ settings, updateSettings }}>
      {children}
    </ConfigContext.Provider>
  );
};

// Hook to use config
export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export default ConfigContext;
