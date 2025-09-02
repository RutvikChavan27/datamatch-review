import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronLeft, ChevronRight, Eye, MoreHorizontal, Download, Trash2, Edit } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DataMatchRecord {
  id: string;
  vendor: string;
  poNumber: string;
  setId: string;
  amount: number;
  status: string;
  statusType: 'ready-for-review' | 'incomplete' | 'auto-approved' | 'approved' | 'failed';
  confidence: number;
  lastUpdated: string;
  assignedTo: string;
}

const DataMatchTab = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('ready-for-review');
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Mock data for Data Match records
  const dataMatchRecords: DataMatchRecord[] = [
    {
      id: 'dm1',
      vendor: 'ABC Corp',
      poNumber: 'PO-2025-001',
      setId: 'DS-00123',
      amount: 1250.00,
      status: 'Ready for Verification',
      statusType: 'ready-for-review',
      confidence: 98,
      lastUpdated: '08/27/2025 14:30',
      assignedTo: 'John Smith'
    },
    {
      id: 'dm2',
      vendor: 'XYZ Supplies',
      poNumber: 'PO-2025-002',
      setId: 'DS-00124',
      amount: 850.75,
      status: 'Processing Failed',
      statusType: 'failed',
      confidence: 45,
      lastUpdated: '08/27/2025 09:15',
      assignedTo: 'Sarah Johnson'
    },
    {
      id: 'dm3',
      vendor: 'Tech Solutions',
      poNumber: 'PO-2025-003',
      setId: 'DS-00125',
      amount: 2100.00,
      status: 'Missing Documents',
      statusType: 'incomplete',
      confidence: 78,
      lastUpdated: '08/26/2025 16:45',
      assignedTo: 'Mike Davis'
    },
    // Add more mock records
    ...Array.from({ length: 47 }, (_, index) => ({
      id: `dm${index + 4}`,
      vendor: ['ABC Corp', 'XYZ Supplies', 'Tech Solutions', 'Global Vendor', 'Local Supplies'][index % 5],
      poNumber: `PO-2025-${(index + 4).toString().padStart(3, '0')}`,
      setId: `DS-${(index + 126).toString().padStart(5, '0')}`,
      amount: Math.round((Math.random() * 5000 + 100) * 100) / 100,
      status: (['Ready for Verification', 'Missing Documents', 'Verified', 'Processing Failed'] as const)[index % 4],
      statusType: (['ready-for-review', 'incomplete', 'approved', 'failed'] as const)[index % 4],
      confidence: Math.floor(Math.random() * 60) + 40,
      lastUpdated: `08/${Math.floor(Math.random() * 7) + 20}/2025 ${Math.floor(Math.random() * 12) + 8}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      assignedTo: ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Brown', 'Tom Wilson'][index % 5]
    }))
  ];

  // Filter data based on active filter
  const filteredData = dataMatchRecords.filter(record => {
    if (activeFilter === 'verified') return record.statusType === 'auto-approved' || record.statusType === 'approved';
    if (activeFilter === 'failed') return record.statusType === 'failed';
    if (activeFilter === 'incomplete') return record.statusType === 'incomplete';
    if (activeFilter === 'ready-for-review') return record.statusType === 'ready-for-review';
    return true; // all records
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Tab counts
  const verifiedCount = dataMatchRecords.filter(r => r.statusType === 'auto-approved' || r.statusType === 'approved').length;
  const failedCount = dataMatchRecords.filter(r => r.statusType === 'failed').length;
  const incompleteCount = dataMatchRecords.filter(r => r.statusType === 'incomplete').length;
  const readyForReviewCount = dataMatchRecords.filter(r => r.statusType === 'ready-for-review').length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRecords(paginatedRecords.map(record => record.id));
    } else {
      setSelectedRecords([]);
    }
  };

  const handleSelectRecord = (recordId: string, checked: boolean) => {
    if (checked) {
      setSelectedRecords([...selectedRecords, recordId]);
    } else {
      setSelectedRecords(selectedRecords.filter(id => id !== recordId));
    }
  };

  const handleRowClick = (record: DataMatchRecord, event: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = event.target as HTMLElement;
    if (target.closest('input[type="checkbox"]') || target.closest('button') || target.closest('[role="combobox"]')) {
      return;
    }
    navigate(`/workspace/data-match/${record.setId}`);
  };

  const getStatusBadge = (status: string, statusType: string) => {
    switch (statusType) {
      case 'ready-for-review':
        return <Badge variant="outline" className="bg-blue-100 border-0" style={{ color: '#333333' }}>Ready for Verification</Badge>;
      case 'incomplete':
        return <Badge variant="outline" className="bg-red-100 border-0" style={{ color: '#333333' }}>Missing Documents</Badge>;
      case 'auto-approved':
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 border-0" style={{ color: '#333333' }}>Verified</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 border-0" style={{ color: '#333333' }}>Processing Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    const getColorClasses = () => {
      if (confidence >= 80) return "bg-green-100 text-green-700 border-green-200";
      if (confidence >= 60) return "bg-yellow-100 text-yellow-700 border-yellow-200";
      return "bg-red-100 text-red-700 border-red-200";
    };

    return (
      <Badge className={`${getColorClasses()} px-2 py-1 rounded-full text-xs font-semibold`}>
        {confidence}%
      </Badge>
    );
  };

  return (
    <div className="space-y-3">
      {/* Filter tabs */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-full w-fit">
          {[
            { key: 'ready-for-review', label: 'Pending Tasks', count: readyForReviewCount },
            { key: 'verified', label: 'Completed Tasks', count: verifiedCount },
            { key: 'incomplete', label: 'Recent Documents', count: incompleteCount },
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
        {selectedRecords.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">
              {selectedRecords.length} Selected
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

      {/* Data Match Table */}
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
                    checked={selectedRecords.length === paginatedRecords.length && paginatedRecords.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="font-semibold w-[130px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Set ID</TableHead>
                <TableHead className="font-semibold w-[150px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Vendor</TableHead>
                <TableHead className="font-semibold w-[120px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>PO Number</TableHead>
                <TableHead className="font-semibold w-[100px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Amount</TableHead>
                <TableHead className="font-semibold w-[130px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Status</TableHead>
                <TableHead className="font-semibold w-[100px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Confidence</TableHead>
                <TableHead className="font-semibold w-[140px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Last Updated</TableHead>
                <TableHead className="font-semibold w-[120px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Assigned To</TableHead>
                <TableHead className="font-semibold w-[100px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRecords.map((record) => (
                <TableRow 
                  key={record.id} 
                  className={`cursor-pointer hover:bg-muted/30 ${selectedRecords.includes(record.id) ? 'bg-muted/50' : ''}`}
                  onClick={(e) => handleRowClick(record, e)}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRecords.includes(record.id)}
                      onCheckedChange={(checked) => handleSelectRecord(record.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>{record.setId}</TableCell>
                  <TableCell>{record.vendor}</TableCell>
                  <TableCell>{record.poNumber}</TableCell>
                  <TableCell>${record.amount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(record.status, record.statusType)}</TableCell>
                  <TableCell>{getConfidenceBadge(record.confidence)}</TableCell>
                  <TableCell>{record.lastUpdated}</TableCell>
                  <TableCell>{record.assignedTo}</TableCell>
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
                          <DropdownMenuItem>Edit Match</DropdownMenuItem>
                          <DropdownMenuItem>Download</DropdownMenuItem>
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

export default DataMatchTab;