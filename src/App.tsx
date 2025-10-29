import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ClientModulesProvider } from "./hooks/useClientModules";
import { ConfigProvider } from "./contexts/ConfigContext";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import "./utils/amplifyConfig";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ConfigProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ClientModulesProvider>
            <BrowserRouter>
              <Index />
            </BrowserRouter>
          </ClientModulesProvider>
        </TooltipProvider>
      </AuthProvider>
    </ConfigProvider>
  </QueryClientProvider>
);

export default App;
