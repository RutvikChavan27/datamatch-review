import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import POTable from "@/components/po-request/POTable";
import { Search, Plus, Filter, Calendar, DollarSign } from "lucide-react";
import {
  POStatus,
  PurchaseOrder,
  PurchaseOrderSummary,
} from "@/types/po-types";
import { poRequestApi } from "@/services/poRequest";
import { toast } from "sonner";
import { mockPurchaseOrders } from "@/data/mock-data";

const PORequestDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState<"all" | POStatus>("all");
  const [hasMinimizedPO, setHasMinimizedPO] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderSummary[]>(
    []
  );
  const [transformedPOs, setTransformedPOs] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  // Status mapping from API to POStatus enum
  const mapApiStatusToPOStatus = (apiStatus: string): POStatus => {
    const statusMap: Record<string, POStatus> = {
      // Capitalized versions
      Pending: "discussion",
      Submitted: "submitted",
      "In Review": "submitted",
      Approved: "approved",
      Rejected: "rejected",
      Discussion: "discussion",
      Query: "query",
      // Lowercase versions
      pending: "discussion",
      submitted: "submitted",
      "in review": "submitted",
      approved: "approved",
      rejected: "rejected",
      discussion: "discussion",
      query: "query",
      // Database-style versions
      pending_review: "submitted",
      draft: "submitted",
      completed: "approved",
    };
    const mappedStatus = statusMap[apiStatus] || "submitted";
    console.log(`🔄 Status mapping: "${apiStatus}" -> "${mappedStatus}"`);
    return mappedStatus;
  };

  // Transform API data to match PurchaseOrder interface
  const transformApiDataToPurchaseOrder = (
    apiData: PurchaseOrderSummary
  ): PurchaseOrder => {
    return {
      id: apiData.id.toString(),
      reference: apiData.reference,
      title: apiData.title,
      vendor: apiData.vendor.name,
      department: apiData.department,
      requestor: apiData.requester,
      totalAmount: parseFloat(apiData.total),
      status: mapApiStatusToPOStatus(apiData.status),
      lineItems: apiData.items.map((item) => ({
        id: item.id.toString(),
        itemCode: item.item_code,
        description: item.description,
        quantity: item.quantity,
        uomId: item.uom,
        unitPrice: parseFloat(item.unit_price),
        totalPrice: item.quantity * parseFloat(item.unit_price),
      })),
      createdAt: new Date(apiData.created_at),
      updatedAt: new Date(apiData.updated_at),
      expectedDeliveryDate: apiData.due_date
        ? new Date(apiData.due_date)
        : null,
      deliveryAddress: apiData.address,
      paymentTerms: apiData.payment_terms,
      notes: apiData.notes,
    };
  };

  // Fetch Purchase Orders from API or use mock data
  useEffect(() => {
    const fetchPOs = async () => {
      setLoading(true);
      setError(null);
      try {
        if (useMockData) {
          console.log("🎭 Using Mock Data for testing");
          console.log(
            "🔍 Mock Data Statuses:",
            mockPurchaseOrders.map((po) => ({
              id: po.id,
              reference: po.reference,
              status: po.status,
            }))
          );
          setTransformedPOs(mockPurchaseOrders);
          toast.success(
            `Loaded ${mockPurchaseOrders.length} purchase orders (Mock Data)`
          );
        } else {
          const poData = await poRequestApi.getAll();
          console.log("🔍 Raw API Data:", poData);
          console.log(
            "🔍 API Status Values:",
            poData.map((po) => ({ id: po.id, status: po.status }))
          );
          setPurchaseOrders(poData);

          // Transform API data to match PurchaseOrder interface
          const transformed = poData.map(transformApiDataToPurchaseOrder);
          console.log(
            "🔍 Transformed Statuses:",
            transformed.map((po) => ({ id: po.id, status: po.status }))
          );
          setTransformedPOs(transformed);

          toast.success(`Loaded ${poData.length} purchase orders`);
        }
      } catch (err) {
        console.error("Failed to fetch purchase orders:", err);
        setError("Failed to load purchase orders. Please try again.");
        toast.error("Failed to load purchase orders");
      } finally {
        setLoading(false);
      }
    };
    fetchPOs();
  }, [useMockData]);

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
  const filteredPOs = transformedPOs.filter((po) => {
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
  const allCount = transformedPOs.length;
  const inReviewCount = transformedPOs.filter(
    (po) => po.status === "submitted"
  ).length;
  const approvedCount = transformedPOs.filter(
    (po) => po.status === "approved"
  ).length;
  const rejectedCount = transformedPOs.filter(
    (po) => po.status === "rejected"
  ).length;
  const discussionCount = transformedPOs.filter(
    (po) => po.status === "discussion"
  ).length;

  console.log("📊 Tab Counts:", {
    all: allCount,
    submitted: inReviewCount,
    approved: approvedCount,
    rejected: rejectedCount,
    discussion: discussionCount,
  });

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

  return (
    <div className="flex flex-col h-full max-w-full overflow-x-hidden">
      {/* Header Section */}
      <div className="space-y-2 px-4 pt-4 pb-2 bg-white">
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
                <span className="font-semibold text-foreground">
                  {allCount}
                </span>
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

            {/* <Button
              onClick={() => setUseMockData(!useMockData)}
              variant="outline"
              className="mr-2"
            >
              {useMockData ? "Use API Data" : "Use Mock Data"}
            </Button> */}
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              New PO Request
            </Button>
          </div>
        </div>
      </div>

      {/* Table Section - This will take the remaining space */}
      <div className="flex-1 min-h-0 px-4 pb-2">
        <div className="h-full flex flex-col">
          <div className="flex-1 min-h-0">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-muted-foreground">
                    Loading purchase orders...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-red-500 mb-2">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <POTable purchaseOrders={filteredPOs} filterKey={`${currentTab}-${searchQuery}`} />
            )}
          </div>
        </div>
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
