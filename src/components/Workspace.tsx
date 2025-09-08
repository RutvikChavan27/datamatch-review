import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus, ChevronDown, ChevronLeft, ChevronRight, Eye, MoreHorizontal, Play, Lock, Unlock, FolderOpen, Mail, Download, Trash2, Printer, Image, Scan, BarChart3, ExternalLink, Edit } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DataMatchTab from './DataMatchTab';
import PORequestsTab from './PORequestsTab';

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

interface RecentDocument {
  id: string;
  documentName: string;
  createdDate: string;
  modifiedDate: string;
  dateAccessed: string;
}

interface DraftRequest {
  id: string;
  draftName: string;
  workflowName: string;
  formName: string;
  createdDate: string;
  modifiedDate: string;
}

interface PendingRequest {
  id: string;
  priority: 'High' | 'Normal' | 'Low';
  workflow: string;
  type: string;
  createdDate: string;
  primaryId: string;
  assignedTo: string;
  status: string;
  stepName: string;
  dueDate: string;
}

interface CompletedRequest {
  id: string;
  priority: 'High' | 'Normal' | 'Low';
  workflow: string;
  type: string;
  createdDate: string;
  primaryId: string;
  assignedTo: string;
  status: string;
  dueDate: string;
}

const Workspace = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my-tasks');
  const [activeFilter, setActiveFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [myRequestsDropdownOpen, setMyRequestsDropdownOpen] = useState(false);
  const [selectedRequestsFilter, setSelectedRequestsFilter] = useState('drafts');
  const [bulkActionsOpen, setBulkActionsOpen] = useState(false);

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

  // Mock data for recent documents
  const recentDocumentsData: RecentDocument[] = [
    {
      id: 'doc1',
      documentName: 'Patient Record_2_2_1799_9276_17561879699751113590.pdf',
      createdDate: '08/27/2025 10:34:24',
      modifiedDate: '08/27/2025 10:34:24',
      dateAccessed: '08/27/2025 10:35:15'
    },
    {
      id: 'doc2',
      documentName: 'Veritas_1_2_474_1041_17563051375562164028.pdf',
      createdDate: '08/27/2025 02:50:10',
      modifiedDate: '08/27/2025 02:50:10',
      dateAccessed: '08/27/2025 02:50:24'
    },
    {
      id: 'doc3',
      documentName: 'Veritas_1_2_471_877_17562772872114175114.pdf',
      createdDate: '08/27/2025 02:44:20',
      modifiedDate: '08/27/2025 02:44:20',
      dateAccessed: '08/27/2025 02:44:54'
    },
    {
      id: 'doc4',
      documentName: 'Patient Record_2_2_470_876_17562768693903399695.pdf',
      createdDate: '08/26/2025 02:02:00',
      modifiedDate: '08/26/2025 02:02:01',
      dateAccessed: '08/26/2025 02:02:49'
    },
    {
      id: 'doc5',
      documentName: 'Veritas_1_2_1788_9215_17561725332048112896.pdf',
      createdDate: '08/25/2025 09:43:26',
      modifiedDate: '08/25/2025 09:43:27',
      dateAccessed: '08/25/2025 09:45:54'
    },
    {
      id: 'doc6',
      documentName: 'Patient Record_2_2_1788_9216_17561725334293676757.pdf',
      createdDate: '08/25/2025 09:44:24',
      modifiedDate: '08/25/2025 09:44:24',
      dateAccessed: '08/25/2025 09:44:41'
    },
    {
      id: 'doc7',
      documentName: 'Veritas_1_2_1775_9201_17561399121901115071.pdf',
      createdDate: '08/24/2025 14:22:10',
      modifiedDate: '08/24/2025 14:22:10',
      dateAccessed: '08/24/2025 14:25:33'
    },
    {
      id: 'doc8',
      documentName: 'Patient Records_2_2_429_796_17550127147545741067.pdf',
      createdDate: '08/24/2025 11:15:45',
      modifiedDate: '08/24/2025 11:15:45',
      dateAccessed: '08/24/2025 11:18:12'
    },
    {
      id: 'doc9',
      documentName: 'Veritas_1_2_1413_3782_17548459233558924285.pdf',
      createdDate: '08/23/2025 16:30:22',
      modifiedDate: '08/23/2025 16:30:22',
      dateAccessed: '08/23/2025 16:35:18'
    },
    {
      id: 'doc10',
      documentName: 'Loan_5_3_247_918_17551674539860733331.pdf',
      createdDate: '08/23/2025 09:12:55',
      modifiedDate: '08/23/2025 09:12:55',
      dateAccessed: '08/23/2025 09:20:41'
    },
    {
      id: 'doc11',
      documentName: 'Veritas_33_1744031523.pdf',
      createdDate: '08/22/2025 15:30:12',
      modifiedDate: '08/22/2025 15:30:12',
      dateAccessed: '08/22/2025 15:32:28'
    },
    {
      id: 'doc12',
      documentName: 'Loan_123_451_28.pdf',
      createdDate: '08/22/2025 11:45:33',
      modifiedDate: '08/22/2025 11:45:33',
      dateAccessed: '08/22/2025 11:48:15'
    },
    {
      id: 'doc13',
      documentName: 'Loan_5_2_429_796_17550127157798693391.pdf',
      createdDate: '08/21/2025 16:22:44',
      modifiedDate: '08/21/2025 16:22:44',
      dateAccessed: '08/21/2025 16:25:11'
    },
    {
      id: 'doc14',
      documentName: 'Veritas_1_2_1723_8941_17560562442639995744.pdf',
      createdDate: '08/21/2025 13:18:55',
      modifiedDate: '08/21/2025 13:18:55',
      dateAccessed: '08/21/2025 13:22:33'
    },
    {
      id: 'doc15',
      documentName: 'Veritas_45_1744076814.pdf',
      createdDate: '08/20/2025 09:55:17',
      modifiedDate: '08/20/2025 09:55:17',
      dateAccessed: '08/20/2025 09:58:42'
    },
    {
      id: 'doc16',
      documentName: 'Veritas_1_2_1490_3896_17551693745979224055.pdf',
      createdDate: '08/20/2025 08:33:28',
      modifiedDate: '08/20/2025 08:33:28',
      dateAccessed: '08/20/2025 08:36:14'
    },
    {
      id: 'doc17',
      documentName: 'Veritas1_1_2_1599_4558_17557830475551619951.pdf',
      createdDate: '08/19/2025 14:12:39',
      modifiedDate: '08/19/2025 14:12:39',
      dateAccessed: '08/19/2025 14:15:55'
    }
  ];

  // Mock data for Draft Requests
  const draftRequestsData: DraftRequest[] = [];

  // Mock data for Pending Requests
  const pendingRequestsData: PendingRequest[] = [
    {
      id: 'pr1',
      priority: 'Normal',
      workflow: 'Invoice Approval',
      type: 'Workflow',
      createdDate: '07/15/2025',
      primaryId: 'IA-001',
      assignedTo: 'admin',
      status: 'Pending',
      stepName: 'Approve',
      dueDate: ''
    },
    {
      id: 'pr2',
      priority: 'Normal',
      workflow: 'New Patient Records',
      type: 'Workflow',
      createdDate: '04/07/2025',
      primaryId: 'NPR-001',
      assignedTo: 'admin',
      status: 'Pending',
      stepName: 'Approve',
      dueDate: ''
    }
  ];

  // Mock data for Completed Requests
  const completedRequestsData: CompletedRequest[] = [];

  // Filter data based on active filter
  let filteredData;
  if (activeFilter === 'my-requests') {
    if (selectedRequestsFilter === 'drafts') {
      filteredData = draftRequestsData;
    } else if (selectedRequestsFilter === 'pending') {
      filteredData = pendingRequestsData;
    } else if (selectedRequestsFilter === 'completed') {
      filteredData = completedRequestsData;
    } else {
      filteredData = [];
    }
  } else if (activeFilter === 'recent-documents') {
    filteredData = recentDocumentsData;
  } else {
    filteredData = tasksData.filter(task => {
      if (activeFilter === 'pending') return task.status === 'Pending';
      if (activeFilter === 'completed') return task.status === 'Completed';
      return true; // all-tasks
    });
  }

  // Pagination calculations
  const isDocumentsView = activeFilter === 'recent-documents';
  const isMyRequestsView = activeFilter === 'my-requests';
  const dataToShow = filteredData;
  const totalPages = Math.ceil(dataToShow.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  
  let paginatedTasks = [];
  let paginatedDocuments = [];
  let paginatedDraftRequests = [];
  let paginatedPendingRequests = [];
  let paginatedCompletedRequests = [];

  if (isDocumentsView) {
    paginatedDocuments = (dataToShow as RecentDocument[]).slice(startIndex, startIndex + itemsPerPage);
  } else if (isMyRequestsView) {
    if (selectedRequestsFilter === 'drafts') {
      paginatedDraftRequests = (dataToShow as DraftRequest[]).slice(startIndex, startIndex + itemsPerPage);
    } else if (selectedRequestsFilter === 'pending') {
      paginatedPendingRequests = (dataToShow as PendingRequest[]).slice(startIndex, startIndex + itemsPerPage);
    } else if (selectedRequestsFilter === 'completed') {
      paginatedCompletedRequests = (dataToShow as CompletedRequest[]).slice(startIndex, startIndex + itemsPerPage);
    }
  } else {
    paginatedTasks = (dataToShow as WorkspaceTask[]).slice(startIndex, startIndex + itemsPerPage);
  }

  // Tab counts
  const allTasksCount = tasksData.length;
  const pendingCount = tasksData.filter(t => t.status === 'Pending').length;
  const completedCount = tasksData.filter(t => t.status === 'Completed').length;

  const handleSelectAll = (checked: boolean) => {
    if (activeFilter === 'recent-documents') {
      if (checked) {
        setSelectedDocuments(paginatedDocuments.map(doc => doc.id));
      } else {
        setSelectedDocuments([]);
      }
    } else if (activeFilter === 'my-requests') {
      // For my-requests, we don't have selection state for each type yet
      // This could be expanded in the future if needed
    } else {
      if (checked) {
        setSelectedTasks(paginatedTasks.map(task => task.id));
      } else {
        setSelectedTasks([]);
      }
    }
  };

  const handleSelectTask = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks([...selectedTasks, taskId]);
    } else {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    }
  };

  const handleSelectDocument = (docId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments([...selectedDocuments, docId]);
    } else {
      setSelectedDocuments(selectedDocuments.filter(id => id !== docId));
    }
  };

  const handlePriorityChange = (taskId: string, newPriority: string) => {
    // In a real app, this would update the task in the database
    console.log(`Task ${taskId} priority changed to ${newPriority}`);
  };

  const handleViewTask = (taskId: string) => {
    navigate(`/workspace/task/${taskId}`);
  };

  const handleViewDocument = (document: RecentDocument) => {
    navigate(`/workspace/document/${document.id}`);
  };

  const handleDocumentRowClick = (document: RecentDocument, event: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = event.target as HTMLElement;
    if (target.closest('input[type="checkbox"]') || target.closest('button') || target.closest('[role="combobox"]')) {
      return;
    }
    navigate(`/workspace/document/${document.id}`);
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
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-full w-fit">
          {[
            { key: 'pending', label: 'Pending Tasks', count: pendingCount },
            { key: 'completed', label: 'Completed Tasks', count: completedCount },
            { key: 'recent-documents', label: 'Recent Documents', count: 45 },
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
            </button>
          ))}
          
          {/* My Requests with dropdown */}
          <DropdownMenu open={myRequestsDropdownOpen} onOpenChange={setMyRequestsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className={`
                  px-4 py-2 flex items-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 border border-b-2
                  ${activeFilter === 'my-requests'
                    ? "text-gray-900 shadow-lg shadow-black/10 border-[#95A3C2]"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-200 border-transparent"}
                `}
                style={activeFilter === 'my-requests' ? {
                  backgroundColor: '#d8f1ff',
                  borderRadius: '19.5px'
                } : {}}
              >
                <span>
                  {activeFilter === 'my-requests' 
                    ? selectedRequestsFilter === 'drafts' 
                      ? 'Drafts Requests'
                      : selectedRequestsFilter === 'pending'
                      ? 'Pending Requests' 
                      : 'Completed Requests'
                    : 'My Requests'}
                </span>
                <ChevronDown className="h-3 w-3 ml-1" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-50 bg-white border border-border shadow-lg rounded-lg w-48">
              <DropdownMenuItem 
                onClick={() => {
                  setActiveFilter('my-requests');
                  setSelectedRequestsFilter('drafts');
                  setMyRequestsDropdownOpen(false);
                }}
                className="hover:bg-gray-100 cursor-pointer"
              >
                Drafts Requests
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  setActiveFilter('my-requests');
                  setSelectedRequestsFilter('pending');
                  setMyRequestsDropdownOpen(false);
                }}
                className="hover:bg-gray-100 cursor-pointer"
              >
                Pending Requests
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  setActiveFilter('my-requests');
                  setSelectedRequestsFilter('completed');
                  setMyRequestsDropdownOpen(false);
                }}
                className="hover:bg-gray-100 cursor-pointer"
              >
                Completed Requests
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bulk Actions for Documents - moved to same level as filter tabs */}
        {activeFilter === 'recent-documents' && selectedDocuments.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">
              {selectedDocuments.length} Selected
            </span>
            <DropdownMenu open={bulkActionsOpen} onOpenChange={setBulkActionsOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  Actions
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-50 bg-white border border-border shadow-lg rounded-lg w-56 p-2">
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Play className="h-4 w-4" />
                  Start Workflow
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Lock className="h-4 w-4" />
                  Apply Legal Hold
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Unlock className="h-4 w-4" />
                  Remove Legal Hold
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <FolderOpen className="h-4 w-4" />
                  Move Documents
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Mail className="h-4 w-4" />
                  Email
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Download className="h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Trash2 className="h-4 w-4" />
                  Delete / Recycle
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Printer className="h-4 w-4" />
                  Print Documents
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Image className="h-4 w-4" />
                  Thumbnail Manager
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Scan className="h-4 w-4" />
                  OCR
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <BarChart3 className="h-4 w-4" />
                  Barcode Recognition
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <ExternalLink className="h-4 w-4" />
                  Open in New Browser Tab
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Bulk Actions for Pending Tasks */}
        {activeFilter === 'pending' && selectedTasks.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">
              {selectedTasks.length} Selected
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
                  <Play className="h-4 w-4" />
                  Start Workflow
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Lock className="h-4 w-4" />
                  Apply Legal Hold
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Unlock className="h-4 w-4" />
                  Remove Legal Hold
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <FolderOpen className="h-4 w-4" />
                  Move Documents
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Mail className="h-4 w-4" />
                  Email
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Download className="h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Trash2 className="h-4 w-4" />
                  Delete / Recycle
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Printer className="h-4 w-4" />
                  Print Documents
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Image className="h-4 w-4" />
                  Thumbnail Manager
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Scan className="h-4 w-4" />
                  OCR
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <BarChart3 className="h-4 w-4" />
                  Barcode Recognition
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <ExternalLink className="h-4 w-4" />
                  Open in New Browser Tab
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Bulk Actions for Completed Tasks */}
        {activeFilter === 'completed' && selectedTasks.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">
              {selectedTasks.length} Selected
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
                  <Mail className="h-4 w-4" />
                  Email
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Printer className="h-4 w-4" />
                  Print
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Image className="h-4 w-4" />
                  Thumbnail Manager
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Download className="h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <Edit className="h-4 w-4" />
                  Update Fields
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer flex items-center gap-3 px-3 py-2.5">
                  <ExternalLink className="h-4 w-4" />
                  Open in New Browser Tab
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Tasks/Documents Table */}
      <Card className="overflow-hidden">
        <div 
          className="overflow-y-auto"
          style={{ 
            maxHeight: `calc(100vh - 320px)`,
            height: dataToShow.length > 15 ? `calc(100vh - 320px)` : 'auto'
          }}
        >
          <Table className="min-w-full [&_th]:border-r-0 [&_td]:border-r-0" style={{ tableLayout: 'fixed' }}>
            <TableHeader className="sticky top-0 z-10">
              <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                <TableHead className="w-12 font-semibold text-sm h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>
                  <Checkbox
                    checked={isDocumentsView 
                      ? selectedDocuments.length === paginatedDocuments.length && paginatedDocuments.length > 0
                      : selectedTasks.length === paginatedTasks.length && paginatedTasks.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {activeFilter === 'recent-documents' ? (
                  <>
                    <TableHead className="font-semibold w-[300px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Document Name</TableHead>
                    <TableHead className="font-semibold w-[180px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Created Date</TableHead>
                    <TableHead className="font-semibold w-[180px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Modified Date</TableHead>
                    <TableHead className="font-semibold w-[180px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Date Accessed</TableHead>
                    <TableHead className="font-semibold w-[100px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Actions</TableHead>
                  </>
                ) : activeFilter === 'my-requests' && selectedRequestsFilter === 'drafts' ? (
                  <>
                    <TableHead className="font-semibold w-[200px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Draft Name</TableHead>
                    <TableHead className="font-semibold w-[200px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Workflow Name</TableHead>
                    <TableHead className="font-semibold w-[200px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Form Name</TableHead>
                    <TableHead className="font-semibold w-[150px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Created Date</TableHead>
                    <TableHead className="font-semibold w-[150px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Modified Date</TableHead>
                  </>
                ) : activeFilter === 'my-requests' && (selectedRequestsFilter === 'pending' || selectedRequestsFilter === 'completed') ? (
                  <>
                    <TableHead className="font-semibold w-[120px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Priority</TableHead>
                    <TableHead className="font-semibold w-[160px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Workflow</TableHead>
                    <TableHead className="font-semibold w-[100px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Type</TableHead>
                    <TableHead className="font-semibold w-[120px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Created Date</TableHead>
                    <TableHead className="font-semibold w-[120px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Primary ID</TableHead>
                    <TableHead className="font-semibold w-[120px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Assigned To</TableHead>
                    <TableHead className="font-semibold w-[100px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Status</TableHead>
                    {selectedRequestsFilter === 'pending' && (
                      <>
                        <TableHead className="font-semibold w-[120px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Step Name</TableHead>
                        <TableHead className="font-semibold w-[120px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Due Date</TableHead>
                      </>
                    )}
                    {selectedRequestsFilter === 'completed' && (
                      <TableHead className="font-semibold w-[120px] text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Due Date</TableHead>
                    )}
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeFilter === 'recent-documents' ? (
                paginatedDocuments.map((document) => (
                  <TableRow 
                    key={document.id} 
                    className={`h-10 cursor-pointer hover:bg-muted/30 ${selectedDocuments.includes(document.id) ? 'bg-muted/50' : ''}`}
                    onClick={(e) => handleDocumentRowClick(document, e)}
                  >
                    <TableCell className="py-2">
                      <Checkbox
                        checked={selectedDocuments.includes(document.id)}
                        onCheckedChange={(checked) => handleSelectDocument(document.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium py-2">{document.documentName}</TableCell>
                    <TableCell className="py-2">{document.createdDate}</TableCell>
                    <TableCell className="py-2">{document.modifiedDate}</TableCell>
                    <TableCell className="py-2">{document.dateAccessed}</TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDocument(document);
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
                            <DropdownMenuItem onClick={() => handleViewDocument(document)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Download</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : activeFilter === 'my-requests' && selectedRequestsFilter === 'drafts' ? (
                paginatedDraftRequests.length > 0 ? (
                  paginatedDraftRequests.map((draft) => (
                    <TableRow key={draft.id} className="h-10 cursor-pointer hover:bg-muted/30">
                      <TableCell className="py-2">
                        <Checkbox />
                      </TableCell>
                      <TableCell className="font-medium py-2">{draft.draftName}</TableCell>
                      <TableCell className="py-2">{draft.workflowName}</TableCell>
                      <TableCell className="py-2">{draft.formName}</TableCell>
                      <TableCell className="py-2">{draft.createdDate}</TableCell>
                      <TableCell className="py-2">{draft.modifiedDate}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No records found
                    </TableCell>
                  </TableRow>
                )
              ) : activeFilter === 'my-requests' && selectedRequestsFilter === 'pending' ? (
                paginatedPendingRequests.length > 0 ? (
                  paginatedPendingRequests.map((request) => (
                    <TableRow key={request.id} className="h-10 cursor-pointer hover:bg-muted/30">
                      <TableCell className="py-2">
                        <Checkbox />
                      </TableCell>
                      <TableCell className="py-2">
                        {getPriorityBadge(request.priority)}
                      </TableCell>
                      <TableCell className="font-medium py-2">{request.workflow}</TableCell>
                      <TableCell className="py-2">{request.type}</TableCell>
                      <TableCell className="py-2">{request.createdDate}</TableCell>
                      <TableCell className="py-2">{request.primaryId}</TableCell>
                      <TableCell className="py-2">{request.assignedTo}</TableCell>
                      <TableCell className="py-2">{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="py-2">{request.stepName}</TableCell>
                      <TableCell className="py-2">{request.dueDate}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">
                      No records found
                    </TableCell>
                  </TableRow>
                )
              ) : activeFilter === 'my-requests' && selectedRequestsFilter === 'completed' ? (
                paginatedCompletedRequests.length > 0 ? (
                  paginatedCompletedRequests.map((request) => (
                    <TableRow key={request.id} className="h-10 cursor-pointer hover:bg-muted/30">
                      <TableCell className="py-2">
                        <Checkbox />
                      </TableCell>
                      <TableCell className="py-2">
                        {getPriorityBadge(request.priority)}
                      </TableCell>
                      <TableCell className="font-medium py-2">{request.workflow}</TableCell>
                      <TableCell className="py-2">{request.type}</TableCell>
                      <TableCell className="py-2">{request.createdDate}</TableCell>
                      <TableCell className="py-2">{request.primaryId}</TableCell>
                      <TableCell className="py-2">{request.assignedTo}</TableCell>
                      <TableCell className="py-2">{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="py-2">{request.dueDate}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                      No records found
                    </TableCell>
                  </TableRow>
                )
              ) : (
                paginatedTasks.map((task) => (
                  <TableRow 
                    key={task.id} 
                    className={`h-10 cursor-pointer hover:bg-muted/30 ${selectedTasks.includes(task.id) ? 'bg-muted/50' : ''}`}
                    onClick={(e) => handleRowClick(task.id, e)}
                  >
                    <TableCell className="py-2">
                      <Checkbox
                        checked={selectedTasks.includes(task.id)}
                        onCheckedChange={(checked) => handleSelectTask(task.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="py-2">
                      <PrioritySelect task={task} />
                    </TableCell>
                    <TableCell className="font-medium py-2">{task.workflow}</TableCell>
                    <TableCell className="py-2">{task.type}</TableCell>
                    <TableCell className="py-2">{task.createdDate}</TableCell>
                    <TableCell className="py-2">{task.primaryId}</TableCell>
                    <TableCell className="py-2">{task.assignedTo}</TableCell>
                    <TableCell className="py-2">{getStatusBadge(task.status)}</TableCell>
                    <TableCell className="py-2">{task.stepName}</TableCell>
                    <TableCell className="py-2">{task.dueDate}</TableCell>
                    <TableCell className="py-2">
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      {dataToShow.length > 0 && (
        <div className="flex justify-end items-center mt-4 px-1">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} of {dataToShow.length}
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
            { key: 'my-tasks', label: 'Workflows' },
            { key: 'my-requests', label: 'Data Match' },
            { key: 'recent-documents', label: 'PO Requests' }
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

        {activeTab === 'my-requests' && <DataMatchTab />}

        {activeTab === 'recent-documents' && <PORequestsTab />}
      </div>
    </div>
  );
};

export default Workspace;