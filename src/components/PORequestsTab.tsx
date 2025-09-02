import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronLeft, ChevronRight, Eye, MoreHorizontal, Download, Trash2, Edit, FileText, CheckCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PORequest {
  id: string;
  reference: string;
  requestTitle: string;
  requestor: string;
  department: string;
  vendor: string;
  totalAmount: number;
  priority: 'High' | 'Normal' | 'Low';
  status: 'In Review' | 'Approved' | 'Rejected';
  createdDate: string;
  itemCount: number;
}

const PORequestsTab = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('pending');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Mock data for PO Requests
  const poRequests: PORequest[] = [
    {
      id: 'por1',
      reference: 'PO-2024-017',
      requestTitle: 'Manufacturing Equipment Upgrade',
      requestor: 'John Smith',
      department: 'IT Department',
      vendor: 'Tech Solutions Inc',
      totalAmount: 15750.00,
      priority: 'High',
      status: 'In Review',
      createdDate: '08/27/2025',
      itemCount: 5
    },
    {
      id: 'por2',
      reference: 'PO-2024-018',
      requestTitle: 'Security Software License',
      requestor: 'Mike Davis',
      department: 'Marketing',
      vendor: 'Office Supplies Co',
      totalAmount: 2850.75,
      priority: 'Normal',
      status: 'Approved',
      createdDate: '08/26/2025',
      itemCount: 12
    },
    {
      id: 'por3',
      reference: 'PO-2024-019',
      requestTitle: 'R&D Equipment',
      requestor: 'Sarah Wilson',
      department: 'Facilities',
      vendor: 'Maintenance Plus',
      totalAmount: 4200.00,
      priority: 'Low',
      status: 'In Review',
      createdDate: '08/25/2025',
      itemCount: 3
    },
    {
      id: 'por4',
      reference: 'PO-2024-020',
      requestTitle: 'HR Training',
      requestor: 'Tom Anderson',
      department: 'Engineering',
      vendor: 'Industrial Tools Ltd',
      totalAmount: 8950.50,
      priority: 'High',
      status: 'Rejected',
      createdDate: '08/24/2025',
      itemCount: 8
    },
    // Add more mock records
    ...Array.from({ length: 46 }, (_, index) => ({
      id: `por${index + 5}`,
      reference: `PO-2024-${(index + 21).toString().padStart(3, '0')}`,
      requestTitle: [
        'Office Supplies', 'Office Furniture Discussion PO', 'Data Center Cooling System', 
        'Marketing Campaign Materials', 'Office Furniture', 'Software Licenses', 
        'Vehicle Fleet Maintenance', 'Office Kitchen Supplies', 'Employee Training Materials', 
        'Conference Room Equipment', 'Testing Equipment Calibration', 'Manufacturing Equipment Upgrade',
        'Security Software License', 'R&D Equipment', 'HR Training'
      ][index % 15],
      requestor: ['John Smith', 'Mike Davis', 'Sarah Wilson', 'Tom Anderson', 'Lisa White', 'David Brown'][index % 6],
      department: ['IT Department', 'Marketing', 'Facilities', 'Engineering', 'HR', 'Finance'][index % 6],
      vendor: ['Tech Solutions Inc', 'Office Supplies Co', 'Maintenance Plus', 'Industrial Tools Ltd', 'Global Vendor', 'Local Supplier'][index % 6],
      totalAmount: Math.round((Math.random() * 20000 + 500) * 100) / 100,
      priority: (['High', 'Normal', 'Low'] as const)[index % 3],
      status: (['In Review', 'Approved', 'Rejected'] as const)[index % 3],
      createdDate: new Date(2025, 7, Math.floor(Math.random() * 30) + 1).toLocaleDateString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric' 
      }),
      itemCount: Math.floor(Math.random() * 15) + 1
    }))
  ];

  // Filter data based on active filter
  const filteredData = poRequests.filter(request => {
    if (activeFilter === 'approved') return request.status === 'Approved';
    if (activeFilter === 'rejected') return request.status === 'Rejected';
    if (activeFilter === 'pending') return request.status === 'In Review';
    return true; // all requests
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Tab counts
  const pendingCount = poRequests.filter(r => r.status === 'In Review').length;
  const approvedCount = poRequests.filter(r => r.status === 'Approved').length;
  const rejectedCount = poRequests.filter(r => r.status === 'Rejected').length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRequests(paginatedRequests.map(request => request.id));
    } else {
      setSelectedRequests([]);
    }
  };

  const handleSelectRequest = (requestId: string, checked: boolean) => {
    if (checked) {
      setSelectedRequests([...selectedRequests, requestId]);
    } else {
      setSelectedRequests(selectedRequests.filter(id => id !== requestId));
    }
  };

  const handleRowClick = (request: PORequest, event: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = event.target as HTMLElement;
    if (target.closest('input[type="checkbox"]') || target.closest('button') || target.closest('[role="combobox"]')) {
      return;
    }
    navigate(`/workspace/po-request/${request.reference}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Review':
        return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">In Review</Badge>;
      case 'Approved':
        return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Approved</Badge>;
      case 'Rejected':
        return <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: 'High' | 'Normal' | 'Low') => {
    const getColorClasses = (priority: string) => {
      switch (priority) {
        case 'High':
          return "bg-red-100 text-red-700 border-red-200";
        case 'Normal':
          return "bg-orange-100 text-orange-700 border-orange-200";
        case 'Low':
          return "bg-green-100 text-green-700 border-green-200";
        default:
          return "border-border bg-background";
      }
    };

    return (
      <Badge className={`${getColorClasses(priority)} px-3 py-1 rounded-full text-xs font-semibold`}>
        {priority}
      </Badge>
    );
  };

  return (
    <div className="space-y-3">
      {/* Filter tabs */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-full w-fit">
          {[
            { key: 'pending', label: 'Pending Tasks', count: pendingCount },
            { key: 'approved', label: 'Completed Tasks', count: approvedCount },
            { key: 'rejected', label: 'Recent Documents', count: rejectedCount },
          ].map(tab => (
            <button
              key={tab.key}
              className={`
                px-4 py-2 flex items-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 border border-b-2
                ${activeFilter === tab.key
                  ? "text-gray-900 shadow-lg shadow-black/10 border-[#95A3C2]"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200 border-transparent"}
              `}
              style={activeFilter === tab.key ? {
                backgroundColor: '#d8f1ff',
                borderRadius: '19.5px'
              } : {}}
              onClick={() => setActiveFilter(tab.key)}
            >
              <span>{tab.label}</span>
              <Badge variant="secondary" className="ml-1">{tab.count}</Badge>
            </button>
          ))}
        </div>

        {/* Bulk Actions */}
        {selectedRequests.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">
              {selectedRequests.length} Selected
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  Actions
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-50 bg-white border border-border shadow-lg rounded-lg w-56 p-2">
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <CheckCircle className="h-4 w-4" />
                  Bulk Approve
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Edit className="h-4 w-4" />
                  Bulk Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Download className="h-4 w-4" />
                  Export Selected
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Trash2 className="h-4 w-4" />
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* PO Requests Table */}
      <Card className="overflow-hidden">
        <div 
          className="overflow-y-auto"
          style={{ 
            maxHeight: `calc(100vh - 320px)`,
            height: filteredData.length > 15 ? `calc(100vh - 320px)` : 'auto'
          }}
        >
          <Table className="min-w-full [&_th]:border-r-0 [&_td]:border-r-0" style={{ tableLayout: 'fixed' }}>
            <TableHeader className="sticky top-0 z-10">
              <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                <TableHead className="w-12 font-semibold text-sm h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>
                  <Checkbox
                    checked={selectedRequests.length === paginatedRequests.length && paginatedRequests.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="font-semibold w-[140px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Reference</TableHead>
                <TableHead className="font-semibold w-[200px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Request Title</TableHead>
                <TableHead className="font-semibold w-[120px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Requestor</TableHead>
                <TableHead className="font-semibold w-[130px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Department</TableHead>
                <TableHead className="font-semibold w-[150px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Vendor</TableHead>
                <TableHead className="font-semibold w-[100px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Amount</TableHead>
                <TableHead className="font-semibold w-[90px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Priority</TableHead>
                <TableHead className="font-semibold w-[130px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Status</TableHead>
                <TableHead className="font-semibold w-[120px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Created Date</TableHead>
                <TableHead className="font-semibold w-[80px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Items</TableHead>
                <TableHead className="font-semibold w-[100px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRequests.map((request) => (
                <TableRow 
                  key={request.id} 
                  className={`cursor-pointer hover:bg-muted/30 ${selectedRequests.includes(request.id) ? 'bg-muted/50' : ''}`}
                  onClick={(e) => handleRowClick(request, e)}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRequests.includes(request.id)}
                      onCheckedChange={(checked) => handleSelectRequest(request.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{request.reference}</TableCell>
                  <TableCell className="truncate" title={request.requestTitle}>{request.requestTitle}</TableCell>
                  <TableCell>{request.requestor}</TableCell>
                  <TableCell>{request.department}</TableCell>
                  <TableCell>{request.vendor}</TableCell>
                  <TableCell>${request.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{request.createdDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {request.itemCount}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-muted"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-muted"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Request</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Generate PO
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="flex justify-end items-center mt-4 px-1">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} of {filteredData.length}
            </span>
            
            {/* Page navigation */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="h-9 w-9 p-0 hover:bg-muted"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {(() => {
                    const pages = [];
                    const showPages = 5;
                    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
                    let endPage = Math.min(totalPages, startPage + showPages - 1);

                    if (endPage - startPage < showPages - 1) {
                      startPage = Math.max(1, endPage - showPages + 1);
                    }

                    for (let i = startPage; i <= endPage; i++) {
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
                    return pages;
                  })()}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="h-9 w-9 p-0 hover:bg-muted"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            
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
        </div>
      )}
    </div>
  );
};

export default PORequestsTab;