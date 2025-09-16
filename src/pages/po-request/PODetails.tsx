import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
// Removed duplicate import - consolidated below
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { users } from "@/data/mock-data";
import {
  PurchaseOrder,
  POApprovalFlow,
  POApprovalStage,
} from "@/types/po-types";
import {
  poRequestApi,
  PurchaseOrderSummary,
  discussionsApi,
} from "@/services/poRequest";
// import { formatCurrency } from "@/lib/formatters";

// Local formatCurrency function
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

import StatusBadge from "@/components/po-request/StatusBadge";
import ClarificationSection, {
  discussionsType,
} from "@/components/po-request/ClarificationSection";
import { toast } from "sonner";
import {
  ArrowLeft,
  Download,
  Eye,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  MessageSquare,
  Plus,
  FileText,
  Check,
  Package,
  Edit,
  Clock,
  X,
  CheckCircle,
  XCircle,
  Printer,
  FileImage,
  FileSpreadsheet,
  ExternalLink,
  HelpCircle,
  MapPin,
  Route,
  Files,
  MoreHorizontal,
  User,
  Calendar,
  Briefcase,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

const PODetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [po, setPo] = useState<PurchaseOrder | null>(null);
  const [approvalFlow, setApprovalFlow] = useState<POApprovalFlow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<any>(null);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const [showDiscussionPopover, setShowDiscussionPopover] = useState(false);
  const [discussionMessage, setDiscussionMessage] = useState("");
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState("");
  const [discussions, setDiscussions] = useState<discussionsType[]>([]);
  const [discussionsLoading, setDiscussionsLoading] = useState(false);
  const [isStartingDiscussion, setIsStartingDiscussion] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [approvingItemIds, setApprovingItemIds] = useState<Set<string>>(new Set());
  const [rejectingItemIds, setRejectingItemIds] = useState<Set<string>>(new Set());

  // Initialize notesValue when po is loaded
  useEffect(() => {
    if (po) {
      setNotesValue(po.notes || "");
    }
  }, [po]);

  // Function to check if PO has ongoing discussion (multiple messages)
  const hasOngoingDiscussion = (po: PurchaseOrder) => {
    // Check if discussions exist and have more than 1 message
    return discussions && discussions.length > 1;
  };

  // Function to check if PO has single discussion message (should show ClarificationSection)
  const hasSingleDiscussion = () => {
    const hasOneDiscussion = discussions && discussions.length === 1;
    const statusIsDiscussion = po?.status === "discussion";
    
    return hasOneDiscussion || statusIsDiscussion;
  };

  // Function to check if PO has discussion request (clarification request without response)
  const hasDiscussionRequest = (po: PurchaseOrder) => {
    return po.clarificationRequest && !po.clarificationRequest.response;
  };

  // Transform API data to match frontend PurchaseOrder interface
  const transformApiDataToPO = (
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
        unitPrice: parseFloat(item.unit_price),
        totalPrice: item.quantity * parseFloat(item.unit_price),
        uom: "Each", // Default since API doesn't return UoM name
      })),
      createdAt: new Date(apiData.created_at),
      updatedAt: new Date(apiData.updated_at),
      expectedDeliveryDate: apiData.due_date
        ? new Date(apiData.due_date)
        : undefined,
      deliveryAddress: apiData.address,
      paymentTerms: apiData.payment_terms || "Net 30",
      notes: apiData.notes || "",
    };
  };

  // Map API status strings to POStatus enum
  const mapApiStatusToPOStatus = (apiStatus: string) => {
    const statusMap: Record<string, any> = {
      // Database status values (lowercase)
      draft: "draft",
      pending_review: "submitted",
      approved: "approved",
      rejected: "rejected",
      completed: "approved",
      discussion: "discussion",
      // Display status values (capitalized) - for compatibility
      Draft: "draft",
      "Pending Review": "submitted",
      Submitted: "submitted",
      "In Review": "submitted",
      Approved: "approved",
      Rejected: "rejected",
      Discussion: "discussion",
      Query: "query",
    };
    return statusMap[apiStatus] || "submitted";
  };

  // Fetch discussions data from API
  const fetchDiscussions = async () => {
    if (!id) return;

    try {
      setDiscussionsLoading(true);
      const discussionResponse = await discussionsApi.getById(parseInt(id));
      console.log("discussionResponse in PODetails:", discussionResponse);
      setDiscussions(discussionResponse || []);
    } catch (error) {
      console.error("Error fetching discussions:", error);
      setDiscussions([]);
    } finally {
      setDiscussionsLoading(false);
    }
  };

  // Fetch PO data from API
  useEffect(() => {
    const fetchPOData = async () => {
      if (!id) {
        navigate("/po-requests");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const apiData = await poRequestApi.getById(parseInt(id));
        const transformedPO = transformApiDataToPO(apiData);
        setPo(transformedPO);

        // TODO: Fetch approval flow data when API is available
        // For now, keep approval flow as null since there's no API endpoint
        setApprovalFlow(null);

        // Fetch discussions
        await fetchDiscussions();

        toast.success("Purchase order loaded successfully");
      } catch (error) {
        console.error("Error fetching PO data:", error);
        setError("Failed to load purchase order details");
        toast.error("Failed to load purchase order details");
        // Navigate back to dashboard on error
        // navigate("/po-requests");
      } finally {
        setLoading(false);
      }
    };

    fetchPOData();
  }, [id, navigate]);

  const handleBack = () => {
    navigate("/po-requests");
  };

  const handleEdit = () => {
    // In a real app, we would navigate to the edit page
    // For now, just navigate back to the dashboard
    navigate("/po-requests");
  };

  const handleClarificationResponse = (response: string) => {
    if (po) {
      const updatedPo = {
        ...po,
        clarificationRequest: {
          ...po.clarificationRequest!,
          response,
          respondedAt: new Date(),
        },
      };
      setPo(updatedPo);
      toast.success("Response submitted successfully");
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setNotesValue(value);
    }
  };

  const handleSaveNotes = async () => {
    try {
      // Here you would typically save to your API
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      // Update local PO object if needed
      if (po) {
        po.notes = notesValue;
      }

      toast.success("Notes saved successfully");
      setEditingNotes(false);
    } catch (error) {
      toast.error("Failed to save notes");
    }
  };

  const handleSendDiscussionMessage = async () => {
    if (discussionMessage.trim() && po) {
      try {
        await discussionsApi.create({
          po_id: parseInt(po.id),
          message: discussionMessage.trim(),
          user_name: "Current User", // In a real app, this would come from auth context
        });

        toast.success("Message sent successfully");
        setDiscussionMessage("");
        setShowDiscussionPopover(false);

        // Refresh discussions to show the new message
        await fetchDiscussions();
      } catch (error) {
        console.error("Error sending discussion message:", error);
        toast.error("Failed to send message");
      }
    }
  };

  const handleStartDiscussionRequest = async (message: string) => {
    // This is called when ClarificationSection successfully starts a discussion
    toast.success("Discussion started successfully");

    // Refresh discussions to get the updated data
    await fetchDiscussions();
  };
  // Fetch documents from API or use fallback data
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!id) return;

      try {
        setDocumentsLoading(true);
        const apiDocuments = await poRequestApi.getDocuments(parseInt(id));
        setDocuments(apiDocuments);
      } catch (error) {
        console.warn(
          "Failed to fetch documents from API, using fallback data:",
          error
        );
        // Fallback to mock data
        setDocuments([
          {
            id: "1",
            name: `PO Document_${po?.reference || "PO-2024-001"}.pdf`,
            type: "application/pdf",
            size: 1024000,
            url: "#",
            uploader: po?.requestor || "System",
            uploadDate: po?.createdAt || new Date(),
          },
          {
            id: "2",
            name: "Approval Form.pdf",
            type: "application/pdf",
            size: 486000,
            url: "#",
            uploader: po?.requestor || "System",
            uploadDate: po?.createdAt || new Date(),
          },
        ]);
      } finally {
        setDocumentsLoading(false);
      }
    };

    if (po) {
      fetchDocuments();
    }
  }, [po, id]);

  // Mock recent activity data
  const getRecentActivity = () => {
    return [
      {
        id: "1",
        dateTime: new Date(2025, 1, 7, 1, 37),
        action: "Added Document",
        description: "Invoice_54_222_21.pdf uploaded to Agreements folder",
      },
      {
        id: "2",
        dateTime: new Date(2025, 1, 7, 1, 35, 22),
        action: "Added Document",
        description: "PO-2024-011.pdf uploaded to Agreements folder",
      },
      {
        id: "3",
        dateTime: new Date(2025, 1, 7, 1, 30, 15),
        action: "Added Document",
        description: "Contract_Legal_2025.pdf uploaded to Agreements folder",
      },
    ];
  };

  const recentActivity = getRecentActivity();

  // Helper function to get icon for document type with Purchase Order Summary styling
  const getDocumentIcon = (type: string) => {
    if (type.includes("pdf")) {
      return (
        <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 text-red-600" />
        </div>
      );
    }
    if (type.includes("image")) {
      return (
        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
          <FileImage className="w-4 h-4 text-blue-600" />
        </div>
      );
    }
    if (
      type.includes("excel") ||
      type.includes("sheet") ||
      type.includes("csv")
    ) {
      return (
        <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
          <FileSpreadsheet className="w-4 h-4 text-green-600" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
        <FileText className="w-4 h-4 text-gray-600" />
      </div>
    );
  };

  const handlePreviewDocument = (doc: any, index: number) => {
    setPreviewDocument(doc);
    setCurrentDocumentIndex(index);
    setShowDocumentPreview(true);
    setZoomLevel(1);
  };

  const handleNextDocument = () => {
    const nextIndex = (currentDocumentIndex + 1) % documents.length;
    setPreviewDocument(documents[nextIndex]);
    setCurrentDocumentIndex(nextIndex);
    setZoomLevel(1);
  };

  const handlePreviousDocument = () => {
    const prevIndex =
      (currentDocumentIndex - 1 + documents.length) % documents.length;
    setPreviewDocument(documents[prevIndex]);
    setCurrentDocumentIndex(prevIndex);
    setZoomLevel(1);
  };

  const handleStartDiscussion = async () => {
    if (!po) return;
    
    try {
      setIsStartingDiscussion(true);
      
      // Update status via API
      await poRequestApi.updateStatus(parseInt(po.id), {
        status: "discussion",
      });
      
      // Update local state to trigger UI re-render
      const updatedPo = {
        ...po,
        status: "discussion" as any,
        updatedAt: new Date()
      };
      setPo(updatedPo);
      
      toast.success(`Discussion started for ${po.reference}`);
      console.log("✅ Discussion started successfully, status updated to:", updatedPo.status);
    } catch (error) {
      console.error("❌ Failed to start discussion:", error);
      toast.error("Failed to start discussion. Please try again.");
    } finally {
      setIsStartingDiscussion(false);
    }
  };

  const handleApprove = async () => {
    if (!po) return;
    
    try {
      setIsApproving(true);
      
      // Call approve API
      await poRequestApi.approve(parseInt(po.id));
      
      // Update local state to trigger UI re-render
      const updatedPo = {
        ...po,
        status: "approved" as any,
        updatedAt: new Date()
      };
      setPo(updatedPo);
      
      toast.success(`Purchase order ${po.reference} has been approved successfully!`);
    } catch (error) {
      console.error("❌ Failed to approve purchase order:", error);
      toast.error("Failed to approve purchase order. Please try again.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!po) return;
    
    try {
      setIsRejecting(true);
      
      // Call reject API
      await poRequestApi.reject(parseInt(po.id));
      
      // Update local state to trigger UI re-render
      const updatedPo = {
        ...po,
        status: "rejected" as any,
        updatedAt: new Date()
      };
      setPo(updatedPo);
      
      toast.success(`Purchase order ${po.reference} has been rejected.`);
    } catch (error) {
      console.error("❌ Failed to reject purchase order:", error);
      toast.error("Failed to reject purchase order. Please try again.");
    } finally {
      setIsRejecting(false);
    }
  };

  const handleApproveItem = async (itemId: string) => {
    if (!po) return;
    
    try {
      // Add item to approving set
      setApprovingItemIds(prev => new Set(prev).add(itemId));
      
      // TODO: Call item-specific approve API when available
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Item ${itemId} has been approved successfully!`);
    } catch (error) {
      console.error("❌ Failed to approve item:", error);
      toast.error("Failed to approve item. Please try again.");
    } finally {
      // Remove item from approving set
      setApprovingItemIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRejectItem = async (itemId: string) => {
    if (!po) return;
    
    try {
      // Add item to rejecting set
      setRejectingItemIds(prev => new Set(prev).add(itemId));
      
      // TODO: Call item-specific reject API when available
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Item ${itemId} has been rejected.`);
    } catch (error) {
      console.error("❌ Failed to reject item:", error);
      toast.error("Failed to reject item. Please try again.");
    } finally {
      // Remove item from rejecting set
      setRejectingItemIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  // Function to combine approval flow and history events into a single timeline
  const getCombinedTimeline = () => {
    if (!po) return [];

    let timeline = [];

    // Add PO creation event
    timeline.push({
      id: "creation",
      type: "creation",
      title: "PO Created",
      user: po.requestor,
      timestamp: po.createdAt,
      description: "Purchase order was created and submitted for approval.",
    });

    // Add approval flow events if they exist
    if (approvalFlow) {
      approvalFlow.stages.forEach((stage) => {
        if (stage.status !== "pending") {
          timeline.push({
            id: `stage-${stage.id}`,
            type:
              stage.status === "approved"
                ? "approved"
                : stage.status === "query"
                ? "query"
                : "rejected",
            title:
              stage.status === "approved"
                ? `Approved by ${stage.approver}`
                : stage.status === "query"
                ? `Query by ${stage.approver}`
                : `Rejected by ${stage.approver}`,
            user: stage.approver,
            timestamp: stage.timestamp,
            description:
              stage.comments ||
              (stage.status === "approved"
                ? `PO was approved at the "${stage.name}" stage.`
                : stage.status === "query"
                ? `PO was queried at the "${stage.name}" stage.`
                : `PO was rejected at the "${stage.name}" stage.`),
            stage: stage.name,
          });
        }
      });
    }

    // Add status-specific events based on current PO status
    if (po.status === "discussion") {
      timeline.push({
        id: "status-discussion",
        type: "discussion",
        title: "In Discussion",
        user: "Manager",
        timestamp: po.updatedAt,
        description: "Purchase order is currently under discussion.",
      });
    } else if (po.status === "query") {
      // For "Ready For Review" status, show "In Discussion" instead of rejected
      timeline.push({
        id: "status-query",
        type: "discussion",
        title: "In Discussion",
        user: "Manager",
        timestamp: po.updatedAt,
        description: "Purchase order is ready for review and discussion.",
      });
    } else if (po.status === "approved") {
      timeline.push({
        id: "status-approved",
        type: "approved",
        title: "PO Approved",
        user:
          approvalFlow?.stages[approvalFlow.stages.length - 1]?.approver ||
          "Manager",
        timestamp: po.updatedAt,
        description: "Purchase order has been fully approved.",
      });
    } else if (po.status === "rejected") {
      timeline.push({
        id: "status-rejected",
        type: "rejected",
        title: "PO Rejected",
        user:
          approvalFlow?.stages[approvalFlow.stages.length - 1]?.approver ||
          "Manager",
        timestamp: po.updatedAt,
        description: "Purchase order has been rejected.",
      });
    }

    // Sort by timestamp
    return timeline.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Loading purchase order details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !po) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error || "Purchase order not found"}</p>
          <button
            onClick={() => navigate("/po-requests")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to PO Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 mr-[-20px]">
      <div className="flex">
        {/* Main Content - Left Panel */}
        <div className="w-full pr-2 py-4">
          <div className="space-y-4">
            {/* Breadcrumb Navigation */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/po-requests" className="font-medium">
                      PO Requests
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="">
                    Purchase Order Details
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* PO Header Section */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {po.title}
                    </h2>
                    {/* <h1 className="text-xl font-bold">{po.title}</h1> */}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-medium text-gray-500">
                        {po.reference}
                      </span>
                      <StatusBadge status={po.status} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {(po.status === "discussion" || po.status === "submitted") && (
                    <>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {}}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>More options</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {}}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Print</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Button 
                        variant="outline" 
                        onClick={handleReject}
                        disabled={isRejecting || isApproving}
                      >
                        {isRejecting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                            Rejecting...
                          </>
                        ) : (
                          "Reject"
                        )}
                      </Button>
                      <Button 
                        onClick={handleApprove}
                        disabled={isApproving || isRejecting}
                      >
                        {isApproving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Approving...
                          </>
                        ) : (
                          "Approve"
                        )}
                      </Button>
                    </>
                  )}

                  {po.status === "submitted" && (
                    <>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {}}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>More options</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {}}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Print</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </>
                  )}

                  {(po.status === "rejected" || po.status === "approved") && (
                    <>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {}}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>More options</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {}}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Print</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Tabs defaultValue="details">
              {/* Properly structured TabsList with custom styling */}
              <TabsList className="h-auto p-0 bg-transparent border-b border-[#e4e5e9] rounded-none w-full justify-start gap-2 mb-6">
                <TabsTrigger
                  value="details"
                  className="bg-white rounded-t-md border-b-2 border-transparent px-4 py-2.5 flex items-center data-[state=active]:border-[#27313e] data-[state=active]:bg-gray-100 data-[state=inactive]:bg-transparent hover:bg-gray-50"
                >
                  <span
                    style={{ fontSize: "16px" }}
                    className="data-[state=active]:font-bold data-[state=active]:text-[#080808] data-[state=inactive]:text-[#333333] data-[state=inactive]:font-medium"
                  >
                    PO Details
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  className="bg-white rounded-t-md border-b-2 border-transparent px-4 py-2.5 flex items-center data-[state=active]:border-[#27313e] data-[state=active]:bg-gray-100 data-[state=inactive]:bg-transparent hover:bg-gray-50"
                >
                  <span
                    style={{ fontSize: "16px" }}
                    className="data-[state=active]:font-bold data-[state=active]:text-[#080808] data-[state=inactive]:text-[#333333] data-[state=inactive]:font-medium"
                  >
                    Timeline
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="bg-white rounded-t-md border-b-2 border-transparent px-4 py-2.5 flex items-center data-[state=active]:border-[#27313e] data-[state=active]:bg-gray-100 data-[state=inactive]:bg-transparent hover:bg-gray-50"
                >
                  <span
                    style={{ fontSize: "16px" }}
                    className="data-[state=active]:font-bold data-[state=active]:text-[#080808] data-[state=inactive]:text-[#333333] data-[state=inactive]:font-medium"
                  >
                    Documents
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="discussion"
                  className="bg-white rounded-t-md border-b-2 border-transparent px-4 py-2.5 flex items-center data-[state=active]:border-[#27313e] data-[state=active]:bg-gray-100 data-[state=inactive]:bg-transparent hover:bg-gray-50 relative"
                >
                  <span
                    style={{ fontSize: "16px" }}
                    className="data-[state=active]:font-bold data-[state=active]:text-[#080808] data-[state=inactive]:text-[#333333] data-[state=inactive]:font-medium"
                  >
                    Discussion
                  </span>
                  {/* Red dot indicator */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#ff2447] rounded-full border border-white"></div>
                </TabsTrigger>
              </TabsList>

              {/* PO Details Tab */}
              <TabsContent value="details" className="space-y-4">
                <div>
                  <h2 className="text-lg font-medium mb-3">Line Items</h2>
                  <div className="border rounded-xl overflow-hidden bg-white shadow-md">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-muted/50 transition-colors">
                          <TableHead
                            className="w-[10%] min-w-[80px] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4"
                            style={{
                              backgroundColor: "#DFE7F3",
                              borderBottomColor: "#c9d1e0",
                              borderTopColor: "#c9d1e0",
                            }}
                          >
                            Item Code
                          </TableHead>
                          <TableHead
                            className="w-[35%] min-w-[200px] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4"
                            style={{
                              backgroundColor: "#DFE7F3",
                              borderBottomColor: "#c9d1e0",
                              borderTopColor: "#c9d1e0",
                            }}
                          >
                            <div className="truncate" title="Description">
                              Description
                            </div>
                          </TableHead>
                          <TableHead
                            className="w-[10%] min-w-[80px] text-right font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4"
                            style={{
                              backgroundColor: "#DFE7F3",
                              borderBottomColor: "#c9d1e0",
                              borderTopColor: "#c9d1e0",
                            }}
                          >
                            Quantity
                          </TableHead>
                          <TableHead
                            className="w-[8%] min-w-[80px] text-right font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4"
                            style={{
                              backgroundColor: "#DFE7F3",
                              borderBottomColor: "#c9d1e0",
                              borderTopColor: "#c9d1e0",
                            }}
                          >
                            UoM
                          </TableHead>
                          <TableHead
                            className="w-[12%] min-w-[100px] text-right font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4"
                            style={{
                              backgroundColor: "#DFE7F3",
                              borderBottomColor: "#c9d1e0",
                              borderTopColor: "#c9d1e0",
                            }}
                          >
                            Unit Price
                          </TableHead>
                          <TableHead
                            className="w-[12%] min-w-[100px] text-right font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4"
                            style={{
                              backgroundColor: "#DFE7F3",
                              borderBottomColor: "#c9d1e0",
                              borderTopColor: "#c9d1e0",
                            }}
                          >
                            Total
                          </TableHead>
                          <TableHead
                            className="w-[8%] min-w-[80px] text-center font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4"
                            style={{
                              backgroundColor: "#DFE7F3",
                              borderBottomColor: "#c9d1e0",
                              borderTopColor: "#c9d1e0",
                            }}
                          >
                            Status
                          </TableHead>
                          {po.status === "discussion" && (
                            <TableHead
                              className="w-[12%] min-w-[100px] text-left font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4"
                              style={{
                                backgroundColor: "#DFE7F3",
                                borderBottomColor: "#c9d1e0",
                                borderTopColor: "#c9d1e0",
                              }}
                            >
                              Actions
                            </TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {po.lineItems.map((item) => (
                          <TableRow
                            key={item.id}
                            className="h-12 hover:bg-muted/50 transition-colors"
                          >
                            <TableCell className="font-fira-code text-sm font-medium py-2 border-r-0 text-foreground truncate px-4">
                              <div className="truncate" title={item.itemCode}>
                                {item.itemCode}
                              </div>
                            </TableCell>
                            <TableCell className="py-2 border-r-0 text-sm text-foreground truncate px-4">
                              <div
                                className="truncate"
                                title={item.description}
                              >
                                {item.description}
                              </div>
                            </TableCell>
                            <TableCell className="text-right py-2 border-r-0 text-sm text-foreground px-4">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="text-right py-2 border-r-0 text-sm text-foreground px-4">
                              <div
                                className="truncate"
                                title={item.uom || "Each"}
                              >
                                {item.uom || "Each"}
                              </div>
                            </TableCell>
                            <TableCell className="text-right py-2 border-r-0 text-sm text-foreground px-4">
                              {formatCurrency(item.unitPrice)}
                            </TableCell>
                            <TableCell className="text-right font-medium py-2 border-r-0 text-sm text-foreground px-4">
                              {formatCurrency(item.totalPrice)}
                            </TableCell>
                            <TableCell className="text-center py-2 border-r-0 text-sm text-foreground px-4">
                              {po.status === "approved" ? (
                                <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                              ) : po.status === "rejected" ? (
                                <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                              ) : po.status === "query" ? (
                                <HelpCircle className="h-4 w-4 text-amber-500 mx-auto" />
                              ) : (
                                <Clock className="h-4 w-4 text-blue-500 mx-auto" />
                              )}
                            </TableCell>
                            {po.status === "discussion" && (
                              <TableCell className="text-center py-2 border-r-0 px-4">
                                <div className="flex items-center justify-center gap-2">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="default"
                                          size="sm"
                                          className="h-9 w-9 p-0 bg-green-600 hover:bg-green-700 text-white"
                                          onClick={() => handleApproveItem(item.id)}
                                          disabled={approvingItemIds.has(item.id) || rejectingItemIds.has(item.id)}
                                        >
                                          {approvingItemIds.has(item.id) ? (
                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                          ) : (
                                            <Check className="w-4 h-4 text-white" />
                                          )}
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Approve</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          onClick={() => handleRejectItem(item.id)}
                                          disabled={rejectingItemIds.has(item.id) || approvingItemIds.has(item.id)}
                                        >
                                          {rejectingItemIds.has(item.id) ? (
                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                                          ) : (
                                            <X className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Reject</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="edit"
                                          size="icon"
                                          onClick={() => {}}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Edit</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}

                        {/* Total Row */}
                        <TableRow className="bg-muted/20">
                          <TableCell
                            colSpan={5}
                            className="text-right font-medium border-r-0"
                          >
                            Total
                          </TableCell>
                          <TableCell className="text-right font-bold border-r-0">
                            {formatCurrency(po.totalAmount)}
                          </TableCell>
                          <TableCell></TableCell>
                          {po.status === "discussion" && (
                            <TableCell></TableCell>
                          )}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Notes Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">Notes</h2>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => setEditingNotes(!editingNotes)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Textarea
                      value={notesValue || ""}
                      onChange={handleNotesChange}
                      readOnly={!editingNotes}
                      placeholder={
                        editingNotes
                          ? "Add notes here..."
                          : "No notes available"
                      }
                      className={`min-h-[100px] resize-none ${
                        !editingNotes ? "bg-muted/30 cursor-default" : ""
                      }`}
                      maxLength={500}
                    />
                    {editingNotes && (
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-muted-foreground">
                          {500 - (notesValue?.length || 0)} characters remaining
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingNotes(false);
                              setNotesValue(po?.notes || "");
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSaveNotes}
                            className="button-primary"
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Timeline Tab with Recent Activity Table */}
              <TabsContent value="timeline" className="space-y-4">
                <div>
                  <h2 className="text-lg font-medium mb-3">Recent Activity</h2>
                  <div className="border rounded-xl overflow-hidden bg-white shadow-md">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-muted/50 transition-colors">
                          <TableHead
                            className="w-[12%] min-w-[140px] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4"
                            style={{
                              backgroundColor: "#DFE7F3",
                              borderBottomColor: "#c9d1e0",
                              borderTopColor: "#c9d1e0",
                            }}
                          >
                            Date & Time
                          </TableHead>
                          <TableHead
                            className="w-[15%] min-w-[150px] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4"
                            style={{
                              backgroundColor: "#DFE7F3",
                              borderBottomColor: "#c9d1e0",
                              borderTopColor: "#c9d1e0",
                            }}
                          >
                            Action
                          </TableHead>
                          <TableHead
                            className="w-[73%] min-w-[200px] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4"
                            style={{
                              backgroundColor: "#DFE7F3",
                              borderBottomColor: "#c9d1e0",
                              borderTopColor: "#c9d1e0",
                            }}
                          >
                            <div className="truncate" title="Description">
                              Description
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentActivity.map((activity) => (
                          <TableRow
                            key={activity.id}
                            className="h-12 hover:bg-muted/50 transition-colors"
                          >
                            <TableCell className="font-roboto text-sm py-2 border-r-0 text-foreground px-4">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-gray-400" />
                                <div
                                  className="truncate"
                                  title={`${activity.dateTime.toLocaleDateString(
                                    "en-GB"
                                  )} ${activity.dateTime.toLocaleTimeString(
                                    "en-GB",
                                    { hour12: false }
                                  )}`}
                                >
                                  {activity.dateTime.toLocaleDateString(
                                    "en-GB"
                                  )}{" "}
                                  {activity.dateTime.toLocaleTimeString(
                                    "en-GB",
                                    {
                                      hour12: false,
                                    }
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium py-2 border-r-0 text-sm text-foreground px-4">
                              <div className="truncate" title={activity.action}>
                                {activity.action}
                              </div>
                            </TableCell>
                            <TableCell className="py-2 border-r-0 text-sm text-foreground px-4">
                              <div
                                className="truncate"
                                title={activity.description}
                              >
                                {activity.description}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* Documents Tab - Table Format */}
              <TabsContent value="documents" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">Documents</h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download All
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download all documents</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="border rounded-xl overflow-hidden bg-white shadow-md">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-muted/50 transition-colors">
                        <TableHead
                          className="w-[40%] min-w-[200px] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4"
                          style={{
                            backgroundColor: "#DFE7F3",
                            borderBottomColor: "#c9d1e0",
                            borderTopColor: "#c9d1e0",
                          }}
                        >
                          <div className="truncate" title="Document Name">
                            Document Name
                          </div>
                        </TableHead>
                        <TableHead
                          className="w-[8%] min-w-[80px] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4"
                          style={{
                            backgroundColor: "#DFE7F3",
                            borderBottomColor: "#c9d1e0",
                            borderTopColor: "#c9d1e0",
                          }}
                        >
                          Size
                        </TableHead>
                        <TableHead
                          className="w-[15%] min-w-[150px] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4"
                          style={{
                            backgroundColor: "#DFE7F3",
                            borderBottomColor: "#c9d1e0",
                            borderTopColor: "#c9d1e0",
                          }}
                        >
                          Added by
                        </TableHead>
                        <TableHead
                          className="w-[12%] min-w-[140px] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4"
                          style={{
                            backgroundColor: "#DFE7F3",
                            borderBottomColor: "#c9d1e0",
                            borderTopColor: "#c9d1e0",
                          }}
                        >
                          Date & Time
                        </TableHead>
                        <TableHead
                          className="w-[12%] min-w-[100px] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t px-4"
                          style={{
                            backgroundColor: "#DFE7F3",
                            borderBottomColor: "#c9d1e0",
                            borderTopColor: "#c9d1e0",
                          }}
                        >
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((doc, index) => (
                        <TableRow
                          key={doc.id}
                          className="h-12 hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-medium py-2 border-r-0 text-sm text-foreground px-4">
                            <div className="flex items-center gap-3">
                              {getDocumentIcon(doc.type)}
                              <div className="flex-1 min-w-0">
                                <div className="truncate" title={doc.name}>
                                  {doc.name}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-2 border-r-0 text-sm text-foreground px-4">
                            {Math.round(doc.size / 1024)} KB
                          </TableCell>
                          <TableCell className="py-2 border-r-0 text-sm text-foreground px-4">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3 text-gray-400" />
                              <div className="truncate" title={doc.uploader}>
                                {doc.uploader}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-roboto text-sm py-2 border-r-0 text-foreground px-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <div
                                className="truncate"
                                title={`${doc.uploadDate.toLocaleDateString(
                                  "en-GB"
                                )} ${doc.uploadDate.toLocaleTimeString(
                                  "en-GB",
                                  {
                                    hour12: false,
                                  }
                                )}`}
                              >
                                {doc.uploadDate.toLocaleDateString("en-GB")}{" "}
                                {doc.uploadDate.toLocaleTimeString("en-GB", {
                                  hour12: false,
                                })}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-2 border-r-0 px-4">
                            <div className="flex items-center gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handlePreviewDocument(doc, index)
                                      }
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>View</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Download</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>More</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Discussion Tab */}
              <TabsContent value="discussion" className="space-y-6">
                {discussionsLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading discussions...</p>
                  </div>
                ) : hasOngoingDiscussion(po) ? (
                  // Show ongoing discussion UI for POs with multiple messages
                  <div className="bg-white border rounded-lg p-6 space-y-4">
                    {/* Render actual discussion messages from API */}
                    {discussions.map((discussion) => (
                      <div key={discussion.id} className="flex gap-3">
                        <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {discussion.user_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-3 w-3 text-gray-400" />
                            <span className="font-medium text-sm">
                              {discussion.user_name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(
                                discussion.created_at
                              ).toLocaleDateString("en-GB")}
                              ,{" "}
                              {new Date(
                                discussion.created_at
                              ).toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed">
                            {discussion.message}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Reply Section */}
                    <div className="border-t pt-4">
                      <div className="flex gap-3">
                        <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          ME
                        </div>
                        <div className="flex-1">
                          <span className="text-sm text-muted-foreground mb-2 block">
                            Response
                          </span>
                          <div className="flex gap-2">
                            <Textarea
                              placeholder="Type your response..."
                              className="flex-1 min-h-[80px] resize-none text-sm"
                              value={discussionMessage}
                              onChange={(e) =>
                                setDiscussionMessage(e.target.value)
                              }
                            />
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={handleSendDiscussionMessage}
                              disabled={!discussionMessage.trim()}
                            >
                              Send
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : hasSingleDiscussion() ? (
                  // Show message indicating discussion is in right panel
                  <div className="text-center py-12 space-y-4">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-8 h-8 text-purple-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">
                        Discussion Request
                      </h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        This purchase order has a discussion request. Please
                        check the right panel for details.
                      </p>
                    </div>
                  </div>
                ) : hasDiscussionRequest(po) ? (
                  // Show the Discussion Request content - handled by ClarificationSection in right panel
                  <div className="text-center py-12 space-y-4">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-8 h-8 text-red-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">
                        Discussion Request
                      </h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        This purchase order has a discussion request. Please
                        check the right panel for details.
                      </p>
                    </div>
                  </div>
                ) : (
                  // Show empty state for POs with no discussion
                  <div className="text-center py-12 space-y-4">
                    {/* Chat bubble icon */}
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-8 h-8 text-gray-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">No Discussion Yet</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Start a discussion about this purchase order to
                        collaborate with your team.
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="default"
                      onClick={() => {
                        handleStartDiscussion();
                      }}
                      disabled={isStartingDiscussion}
                    >
                      {isStartingDiscussion ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Starting...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Start Discussion
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Purchase Order Summary - Right Panel */}
        <div className="bg-white max-w-[307px] ml-2 px-4 py-4 space-y-6 border border-gray-200 shadow-lg h-[calc(100vh)] overflow-y-auto border-t-0">
          {/* Discussion Request Card - shown when discussion length is 1 or PO status is discussion */}
          {hasSingleDiscussion() && (
            <ClarificationSection
              po={po}
              onRespond={(message) => {
                handleStartDiscussionRequest(message);
              }}
              readOnly={false}
            />
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-medium pb-4 flex items-center gap-3">
              Purchase Order Summary
            </h3>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Vendor
                </p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {po.vendor}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Briefcase className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Department
                </p>
                <p className="text-sm text-gray-900 truncate">
                  {po.department}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Requested by
                </p>
                <p className="text-sm text-gray-900 truncate">{po.requestor}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Calendar className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Created Date
                </p>
                <p className="text-sm text-gray-900">
                  {po.createdAt.toLocaleDateString("en-GB")}
                </p>
              </div>
            </div>

            {po.expectedDeliveryDate && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-teal-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4 text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Expected Delivery
                  </p>
                  <p className="text-sm text-gray-900">
                    {po.expectedDeliveryDate.toLocaleDateString("en-GB")}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Delivery Address
                </p>
                <p className="text-sm text-gray-900 leading-relaxed">
                  {po.deliveryAddress || "123 Main St, Anytown USA"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <FileText className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Terms
                </p>
                <p className="text-sm text-gray-900">
                  {po.paymentTerms || "Net 30"}
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Total Amount
              </p>
              <p className="text-2xl font-bold text-po-brand mb-1">
                {formatCurrency(po.totalAmount)}
              </p>
              <p className="text-sm text-muted-foreground">
                {po.lineItems.length}{" "}
                {po.lineItems.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          {/* Timeline Section */}
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3">
                {getCombinedTimeline().map((event, index) => {
                  let icon;
                  let iconBgColor = "bg-gray-100";
                  let iconColor = "text-gray-600";

                  switch (event.type) {
                    case "creation":
                      icon = <Plus className="w-4 h-4" />;
                      break;
                    case "approved":
                      icon = <CheckCircle className="w-4 h-4" />;
                      iconBgColor = "bg-green-100";
                      iconColor = "text-green-600";
                      break;
                    case "rejected":
                      icon = <XCircle className="w-4 h-4" />;
                      iconBgColor = "bg-red-100";
                      iconColor = "text-red-600";
                      break;
                    case "comment":
                      icon = <MessageCircle className="w-4 h-4" />;
                      iconBgColor = "bg-blue-100";
                      iconColor = "text-blue-600";
                      break;
                    case "document":
                      icon = <FileText className="w-4 h-4" />;
                      iconBgColor = "bg-purple-100";
                      iconColor = "text-purple-600";
                      break;
                    default:
                      icon = <Clock className="w-4 h-4" />;
                  }

                  return (
                    <div key={event.id} className="flex gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${iconBgColor}`}
                      >
                        <div className={iconColor}>{icon}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {event.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {event.user} •{" "}
                          {event.timestamp.toLocaleDateString("en-GB")}
                        </p>
                        {event.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Document Preview Modal */}
        <Dialog
          open={showDocumentPreview}
          onOpenChange={setShowDocumentPreview}
        >
          <DialogContent className="max-w-4xl w-full h-[80vh] flex flex-col p-0">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-medium">{previewDocument?.name}</h2>
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setZoomLevel(Math.max(0.5, zoomLevel - 0.1))
                        }
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Zoom out</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="text-sm mx-2">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setZoomLevel(Math.min(2, zoomLevel + 0.1))
                        }
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Zoom in</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download document</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="flex-1 bg-gray-100 flex justify-center items-center overflow-auto">
              <div
                className="p-4 bg-white shadow-lg transition-transform"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* Mock document preview - in a real app, this would render the actual document */}
                <div className="w-[600px] h-[800px] bg-white border flex items-center justify-center">
                  <div className="text-center">
                    {getDocumentIcon(previewDocument?.type || "")}
                    <p className="mt-2">{previewDocument?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Document preview would appear here
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t flex justify-between">
              <Button variant="outline" onClick={handlePreviousDocument}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button variant="outline" onClick={handleNextDocument}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PODetails;
