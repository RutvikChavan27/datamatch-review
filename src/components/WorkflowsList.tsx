import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CreateWorkflowPopover } from "./CreateWorkflowPopover";

interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  status: "Active" | "Inactive";
  actions: number;
  created: string;
  type: "Simple Workflow" | "Advance Workflow";
}

const workflowsData: Workflow[] = [
  {
    id: "1",
    name: "Order Management 101",
    description: "Automated workflow for deadline alert processing and routing",
    trigger: "Deadline Alert",
    status: "Inactive",
    actions: 4,
    created: "Dec 28, 2024",
    type: "Advance Workflow",
  },
  {
    id: "2",
    name: "Project Routing 103",
    description:
      "Automated workflow for document upload processing and routing",
    trigger: "Document Upload",
    status: "Active",
    actions: 3,
    created: "Dec 28, 2024",
    type: "Simple Workflow",
  },
  {
    id: "3",
    name: "Invoice Review 484",
    description:
      "Automated workflow for form submission processing and routing",
    trigger: "Form Submission",
    status: "Active",
    actions: 4,
    created: "Dec 28, 2024",
    type: "Advance Workflow",
  },
  {
    id: "4",
    name: "Document Review 1084",
    description: "Automated workflow for scheduled processing and routing",
    trigger: "Scheduled",
    status: "Active",
    actions: 3,
    created: "Dec 28, 2024",
    type: "Simple Workflow",
  },
  {
    id: "5",
    name: "Project Routing 1233",
    description: "Automated workflow for deadline alert processing and routing",
    trigger: "Deadline Alert",
    status: "Inactive",
    actions: 1,
    created: "Dec 28, 2024",
    type: "Simple Workflow",
  },
  {
    id: "6",
    name: "Customer Processing 467",
    description:
      "Automated workflow for form submission processing and routing",
    trigger: "Form Submission",
    status: "Active",
    actions: 2,
    created: "Dec 27, 2024",
    type: "Simple Workflow",
  },
  {
    id: "7",
    name: "Document Review 1186",
    description: "Automated workflow for data update processing and routing",
    trigger: "Data Update",
    status: "Inactive",
    actions: 2,
    created: "Dec 27, 2024",
    type: "Simple Workflow",
  },
  {
    id: "8",
    name: "Document Notification 1222",
    description:
      "Automated workflow for form submission processing and routing",
    trigger: "Form Submission",
    status: "Active",
    actions: 3,
    created: "Dec 27, 2024",
    type: "Advance Workflow",
  },
  {
    id: "9",
    name: "Document Management 512",
    description:
      "Automated workflow for document upload processing and routing",
    trigger: "Document Upload",
    status: "Inactive",
    actions: 4,
    created: "Dec 26, 2024",
    type: "Advance Workflow",
  },
  {
    id: "10",
    name: "Customer Review 570",
    description:
      "Automated workflow for form submission processing and routing",
    trigger: "Form Submission",
    status: "Active",
    actions: 2,
    created: "Dec 26, 2024",
    type: "Simple Workflow",
  },
  {
    id: "11",
    name: "Contract Processing 623",
    description: "Automated workflow for data update processing and routing",
    trigger: "Data Update",
    status: "Active",
    actions: 2,
    created: "Dec 26, 2024",
    type: "Advance Workflow",
  },
  {
    id: "12",
    name: "Document Processing 6",
    description:
      "Automated workflow for document upload processing and routing",
    trigger: "Document Upload",
    status: "Inactive",
    actions: 4,
    created: "Dec 25, 2024",
    type: "Simple Workflow",
  },
  {
    id: "13",
    name: "Supply Chain Management 789",
    description:
      "Automated workflow for inventory alert processing and routing",
    trigger: "Inventory Alert",
    status: "Active",
    actions: 3,
    created: "Dec 25, 2024",
    type: "Advance Workflow",
  },
  {
    id: "14",
    name: "Quality Assurance 901",
    description: "Automated workflow for quality check processing and routing",
    trigger: "Quality Check",
    status: "Active",
    actions: 2,
    created: "Dec 24, 2024",
    type: "Advance Workflow",
  },
  {
    id: "15",
    name: "Customer Service 234",
    description:
      "Automated workflow for ticket creation processing and routing",
    trigger: "Ticket Creation",
    status: "Inactive",
    actions: 5,
    created: "Dec 24, 2024",
    type: "Advance Workflow",
  },
  {
    id: "16",
    name: "Financial Review 567",
    description:
      "Automated workflow for payment approval processing and routing",
    trigger: "Payment Request",
    status: "Active",
    actions: 4,
    created: "Dec 23, 2024",
    type: "Advance Workflow",
  },
  {
    id: "17",
    name: "Compliance Check 890",
    description:
      "Automated workflow for regulatory compliance processing and routing",
    trigger: "Compliance Alert",
    status: "Active",
    actions: 3,
    created: "Dec 23, 2024",
    type: "Advance Workflow",
  },
  {
    id: "18",
    name: "Vendor Management 123",
    description:
      "Automated workflow for vendor registration processing and routing",
    trigger: "Vendor Request",
    status: "Inactive",
    actions: 2,
    created: "Dec 22, 2024",
    type: "Simple Workflow",
  },
  {
    id: "19",
    name: "Asset Tracking 456",
    description: "Automated workflow for asset movement processing and routing",
    trigger: "Asset Update",
    status: "Active",
    actions: 4,
    created: "Dec 22, 2024",
    type: "Advance Workflow",
  },
  {
    id: "20",
    name: "HR Onboarding 789",
    description:
      "Automated workflow for employee onboarding processing and routing",
    trigger: "Employee Start",
    status: "Active",
    actions: 6,
    created: "Dec 21, 2024",
    type: "Advance Workflow",
  },
];

