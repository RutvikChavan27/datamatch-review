import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PurchaseOrder } from "@/types/po-types";
import StatusBadge from "./StatusBadge";

// Local formatCurrency function
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

import {
  Eye,
  MessageSquare,
  User,
  Calendar,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import POQuickView from "./POQuickView";
import ChatPanel from "./ChatPanel";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface POTableProps {
  purchaseOrders: PurchaseOrder[];
  itemsPerPage?: number;
  filterKey?: string;
}

const POTable: React.FC<POTableProps> = ({
  purchaseOrders,
  itemsPerPage = 15,
  filterKey,
}) => {
  const navigate = useNavigate();
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [quickViewPO, setQuickViewPO] = useState<PurchaseOrder | null>(null);
  const [chatPO, setChatPO] = useState<PurchaseOrder | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterKey]);

  // Sort POs with custom logic
  const sortedPOs = [...purchaseOrders].sort((a, b) => {
    if (sortConfig) {
      const { key, direction } = sortConfig;
      let aValue: any, bValue: any;

      switch (key) {
        case "reference":
          aValue = a.reference;
          bValue = b.reference;
          break;
        case "title":
          aValue = a.title;
          bValue = b.title;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "vendor":
          aValue = a.vendor;
          bValue = b.vendor;
          break;
        case "department":
          aValue = a.department;
          bValue = b.department;
          break;
        case "createdAt":
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case "totalAmount":
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    }

    // Default sorting (original logic)
    if (a.status === "submitted" && b.status !== "submitted") return -1;
    if (a.status !== "submitted" && b.status === "submitted") return 1;
    if (a.status === "discussion" && b.status !== "discussion") return -1;
    if (a.status !== "discussion" && b.status === "discussion") return 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedPOs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedPOs.length);
  const currentPOs = sortedPOs.slice(startIndex, endIndex);

  const handleRowClick = (poId: string) => {
    console.log("poId ", poId);

    navigate(`/po-requests/po/${poId}`);
  };

  const handleQuickView = (e: React.MouseEvent, po: PurchaseOrder) => {
    e.stopPropagation();
    setQuickViewPO(po);
  };

  const handleChatView = (e: React.MouseEvent, po: PurchaseOrder) => {
    e.stopPropagation();
    setChatPO(po);
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Function to check if PO has unresolved clarification request
  const hasUnreadMessages = (po: PurchaseOrder) => {
    return po.clarificationRequest && !po.clarificationRequest.response;
  };

  // Function to check if PO has ongoing discussion
  const hasOngoingDiscussion = (po: PurchaseOrder) => {
    return (
      po.discussion &&
      po.discussion.isActive &&
      po.discussion.messages.length > 0
    );
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <TooltipProvider>
      <div className="mt-2 shadow-lg shadow-black/5">
        <Card className="overflow-hidden">
          {/* Table Container with Fixed Header and Scrollable Body */}
          <div
            ref={tableContainerRef}
            className="overflow-auto bg-white relative"
            style={{
              scrollBehavior: "smooth",
              maxHeight: "calc(100vh - 280px)",
            }}
            // onScroll={handleBodyScroll}
          >
            <Table
              className="min-w-max relative"
              style={{ tableLayout: "fixed", minWidth: "1420px" }}
            >
              {/* Fixed Header */}
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="hover:bg-muted/50 border-b border-border">
                  <TableHead
                    className="font-semibold w-[100px] border-r-0 text-sm text-foreground h-12 border-b border-t sticky top-0"
                    style={{
                      backgroundColor: "#DFE7F3",
                      borderBottomColor: "#c9d1e0",
                      borderTopColor: "#c9d1e0",
                    }}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Reference</span>
                    </div>
                  </TableHead>
                  <TableHead
                    className="w-[150px] font-semibold cursor-pointer hover:bg-muted/50 transition-colors border-r-0 text-sm text-foreground h-12 border-b border-t sticky top-0"
                    style={{
                      backgroundColor: "#DFE7F3",
                      borderBottomColor: "#c9d1e0",
                      borderTopColor: "#c9d1e0",
                    }}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Request Title</span>
                    </div>
                  </TableHead>
                  <TableHead
                    className="w-[180px] font-semibold cursor-pointer hover:bg-muted/50 transition-colors border-r-0 text-sm text-foreground h-12 border-b border-t sticky top-0"
                    style={{
                      backgroundColor: "#DFE7F3",
                      borderBottomColor: "#c9d1e0",
                      borderTopColor: "#c9d1e0",
                    }}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                    </div>
                  </TableHead>
                  <TableHead
                    className="w-[160px] font-semibold cursor-pointer hover:bg-muted/50 transition-colors border-r-0 text-sm text-foreground h-12 border-b border-t sticky top-0"
                    style={{
                      backgroundColor: "#DFE7F3",
                      borderBottomColor: "#c9d1e0",
                      borderTopColor: "#c9d1e0",
                    }}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Vendor</span>
                    </div>
                  </TableHead>
                  <TableHead
                    className="w-[100px] font-semibold cursor-pointer hover:bg-muted/50 transition-colors border-r-0 text-sm text-foreground h-12 border-b border-t sticky top-0"
                    style={{
                      backgroundColor: "#DFE7F3",
                      borderBottomColor: "#c9d1e0",
                      borderTopColor: "#c9d1e0",
                    }}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Department</span>
                    </div>
                  </TableHead>
                  <TableHead
                    className="w-[150px] font-semibold cursor-pointer hover:bg-muted/50 transition-colors border-r-0 text-sm text-foreground h-12 border-b border-t sticky top-0"
                    style={{
                      backgroundColor: "#DFE7F3",
                      borderBottomColor: "#c9d1e0",
                      borderTopColor: "#c9d1e0",
                    }}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Requestor</span>
                    </div>
                  </TableHead>
                  <TableHead
                    className="w-[120px] font-semibold cursor-pointer hover:bg-muted/50 transition-colors border-r-0 text-sm text-foreground h-12 border-b border-t sticky top-0"
                    style={{
                      backgroundColor: "#DFE7F3",
                      borderBottomColor: "#c9d1e0",
                      borderTopColor: "#c9d1e0",
                    }}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Created</span>
                    </div>
                  </TableHead>
                  <TableHead
                    className="w-[80px] font-semibold cursor-pointer hover:bg-muted/50 transition-colors border-r-0 text-sm text-foreground h-12 border-b border-t sticky top-0"
                    style={{
                      backgroundColor: "#DFE7F3",
                      borderBottomColor: "#c9d1e0",
                      borderTopColor: "#c9d1e0",
                    }}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Items</span>
                    </div>
                  </TableHead>
                  <TableHead
                    className="w-[120px] text-right font-semibold cursor-pointer hover:bg-muted/50 transition-colors border-r-0 text-sm text-foreground h-12 border-b border-t sticky top-0"
                    style={{
                      backgroundColor: "#DFE7F3",
                      borderBottomColor: "#c9d1e0",
                      borderTopColor: "#c9d1e0",
                    }}
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>Amount</span>
                    </div>
                  </TableHead>
                  <TableHead
                    className="w-[140px] font-semibold cursor-pointer hover:bg-muted/50 transition-colors border-r-0 text-sm text-foreground h-12 border-b border-t sticky top-0"
                    style={{
                      backgroundColor: "#DFE7F3",
                      borderBottomColor: "#c9d1e0",
                      borderTopColor: "#c9d1e0",
                    }}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Actions</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* Scrollable Body */}
              <TableBody>
                {currentPOs.map((po) => (
                  <TableRow
                    key={po.id}
                    className="h-10 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(po.id)}
                  >
                    <TableCell className="font-mono text-sm font-medium py-2 border-r-0 text-foreground truncate w-[100px]">
                      <div className="flex items-center gap-2">
                        <div className="truncate" title={po.reference}>
                          {po.reference}
                        </div>
                        {(hasUnreadMessages(po) ||
                          hasOngoingDiscussion(po)) && (
                          <div className="relative">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-[18px] w-[18px] p-0 border-none hover:bg-gray-100"
                                  onClick={(e) => handleChatView(e, po)}
                                >
                                  <MessageSquare className="h-[18px] w-[18px]" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Discussion</p>
                              </TooltipContent>
                            </Tooltip>
                            {hasUnreadMessages(po) && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell
                      className="py-2 border-r-0 text-sm text-foreground truncate w-[180px]"
                      title={po.title}
                    >
                      {po.title}
                    </TableCell>
                    <TableCell className="py-2 border-r-0 w-[120px]">
                      <StatusBadge status={po.status} />
                    </TableCell>
                    <TableCell
                      className="py-2 border-r-0 text-sm text-foreground truncate w-[160px]"
                      title={po.vendor}
                    >
                      {po.vendor}
                    </TableCell>
                    <TableCell className="py-2 border-r-0 w-[100px]">
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                        title={po.department}
                      >
                        {po.department}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 border-r-0 text-sm text-foreground truncate w-[150px]">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-gray-500" />
                        <div className="truncate" title="Alex Johnson">
                          Alex Johnson
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 border-r-0 text-sm text-foreground w-[120px]">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        <div
                          className="truncate"
                          title={po.createdAt.toLocaleDateString()}
                        >
                          {po.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 border-r-0 text-sm text-foreground w-[80px]">
                      <div
                        className="truncate"
                        title={`${po.lineItems.length} items`}
                      >
                        {po.lineItems.length} items
                      </div>
                    </TableCell>
                    <TableCell className="font-medium py-2 border-r-0 text-sm text-foreground w-[120px] text-right">
                      <div
                        className="truncate"
                        title={formatCurrency(po.totalAmount)}
                      >
                        {formatCurrency(po.totalAmount)}
                      </div>
                    </TableCell>
                    <TableCell className="py-2 border-r-0 w-[140px]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  onClick={(e) => handleQuickView(e, po)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          {po.status === "discussion" && (
                            <Button
                              className="button-primary"
                              size="sm"
                              onClick={(e) => handleRowClick(po.id)}
                            >
                              Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {currentPOs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      No purchase orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Pagination below table */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center mt-4 px-1">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} of {sortedPOs.length}
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                disabled={currentPage <= 1}
                className="h-9 w-9 p-0 hover:bg-muted"
              >
                <ChevronUp className="h-4 w-4 rotate-[-90deg]" />
              </Button>

              {getPageNumbers().map((page, index) =>
                page === "ellipsis" ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-sm text-muted-foreground"
                  >
                    …
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handlePageChange(page as number)}
                    className={`h-9 w-9 p-0 text-sm ${
                      currentPage === page
                        ? "bg-primary text-primary-foreground rounded-md"
                        : "hover:bg-muted"
                    }`}
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
                disabled={currentPage >= totalPages}
                className="h-9 w-9 p-0 hover:bg-muted"
              >
                <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <POQuickView
        po={quickViewPO}
        isOpen={quickViewPO !== null}
        onClose={() => setQuickViewPO(null)}
      />

      <ChatPanel
        po={chatPO}
        isOpen={chatPO !== null}
        onClose={() => setChatPO(null)}
      />
    </TooltipProvider>
  );
};

export default POTable;
