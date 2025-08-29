import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import POTable from "@/components/po-request/POTable";
import { mockPurchaseOrders } from "@/data/mock-data";
import { Search, Plus, Filter, Calendar, DollarSign } from "lucide-react";
import { POStatus } from "@/types/po-types";

const PORequestDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState<"all" | POStatus>("all");
  const [hasMinimizedPO, setHasMinimizedPO] = useState(false);

  // Check if there's a minimized PO when the component mounts or location changes
  useEffect(() => {
    if (location.state && location.state.minimizedPO) {
      setHasMinimizedPO(true);
    }
  }, [location]);

  const handleCreateNew = () => {
    navigate("/po-requests/create");
  };

  const handleRestorePO = () => {
    navigate("/po-requests/create");
  };

  // Filter POs based on search query and selected tab
  const filteredPOs = mockPurchaseOrders.filter((po) => {
    const matchesSearch =
      po.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.vendor.toLowerCase().includes(searchQuery.toLowerCase());

    if (currentTab === "all") {
      return matchesSearch;
    }

    return matchesSearch && po.status === currentTab;
  });

  // Calculate counts for each tab
  const allCount = mockPurchaseOrders.length;
  const inReviewCount = mockPurchaseOrders.filter(
    (po) => po.status === "submitted"
  ).length;
  const approvedCount = mockPurchaseOrders.filter(
    (po) => po.status === "approved"
  ).length;
  const rejectedCount = mockPurchaseOrders.filter(
    (po) => po.status === "rejected"
  ).length;
  const discussionCount = mockPurchaseOrders.filter(
    (po) => po.status === "discussion"
  ).length;

  // Calculate total value of filtered POs
  const totalValue = filteredPOs.reduce((sum, po) => sum + po.totalAmount, 0);

  // Format currency helper function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Helper function to get count badge with semantic background colors matching Workspace statusBadge
  const getCountBadge = (tabKey: string, count: number, isActive: boolean) => {
    if (isActive) {
      // Active state - use semantic colors based on tab type (matching Workspace statusBadge patterns)
      switch (tabKey) {
        case "all":
          return (
            <div className="bg-slate-600 text-white rounded-full px-2 py-0.5 text-xs font-bold">
              {count}
            </div>
          );
        case "submitted":
          // In Review - use yellow/pending colors like Workspace "Pending" status
          return (
            <div className="bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-full px-2 py-0.5 text-xs font-bold">
              {count}
            </div>
          );
        case "approved":
          // Approved - use green colors like Workspace "Low" priority (success)
          return (
            <div className="bg-green-100 text-green-700 border border-green-200 rounded-full px-2 py-0.5 text-xs font-bold">
              {count}
            </div>
          );
        case "rejected":
          // Rejected - use red colors like Workspace "High" priority (error)
          return (
            <div className="bg-red-100 text-red-700 border border-red-200 rounded-full px-2 py-0.5 text-xs font-bold">
              {count}
            </div>
          );
        case "discussion":
          // Ready for Review - use orange colors like Workspace "Normal" priority
          return (
            <div className="bg-orange-100 text-orange-700 border border-orange-200 rounded-full px-2 py-0.5 text-xs font-bold">
              {count}
            </div>
          );
        default:
          return (
            <div className="bg-slate-600 text-white rounded-full px-2 py-0.5 text-xs font-bold">
              {count}
            </div>
          );
      }
    } else {
      // Inactive state - use light semantic colors with reduced opacity
      switch (tabKey) {
        case "all":
          return (
            <div className="bg-slate-50 text-slate-600 border border-slate-200 rounded-full px-2 py-0.5 text-xs font-bold">
              {count}
            </div>
          );
        case "submitted":
          return (
            <div className="bg-yellow-50 text-yellow-600 border border-yellow-200 rounded-full px-2 py-0.5 text-xs font-bold">
              {count}
            </div>
          );
        case "approved":
          return (
            <div className="bg-green-50 text-green-600 border border-green-200 rounded-full px-2 py-0.5 text-xs font-bold">
              {count}
            </div>
          );
        case "rejected":
          return (
            <div className="bg-red-50 text-red-600 border border-red-200 rounded-full px-2 py-0.5 text-xs font-bold">
              {count}
            </div>
          );
        case "discussion":
          return (
            <div className="bg-orange-50 text-orange-600 border border-orange-200 rounded-full px-2 py-0.5 text-xs font-bold">
              {count}
            </div>
          );
        default:
          return (
            <div className="bg-slate-50 text-slate-600 border border-slate-200 rounded-full px-2 py-0.5 text-xs font-bold">
              {count}
            </div>
          );
      }
    }
  };

  // Debug log to see the statuses of POs
  console.log(
    "All PO statuses:",
    mockPurchaseOrders.map((po) => po.status)
  );
  console.log(
    "Discussion POs:",
    mockPurchaseOrders.filter((po) => po.status === "discussion")
  );
  console.log("Current tab:", currentTab);
  console.log("Filtered POs:", filteredPOs);

  return (
    <div className="space-y-2 px-4 pt-4 pb-2 max-w-full overflow-x-hidden">
      {/* Clean Header with Statistics */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground font-inter">
            PO Requests
          </h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground font-roboto">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>This Month</span>
              <span className="font-semibold text-foreground">{allCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <span>Total Value</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(totalValue)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section with Document Matching UI Styling */}
      <div className="flex items-center justify-between mt-4">
        {/* Left Side - Modern Tab Filters */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-full">
          {[
            { key: "all", label: "All Requests", count: allCount },
            { key: "submitted", label: "In Review", count: inReviewCount },
            { key: "approved", label: "Approved", count: approvedCount },
            { key: "rejected", label: "Rejected", count: rejectedCount },
            {
              key: "discussion",
              label: "Ready For Review",
              count: discussionCount,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`
                px-4 py-2 flex items-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 border border-b-2
                ${
                  currentTab === tab.key
                    ? "text-gray-900 shadow-lg shadow-black/10 border-[#95A3C2]"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-200 border-transparent"
                }
              `}
              style={
                currentTab === tab.key
                  ? {
                      backgroundColor: "#D8F1FF",
                      borderRadius: "19.5px",
                    }
                  : {}
              }
              onClick={() => setCurrentTab(tab.key as typeof currentTab)}
            >
              <span>{tab.label}</span>
              {getCountBadge(tab.key, tab.count, currentTab === tab.key)}
            </button>
          ))}
        </div>

        {/* Right Side - Search and Filter */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 cursor-pointer hover:text-foreground" />
            <Input
              placeholder="Search vendor, PO number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-9 font-roboto w-64"
            />
          </div>

          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            New PO Request
          </Button>
        </div>
      </div>

      {/* POs Table */}
      <div className="mt-2">
        <POTable purchaseOrders={filteredPOs} />
      </div>

      {/* Minimized PO Tab */}
      {hasMinimizedPO && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={handleRestorePO}
            className="bg-white shadow-md border border-gray-200 text-gray-800 hover:bg-gray-50 py-2 px-4 rounded-md flex items-center"
          >
            <div className="mr-2">
              <div className="text-left font-medium text-sm">
                Resume PO Creation
              </div>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
};

export default PORequestDashboard;