const WorkflowsList = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const filteredWorkflows = workflowsData.filter((workflow) => {
    const matchesStatus =
      statusFilter === "all" || workflow.status === statusFilter;
    const matchesSearch =
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.trigger.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredWorkflows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWorkflows = filteredWorkflows.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusCounts = () => {
    return {
      all: workflowsData.length,
      active: workflowsData.filter((w) => w.status === "Active").length,
      inactive: workflowsData.filter((w) => w.status === "Inactive").length,
    };
  };

  const statusCounts = getStatusCounts();

  // Helper function to get count badge with semantic background colors matching PORequestDashboard
  const getCountBadge = (tabKey: string, count: number, isActive: boolean) => {
    if (isActive) {
      // Active state - use semantic colors based on tab type
      switch (tabKey) {
        case "all":
          return (
            <div className="bg-slate-600 text-white rounded-full px-2 py-0.5 text-xs font-bold">
              {count}
            </div>
          );
        case "Active":
          // Active workflows - use green colors like approved/success
          return (
            <div className="bg-green-100 text-green-700 border border-green-200 rounded-full px-2 py-0.5 text-xs font-bold">
              {count}
            </div>
          );
        case "Inactive":
          // Inactive workflows - use gray colors for disabled/inactive state
          return (
            <div className="bg-gray-100 text-gray-700 border border-gray-200 rounded-full px-2 py-0.5 text-xs font-bold">
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
      // Inactive state - use light semantic colors
      switch (tabKey) {
        case "all":
          return (
            <div className="bg-slate-50 text-slate-600 border border-slate-200 rounded-full px-2 py-0.5 text-xs font-bold">
              {count}
            </div>
          );
        case "Active":
          return (
            <div className="bg-green-50 text-green-600 border border-green-200 rounded-full px-2 py-0.5 text-xs font-bold">
              {count}
            </div>
          );
        case "Inactive":
          return (
            <div className="bg-gray-50 text-gray-600 border border-gray-200 rounded-full px-2 py-0.5 text-xs font-bold">
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

  const getStatusBadge = (status: string) => {
    return (
      <Badge
        variant={status === "Active" ? "default" : "secondary"}
        className={`h-6 px-2 text-xs font-medium ${
          status === "Active"
            ? "bg-green-100 text-green-800 border-green-200"
            : "bg-gray-100 text-gray-600 border-gray-200"
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full mr-1.5 ${
            status === "Active" ? "bg-green-500" : "bg-gray-400"
          }`}
        />
        {status}
      </Badge>
    );
  };

  const getTriggerBadge = (trigger: string) => {
    const triggerStyles = {
      "Deadline Alert": "bg-red-50 text-red-700 border-red-200",
      "Document Upload": "bg-blue-50 text-blue-700 border-blue-200",
      "Form Submission": "bg-purple-50 text-purple-700 border-purple-200",
      Scheduled: "bg-green-50 text-green-700 border-green-200",
      "Data Update": "bg-orange-50 text-orange-700 border-orange-200",
      "Inventory Alert": "bg-yellow-50 text-yellow-700 border-yellow-200",
      "Quality Check": "bg-indigo-50 text-indigo-700 border-indigo-200",
      "Ticket Creation": "bg-pink-50 text-pink-700 border-pink-200",
      "Payment Request": "bg-emerald-50 text-emerald-700 border-emerald-200",
      "Compliance Alert": "bg-amber-50 text-amber-700 border-amber-200",
      "Vendor Request": "bg-teal-50 text-teal-700 border-teal-200",
      "Asset Update": "bg-cyan-50 text-cyan-700 border-cyan-200",
      "Employee Start": "bg-violet-50 text-violet-700 border-violet-200",
    };

    return (
      <Badge
        variant="outline"
        className={`h-6 px-2 text-xs font-medium ${
          triggerStyles[trigger as keyof typeof triggerStyles] ||
          "bg-gray-50 text-gray-700 border-gray-200"
        }`}
      >
        {trigger}
      </Badge>
    );
  };

  return (
    <div className="space-y-2 px-4 pt-4 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between py-1">
        <h1 className="text-xl font-semibold text-foreground font-inter">
          Productivity Engine
        </h1>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mt-4">
        {/* Modern Tab Filters */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-full">
          {[
            { key: "all", label: "All Workflows", count: statusCounts.all },
            { key: "Active", label: "Active", count: statusCounts.active },
            {
              key: "Inactive",
              label: "Inactive",
              count: statusCounts.inactive,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`
                px-4 py-2 flex items-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 border
                ${
                  statusFilter === tab.key
                    ? "text-gray-900 shadow-lg shadow-black/10 border-[#95A3C2]"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-200 border-transparent"
                }
              `}
              style={{
                backgroundColor:
                  statusFilter === tab.key ? "#D8F1FF" : undefined,
                borderRadius: "19.5px",
              }}
              onClick={() => setStatusFilter(tab.key)}
            >
              <span>{tab.label}</span>
              {getCountBadge(tab.key, tab.count, statusFilter === tab.key)}
            </button>
          ))}
        </div>

        {/* Right Side - Search and Create Button */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <CreateWorkflowPopover>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Workflow
            </Button>
          </CreateWorkflowPopover>
        </div>
      </div>

      {/* Table */}
      <Tabs value="all" className="w-full">
        <TabsList className="hidden">
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-2 shadow-lg shadow-black/5">
          <Card>
            <CardContent className="p-0">
              <div
                className="overflow-auto h-[calc(100vh-280px)]"
                style={{ scrollBehavior: "smooth" }}
              >
                <Table>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b sticky top-0"
                        style={{
                          backgroundColor: "#ECF0F7",
                          borderBottomColor: "#D6DEE9",
                        }}
                      >
                        Workflow Name
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b sticky top-0"
                        style={{
                          backgroundColor: "#ECF0F7",
                          borderBottomColor: "#D6DEE9",
                        }}
                      >
                        Type
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b sticky top-0"
                        style={{
                          backgroundColor: "#ECF0F7",
                          borderBottomColor: "#D6DEE9",
                        }}
                      >
                        Trigger
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b sticky top-0"
                        style={{
                          backgroundColor: "#ECF0F7",
                          borderBottomColor: "#D6DEE9",
                        }}
                      >
                        Status
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b sticky top-0"
                        style={{
                          backgroundColor: "#ECF0F7",
                          borderBottomColor: "#D6DEE9",
                        }}
                      >
                        Actions
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b sticky top-0"
                        style={{
                          backgroundColor: "#ECF0F7",
                          borderBottomColor: "#D6DEE9",
                        }}
                      >
                        Created
                      </TableHead>
                      <TableHead
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b w-12 sticky top-0"
                        style={{
                          backgroundColor: "#ECF0F7",
                          borderBottomColor: "#D6DEE9",
                        }}
                      ></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedWorkflows.map((workflow) => (
                      <TableRow
                        key={workflow.id}
                        className="h-10 hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="py-2 border-r-0">
                          <div>
                            <div className="font-medium text-sm text-foreground">
                              {workflow.name}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {workflow.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 border-r-0">
                          {workflow.type}
                        </TableCell>
                        <TableCell className="py-2 border-r-0">
                          {getTriggerBadge(workflow.trigger)}
                        </TableCell>
                        <TableCell className="py-2 border-r-0">
                          {getStatusBadge(workflow.status)}
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">
                          {workflow.actions} action
                          {workflow.actions !== 1 ? "s" : ""}
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-muted-foreground">
                          {workflow.created}
                        </TableCell>
                        <TableCell className="py-2 border-r-0">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Workflow</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modern Pagination */}
      {filteredWorkflows.length > 0 && (
        <div className="flex justify-end items-center mt-6 px-1">
          {/* Results info and per page selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} of {filteredWorkflows.length}
            </span>
            <div className="flex items-center gap-2">
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-32 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 Per Page</SelectItem>
                  <SelectItem value="25">25 Per Page</SelectItem>
                  <SelectItem value="50">50 Per Page</SelectItem>
                  <SelectItem value="100">100 Per Page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Page navigation */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              {/* Previous button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                disabled={currentPage <= 1}
                className="h-9 w-9 p-0 hover:bg-muted"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {(() => {
                  const pages = [];
                  const showPages = 5; // Maximum pages to show
                  let startPage = Math.max(
                    1,
                    currentPage - Math.floor(showPages / 2)
                  );
                  let endPage = Math.min(totalPages, startPage + showPages - 1);

                  // Adjust start if we're near the end
                  if (endPage - startPage < showPages - 1) {
                    startPage = Math.max(1, endPage - showPages + 1);
                  }

                  // Always show first page
                  if (startPage > 1) {
                    pages.push(
                      <Button
                        key={1}
                        variant={currentPage === 1 ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        className={`h-9 w-9 p-0 text-sm ${
                          currentPage === 1
                            ? "bg-primary text-primary-foreground rounded-md"
                            : "hover:bg-muted"
                        }`}
                      >
                        1
                      </Button>
                    );
                    if (startPage > 2) {
                      pages.push(
                        <span
                          key="ellipsis1"
                          className="px-2 text-sm text-muted-foreground"
                        >
                          …
                        </span>
                      );
                    }
                  }

                  // Show middle pages
                  for (let i = startPage; i <= endPage; i++) {
                    if (i === 1 && startPage === 1) continue; // Skip if already added
                    pages.push(
                      <Button
                        key={i}
                        variant={currentPage === i ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setCurrentPage(i)}
                        className={`h-9 w-9 p-0 text-sm ${
                          currentPage === i
                            ? "bg-primary text-primary-foreground rounded-md"
                            : "hover:bg-muted"
                        }`}
                      >
                        {i}
                      </Button>
                    );
                  }

                  // Always show last page
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push(
                        <span
                          key="ellipsis2"
                          className="px-2 text-sm text-muted-foreground"
                        >
                          …
                        </span>
                      );
                    }
                    pages.push(
                      <Button
                        key={totalPages}
                        variant={
                          currentPage === totalPages ? "default" : "ghost"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        className={`h-9 w-9 p-0 text-sm ${
                          currentPage === totalPages
                            ? "bg-primary text-primary-foreground rounded-md"
                            : "hover:bg-muted"
                        }`}
                      >
                        {totalPages}
                      </Button>
                    );
                  }

                  return pages;
                })()}
              </div>

              {/* Next button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
                disabled={currentPage >= totalPages}
                className="h-9 w-9 p-0 hover:bg-muted"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkflowsList;
