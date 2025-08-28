import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus, ChevronDown, ChevronLeft, ChevronRight, Eye, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WorkspaceTask {
  id: string;
  priority: 'High' | 'Normal' | 'Low';
  workflow: string;
  type: string;
  createdDate: string;
  primaryId: string;
  assignedTo: string;
  status: 'Pending' | 'Completed';
  stepName: string;
  dueDate: string;
}

const Workspace = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my-tasks');
  const [activeFilter, setActiveFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Mock data for tasks - expanded to 100+ records
  const tasksData: WorkspaceTask[] = [
    {
      id: '1',
      priority: 'Normal',
      workflow: 'Loan Approval',
      type: 'Workflow',
      createdDate: '08/14/2025',
      primaryId: 'LA-001',
      assignedTo: 'Me',
      status: 'Pending',
      stepName: 'Approve',
      dueDate: '08/20/2025'
    },
    {
      id: '2',
      priority: 'High',
      workflow: 'Loan Approval',
      type: 'Workflow',
      createdDate: '08/12/2025',
      primaryId: 'LA-002',
      assignedTo: 'Me',
      status: 'Pending',
      stepName: 'Approve',
      dueDate: '08/18/2025'
    },
    {
      id: '3',
      priority: 'Normal',
      workflow: 'New Patient Records',
      type: 'Workflow',
      createdDate: '08/12/2025',
      primaryId: 'NPR-001',
      assignedTo: 'John Smith',
      status: 'Completed',
      stepName: '',
      dueDate: ''
    },
    {
      id: '4',
      priority: 'Low',
      workflow: 'New Patient Records',
      type: 'Workflow',
      createdDate: '08/10/2025',
      primaryId: 'NPR-002',
      assignedTo: 'Me',
      status: 'Pending',
      stepName: 'Approve',
      dueDate: '08/25/2025'
    },
    {
      id: '5',
      priority: 'Normal',
      workflow: 'New Patient Records',
      type: 'Workflow',
      createdDate: '08/12/2025',
      primaryId: 'NPR-003',
      assignedTo: 'Sarah Johnson',
      status: 'Completed',
      stepName: '',
      dueDate: ''
    },
    // Adding 95 more records to reach 100+
    ...Array.from({ length: 95 }, (_, index) => ({
      id: (index + 6).toString(),
      priority: ['High', 'Normal', 'Low'][index % 3] as 'High' | 'Normal' | 'Low',
      workflow: ['Loan Approval', 'New Patient Records', 'Insurance Claims', 'Vendor Onboarding', 'Employee Verification'][index % 5],
      type: 'Workflow',
      createdDate: new Date(2025, 7, Math.floor(Math.random() * 30) + 1).toLocaleDateString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric' 
      }),
      primaryId: `WF-${(index + 6).toString().padStart(3, '0')}`,
      assignedTo: ['Me', 'John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Brown'][index % 5],
      status: ['Pending', 'Completed'][index % 2] as 'Pending' | 'Completed',
      stepName: index % 2 === 0 ? 'Approve' : '',
      dueDate: index % 2 === 0 ? new Date(2025, 7, Math.floor(Math.random() * 15) + 15).toLocaleDateString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric' 
      }) : ''
    }))
  ];

  // Filter tasks based on active filter
  const filteredTasks = tasksData.filter(task => {
    if (activeFilter === 'pending') return task.status === 'Pending';
    if (activeFilter === 'completed') return task.status === 'Completed';
    return true; // all-tasks
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + itemsPerPage);

  // Tab counts
  const allTasksCount = tasksData.length;
  const pendingCount = tasksData.filter(t => t.status === 'Pending').length;
  const completedCount = tasksData.filter(t => t.status === 'Completed').length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(paginatedTasks.map(task => task.id));
    } else {
      setSelectedTasks([]);
    }
  };

  const handleSelectTask = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks([...selectedTasks, taskId]);
    } else {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    }
  };

  const handlePriorityChange = (taskId: string, newPriority: string) => {
    // In a real app, this would update the task in the database
    console.log(`Task ${taskId} priority changed to ${newPriority}`);
  };

  const handleViewTask = (taskId: string) => {
    navigate(`/workspace/task/${taskId}`);
  };

  const handleRowClick = (taskId: string, event: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = event.target as HTMLElement;
    if (target.closest('input[type="checkbox"]') || target.closest('button') || target.closest('[role="combobox"]')) {
      return;
    }
    handleViewTask(taskId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Pending</Badge>;
      case 'Completed':
        return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: 'High' | 'Normal' | 'Low', showArrow = false) => {
    const getColorClasses = (priority: string) => {
      switch (priority) {
        case 'High':
          return "bg-red-100 text-red-700 border-red-200 hover:bg-red-100";
        case 'Normal':
          return "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100";
        case 'Low':
          return "bg-green-100 text-green-700 border-green-200 hover:bg-green-100";
        default:
          return "border-border bg-background hover:bg-muted";
      }
    };

    return (
      <Badge className={`${getColorClasses(priority)} px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 w-auto`}>
        {priority}
        {showArrow && <ChevronDown className="h-3 w-3" />}
      </Badge>
    );
  };

  const PrioritySelect = ({ task }: { task: WorkspaceTask }) => {
    const isEditable = task.status === 'Pending';
    
    if (!isEditable) {
      return getPriorityBadge(task.priority);
    }

    return (
      <Select value={task.priority} onValueChange={(value) => handlePriorityChange(task.id, value)}>
        <SelectTrigger className="w-auto h-auto border-none bg-transparent shadow-none p-0 hover:bg-muted/50 rounded focus:ring-0 focus:ring-offset-0 justify-start [&>svg]:hidden">
          {getPriorityBadge(task.priority, true)}
        </SelectTrigger>
        <SelectContent className="z-50 bg-white border border-border shadow-lg">
          <SelectItem value="High">
            {getPriorityBadge('High')}
          </SelectItem>
          <SelectItem value="Normal">
            {getPriorityBadge('Normal')}
          </SelectItem>
          <SelectItem value="Low">
            {getPriorityBadge('Low')}
          </SelectItem>
        </SelectContent>
      </Select>
    );
  };

  const renderMyTasksContent = () => (
    <div className="space-y-3">
      {/* Filter tabs for My Tasks - matching MatchingQueue style */}
      <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-full w-fit">
        {[
          { key: 'pending', label: 'Pending', count: pendingCount },
          { key: 'completed', label: 'Completed', count: completedCount }
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
            <div className={`rounded-full px-2 py-0.5 text-xs font-bold ${
              activeFilter === tab.key ? 'bg-slate-600 text-white' : 'bg-white text-gray-700'
            }`}>
              {tab.count}
            </div>
          </button>
        ))}
      </div>

      {/* Tasks Table */}
      <Card className="overflow-hidden">
        <div 
          className="overflow-y-auto"
          style={{ 
            maxHeight: `calc(100vh - 320px)`,
            height: filteredTasks.length > 15 ? `calc(100vh - 320px)` : 'auto'
          }}
        >
          <Table className="min-w-full [&_th]:border-r-0 [&_td]:border-r-0" style={{ tableLayout: 'fixed' }}>
            <TableHeader className="sticky top-0 z-10">
              <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                <TableHead className="w-12 font-semibold text-sm h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>
                  <Checkbox
                    checked={selectedTasks.length === paginatedTasks.length && paginatedTasks.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="font-semibold w-[120px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Priority</TableHead>
                <TableHead className="font-semibold w-[160px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Workflow</TableHead>
                <TableHead className="font-semibold w-[100px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Type</TableHead>
                <TableHead className="font-semibold w-[120px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Created Date</TableHead>
                <TableHead className="font-semibold w-[120px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Primary ID</TableHead>
                <TableHead className="font-semibold w-[120px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Assigned To</TableHead>
                <TableHead className="font-semibold w-[100px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Status</TableHead>
                <TableHead className="font-semibold w-[120px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Step Name</TableHead>
                <TableHead className="font-semibold w-[120px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Due Date</TableHead>
                <TableHead className="font-semibold w-[100px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTasks.map((task) => (
                <TableRow 
                  key={task.id} 
                  className={`cursor-pointer hover:bg-muted/30 ${selectedTasks.includes(task.id) ? 'bg-muted/50' : ''}`}
                  onClick={(e) => handleRowClick(task.id, e)}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedTasks.includes(task.id)}
                      onCheckedChange={(checked) => handleSelectTask(task.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <PrioritySelect task={task} />
                  </TableCell>
                  <TableCell className="font-medium">{task.workflow}</TableCell>
                  <TableCell>{task.type}</TableCell>
                  <TableCell>{task.createdDate}</TableCell>
                  <TableCell>{task.primaryId}</TableCell>
                  <TableCell>{task.assignedTo}</TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell>{task.stepName}</TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewTask(task.id);
                        }}
                        className="h-8 w-8 p-0 hover:bg-muted"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                            className="h-8 w-8 p-0 hover:bg-muted"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewTask(task.id)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Assign</DropdownMenuItem>
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
      {filteredTasks.length > 0 && (
        <div className="flex justify-end items-center mt-4 px-1">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} of {filteredTasks.length}
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

                    // Show pages in range
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

  return (
    <div className="min-h-screen p-6 space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-semibold text-foreground font-inter">
            Workspace
          </h1>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="border-b border-border flex items-center justify-between px-0 -mt-2">
        <div className="flex items-center flex-1 -mb-px pb-1">
          {[
            { key: 'my-tasks', label: 'My Tasks' },
            { key: 'my-requests', label: 'My Requests' },
            { key: 'recent-documents', label: 'Recent Documents' }
          ].map((tab, index) => (
            <button
              key={tab.key}
              className={`
                px-4 py-2.5 flex items-center gap-2 justify-center transition-all duration-200 relative
                ${index > 0 ? '-ml-px' : ''}
                ${activeTab === tab.key
                  ? `bg-white text-gray-900 font-semibold z-10 border-b-2 border-b-[#27313e] shadow-md border-transparent rounded-t-md`
                  : "text-muted-foreground font-medium hover:bg-gray-50 hover:text-gray-700"}
              `}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="text-center text-sm leading-5 flex items-center justify-center font-semibold">
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Search and Action Button */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              type="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-80"
            />
          </div>
          
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Start Workflow
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'my-tasks' && renderMyTasksContent()}

        {activeTab === 'my-requests' && (
          <div className="space-y-6">
            {/* Filter tabs for My Requests - matching Document Matching style */}
            <Tabs defaultValue="drafts">
              <TabsList className="bg-muted">
                <TabsTrigger value="drafts" className="data-[state=active]:bg-background">
                  Drafts
                  <Badge variant="secondary" className="ml-2">0</Badge>
                </TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:bg-background">
                  Pending
                  <Badge variant="secondary" className="ml-2">0</Badge>
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-background">
                  Completed
                  <Badge variant="secondary" className="ml-2">0</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="text-center py-12">
              <p className="text-muted-foreground">No requests found</p>
            </div>
          </div>
        )}

        {activeTab === 'recent-documents' && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Recent documents view</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workspace;