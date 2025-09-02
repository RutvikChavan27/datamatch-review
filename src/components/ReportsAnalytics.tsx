import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, TrendingUp, TrendingDown, Folder, HardDrive, BarChart3, ChevronDown, Check, Settings, Users, Database, Workflow, Clock, Shield, FileText, X, Upload, Eye, CheckCircle, Trophy, XCircle, UserCheck, UsersRound, Activity, Hash, Tag, AlertCircle, Info, CalendarIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as ChartTooltip, BarChart, Bar, XAxis, YAxis, LabelList } from 'recharts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { GenerateDataMatchReportModal } from './GenerateDataMatchReportModal';
import { GenerateProductivityEngineReportModal } from './GenerateProductivityEngineReportModal';
import RecentActivity from './RecentActivity';
const ReportsAnalytics = () => {
  // Workflows data
  const workflowsData = [{
    name: 'Invoice Processing',
    created: 'Feb 3, 2024',
    modified: 'Jan 5, 2025',
    executed: '30 mins ago',
    status: 'Active',
    executions: 3456,
    user: 'Sarah Johnson',
    access: 'Finance Team, Admin',
    avgTime: '1.2 min',
    processed: 3456
  }, {
    name: 'Document Classification',
    created: 'Jan 15, 2024',
    modified: 'Dec 18, 2024',
    executed: '2 hours ago',
    status: 'Active',
    executions: 2891,
    user: 'Michael Chen',
    access: 'All Teams',
    avgTime: '0.8 min',
    processed: 2891
  }, {
    name: 'Data Extraction',
    created: 'Mar 8, 2024',
    modified: 'Jan 3, 2025',
    executed: '1 hour ago',
    status: 'Active',
    executions: 2567,
    user: 'Lisa Rodriguez',
    access: 'Operations, IT',
    avgTime: '2.3 min',
    processed: 2567
  }, {
    name: 'Compliance Check',
    created: 'Apr 12, 2024',
    modified: 'Dec 15, 2024',
    executed: '3 hours ago',
    status: 'Active',
    executions: 987,
    user: 'David Kim',
    access: 'Legal, Compliance',
    avgTime: '5.1 min',
    processed: 987
  }, {
    name: 'Approval Workflow',
    created: 'May 20, 2024',
    modified: 'Jan 2, 2025',
    executed: '45 mins ago',
    status: 'Inactive',
    executions: 1234,
    user: 'Emma Thompson',
    access: 'Management',
    avgTime: '3.7 min',
    processed: 1234
  }];
  const [activeTab, setActiveTab] = useState('storage');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 30 days');
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [isDataMatchModalOpen, setIsDataMatchModalOpen] = useState(false);
  const [isProductivityModalOpen, setIsProductivityModalOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(workflowsData[0]); // Auto-select first workflow
  const [analyticsTimeRange, setAnalyticsTimeRange] = useState('Last 30 days');
  const [isPOReportModalOpen, setIsPOReportModalOpen] = useState(false);
  const [poReportData, setPOReportData] = useState({
    vendors: [],
    departments: [],
    users: [],
    minValue: '',
    status: {
      approved: false,
      pending: false,
      rejected: false
    },
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
    exportFormat: 'PDF'
  });
  const itemsPerPage = 10;
  const foldersData = [{
    name: 'Invoices',
    team: 'Finance Team',
    moreGroups: 27,
    documents: 15432,
    size: '234 GB',
    growth: '+18%',
    growthType: 'positive'
  }, {
    name: 'Purchase Orders',
    team: 'Procurement Team',
    moreGroups: 14,
    documents: 6801,
    size: '156 GB',
    growth: '+8%',
    growthType: 'positive'
  }, {
    name: 'Court Records',
    team: 'Legal Team',
    moreGroups: 11,
    documents: 3245,
    size: '78 GB',
    growth: '+2%',
    growthType: 'positive'
  }, {
    name: 'Agreements and Contracts',
    team: 'Legal Team',
    moreGroups: 7,
    documents: 2134,
    size: '67 GB',
    growth: '+4%',
    growthType: 'positive'
  }, {
    name: 'MoUs and Legal Documents',
    team: 'Legal Team',
    moreGroups: 4,
    documents: 1567,
    size: '34 GB',
    growth: '-3%',
    growthType: 'negative'
  }, {
    name: 'HR Documents',
    team: 'HR Team',
    moreGroups: 6,
    documents: 1234,
    size: '28 GB',
    growth: '+6%',
    growthType: 'positive'
  }, {
    name: 'Financial Reports',
    team: 'Finance Team',
    moreGroups: 17,
    documents: 987,
    size: '23 GB',
    growth: '+1%',
    growthType: 'positive'
  }, {
    name: 'Tax Documents',
    team: 'Finance Team',
    moreGroups: 5,
    documents: 876,
    size: '19 GB',
    growth: '+3%',
    growthType: 'positive'
  }, {
    name: 'Insurance Documents',
    team: 'HR Team',
    moreGroups: 3,
    documents: 654,
    size: '15 GB',
    growth: '+2%',
    growthType: 'positive'
  }, {
    name: 'Marketing Materials',
    team: 'Marketing Team',
    moreGroups: 21,
    documents: 543,
    size: '12 GB',
    growth: '+4%',
    growthType: 'positive'
  }, {
    name: 'Compliance Documents',
    team: 'Compliance Team, Legal Team',
    moreGroups: 0,
    documents: 432,
    size: '9 GB',
    growth: '+1%',
    growthType: 'positive'
  }, {
    name: 'Training Materials',
    team: 'HR Team',
    moreGroups: 114,
    documents: 321,
    size: '7 GB',
    growth: '-2%',
    growthType: 'negative'
  }, {
    name: 'Archived Files',
    team: 'IT Admin',
    moreGroups: 0,
    documents: 210,
    size: '5 GB',
    growth: '0%',
    growthType: 'neutral'
  }, {
    name: 'Templates',
    team: 'All Employees',
    moreGroups: 158,
    documents: 123,
    size: '2 GB',
    growth: '+1%',
    growthType: 'positive'
  }];
  const storageBreakdown = [{
    name: 'Invoices',
    size: '234 GB',
    value: 234,
    color: '#22c55e'
  }, {
    name: 'Purchase Orders',
    size: '156 GB',
    value: 156,
    color: '#3b82f6'
  }, {
    name: 'Court Records',
    size: '78 GB',
    value: 78,
    color: '#eab308'
  }, {
    name: 'Agreements and Contracts',
    size: '67 GB',
    value: 67,
    color: '#a855f7'
  }, {
    name: 'MoUs and Legal Documents',
    size: '34 GB',
    value: 34,
    color: '#ec4899'
  }, {
    name: 'HR Documents',
    size: '28 GB',
    value: 28,
    color: '#f97316'
  }];
  const getFolderColor = (folderName: string) => {
    const colorMap: {
      [key: string]: string;
    } = {
      'Invoices': '#22c55e',
      'Purchase Orders': '#3b82f6',
      'Court Records': '#eab308',
      'Agreements and Contracts': '#a855f7',
      'MoUs and Legal Documents': '#ec4899',
      'HR Documents': '#f97316'
    };
    return colorMap[folderName] || '#6b7280';
  };
  const getGrowthIcon = (type: string) => {
    if (type === 'positive') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (type === 'negative') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return null;
  };
  const getGrowthColor = (type: string) => {
    if (type === 'positive') return 'text-green-600';
    if (type === 'negative') return 'text-red-600';
    return 'text-muted-foreground';
  };
  return <div className="h-full p-6 space-y-6">
      {/* Clean Header */}
      <div className="flex items-center justify-between py-1">
        <div>
          <h1 className="text-xl font-semibold text-foreground font-inter">
            Reports & Analytics
          </h1>
        </div>
      </div>

      {/* Custom Tab Navigation */}
      <div className="border-b border-border flex items-center justify-between px-0">
        <div className="flex items-center flex-1 -mb-px pb-1">
          {[{
          key: 'storage',
          label: 'Storage'
        }, {
          key: 'workflows',
          label: 'Workflows'
        }, {
          key: 'po-requests',
          label: 'PO Requests'
        }, {
          key: 'data-match',
          label: 'Data Match'
        }, {
          key: 'system-reports',
          label: 'System Reports'
        }, {
          key: 'audit-logs',
          label: 'Recent Activity'
        }].map((tab, index) => <button key={tab.key} className={`
                px-4 py-2.5 flex items-center gap-2 justify-center transition-all duration-200 relative font-semibold
                ${index > 0 ? '-ml-px' : ''}
                ${activeTab === tab.key ? `bg-white text-gray-900 z-10 border-b-2 border-b-[#27313e] border-transparent rounded-t-md` : "text-muted-foreground hover:bg-gray-50 hover:text-gray-700 border-b-2 border-transparent"}
              `} onClick={() => setActiveTab(tab.key)}>
              <span className="text-center text-sm leading-5 flex items-center justify-center font-semibold">
                {tab.label}
              </span>
            </button>)}
        </div>

        {/* Buttons on same level as tabs */}
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {selectedTimeRange}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {['Last 7 days', 'Last 30 days', 'Last 90 days', 'Custom range'].map(option => <DropdownMenuItem key={option} onClick={() => setSelectedTimeRange(option)} className="flex items-center justify-between">
                  <span>{option}</span>
                  {selectedTimeRange === option && <Check className="w-4 h-4 text-primary" />}
                </DropdownMenuItem>)}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                Report
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                Generate PDF Report
              </DropdownMenuItem>
              <DropdownMenuItem>
                Generate Excel Report
              </DropdownMenuItem>
              <DropdownMenuItem>
                Generate CSV Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>

        <TabsContent value="storage" className="space-y-6">
          <div className="flex gap-6">
            {/* Left Section - All Folders Table (80%) */}
            <div className="flex-1">
              {/* All Folders Title */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">All Folders</h2>
                  <p className="text-sm text-muted-foreground">Document storage and folder organization overview</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input type="search" placeholder="Search folders or access group" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 w-80" />
                  </div>
                  
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export List
                  </Button>
                </div>
              </div>
              
              <div className="shadow-lg shadow-black/5">
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="overflow-y-auto" style={{
                  maxHeight: `calc(100vh - 320px)`
                }}>
                    <Table className="min-w-full" style={{
                    tableLayout: 'fixed'
                  }}>
                      <TableHeader className="sticky top-0 z-10">
                        <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                          <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{
                          backgroundColor: '#DFE7F3',
                          borderBottomColor: '#c9d1e0',
                          borderTopColor: '#c9d1e0',
                          width: '35%'
                        }}>
                            Folder Name
                          </TableHead>
                          <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{
                          backgroundColor: '#DFE7F3',
                          borderBottomColor: '#c9d1e0',
                          borderTopColor: '#c9d1e0',
                          width: '30%'
                        }}>
                            Access
                          </TableHead>
                          <TableHead className="text-right font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{
                          backgroundColor: '#DFE7F3',
                          borderBottomColor: '#c9d1e0',
                          borderTopColor: '#c9d1e0',
                          width: '12%'
                        }}>
                            Documents
                          </TableHead>
                          <TableHead className="text-right font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{
                          backgroundColor: '#DFE7F3',
                          borderBottomColor: '#c9d1e0',
                          borderTopColor: '#c9d1e0',
                          width: '12%'
                        }}>
                            Size
                          </TableHead>
                          <TableHead className="text-right font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{
                          backgroundColor: '#DFE7F3',
                          borderBottomColor: '#c9d1e0',
                          borderTopColor: '#c9d1e0',
                          width: '11%'
                        }}>
                            Growth
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {foldersData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((folder, index) => <TableRow key={index} className="bg-white h-14 hover:bg-muted/50 transition-colors">
                            <TableCell className="font-medium py-2 border-r-0 text-sm text-foreground">
                              <div className="flex items-center gap-2">
                                <Folder className="w-4 h-4" style={{
                              color: getFolderColor(folder.name)
                            }} />
                                {folder.name}
                              </div>
                            </TableCell>
                            <TableCell className="py-2 border-r-0 text-sm text-foreground">
                              <div className="text-sm">
                                <span className="text-foreground font-medium">{folder.team}</span>
                                {folder.moreGroups > 0 && <span className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer ml-1">+ {folder.moreGroups} more groups</span>}
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium py-2 border-r-0 text-sm text-foreground">
                              {folder.documents.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right font-medium py-2 border-r-0 text-sm text-foreground">
                              {folder.size}
                            </TableCell>
                            <TableCell className="text-right py-2 border-r-0 text-sm text-foreground">
                              <div className={`flex items-center justify-end gap-1 ${getGrowthColor(folder.growthType)}`}>
                                {getGrowthIcon(folder.growthType)}
                                <span className="font-medium">{folder.growth}</span>
                              </div>
                            </TableCell>
                          </TableRow>)}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
              
              {/* Pagination */}
              {Math.ceil(foldersData.length / itemsPerPage) > 1 && <div className="flex justify-between items-center mt-6">
                  <Pagination className="mx-0 justify-start">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" onClick={e => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }} className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""} />
                      </PaginationItem>
                      
                      {Array.from({
                    length: Math.ceil(foldersData.length / itemsPerPage)
                  }, (_, i) => i + 1).map(page => <PaginationItem key={page}>
                          <PaginationLink href="#" onClick={e => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }} isActive={currentPage === page}>
                            {page}
                          </PaginationLink>
                        </PaginationItem>)}
                      
                      <PaginationItem>
                        <PaginationNext href="#" onClick={e => {
                      e.preventDefault();
                      if (currentPage < Math.ceil(foldersData.length / itemsPerPage)) setCurrentPage(currentPage + 1);
                    }} className={currentPage >= Math.ceil(foldersData.length / itemsPerPage) ? "pointer-events-none opacity-50" : ""} />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                  
                </div>}
            </div>

            {/* Right Section - Info Cards (25%) */}
            <div className="w-[400px] space-y-6">
              {/* Storage Overview Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Storage Overview</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Storage Used</p>
                      <p className="text-2xl font-semibold text-foreground">847.2 GB</p>
                    </div>
                    <HardDrive className="w-8 h-8 text-muted-foreground opacity-60" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Documents:</span>
                      <span className="font-medium">156,429 <span className="text-green-600">+48%</span></span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Active Folders:</span>
                      <span className="font-medium">89 <span className="text-green-600">+3</span></span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Avg File Size:</span>
                      <span className="font-medium">5.4 MB <span className="text-red-600">-3%</span></span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Storage Breakdown Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Storage Breakdown</h3>
                    <HardDrive className="w-5 h-5 text-muted-foreground" />
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">Total: 847.2 GB of 1,000 GB</p>
                  </div>

                  {/* Pie Chart */}
                  <div className="h-52 mb-2 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={storageBreakdown} cx="50%" cy="50%" innerRadius={65} outerRadius={80} paddingAngle={1} dataKey="value">
                          {storageBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <ChartTooltip formatter={(value: number, name: string) => [`${value} GB`, name]} labelStyle={{
                        color: '#374151'
                      }} contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Center text overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-xl font-bold text-foreground">847.2 GB</p>
                        <p className="text-sm text-muted-foreground">Used</p>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-2">
                    {storageBreakdown.map((item, index) => <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{
                        backgroundColor: item.color
                      }} />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium">{item.size}</span>
                      </div>)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Placeholder tabs */}
        <TabsContent value="workflows" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Workflows Overview</h2>
              <p className="text-sm text-muted-foreground">Workflow automation and process management reporting</p>
            </div>
            <Button onClick={() => setIsProductivityModalOpen(true)}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>

          {/* Two Column Layout */}
          <div className="flex gap-6">
            {/* Left Column - Workflows List */}
            <div className="w-1/2 space-y-6">
              {/* Workflows List */}
              <Card className="rounded-xl shadow-sm border border-border/50 h-full">
                 <CardContent className="p-6 h-full">
                   {/* Search Bar */}
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-semibold text-foreground">Workflows</h3>
                     <div className="relative">
                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                       <Input type="search" placeholder="Search workflows..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 w-80" />
                     </div>
                   </div>

                   {/* Stats Cards */}
                   <div className="grid grid-cols-2 gap-4 mb-6">
                     <Card className="rounded-xl shadow-sm border border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Workflow className="w-6 h-6 text-blue-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Active Workflows</p>
                                <p className="text-2xl font-bold text-foreground mb-1">47</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-green-500" />
                              <span className="text-xs font-medium text-green-500">+5 new</span>
                            </div>
                          </div>
                       </CardContent>
                     </Card>

                     <Card className="rounded-xl shadow-sm border border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-green-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Documents Processed</p>
                                <p className="text-2xl font-bold text-foreground mb-1">18,429</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-green-500" />
                              <span className="text-xs font-medium text-green-500">+34%</span>
                            </div>
                          </div>
                       </CardContent>
                     </Card>
                   </div>

              <div className="shadow-lg shadow-black/5">
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="overflow-y-auto" style={{
                      maxHeight: `calc(100vh - 320px)`
                    }}>
                    <Table className="min-w-full" style={{
                        tableLayout: 'fixed'
                      }}>
                      <TableHeader className="sticky top-0 z-10">
                        <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                          <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{
                              backgroundColor: '#DFE7F3',
                              borderBottomColor: '#c9d1e0',
                              borderTopColor: '#c9d1e0'
                            }}>
                            Workflow Name
                          </TableHead>
                          <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{
                              backgroundColor: '#DFE7F3',
                              borderBottomColor: '#c9d1e0',
                              borderTopColor: '#c9d1e0'
                            }}>
                            Created
                          </TableHead>
                          <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{
                              backgroundColor: '#DFE7F3',
                              borderBottomColor: '#c9d1e0',
                              borderTopColor: '#c9d1e0'
                            }}>
                            Last Modified
                          </TableHead>
                          <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{
                              backgroundColor: '#DFE7F3',
                              borderBottomColor: '#c9d1e0',
                              borderTopColor: '#c9d1e0'
                            }}>
                            Last Executed
                          </TableHead>
                          <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{
                              backgroundColor: '#DFE7F3',
                              borderBottomColor: '#c9d1e0',
                              borderTopColor: '#c9d1e0'
                            }}>
                            Status
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {workflowsData.filter(workflow => workflow.name.toLowerCase().includes(searchTerm.toLowerCase())).map((workflow, index) => <TableRow key={index} className={`cursor-pointer h-14 hover:bg-muted/50 transition-colors ${selectedWorkflow?.name === workflow.name ? 'bg-primary/5 border-l-4 border-l-primary' : 'bg-white'}`} onClick={() => setSelectedWorkflow(workflow)}>
                            <TableCell className="font-medium py-2 border-r-0 text-sm text-foreground">
                              {workflow.name}
                            </TableCell>
                            <TableCell className="py-2 border-r-0 text-sm text-muted-foreground">
                              {workflow.created}
                            </TableCell>
                            <TableCell className="py-2 border-r-0 text-sm text-muted-foreground">
                              {workflow.modified}
                            </TableCell>
                            <TableCell className="py-2 border-r-0 text-sm text-muted-foreground">
                              {workflow.executed}
                            </TableCell>
                            <TableCell className="py-2 border-r-0 text-sm">
                              <Badge variant={workflow.status === 'Active' ? 'default' : 'secondary'} className={workflow.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-100'}>
                                {workflow.status}
                              </Badge>
                            </TableCell>
                          </TableRow>)}
                      </TableBody>
                    </Table>
                   </div>
                 </div>
               </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Selected Workflow Details */}
            <div className="flex-1 relative">
              <Card className="rounded-xl shadow-sm border border-border/50">
                <CardContent className="p-6">
                   {/* Selected Workflow */}
                   <div className="relative p-4 rounded-lg border-2 transition-all bg-blue-50 border-blue-200 shadow-sm mb-4">
                     {/* Triangle notch on left edge of workflow box */}
                     {selectedWorkflow && <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-primary z-10" />}
                     <div className="flex items-center justify-between">
                       <div className="flex items-start gap-3">
                         <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                           <Workflow className="w-5 h-5 text-purple-600" />
                         </div>
                         <div className="flex-1 min-w-0">
                           <h4 className="font-medium text-sm text-muted-foreground mb-1">Workflow</h4>
                           <p className="font-bold text-base text-foreground">{selectedWorkflow.name}</p>
                         </div>
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="text-sm text-muted-foreground">Analytics Period:</span>
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="outline" size="sm" className="bg-background border-border hover:bg-muted/50">
                               {analyticsTimeRange}
                               <ChevronDown className="ml-2 h-3 w-3" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="bg-background border-border shadow-lg z-50">
                             <DropdownMenuItem onClick={() => setAnalyticsTimeRange('Last 30 days')} className="hover:bg-muted">
                               <Check className={`mr-2 h-3 w-3 ${analyticsTimeRange === 'Last 30 days' ? 'opacity-100' : 'opacity-0'}`} />
                               Last 30 days
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => setAnalyticsTimeRange('Last 3 months')} className="hover:bg-muted">
                               <Check className={`mr-2 h-3 w-3 ${analyticsTimeRange === 'Last 3 months' ? 'opacity-100' : 'opacity-0'}`} />
                               Last 3 months
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => setAnalyticsTimeRange('Last 6 months')} className="hover:bg-muted">
                               <Check className={`mr-2 h-3 w-3 ${analyticsTimeRange === 'Last 6 months' ? 'opacity-100' : 'opacity-0'}`} />
                               Last 6 months
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => setAnalyticsTimeRange('Last year')} className="hover:bg-muted">
                               <Check className={`mr-2 h-3 w-3 ${analyticsTimeRange === 'Last year' ? 'opacity-100' : 'opacity-0'}`} />
                               Last year
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => setAnalyticsTimeRange('Custom range')} className="hover:bg-muted">
                               <Check className={`mr-2 h-3 w-3 ${analyticsTimeRange === 'Custom range' ? 'opacity-100' : 'opacity-0'}`} />
                               Custom range
                             </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
                       </div>
                     </div>
                   </div>
                  
                   <div className="flex gap-6">
                     {/* Left Side - Main Content */}
                     <div className="flex-1">
                       {/* Workflow Statistics */}
                       <div className="mb-6">
                         <div className="flex items-center justify-between mb-3">
                           <h4 className="text-md font-semibold text-foreground">Workflow Statistics</h4>
                           <Button variant="outline" size="sm" className="bg-background border-border hover:bg-muted/50">
                             <Download className="w-4 h-4 mr-2" />
                             Export
                           </Button>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                           <div className="text-center p-3 bg-card rounded-lg border">
                             <p className="text-2xl font-bold text-foreground">{selectedWorkflow.avgTime}</p>
                             <p className="text-xs text-muted-foreground">Avg Completion</p>
                           </div>
                           <div className="text-center p-3 bg-card rounded-lg border">
                             <p className="text-2xl font-bold text-foreground">{selectedWorkflow.processed.toLocaleString()}</p>
                             <p className="text-xs text-muted-foreground">Documents Processed</p>
                           </div>
                         </div>
                       </div>

                       {/* Metadata Header */}
                       <div className="flex flex-col gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
                         <div className="flex-1">
                           <div className="flex items-start gap-3">
                             <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                               <BarChart3 className="w-5 h-5 text-blue-600" />
                             </div>
                             <div>
                               <p className="text-sm text-muted-foreground">Total Executions</p>
                               <p className="text-xl font-semibold text-foreground">{selectedWorkflow.executions.toLocaleString()}</p>
                             </div>
                           </div>
                         </div>
                         <div className="flex-1">
                           <div className="flex items-start gap-3">
                             <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                               <Users className="w-5 h-5 text-green-600" />
                             </div>
                             <div>
                               <p className="text-sm text-muted-foreground">User</p>
                               <p className="text-sm font-medium text-foreground">{selectedWorkflow.user}</p>
                             </div>
                           </div>
                         </div>
                         <div className="flex-1">
                           <div className="flex items-start gap-3">
                             <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                               <Shield className="w-5 h-5 text-purple-600" />
                             </div>
                             <div>
                               <p className="text-sm text-muted-foreground">Access</p>
                               <p className="text-sm font-medium text-foreground">{selectedWorkflow.access}</p>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>

                    {/* Right Side - Recent Activity */}
                    <div className="w-80">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-md font-semibold text-foreground">Recent Activity</h4>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          Full History
                        </button>
                      </div>
                      <div className="space-y-3">
                        {[{
                        time: 'Jan 21, 10:30 AM',
                        document: 'Document_Invoice_1.pdf',
                        status: 'Success',
                        duration: '1.1 min'
                      }, {
                        time: 'Jan 21, 8:15 AM',
                        document: 'Document_Invoice_2.pdf',
                        status: 'Success',
                        duration: '1.3 min'
                      }, {
                        time: 'Jan 20, 4:45 PM',
                        document: 'Document_Invoice_3.pdf',
                        status: 'Success',
                        duration: '1.0 min'
                      }, {
                        time: 'Jan 20, 2:20 PM',
                        document: 'Document_Invoice_4.pdf',
                        status: 'Success',
                        duration: '1.4 min'
                      }, {
                        time: 'Jan 20, 11:30 AM',
                        document: 'Document_Invoice_5.pdf',
                        status: 'Failed',
                        duration: '1.2 min'
                      }].map((activity, index) => <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-foreground">{activity.document}</p>
                              <p className="text-xs text-muted-foreground">{activity.time} • Completed in {activity.duration}</p>
                            </div>
                            <Badge variant={activity.status === 'Success' ? 'default' : 'destructive'} className={activity.status === 'Success' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-red-100 text-red-700 hover:bg-red-100'}>
                              {activity.status}
                            </Badge>
                          </div>)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="po-requests" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Purchase Order Requests</h2>
              <p className="text-sm text-muted-foreground">PO request processing and approval workflow analytics</p>
            </div>
            <Button onClick={() => setIsPOReportModalOpen(true)}>Generate Report</Button>
          </div>
          {/* Overview Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-xl shadow-sm border border-border/50">
               <CardContent className="p-6 relative">
                 <div className="flex items-start justify-between">
                   <div>
                     <p className="text-sm font-medium text-muted-foreground mb-1">Received Requests</p>
                     <p className="text-3xl font-bold text-foreground mb-2">1,847</p>
                     <p className="text-sm text-muted-foreground">Total Value: <span className="font-medium text-foreground">$4.2M</span></p>
                   </div>
                   <div className="flex items-center gap-1 text-green-600">
                     <TrendingUp className="w-4 h-4" />
                     <span className="text-sm font-medium">+18%</span>
                   </div>
                 </div>
                 <div className="absolute bottom-4 right-4 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                   <FileText className="w-5 h-5 text-blue-500" />
                 </div>
               </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm border border-border/50">
               <CardContent className="p-6 relative">
                 <div className="flex items-start justify-between">
                   <div>
                     <p className="text-sm font-medium text-muted-foreground mb-1">Approved Requests</p>
                     <p className="text-3xl font-bold text-foreground mb-2">1,516</p>
                     <p className="text-sm text-muted-foreground">Approved Value: <span className="font-medium text-foreground">$2.4M</span></p>
                   </div>
                   <div className="flex items-center gap-1 text-green-600">
                     <TrendingUp className="w-4 h-4" />
                     <span className="text-sm font-medium">+22%</span>
                   </div>
                 </div>
                 <div className="absolute bottom-4 right-4 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                   <CheckCircle className="w-5 h-5 text-green-500" />
                 </div>
               </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm border border-border/50">
               <CardContent className="p-6 relative">
                 <div className="flex items-start justify-between">
                   <div>
                     <p className="text-sm font-medium text-muted-foreground mb-1">Average Approval Time</p>
                     <p className="text-3xl font-bold text-foreground mb-2">4.2 <span className="text-lg font-medium text-muted-foreground">hrs</span></p>
                   </div>
                   <div className="flex items-center gap-1 text-red-600">
                     <TrendingDown className="w-4 h-4" />
                     <span className="text-sm font-medium">-32%</span>
                   </div>
                 </div>
                 <div className="absolute bottom-4 right-4 w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                   <Clock className="w-5 h-5 text-orange-500" />
                 </div>
               </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm border border-border/50">
               <CardContent className="p-6 relative">
                 <div className="flex items-start justify-between">
                   <div>
                     <p className="text-sm font-medium text-muted-foreground mb-1">Pending Approval</p>
                     <p className="text-3xl font-bold text-foreground mb-2">23</p>
                   </div>
                   <div className="flex items-center gap-1 text-red-600">
                     <TrendingDown className="w-4 h-4" />
                     <span className="text-sm font-medium">-47%</span>
                   </div>
                 </div>
                 <div className="absolute bottom-4 right-4 w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                   <AlertCircle className="w-5 h-5 text-yellow-500" />
                 </div>
               </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="flex gap-6">
            {/* Left Section - Top Vendors by Volume */}
            <div className="flex-1">
              <Card className="rounded-xl shadow-sm border border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center">
                      <h2 className="text-lg font-semibold text-foreground">Top Vendors by Volume</h2>
                    </div>
                  </div>
                  
                  <div className="border border-border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                          <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{
                            backgroundColor: '#DFE7F3',
                            borderBottomColor: '#c9d1e0',
                            borderTopColor: '#c9d1e0'
                          }}>
                            Vendor Name
                          </TableHead>
                          <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{
                            backgroundColor: '#DFE7F3',
                            borderBottomColor: '#c9d1e0',
                            borderTopColor: '#c9d1e0'
                          }}>
                            Volume
                          </TableHead>
                          <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{
                            backgroundColor: '#DFE7F3',
                            borderBottomColor: '#c9d1e0',
                            borderTopColor: '#c9d1e0'
                          }}>
                            Value
                          </TableHead>
                          <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{
                            backgroundColor: '#DFE7F3',
                            borderBottomColor: '#c9d1e0',
                            borderTopColor: '#c9d1e0'
                          }}>
                            Type
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[{
                        vendor: 'ABC Corp',
                        volume: 234,
                        value: '$456K',
                        type: 'Repeat'
                      }, {
                        vendor: 'XYZ Solutions',
                        volume: 189,
                        value: '$378K',
                        type: 'Repeat'
                      }, {
                        vendor: 'Tech Supplies Inc',
                        volume: 156,
                        value: '$289K',
                        type: 'Repeat'
                      }, {
                        vendor: 'Office Materials',
                        volume: 134,
                        value: '$234K',
                        type: 'New'
                      }, {
                        vendor: 'Equipment Plus',
                        volume: 98,
                        value: '$567K',
                        type: 'Repeat'
                      }, {
                        vendor: 'Service Partners',
                        volume: 87,
                        value: '$178K',
                        type: 'New'
                      }].map((item, index) => <TableRow key={index} className="bg-white">
                            <TableCell className="font-medium bg-white border-r-0">
                              {item.vendor}
                            </TableCell>
                            <TableCell className="bg-white border-r-0">
                              {item.volume}
                            </TableCell>
                            <TableCell className="font-medium bg-white border-r-0">
                              {item.value}
                            </TableCell>
                            <TableCell className="bg-white border-r-0">
                              <Badge variant={item.type === 'Repeat' ? 'secondary' : 'outline'} className={item.type === 'Repeat' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100'}>
                                {item.type}
                              </Badge>
                            </TableCell>
                          </TableRow>)}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Section - Cost Center/Department Numbers */}
            <div className="w-96">
              <Card className="rounded-xl shadow-sm border border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center">
                      <h2 className="text-lg font-semibold text-foreground">Cost Center/Department Numbers</h2>
                    </div>
                  </div>
                  
                    <div className="shadow-lg shadow-black/5">
                      <div className="border border-border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                              <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{
                            backgroundColor: '#DFE7F3',
                            borderBottomColor: '#c9d1e0',
                            borderTopColor: '#c9d1e0'
                          }}>
                                Department
                              </TableHead>
                              <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t text-right" style={{
                            backgroundColor: '#DFE7F3',
                            borderBottomColor: '#c9d1e0',
                            borderTopColor: '#c9d1e0'
                          }}>
                                Requested
                              </TableHead>
                              <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t text-right" style={{
                            backgroundColor: '#DFE7F3',
                            borderBottomColor: '#c9d1e0',
                            borderTopColor: '#c9d1e0'
                          }}>
                                Approved
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[{
                          department: 'IT',
                          requested: '$567K',
                          approved: '$523K'
                        }, {
                          department: 'Operations',
                          requested: '$434K',
                          approved: '$401K'
                        }, {
                          department: 'Marketing',
                          requested: '$289K',
                          approved: '$267K'
                        }, {
                          department: 'HR',
                          requested: '$156K',
                          approved: '$148K'
                        }, {
                          department: 'Finance',
                          requested: '$123K',
                          approved: '$119K'
                        }, {
                          department: 'Sales',
                          requested: '$234K',
                          approved: '$221K'
                        }].map((item, index) => <TableRow key={index} className="bg-white h-14 hover:bg-muted/50 transition-colors">
                                <TableCell className="font-medium py-2 border-r-0 text-sm text-foreground">
                                  {item.department}
                                </TableCell>
                                <TableCell className="text-right font-medium py-2 border-r-0 text-sm text-foreground">
                                  {item.requested}
                                </TableCell>
                                <TableCell className="text-right font-medium py-2 border-r-0 text-sm text-foreground">
                                  {item.approved}
                                </TableCell>
                              </TableRow>)}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="data-match" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Data Matching Analytics</h2>
              <p className="text-sm text-muted-foreground">Three-way matching performance and accuracy metrics</p>
            </div>
            <Button onClick={() => setIsDataMatchModalOpen(true)}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
          {/* Overview Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-xl shadow-sm border border-border/50">
              <CardContent className="p-6">
                 <div className="flex items-start justify-between">
                   <div>
                     <p className="text-sm font-medium text-muted-foreground mb-1">Successful Matches</p>
                     <p className="text-3xl font-bold text-foreground mb-2">24,387</p>
                     <div className="flex items-center gap-1">
                       <TrendingUp className="w-4 h-4 text-emerald-500" />
                       <span className="text-sm font-medium text-emerald-500">+12%</span>
                       <span className="text-sm text-muted-foreground">vs last period</span>
                     </div>
                   </div>
                   <div className="flex items-center justify-center w-12 h-12 bg-emerald-50 rounded-full">
                     <CheckCircle className="w-6 h-6 text-emerald-600" />
                   </div>
                 </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm border border-border/50">
              <CardContent className="p-6">
                 <div className="flex items-start justify-between">
                   <div>
                     <p className="text-sm font-medium text-muted-foreground mb-1">Match Success Rate</p>
                     <p className="text-3xl font-bold text-foreground mb-2">98.5%</p>
                     <div className="flex items-center gap-1">
                       <TrendingUp className="w-4 h-4 text-emerald-500" />
                       <span className="text-sm font-medium text-emerald-500">+2.1%</span>
                       <span className="text-sm text-muted-foreground">vs last period</span>
                     </div>
                   </div>
                   <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full">
                     <Trophy className="w-6 h-6 text-blue-600" />
                   </div>
                 </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm border border-border/50">
              <CardContent className="p-6">
                 <div className="flex items-start justify-between">
                   <div>
                     <p className="text-sm font-medium text-muted-foreground mb-1">Pending Verification</p>
                     <p className="text-3xl font-bold text-foreground mb-2">156</p>
                     <div className="flex items-center gap-1">
                       <TrendingDown className="w-4 h-4 text-red-500" />
                       <span className="text-sm font-medium text-red-500">-23%</span>
                       <span className="text-sm text-muted-foreground">vs last period</span>
                     </div>
                   </div>
                   <div className="flex items-center justify-center w-12 h-12 bg-orange-50 rounded-full">
                     <Clock className="w-6 h-6 text-orange-600" />
                   </div>
                 </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm border border-border/50">
              <CardContent className="p-6">
                 <div className="flex items-start justify-between">
                   <div>
                     <p className="text-sm font-medium text-muted-foreground mb-1">Unmatched Documents</p>
                     <p className="text-3xl font-bold text-foreground mb-2">89</p>
                     <div className="flex items-center gap-1">
                       <TrendingDown className="w-4 h-4 text-red-500" />
                       <span className="text-sm font-medium text-red-500">-18%</span>
                       <span className="text-sm text-muted-foreground">vs last period</span>
                     </div>
                   </div>
                   <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full">
                     <XCircle className="w-6 h-6 text-red-600" />
                   </div>
                 </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Document Cycle Time */}
            <Card className="rounded-xl shadow-sm border border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Document Cycle Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden border border-border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold" style={{
                        backgroundColor: '#ECF0F7',
                        borderBottomColor: '#D6DEE9'
                      }}>
                          Document Type
                        </TableHead>
                        <TableHead className="font-semibold text-center" style={{
                        backgroundColor: '#ECF0F7',
                        borderBottomColor: '#D6DEE9'
                      }}>
                          Avg Cycle Time
                        </TableHead>
                        <TableHead className="font-semibold text-center" style={{
                        backgroundColor: '#ECF0F7',
                        borderBottomColor: '#D6DEE9'
                      }}>
                          Success Rate
                        </TableHead>
                        <TableHead className="font-semibold text-center" style={{
                        backgroundColor: '#ECF0F7',
                        borderBottomColor: '#D6DEE9'
                      }}>
                          Confidence
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="bg-white">
                        <TableCell className="font-medium">PO-Invoice Match</TableCell>
                        <TableCell className="text-center">0.8s</TableCell>
                        <TableCell className="text-center">98.7%</TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">High</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-white">
                        <TableCell className="font-medium">GRN-Invoice Match</TableCell>
                        <TableCell className="text-center">1.2s</TableCell>
                        <TableCell className="text-center">96.3%</TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">High</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-white">
                        <TableCell className="font-medium">Three-way Match (PO-Invoice-GRN)</TableCell>
                        <TableCell className="text-center">2.3s</TableCell>
                        <TableCell className="text-center">94.1%</TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Value of Matched Documents */}
            <Card className="rounded-xl shadow-sm border border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Value of Matched Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Successfully Matched */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-foreground">$4.2M</p>
                      <p className="text-sm text-muted-foreground">Successfully Matched</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-foreground">$156K</p>
                      <p className="text-sm text-muted-foreground">Pending Match</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-bold text-foreground">$89K</p>
                        <p className="text-sm text-muted-foreground">Variance Detected</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-foreground">$23K</p>
                        <p className="text-sm text-muted-foreground">Failed Match</p>
                      </div>
                    </div>
                  </div>

                  {/* Match Quality Indicators */}
                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Field Completeness</span>
                      <span className="text-sm font-medium">97.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Data Validation</span>
                      <span className="text-sm font-medium">94.8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Error Rate</span>
                      <span className="text-sm font-medium text-red-600">1.3%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system-reports" className="space-y-6">
          {/* System Configuration Overview Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">System Configuration Overview</h2>
              <p className="text-sm text-muted-foreground">Complete system account information and system setup summary</p>
            </div>
            <Button onClick={() => setShowExportPanel(true)} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
          </div>

          {/* Enabled Modules */}
          <Card className="rounded-xl shadow-sm border border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">
                Enabled Modules
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4 overflow-x-auto">
              <div className="flex items-start justify-between p-4 border border-border rounded-lg">
                <div className="flex items-start gap-3">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Storage + Simple Workflow</h4>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mb-2">Always Enabled</Badge>
                    <p className="text-sm text-muted-foreground">Core platform functionality that provides document storage with basic workflow automation capabilities</p>
                  </div>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-full flex-shrink-0">
                  <HardDrive className="w-6 h-6 text-gray-600" />
                </div>
              </div>

              <div className="flex items-start justify-between p-4 border border-border rounded-lg">
                <div className="flex items-start gap-3">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Advanced Workflow</h4>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 mb-2">Enabled</Badge>
                    <p className="text-sm text-muted-foreground">Advanced workflow automation with visual builder and intelligent rule processing for complex document operations</p>
                  </div>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full flex-shrink-0">
                  <Workflow className="w-6 h-6 text-blue-600" />
                </div>
              </div>

              <div className="flex items-start justify-between p-4 border border-border rounded-lg">
                <div className="flex items-start gap-3">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">PO Requests</h4>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 mb-2">Enabled</Badge>
                    <p className="text-sm text-muted-foreground">Purchase order request management module for handling procurement workflows and approvals</p>
                  </div>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-full flex-shrink-0">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
              </div>

              <div className="flex items-start justify-between p-4 border border-border rounded-lg">
                <div className="flex items-start gap-3">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Data Match</h4>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 mb-2">Enabled</Badge>
                    <p className="text-sm text-muted-foreground">Three-way document matching for PO-Invoice-GRN processing with automated verification workflows</p>
                  </div>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-purple-50 rounded-full flex-shrink-0">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* User Management */}
            <Card className="rounded-xl shadow-sm border border-border/50 h-[280px]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">
                  User Management
                </CardTitle>
              </CardHeader>
               <CardContent className="flex gap-3 min-h-[180px]">
                  {/* Left 40% - Users Pie Chart */}
                 <div className="hidden lg:flex flex-col items-center justify-center relative w-2/5 flex-shrink-0">
                  <ResponsiveContainer width="100%" height={100}>
                     <PieChart>
                       <Pie data={[{
                       name: 'Total Users',
                       value: 34,
                       color: '#3b82f6'
                     }, {
                       name: 'Active Users',
                       value: 5,
                       color: '#22c55e'
                     }]} cx="50%" cy="50%" innerRadius={40} outerRadius={48} paddingAngle={2} dataKey="value" strokeWidth={1}>
                         {[{
                         name: 'Total Users',
                         value: 34,
                         color: '#3b82f6'
                       }, {
                         name: 'Active Users',
                         value: 5,
                         color: '#22c55e'
                       }].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                       </Pie>
                       <ChartTooltip />
                     </PieChart>
                  </ResponsiveContainer>
                  {/* User icon in center */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>

                {/* Right 60% - All User Data */}
                <div className="grid grid-cols-1 gap-0 divide-y divide-border flex-1">
                   <div className="flex items-center justify-between py-3">
                     <div className="flex items-center gap-2">
                       <Users className="w-4 h-4 text-blue-600" />
                       <span className="text-sm text-muted-foreground">Total Users</span>
                     </div>
                     <span className="font-bold text-lg">34</span>
                   </div>
                   <div className="flex items-center justify-between py-3">
                     <div className="flex items-center gap-2">
                       <UserCheck className="w-4 h-4 text-green-600" />
                       <span className="text-sm text-muted-foreground">Active Users</span>
                     </div>
                     <span className="font-bold text-lg">5</span>
                   </div>
                   <div className="flex items-center justify-between py-3">
                     <div className="flex items-center gap-2">
                       <UsersRound className="w-4 h-4 text-purple-600" />
                       <span className="text-sm text-muted-foreground">User Groups</span>
                     </div>
                     <span className="font-bold text-lg">20</span>
                   </div>
                   <div className="flex items-center justify-between py-3">
                     <div className="flex items-center gap-2">
                       <Activity className="w-4 h-4 text-orange-600" />
                       <span className="text-sm text-muted-foreground">Active Sessions</span>
                     </div>
                     <span className="font-bold text-lg">12</span>
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Storage Configuration */}
            <Card className="rounded-xl shadow-sm border border-border/50 h-[280px]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  Storage Configuration
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Storage: 847.2 GB (84.7% used)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
               <CardContent className="flex gap-3 min-h-[180px]">
                  {/* Left 40% - Storage Usage Pie Chart */}
                 <div className="hidden lg:flex flex-col items-center justify-center relative w-2/5 flex-shrink-0">
                  <ResponsiveContainer width="100%" height={100}>
                     <PieChart>
                       <Pie data={[{
                       name: 'Total Folders',
                       value: 100,
                       color: '#3b82f6'
                     }, {
                       name: 'Data Match Folders',
                       value: 12,
                       color: '#a855f7'
                     }, {
                       name: 'Watch Folders',
                       value: 5,
                       color: '#22c55e'
                     }]} cx="50%" cy="50%" innerRadius={40} outerRadius={48} paddingAngle={2} dataKey="value" strokeWidth={1}>
                         {[{
                         name: 'Total Folders',
                         value: 100,
                         color: '#3b82f6'
                       }, {
                         name: 'Data Match Folders',
                         value: 12,
                         color: '#a855f7'
                       }, {
                         name: 'Watch Folders',
                         value: 5,
                         color: '#22c55e'
                       }].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                       </Pie>
                       <ChartTooltip />
                     </PieChart>
                  </ResponsiveContainer>
                  {/* Storage icon in center */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <HardDrive className="w-6 h-6 text-blue-600" />
                  </div>
                </div>

                {/* Right 60% - All Storage Data */}
                <div className="grid grid-cols-1 gap-0 divide-y divide-border flex-1">
                   <div className="flex items-center justify-between py-3">
                     <div className="flex items-center gap-2">
                       <Folder className="w-4 h-4 text-blue-600" />
                       <span className="text-sm text-muted-foreground">Total Folders</span>
                     </div>
                     <span className="font-bold text-lg">100</span>
                   </div>
                   <div className="flex items-center justify-between py-3">
                     <div className="flex items-center gap-2">
                       <Database className="w-4 h-4 text-purple-600" />
                       <span className="text-sm text-muted-foreground">Data Match Folders</span>
                     </div>
                     <span className="font-bold text-lg">12</span>
                   </div>
                   <div className="flex items-center justify-between py-3">
                     <div className="flex items-center gap-2">
                       <Eye className="w-4 h-4 text-green-600" />
                       <span className="text-sm text-muted-foreground">Watch Folders</span>
                     </div>
                     <span className="font-bold text-lg">5</span>
                   </div>
                   <div className="flex items-center justify-between py-3">
                     <div className="flex items-center gap-2">
                       <FileText className="w-4 h-4 text-orange-600" />
                       <span className="text-sm text-muted-foreground">Total Documents</span>
                     </div>
                     <span className="font-bold text-lg">156,429</span>
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Workflow Configuration */}
            <Card className="rounded-xl shadow-sm border border-border/50 h-[280px]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  Workflow Configuration
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Inactive: 2 workflows</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
               <CardContent className="flex gap-3 min-h-[180px]">
                  {/* Left 40% - Workflow Status Pie Chart */}
                 <div className="hidden lg:flex flex-col items-center justify-center relative w-2/5 flex-shrink-0">
                   <ResponsiveContainer width="80%" height={100}>
                     <BarChart data={[{
                       name: 'Total Workflows',
                       value: 47
                     }, {
                       name: 'Active Workflow', 
                       value: 45
                     }]}>
                       <XAxis dataKey="name" hide />
                       <YAxis type="number" hide />
                       <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                         <Cell fill="#3b82f6" />
                         <Cell fill="#10b981" />
                         <LabelList dataKey="value" position="top" style={{ fontSize: '12px', fontWeight: 'bold', fill: '#374151' }} />
                       </Bar>
                       <ChartTooltip />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>

                {/* Right 60% - All Workflow Data */}
                <div className="grid grid-cols-1 gap-0 divide-y divide-border flex-1">
                   <div className="flex items-center justify-between py-3">
                     <div className="flex items-center gap-2">
                       <Hash className="w-4 h-4 text-blue-600" />
                       <span className="text-sm text-muted-foreground">Total Workflows</span>
                     </div>
                     <span className="font-bold text-lg">47</span>
                   </div>
                   <div className="flex items-center justify-between py-3">
                     <div className="flex items-center gap-2">
                       <Workflow className="w-4 h-4 text-green-600" />
                       <span className="text-sm text-muted-foreground">Active Workflow</span>
                     </div>
                     <span className="font-bold text-lg">45</span>
                   </div>
                   <div className="flex items-center justify-between py-3">
                     <div className="flex items-center gap-2">
                       <FileText className="w-4 h-4 text-purple-600" />
                       <span className="text-sm text-muted-foreground">Templates Used</span>
                     </div>
                     <span className="font-bold text-lg">8</span>
                   </div>
                   <div className="flex items-center justify-between py-3">
                     <div className="flex items-center gap-2">
                       <BarChart3 className="w-4 h-4 text-orange-600" />
                       <span className="text-sm text-muted-foreground">Utilization</span>
                     </div>
                     <span className="font-bold text-lg">96%</span>
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* System Objects */}
            <Card className="rounded-xl shadow-sm border border-border/50 h-[280px]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">
                  System Objects
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 min-h-[180px]">
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg flex-shrink-0">
                    <Hash className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg">156</span>
                    <span className="text-sm text-muted-foreground">Index Fields</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center justify-center w-8 h-8 bg-green-50 rounded-lg flex-shrink-0">
                    <Tag className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg">45</span>
                    <span className="text-sm text-muted-foreground">Tags</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center justify-center w-8 h-8 bg-purple-50 rounded-lg flex-shrink-0">
                    <Check className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg">28</span>
                    <span className="text-sm text-muted-foreground">Tasks</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center justify-center w-8 h-8 bg-orange-50 rounded-lg flex-shrink-0">
                    <FileText className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg">12</span>
                    <span className="text-sm text-muted-foreground">Index Forms</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Workflow Templates Configuration */}
            <div className="lg:col-span-2">
              <Card className="rounded-xl shadow-sm border border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                      Workflow Templates Configuration
                    </CardTitle>
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input type="search" placeholder="Search templates..." className="pl-9" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden border border-border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-semibold" style={{
                          backgroundColor: '#ECF0F7',
                          borderBottomColor: '#D6DEE9'
                        }}>
                            Template Name
                          </TableHead>
                          <TableHead className="font-semibold text-center" style={{
                          backgroundColor: '#ECF0F7',
                          borderBottomColor: '#D6DEE9'
                        }}>
                            Executions
                          </TableHead>
                          <TableHead className="font-semibold text-center" style={{
                          backgroundColor: '#ECF0F7',
                          borderBottomColor: '#D6DEE9'
                        }}>
                            Status
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[{
                        name: 'Invoice Approval',
                        executions: '3,456 executions',
                        status: 'Active'
                      }, {
                        name: 'Document Classification',
                        executions: '2,891 executions',
                        status: 'Active'
                      }, {
                        name: 'Data Extraction',
                        executions: '2,567 executions',
                        status: 'Active'
                      }, {
                        name: 'Archive Processing',
                        executions: '1,876 executions',
                        status: 'Active'
                      }, {
                        name: 'Purchase Order Processing',
                        executions: '1,543 executions',
                        status: 'Active'
                      }, {
                        name: 'Contract Review',
                        executions: '1,234 executions',
                        status: 'Active'
                      }, {
                        name: 'Expense Report Processing',
                        executions: '1,098 executions',
                        status: 'Active'
                      }, {
                        name: 'HR Document Processing',
                        executions: '987 executions',
                        status: 'Active'
                      }, {
                        name: 'Compliance Check',
                        executions: '876 executions',
                        status: 'Active'
                      }, {
                        name: 'Quality Assurance Review',
                        executions: '765 executions',
                        status: 'Active'
                      }].map((template, index) => <TableRow key={index} className="bg-white">
                            <TableCell className="font-medium">{template.name}</TableCell>
                            <TableCell className="text-center text-sm text-muted-foreground">{template.executions}</TableCell>
                            <TableCell className="text-center">
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                {template.status}
                              </Badge>
                            </TableCell>
                          </TableRow>)}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Information Panel */}
            <div>
              <Card className="rounded-xl shadow-sm border border-border/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">
                    System Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-blue-600 mb-3">Instance Details</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Instance ID:</p>
                        <p className="text-sm font-medium text-foreground">SYS-ABC-2024-001</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Deployment Date:</p>
                        <p className="text-sm font-medium text-foreground">March 15, 2024</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Data Retention:</p>
                        <p className="text-sm font-medium text-foreground">7 years</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-blue-600 mb-3">System Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Last System Update:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">January 18, 2025</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Last Backup:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">24 hours ago</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Version:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">v2.4.1</span>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Export Panel */}
        {showExportPanel && <div className="fixed top-16 right-0 bottom-0 left-0 bg-black/50 flex items-center justify-end z-50">
            <div className="bg-white w-96 h-full shadow-xl overflow-y-auto">
              <div className="p-6 border-b border-border relative">
                <Button variant="ghost" size="sm" onClick={() => setShowExportPanel(false)} className="absolute top-4 right-4 z-10">
                  <X className="w-4 h-4" />
                </Button>
                <div className="pr-12">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">Export System Configuration Report</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Generate comprehensive reports containing all tenant configuration information for compliance, audit, or stakeholder review purposes.</p>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-4">Export Options</h4>
                  <div className="space-y-4">
                    <div className="p-4 border border-border rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-foreground mb-1">PDF Report</h5>
                          <p className="text-sm text-muted-foreground mb-3">Complete formatted report with executive summary and detailed configuration data</p>
                          <Button size="sm">Download PDF</Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-border rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <BarChart3 className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-foreground mb-1">Excel Data</h5>
                          <p className="text-sm text-muted-foreground mb-3">Raw configuration data in spreadsheet format for analysis and reporting</p>
                          <Button size="sm">Download Excel</Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-border rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Database className="w-5 h-5 text-cyan-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-foreground mb-1">CSV Export</h5>
                          <p className="text-sm text-muted-foreground mb-3">Configuration data in CSV format for integration with external systems</p>
                          <Button size="sm">Download CSV</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">System Configuration Overview</h4>
                      <p className="text-sm text-muted-foreground">These reports provide a complete inventory of your system configuration including modules, users, workflows, document types, and integration status. Perfect for compliance documentation, stakeholder presentations, or system audit purposes.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>}

        <TabsContent value="audit-logs" className="space-y-6">
          <RecentActivity />
        </TabsContent>
      </Tabs>
      
      <GenerateDataMatchReportModal isOpen={isDataMatchModalOpen} onClose={() => setIsDataMatchModalOpen(false)} />
      
      <GenerateProductivityEngineReportModal isOpen={isProductivityModalOpen} onClose={() => setIsProductivityModalOpen(false)} />
      
      <Dialog open={isPOReportModalOpen} onOpenChange={setIsPOReportModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate PO Requests Report</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* Vendor Selection */}
            <div className="grid gap-2">
              <Label htmlFor="vendor">Vendor Selection</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendors" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border">
                  <SelectItem value="all">All Vendors</SelectItem>
                  <SelectItem value="vendor1">ABC Supplies Inc.</SelectItem>
                  <SelectItem value="vendor2">Global Materials Ltd.</SelectItem>
                  <SelectItem value="vendor3">Tech Solutions Corp.</SelectItem>
                  <SelectItem value="vendor4">Office Equipment Co.</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Department Selection */}
            <div className="grid gap-2">
              <Label htmlFor="department">Department Selection</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select departments" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border">
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="it">Information Technology</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* User Selection */}
            <div className="grid gap-2">
              <Label htmlFor="user">User Selection</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select users" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border">
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="sarah">Sarah Johnson</SelectItem>
                  <SelectItem value="michael">Michael Chen</SelectItem>
                  <SelectItem value="lisa">Lisa Rodriguez</SelectItem>
                  <SelectItem value="emma">Emma Thompson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* PO Value Threshold */}
            <div className="grid gap-2">
              <Label htmlFor="minValue">PO Value Threshold</Label>
              <Input
                id="minValue"
                type="number"
                placeholder="Minimum amount"
                value={poReportData.minValue}
                onChange={(e) => setPOReportData(prev => ({ ...prev, minValue: e.target.value }))}
              />
            </div>

            {/* Status Filter */}
            <div className="grid gap-2">
              <Label>Status Filter</Label>
              <div className="flex flex-row gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="approved"
                    checked={poReportData.status.approved}
                    onCheckedChange={(checked) => 
                      setPOReportData(prev => ({ 
                        ...prev, 
                        status: { ...prev.status, approved: checked === true }
                      }))
                    }
                  />
                  <Label htmlFor="approved">Approved</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pending"
                    checked={poReportData.status.pending}
                    onCheckedChange={(checked) => 
                      setPOReportData(prev => ({ 
                        ...prev, 
                        status: { ...prev.status, pending: checked === true }
                      }))
                    }
                  />
                  <Label htmlFor="pending">Pending</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rejected"
                    checked={poReportData.status.rejected}
                    onCheckedChange={(checked) => 
                      setPOReportData(prev => ({ 
                        ...prev, 
                        status: { ...prev.status, rejected: checked === true }
                      }))
                    }
                  />
                  <Label htmlFor="rejected">Rejected</Label>
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !poReportData.fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {poReportData.fromDate ? format(poReportData.fromDate, "dd-MM-yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border border-border" align="start">
                    <Calendar
                      mode="single"
                      selected={poReportData.fromDate}
                      onSelect={(date) => setPOReportData(prev => ({ ...prev, fromDate: date }))}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label>To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !poReportData.toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {poReportData.toDate ? format(poReportData.toDate, "dd-MM-yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border border-border" align="start">
                    <Calendar
                      mode="single"
                      selected={poReportData.toDate}
                      onSelect={(date) => setPOReportData(prev => ({ ...prev, toDate: date }))}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Export Format */}
            <div className="grid gap-2">
              <Label htmlFor="exportFormat">Export Format</Label>
              <Select defaultValue="PDF">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border">
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="Excel">Excel</SelectItem>
                  <SelectItem value="CSV">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPOReportModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Handle report generation logic here
              console.log('Generating PO Report with data:', poReportData);
              setIsPOReportModalOpen(false);
            }}>
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};
export default ReportsAnalytics;