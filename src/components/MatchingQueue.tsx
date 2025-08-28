
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Search, MoreHorizontal, Filter, ArrowUpDown, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const MatchingQueue = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [smartFilter, setSmartFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const lastRefreshTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  const documentSets = [
    {
      setId: 'DS-00123',
      vendor: 'Acme Corporation',
      poNumber: 'PO-2024-0456',
      status: 'Ready for Verification',
      documents: { invoice: true, po: true, grn: false },
      totalAmount: 12345.67,
      statusType: 'ready-for-review',
      priority: 'high',
      majorIssues: 2,
      minorIssues: 1,
      daysInQueue: 8,
      assignedTo: 'John Smith',
      lastActivity: '2024-01-16'
    },
    {
      setId: 'DS-00124',
      vendor: 'Tech Solutions Ltd',
      poNumber: 'PO-2024-0457',
      status: 'Ready for Verification',
      documents: { invoice: true, po: true, grn: false },
      totalAmount: 8976.42,
      statusType: 'ready-for-review',
      priority: 'medium',
      majorIssues: 0,
      minorIssues: 2,
      daysInQueue: 5,
      assignedTo: 'Sarah Johnson',
      lastActivity: '2024-01-17'
    },
    {
      setId: 'DS-00125',
      vendor: 'Office Supplies Co',
      poNumber: 'PO-2024-0458',
      status: 'Ready for Verification',
      documents: { invoice: true, po: true, grn: true },
      totalAmount: 5432.18,
      statusType: 'ready-for-review',
      priority: 'low',
      majorIssues: 0,
      minorIssues: 0,
      daysInQueue: 2,
      assignedTo: 'Mike Davis',
      lastActivity: '2024-01-18'
    },
    {
      setId: 'DS-00126',
      vendor: 'Industrial Parts Inc',
      poNumber: 'PO-2024-0459',
      status: 'Missing Documents',
      documents: { invoice: true, po: false, grn: false },
      totalAmount: 15678.90,
      statusType: 'incomplete',
      priority: 'high',
      majorIssues: 0,
      minorIssues: 0,
      daysInQueue: 10,
      assignedTo: null,
      lastActivity: '2024-01-15'
    },
    {
      setId: 'DS-00127',
      vendor: 'Quick Supply Co',
      poNumber: 'PO-2024-0460',
      status: 'Verified',
      documents: { invoice: true, po: true, grn: true },
      totalAmount: 3245.12,
      statusType: 'auto-approved',
      priority: 'low',
      majorIssues: 0,
      minorIssues: 0,
      daysInQueue: 1,
      assignedTo: null,
      lastActivity: '2024-01-15'
    },
    {
      setId: 'DS-00128',
      vendor: 'Manufacturing Corp',
      poNumber: 'PO-2024-0461',
      status: 'Verified',
      documents: { invoice: true, po: true, grn: true },
      totalAmount: 9876.54,
      statusType: 'approved',
      priority: 'medium',
      majorIssues: 0,
      minorIssues: 0,
      daysInQueue: 3,
      assignedTo: 'John Smith',
      lastActivity: '2024-01-14'
    },
    {
      setId: 'DS-00129',
      vendor: 'Failed Vendor LLC',
      poNumber: 'PO-2024-0462',
      status: 'Processing Failed',
      documents: { invoice: true, po: true, grn: false },
      totalAmount: 4321.98,
      statusType: 'failed',
      priority: 'high',
      majorIssues: 3,
      minorIssues: 0,
      daysInQueue: 12,
      assignedTo: null,
      lastActivity: '2024-01-10'
    },
    {
      setId: 'DS-00130',
      vendor: 'Global Electronics Inc',
      poNumber: 'PO-2024-0463',
      status: 'Ready for Verification',
      documents: { invoice: true, po: true, grn: true },
      totalAmount: 7890.25,
      statusType: 'ready-for-review',
      priority: 'medium',
      majorIssues: 1,
      minorIssues: 0,
      daysInQueue: 4,
      assignedTo: 'Emily Chen',
      lastActivity: '2024-01-18'
    },
    {
      setId: 'DS-00131',
      vendor: 'Prime Materials LLC',
      poNumber: 'PO-2024-0464',
      status: 'Missing Documents',
      documents: { invoice: false, po: true, grn: false },
      totalAmount: 11234.50,
      statusType: 'incomplete',
      priority: 'high',
      majorIssues: 0,
      minorIssues: 0,
      daysInQueue: 6,
      assignedTo: null,
      lastActivity: '2024-01-16'
    },
    {
      setId: 'DS-00132',
      vendor: 'Smart Solutions Corp',
      poNumber: 'PO-2024-0465',
      status: 'Ready for Verification',
      documents: { invoice: true, po: true, grn: false },
      totalAmount: 6543.21,
      statusType: 'ready-for-review',
      priority: 'low',
      majorIssues: 0,
      minorIssues: 1,
      daysInQueue: 3,
      assignedTo: 'David Wilson',
      lastActivity: '2024-01-17'
    },
    {
      setId: 'DS-00133',
      vendor: 'AutoParts Express',
      poNumber: 'PO-2024-0466',
      status: 'Verified',
      documents: { invoice: true, po: true, grn: true },
      totalAmount: 4567.89,
      statusType: 'approved',
      priority: 'low',
      majorIssues: 0,
      minorIssues: 0,
      daysInQueue: 2,
      assignedTo: 'Lisa Brown',
      lastActivity: '2024-01-18'
    },
    {
      setId: 'DS-00134',
      vendor: 'Quality Tools Inc',
      poNumber: 'PO-2024-0467',
      status: 'Ready for Verification',
      documents: { invoice: true, po: true, grn: true },
      totalAmount: 13456.78,
      statusType: 'ready-for-review',
      priority: 'high',
      majorIssues: 2,
      minorIssues: 2,
      daysInQueue: 9,
      assignedTo: 'Mark Johnson',
      lastActivity: '2024-01-15'
    },
    {
      setId: 'DS-00135',
      vendor: 'Essential Supplies Ltd',
      poNumber: 'PO-2024-0468',
      status: 'Missing Documents',
      documents: { invoice: true, po: false, grn: true },
      totalAmount: 2345.67,
      statusType: 'incomplete',
      priority: 'medium',
      majorIssues: 0,
      minorIssues: 0,
      daysInQueue: 7,
      assignedTo: null,
      lastActivity: '2024-01-16'
    },
    {
      setId: 'DS-00136',
      vendor: 'Metro Hardware Co',
      poNumber: 'PO-2024-0469',
      status: 'Processing Failed',
      documents: { invoice: true, po: true, grn: false },
      totalAmount: 8901.23,
      statusType: 'failed',
      priority: 'medium',
      majorIssues: 1,
      minorIssues: 1,
      daysInQueue: 11,
      assignedTo: null,
      lastActivity: '2024-01-14'
    },
    {
      setId: 'DS-00137',
      vendor: 'Superior Products Inc',
      poNumber: 'PO-2024-0470',
      status: 'Verified',
      documents: { invoice: true, po: true, grn: true },
      totalAmount: 5678.90,
      statusType: 'auto-approved',
      priority: 'low',
      majorIssues: 0,
      minorIssues: 0,
      daysInQueue: 1,
      assignedTo: null,
      lastActivity: '2024-01-18'
    }
  ];

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

  const getIssuesIndicator = (majorIssues: number, minorIssues: number, statusType: string) => {
    if (statusType === 'processing' || statusType === 'failed') {
      return <span className="text-muted-foreground text-sm font-roboto">—</span>;
    }
    
    if (majorIssues === 0 && minorIssues === 0) {
      return <span className="text-muted-foreground text-sm font-roboto">✓</span>;
    }

    const totalIssues = majorIssues + minorIssues;
    return (
      <div className="flex items-center space-x-1">
        <span className="text-foreground text-sm font-medium font-inter">{totalIssues}</span>
        <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
      </div>
    );
  };

  const getDaysDisplay = (days: number) => {
    if (days > 10) {
      return <span className="text-orange-600 font-bold text-sm font-inter">{days}</span>;
    } else if (days > 7) {
      return <span className="text-orange-500 text-sm font-inter">{days}</span>;
    } else {
      return <span className="text-muted-foreground text-sm font-roboto">{days}</span>;
    }
  };

  const getActionButton = (statusType: string, setId: string, status: string) => {
    if (status === 'Ready for Verification') {
      return (
        <Button className="button-primary" asChild>
          <Link to={`/matching/sets/${setId}`}>
            Verify
          </Link>
        </Button>
      );
    }
    
  // All other statuses use "View" and go to review with status parameter
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" asChild>
            <Link to={`/matching/sets/${setId}?status=${encodeURIComponent(status)}`}>
              <Eye className="w-4 h-4" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getRowBorderClass = (priority: string, daysInQueue: number) => {
    // Removed red border stroke
    return '';
  };

  const handleSelectItem = (setId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(setId)) {
      newSelected.delete(setId);
    } else {
      newSelected.add(setId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(paginatedSets.map(set => set.setId)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredSets = documentSets
    .filter(set => {
      // Status filter
      if (statusFilter === 'verified' && set.statusType !== 'auto-approved' && set.statusType !== 'approved') return false;
      if (statusFilter !== 'all' && statusFilter !== 'verified' && set.statusType !== statusFilter) return false;
      
      // Search filter
      if (searchTerm && !set.vendor.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !set.poNumber.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      // Smart filter combinations
      if (smartFilter === 'urgent') return set.daysInQueue > 7 || set.priority === 'high';
      if (smartFilter === 'high-value') return set.totalAmount > 10000;
      if (smartFilter === 'has-issues') return set.majorIssues > 0 || set.minorIssues > 0;
      if (smartFilter === 'missing-docs') return !set.documents.po || !set.documents.grn;
      
      return true;
    })
    .sort((a, b) => {
      let result = 0;
      
      switch (sortBy) {
        case 'priority':
          const aPriority = (a.daysInQueue > 10 || a.priority === 'high') ? 3 : 
                          (a.daysInQueue > 7 || a.priority === 'medium') ? 2 : 1;
          const bPriority = (b.daysInQueue > 10 || b.priority === 'high') ? 3 : 
                          (b.daysInQueue > 7 || b.priority === 'medium') ? 2 : 1;
          result = bPriority - aPriority;
          break;
        case 'amount':
          result = b.totalAmount - a.totalAmount;
          break;
        case 'age':
          result = b.daysInQueue - a.daysInQueue;
          break;
        case 'vendor':
          result = a.vendor.localeCompare(b.vendor);
          break;
        case 'issues':
          const aIssues = a.majorIssues + a.minorIssues;
          const bIssues = b.majorIssues + b.minorIssues;
          result = bIssues - aIssues;
          break;
        default:
          return 0;
      }
      
      return sortOrder === 'asc' ? -result : result;
    });

  const totalPages = Math.ceil(filteredSets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSets = filteredSets.slice(startIndex, startIndex + itemsPerPage);

  const getStatusCounts = () => {
    const counts = {
      all: documentSets.length,
      incomplete: documentSets.filter(s => s.statusType === 'incomplete').length,
      'ready-for-review': documentSets.filter(s => s.statusType === 'ready-for-review').length,
      verified: documentSets.filter(s => s.statusType === 'auto-approved' || s.statusType === 'approved').length,
      rejected: documentSets.filter(s => s.statusType === 'rejected').length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  const SortableHeader = ({ field, children, className = "" }: { field: string, children: React.ReactNode, className?: string }) => (
    <TableHead 
      className={`font-semibold cursor-pointer hover:bg-muted/50 transition-colors border-r-0 border-b border-t ${className}`}
      style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
        {sortBy === field && (
          <span className="text-foreground text-xs">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </TableHead>
  );

  return (
    <div className="space-y-2 px-4 pt-4 pb-2 max-w-full overflow-x-hidden">
      {/* Compact Header */}
      <div className="flex items-center justify-between py-1">
        <div>
          <h1 className="text-xl font-semibold text-foreground font-inter">Document Matching</h1>
        </div>
        <div className="flex space-x-2 items-center">
          {selectedItems.size > 0 && (
            <div className="flex items-center space-x-2 mr-4">
              <span className="text-sm text-muted-foreground font-roboto">{selectedItems.size} selected</span>
              <Button variant="outline" className="button-outline">Bulk Assign</Button>
              <Button variant="outline" className="button-outline">Bulk Verify</Button>
            </div>
          )}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground font-roboto">
          </div>
        </div>
      </div>


      {/* Duplicate Filter Section with Review Page Styling */}
      <div className="flex items-center justify-between mt-4">
        {/* Left Side - Modern Tab Filters */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-full">
          {[
            { key: 'all', label: 'All', count: statusCounts.all },
            { key: 'incomplete', label: 'Missing Documents', count: statusCounts.incomplete },
            { key: 'ready-for-review', label: 'Ready for Verification', count: statusCounts['ready-for-review'] },
            { key: 'verified', label: 'Verified', count: statusCounts.verified },
            { key: 'rejected', label: 'Rejected', count: statusCounts.rejected }
          ].map(tab => (
            <button
              key={tab.key}
              className={`
                px-4 py-2 flex items-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 border border-b-2
                ${statusFilter === tab.key
                  ? "text-gray-900 shadow-lg shadow-black/10 border-[#95A3C2]"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200 border-transparent"}
              `}
              style={statusFilter === tab.key ? {
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 1) 8.65%, rgba(255, 255, 255, 1) 48.88%, rgba(181, 218, 241, 1) 100%)',
                borderRadius: '19.5px',
                mixBlendMode: 'darken'
              } : {}}
              onClick={() => setStatusFilter(tab.key)}
            >
              <span>{tab.label}</span>
              <div className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                statusFilter === tab.key ? (
                  tab.key === 'all' ? 'bg-slate-600 text-white' :
                  tab.key === 'incomplete' ? 'bg-rose-600 text-white' :
                  tab.key === 'ready-for-review' ? 'bg-blue-600 text-white' :
                  tab.key === 'verified' ? 'bg-emerald-600 text-white' :
                  tab.key === 'rejected' ? 'bg-rose-600 text-white' : 'bg-slate-600 text-white'
                ) : (
                  tab.key === 'all' ? 'bg-gray-100 text-gray-700' :
                  tab.key === 'incomplete' ? 'bg-red-100 text-gray-700' :
                  tab.key === 'ready-for-review' ? 'bg-blue-100 text-gray-700' :
                  tab.key === 'verified' ? 'bg-green-100 text-gray-700' :
                  tab.key === 'rejected' ? 'bg-red-100 text-gray-700' : 'bg-gray-100 text-gray-700'
                )
              }`}>
                {tab.count}
              </div>
            </button>
          ))}
        </div>

        {/* Right Side - Search and Filter (Duplicate) */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Filter 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 cursor-pointer hover:text-foreground" 
              onClick={() => setSmartFilter('all')}
            />
            <Input
              placeholder="Search vendor, PO number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 h-9 font-roboto w-64"
            />
          </div>
        </div>
      </div>

      {/* Data Table Container with Fixed Height and Internal Scrolling */}
      <Tabs value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}>
        <TabsList className="hidden">
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="mt-2 shadow-lg shadow-black/5">
          <Card className="overflow-hidden">
            {/* Single Table with Sticky Header */}
            <div 
              className="overflow-y-auto"
              style={{ 
                maxHeight: `calc(100vh - 320px)`,
                height: paginatedSets.length > 15 ? `calc(100vh - 320px)` : 'auto'
              }}
            >
              <Table className="min-w-full" style={{ tableLayout: 'fixed' }}>
                <TableHeader className="sticky top-0 z-10">
                  <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                     <TableHead className="w-12 font-semibold border-r-0 text-sm h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>
                       <Checkbox
                         checked={selectedItems.size === paginatedSets.length && paginatedSets.length > 0}
                         onCheckedChange={handleSelectAll}
                         aria-label="Select all"
                       />
                     </TableHead>
                     <TableHead className="font-semibold w-[100px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Set ID</TableHead>
                     <SortableHeader field="vendor" className="w-[160px]">Vendor Name</SortableHeader>
                     <TableHead className="font-semibold w-[120px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>PO Number</TableHead>
                     <TableHead className="font-semibold w-[140px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Status</TableHead>
                     <SortableHeader field="issues" className="w-[80px]">Issues</SortableHeader>
                     <SortableHeader field="amount" className="w-[120px]">Amount</SortableHeader>
                     <SortableHeader field="age" className="w-[80px]">Days</SortableHeader>
                     <TableHead className="font-semibold w-[140px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSets.map((set) => (
                    <TableRow key={set.setId} className={`${getRowBorderClass(set.priority, set.daysInQueue)} h-10 hover:bg-muted/50 transition-colors`}>
                      <TableCell className="py-2 border-r-0 w-12">
                        <Checkbox
                          checked={selectedItems.has(set.setId)}
                          onCheckedChange={() => handleSelectItem(set.setId)}
                          aria-label={`Select set ${set.setId}`}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm font-medium py-2 border-r-0 text-foreground truncate w-[100px]">{set.setId}</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground truncate w-[160px]" title={set.vendor}>{set.vendor}</TableCell>
                      <TableCell className="py-2 border-r-0 w-[120px]">
                        <Link 
                          to={`/matching/sets/${set.setId}`}
                          className="font-medium text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {set.poNumber}
                        </Link>
                      </TableCell>
                      <TableCell className="py-2 border-r-0 w-[140px]">{getStatusBadge(set.status, set.statusType)}</TableCell>
                      <TableCell className="py-2 border-r-0 w-[80px]">{getIssuesIndicator(set.majorIssues, set.minorIssues, set.statusType)}</TableCell>
                      <TableCell className="font-medium py-2 border-r-0 text-sm text-foreground w-[120px]">{formatCurrency(set.totalAmount)}</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-muted-foreground w-[80px]">{getDaysDisplay(set.daysInQueue)}</TableCell>
                      <TableCell className="py-2 border-r-0 w-[140px]">
                        <div className="flex items-center justify-between">
                          {getActionButton(set.statusType, set.setId, set.status)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Assign to User</DropdownMenuItem>
                              <DropdownMenuItem>Download Documents</DropdownMenuItem>
                              <DropdownMenuItem>View History</DropdownMenuItem>
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
        </TabsContent>
      </Tabs>

      {/* Pagination on Main Background */}
      {filteredSets.length > 0 && (
        <div className="flex justify-end items-center mt-4 px-1">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} of {filteredSets.length}
            </span>
            
            {/* Page navigation */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                {/* Previous button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
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
                    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
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
                          <span key="ellipsis1" className="px-2 text-sm text-muted-foreground">
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
                          <span key="ellipsis2" className="px-2 text-sm text-muted-foreground">
                            …
                          </span>
                        );
                      }
                      pages.push(
                        <Button
                          key={totalPages}
                          variant={currentPage === totalPages ? "default" : "ghost"}
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

export default MatchingQueue;
