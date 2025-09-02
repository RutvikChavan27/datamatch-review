import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  UserCircle,
  Settings,
  Home,
  Database,
  Workflow,
  FileText,
  GitMerge,
  BarChart3,
  HelpCircle,
} from "lucide-react";
import LoadingScreen from "./LoadingScreen";

interface SidebarProps {
  enabledModules: {
    purchaseOrder: boolean;
    goodsReceiptNote: boolean;
    poRequest: boolean;
  };
}

interface NavItem {
  name: string;
  path?: string;
  always?: boolean;
  condition?: boolean;
  hasNotification?: boolean;
  subItems?: NavItem[];
  icon?: any;
}

interface NavCategory {
  category: string;
  items: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ enabledModules }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<
    "PRODUCTIVITY ENGINE" | "DOCUMENT MATCHING" | null
  >("DOCUMENT MATCHING");
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  const isActive = (path?: string) => {
    if (!path) return false;
    if (location.pathname === path) return true;
    if (
      path === "/workspace" &&
      (location.pathname.startsWith("/workspace/") || location.pathname === "/")
    )
      return true;
    if (
      path === "/documents/invoices" &&
      location.pathname.startsWith("/documents/invoices/")
    )
      return true;
    if (
      path === "/documents/purchase-orders" &&
      location.pathname.startsWith("/documents/purchase-orders/")
    )
      return true;
    if (
      path === "/documents/goods-receipt-notes" &&
      location.pathname.startsWith("/documents/goods-receipt-notes/")
    )
      return true;
    if (path === "/po-requests" && location.pathname.startsWith("/po-requests"))
      return true;
    if (
      path === "/matching" &&
      (location.pathname.startsWith("/matching/") ||
        location.pathname === "/matching")
    )
      return true;
    if (
      path === "/workflows" &&
      (location.pathname.startsWith("/workflows/") ||
        location.pathname === "/workflows")
    )
      return true;
    return false;
  };

  const hasNewRequests = true;

  // Navigation categories and items with proper document connections
  const navItems: NavCategory[] = [
    {
      category: "",
      items: [
        { name: "Workspace", path: "/workspace", always: true, icon: Home },
        { name: "Storage", path: "/storage", always: true, icon: Database },
        {
          name: "Productivity Engine",
          path: "/workflows",
          always: true,
          icon: Workflow,
        },
        {
          name: "PO Requests",
          path: "/po-requests",
          condition: enabledModules.poRequest,
          hasNotification: hasNewRequests,
          icon: FileText,
        },
        {
          name: "Data Match",
          path: "/matching",
          always: true,
          icon: GitMerge,
        },
        { name: "Reports", path: "/reports", always: true, icon: BarChart3 },
      ],
    },
  ];

  // Render logic for items and subItems (no icons)
  const renderNavItem = (item: NavItem) => {
    if (item.subItems && item.subItems.length > 0) {
      return (
        <div key={item.name} className="mb-1">
          <div className="flex items-center px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {item.name}
          </div>
          <ul className="ml-2 pl-3 border-l border-gray-100 space-y-1">
            {item.subItems
              .filter(
                (sub) =>
                  sub.always || sub.condition === undefined || sub.condition
              )
              .map((sub) => (
                <li key={sub.name}>
                  <Link
                    to={sub.path || "#"}
                    className={`flex items-center px-2 py-2 rounded-r-md text-sm font-medium transition-colors relative gap-2 ${
                      isActive(sub.path)
                        ? "bg-blue-50 text-blue-700 border-l-2 border-primary"
                        : "text-gray-700 hover:bg-gray-50 rounded-md"
                    }`}
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      );
    } else {
      // Standard list item (no subItems)
      return (
        <li key={item.name}>
          <Link
            to={item.path || "#"}
            className={`flex items-center px-3 py-2 rounded-r-md text-sm font-medium transition-colors relative ${
              isActive(item.path)
                ? "bg-[hsl(var(--sidebar-active))] text-foreground border-l-2 border-primary"
                : "text-gray-700 hover:bg-gray-50 rounded-md"
            }`}
          >
            {item.icon && <item.icon className="h-4 w-4 mr-3" />}
            {item.name}
            {item.hasNotification && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
            )}
          </Link>
        </li>
      );
    }
  };

  // Only one menu can be expanded at a time
  const handleExpandSection = (
    section: "PRODUCTIVITY ENGINE" | "DOCUMENT MATCHING"
  ) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const handleSignOut = () => {
    setShowLoadingScreen(true);
    // Simulate logout process delay
    setTimeout(() => {
      setShowLoadingScreen(false);
      navigate("/login");
    }, 2000);
  };

  return (
    <>
      {showLoadingScreen && <LoadingScreen />}
      <aside
        className="w-full bg-white flex flex-col"
        style={{ height: `calc(100vh - 60px)` }}
      >
        <nav className="flex-1 px-4 pb-4 pt-8 space-y-3 min-h-0">
          {/* Main Navigation */}
          <div className="flex-1 min-h-0">
            <ul className="space-y-1">
              {navItems[0].items.map(renderNavItem)}
            </ul>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-200">
          {/* Settings Item */}
          <div className="p-3 pt-0">
            <Link
              to="/settings"
              className={`flex items-center px-3 py-2 rounded-r-md text-sm font-medium transition-colors ${
                isActive("/settings")
                  ? "bg-blue-50 text-blue-700 border-l-2 border-primary"
                  : "text-gray-700 hover:bg-gray-50 rounded-md"
              }`}
            >
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </Link>
          </div>

          {/* User Avatar and Dropdown */}
          <div className="p-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold">
                    JS
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="text-sm font-semibold text-gray-900">
                    John Smith
                  </div>
                  <div className="text-xs text-gray-500">john@company.com</div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white border border-gray-200 shadow-lg"
              >
                <DropdownMenuItem
                  className="flex items-center space-x-2 p-3 hover:bg-gray-50"
                  asChild
                >
                  <Link to="/profile">
                    <UserCircle className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center space-x-2 p-3 hover:bg-gray-50">
                  <HelpCircle className="h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem
                  className="flex items-center space-x-2 p-3 hover:bg-gray-50 text-red-600"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
