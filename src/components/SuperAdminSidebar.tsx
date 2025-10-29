import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, LogOut, UserCircle, HelpCircle, LayoutDashboard, Users, Shield, BarChart3 } from 'lucide-react';
import LoadingScreen from './LoadingScreen';

interface NavItem {
  name: string;
  path?: string;
  icon?: any;
}

interface NavCategory {
  category: string;
  items: NavItem[];
}

const SuperAdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  const isActive = (path?: string) => {
    if (!path) return false;
    if (location.pathname === path) return true;
    if (path === '/super-admin/dashboard' && location.pathname === '/super-admin/dashboard') return true;
    if (path === '/super-admin/tenants' && location.pathname.startsWith('/super-admin/tenants')) return true;
    if (path === '/super-admin/reports' && location.pathname === '/super-admin/reports') return true;
    if (path === '/super-admin/audits' && location.pathname === '/super-admin/audits') return true;
    return false;
  };

  const navItems: NavCategory[] = [
    {
      category: '',
      items: [
        { name: 'Dashboard', path: '/super-admin/dashboard', icon: LayoutDashboard },
        { name: 'Tenants', path: '/super-admin/tenants', icon: Users },
        { name: 'Reports', path: '/super-admin/reports', icon: BarChart3 },
        { name: 'Audits', path: '/super-admin/audits', icon: Shield },
      ]
    }
  ];

  // Render logic for items
  const renderNavItem = (item: NavItem) => {
    return (
      <li key={item.name}>
        <Link
          to={item.path || "#"}
          className={`flex items-center px-3 py-2 rounded-r-md text-sm font-medium transition-colors relative ${
            isActive(item.path)
              ? 'bg-[hsl(var(--sidebar-active))] text-foreground border-l-2 border-primary'
              : 'text-gray-700 hover:bg-gray-50 rounded-md'
          }`}
        >
          {item.icon && <item.icon className="h-4 w-4 mr-3" />}
          {item.name}
        </Link>
      </li>
    );
  };

  const handleSignOut = async () => {
    setShowLoadingScreen(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      setShowLoadingScreen(false);
    }
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
          {/* User Avatar and Dropdown */}
          <div className="p-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-purple-100 text-purple-700 text-sm font-semibold">
                    SA
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="text-sm font-semibold text-gray-900">
                    Super Admin
                  </div>
                  <div className="text-xs text-gray-500">admin@maxxlogix.com</div>
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

export default SuperAdminSidebar;
