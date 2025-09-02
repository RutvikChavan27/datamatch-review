import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Search, 
  Workflow, 
  Target, 
  ShoppingCart, 
  Shield, 
  Plug,
  ChevronRight 
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const foundationalSettings = [
    {
      title: "Storage Settings",
      description: "Configure index fields, forms, and folder structure for document organization",
      icon: Database,
      path: "/settings/storage",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Search Configuration", 
      description: "Configure search capabilities and saved searches",
      icon: Search,
      path: "/settings/search",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      disabled: true
    },
    {
      title: "Workflow Settings",
      description: "Manage workflow tasks, notification channels, and reminder settings", 
      icon: Workflow,
      path: "/settings/workflow",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    }
  ];

  const moduleSettings = [
    {
      title: "Data Match Configuration",
      description: "Configure variance thresholds for automatic document matching",
      icon: Target,
      path: "/settings/data-match",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "PO Request Settings",
      description: "Configure PO fields, vendors, departments, line items, and cost centers",
      icon: ShoppingCart,
      path: "/settings/po-request",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600"
    }
  ];

  const systemAdministration = [
    {
      title: "System Administration",
      description: "Manage users, integrations, and email templates across all modules",
      icon: Shield,
      path: "/settings/system-admin",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      disabled: true
    },
    {
      title: "Watch Folder Settings",
      description: "Configure watch folders and external system integrations",
      icon: Plug,
      path: "/settings/watch-folders",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600"
    }
  ];

  const SettingCard = ({ title, description, icon: Icon, path, bgColor, iconColor, onClick, disabled = false }) => (
    <Card 
      className={`transition-all duration-200 border border-border/40 rounded-2xl shadow-md border-border/50 ${
        disabled 
          ? 'bg-gray-50 cursor-not-allowed opacity-50' 
          : 'bg-white hover:scale-105 hover:shadow-2xl hover:shadow-gray-300/50 cursor-pointer'
      }`}
      onClick={disabled ? undefined : onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground leading-tight mb-3">
              {title}
            </CardTitle>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
          <div className={`flex items-center justify-center w-12 h-12 rounded-full ${bgColor}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
        <div className="flex justify-start">
          <button
            onClick={disabled ? undefined : (e) => {
              e.stopPropagation();
              onClick();
            }}
            disabled={disabled}
            className={`text-sm font-medium flex items-center gap-1 ${
              disabled 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            View
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-2 px-4 pt-4 pb-2 max-w-full overflow-x-hidden">
      
      <div className="space-y-8 max-w-7xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">System Settings</h2>
          <p className="text-muted-foreground">
            Configure your system settings and manage platform preferences
          </p>
        </div>

      {/* Section 1: Foundational Settings */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Foundational Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {foundationalSettings.map((setting, index) => (
              <SettingCard
                key={index}
                title={setting.title}
                description={setting.description}
                icon={setting.icon}
                path={setting.path}
                bgColor={setting.bgColor}
                iconColor={setting.iconColor}
                onClick={() => handleCardClick(setting.path)}
                disabled={setting.disabled}
              />
            ))}
          </div>
        </div>

        {/* Section 2: Module-Specific Settings */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Module-Specific Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {moduleSettings.map((setting, index) => (
              <SettingCard
                key={index}
                title={setting.title}
                description={setting.description}
                icon={setting.icon}
                path={setting.path}
                bgColor={setting.bgColor}
                iconColor={setting.iconColor}
                onClick={() => handleCardClick(setting.path)}
              />
            ))}
          </div>
        </div>

        {/* Section 3: System Administration */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">System Administration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {systemAdministration.map((setting, index) => (
              <SettingCard
                key={index}
                title={setting.title}
                description={setting.description}
                icon={setting.icon}
                path={setting.path}
                bgColor={setting.bgColor}
                iconColor={setting.iconColor}
                onClick={() => handleCardClick(setting.path)}
                disabled={setting.disabled}
              />
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Settings;