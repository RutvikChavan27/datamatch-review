import React from "react";
import { Menu, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import QuantumBadge from "@/components/ui/quantum-badge";

interface TopBarProps {
  onMenuToggle: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuToggle }) => {
  const location = useLocation();

  const getModuleName = (pathname: string): string => {
    if (pathname === "/" || pathname === "/workspace") return "Workspace";
    if (pathname.startsWith("/storage")) return "Storage";
    if (pathname.startsWith("/workflows")) return "Productivity Engine";
    if (pathname.startsWith("/documents")) return "Documents";
    if (pathname.startsWith("/matching")) return "Data Match";
    if (pathname.startsWith("/po-requests")) return "PO Requests";
    if (pathname.startsWith("/reports")) return "Reports";
    if (pathname.startsWith("/settings")) return "Settings";
    return "Workspace";
  };

  return (
    <div className="app-header z-50 fixed top-0 left-0 right-0">
      <div className="header-left">
        <button
          className="menu-button"
          onClick={onMenuToggle}
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <img
          src="/lovable-uploads/c24bf7a8-2cc8-4ae6-9497-8bc1716e1451.png"
          alt="MaxxLogix Logo"
          className="header-logo"
        />
        <div className="flex items-center ml-4">
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="flex items-center ml-4">
            <span className="text-base font-bold text-gray-700">
              {getModuleName(location.pathname)}
            </span>
            {location.pathname.startsWith("/storage") && (
              <DropdownMenu>
                <DropdownMenuTrigger className="ml-2 p-1 hover:bg-gray-100 rounded">
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-56 bg-white border border-gray-200 shadow-lg"
                >
                  <DropdownMenuItem className="flex items-center p-3 hover:bg-gray-50">
                    <span>View All Documents</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center p-3 hover:bg-gray-50">
                    <span>Search Documents</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center p-3 hover:bg-gray-50">
                    <span>Upload Documents</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center p-3 hover:bg-gray-50">
                    <span>Manage Folders</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
      <div className="ml-auto">
        <QuantumBadge text="AI Productivity Platform" size="md" />
      </div>
    </div>
  );
};

export default TopBar;
