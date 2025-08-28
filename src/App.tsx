
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ClientModulesProvider } from "./hooks/useClientModules";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ClientModulesProvider>
        <BrowserRouter>
          <Index />
        </BrowserRouter>
      </ClientModulesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
