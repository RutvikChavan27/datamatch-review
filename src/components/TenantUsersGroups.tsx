import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import UsersList from "./UsersList";
import UserGroupsList from "./UserGroupsList";

const TenantUsersGroups: React.FC = () => {
  const navigate = useNavigate();
  const { tenantId } = useParams();
  const [activeTab, setActiveTab] = useState("users");

  // Mock tenant data - in real app, fetch based on tenantId
  const tenantName = "iAF Technologies";

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => navigate("/super-admin/tenants")}
              className="cursor-pointer"
            >
              Tenants
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{tenantName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{tenantName}</h1>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border flex items-center justify-between px-0">
        <div className="flex items-center flex-1 -mb-px pb-1">
          {[
            { key: "users", label: "Users" },
            { key: "groups", label: "Groups" },
          ].map((tab, index) => (
            <button
              key={tab.key}
              className={`
                px-4 py-2.5 flex items-center gap-2 justify-center transition-all duration-200 relative font-semibold
                ${index > 0 ? "-ml-px" : ""}
                ${
                  activeTab === tab.key
                    ? `bg-white text-gray-900 z-10 border-b-2 border-b-[#27313e] border-transparent rounded-t-md`
                    : "text-muted-foreground hover:bg-gray-50 hover:text-gray-700 border-b-2 border-transparent"
                }
              `}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="text-center text-sm leading-5 flex items-center justify-center font-semibold">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "users" && <UsersList />}
      {activeTab === "groups" && <UserGroupsList />}
    </div>
  );
};

export default TenantUsersGroups;
