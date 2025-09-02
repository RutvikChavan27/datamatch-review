import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ZoomIn, ZoomOut, RotateCw, FileText, Info, Link, GitBranch, Edit, Save, X, Download, Share, Move, Trash2, Settings, CheckCircle, AlertCircle, AlertTriangle, Sparkles, User, Clock, Calendar, MapPin, Eye, EyeOff, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MousePointer, Hand, MessageSquare, Maximize, Printer, Play, DollarSign, CheckSquare, Archive, List, Circle, Folder, FolderOpen, Search, TrendingUp, File, Home, Check, MoreVertical, MoreHorizontal, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { toast } from 'sonner';
import { Document, ExtractedField } from '@/types/storage';
import { format } from 'date-fns';
import WorkspaceDocumentDetailView from './WorkspaceDocumentDetailView';

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

const PORequestTaskDocumentView = () => {
  const { reference } = useParams<{ reference: string }>();
  const navigate = useNavigate();

  // Get PO request by reference
  // This would normally come from an API call, but using mock data for now
  const getPORequestByReference = (ref: string) => {
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
        department: 'IT Department',
        vendor: 'SecureTech Solutions',
        totalAmount: 8500.00,
        priority: 'Normal',
        status: 'Approved',
        createdDate: '08/26/2025',
        itemCount: 3
      },
      {
        id: 'por3',
        reference: 'PO-2024-019',
        requestTitle: 'Office Furniture Package',
        requestor: 'Sarah Johnson',
        department: 'Human Resources',
        vendor: 'Office Depot',
        totalAmount: 3250.75,
        priority: 'Low',
        status: 'In Review',
        createdDate: '08/25/2025',
        itemCount: 12
      },
      {
        id: 'por4',
        reference: 'PO-2024-020',
        requestTitle: 'Network Infrastructure Upgrade',
        requestor: 'Lisa Brown',
        department: 'IT Department',
        vendor: 'NetworkPro Inc',
        totalAmount: 22500.00,
        priority: 'High',
        status: 'In Review',
        createdDate: '08/24/2025',
        itemCount: 8
      },
      {
        id: 'por5',
        reference: 'PO-2024-021',
        requestTitle: 'Marketing Campaign Materials',
        requestor: 'David Wilson',
        department: 'Marketing',
        vendor: 'Creative Solutions',
        totalAmount: 1850.50,
        priority: 'Normal',
        status: 'Rejected',
        createdDate: '08/23/2025',
        itemCount: 6
      },
      // Generate additional PO requests
      ...Array.from({ length: 45 }, (_, index) => ({
        id: `por${index + 6}`,
        reference: `PO-2024-${(index + 22).toString().padStart(3, '0')}`,
        requestTitle: [
          'Office Supplies Order',
          'Software License Renewal', 
          'Equipment Maintenance',
          'Training Materials',
          'Facility Upgrades'
        ][index % 5],
        requestor: ['John Smith', 'Mike Davis', 'Sarah Johnson', 'Lisa Brown', 'David Wilson'][index % 5],
        department: ['IT Department', 'Human Resources', 'Marketing', 'Operations', 'Finance'][index % 5],
        vendor: ['Tech Solutions Inc', 'Office Depot', 'SecureTech Solutions', 'NetworkPro Inc', 'Creative Solutions'][index % 5],
        totalAmount: Math.round((Math.random() * 20000 + 500) * 100) / 100,
        priority: ['High', 'Normal', 'Low'][index % 3] as 'High' | 'Normal' | 'Low',
        status: ['In Review', 'Approved', 'Rejected'][index % 3] as 'In Review' | 'Approved' | 'Rejected',
        createdDate: new Date(2025, 7, Math.floor(Math.random() * 30) + 1).toLocaleDateString('en-US', { 
          month: '2-digit', 
          day: '2-digit', 
          year: 'numeric' 
        }),
        itemCount: Math.floor(Math.random() * 15) + 1
      }))
    ];
    
    return poRequests.find(request => request.reference === ref);
  };

  const currentRequest = getPORequestByReference(reference || '');

  // Mock document based on PO request - in real app, this would come from API
  const mockDocument: Document = {
    id: `po-request-doc-${reference}`,
    name: `${currentRequest?.requestTitle || 'PO Request'}_${reference}.pdf`,
    type: 'pdf',
    size: '2.1 MB',
    url: '/lovable-uploads/40a647b5-00f5-4bd4-825e-8b58cca2e7c2.png',
    folderId: 'po-requests',
    tags: ['po-request', 'procurement'],
    created: new Date('2024-01-25'),
    modified: new Date('2024-01-25'),
    createdBy: currentRequest?.requestor || 'System',
    isProcessed: true,
    workflowStatus: 'pending',
    version: 1,
    originalName: `${currentRequest?.requestTitle || 'PO Request'}_${reference}.pdf`
  };

  const handleClose = () => {
    navigate('/workspace');
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden flex flex-col" style={{
      height: 'calc(100vh - 0px)'
    }}>
      {/* Custom Breadcrumb for PO Requests */}
      <div className="mb-3 pt-3 px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" onClick={(e) => {
                e.preventDefault();
                handleClose();
              }} className="font-medium">
                Workspace
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Task Reference {currentRequest?.reference} (PO Requests)</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Use WorkspaceDocumentDetailView but hide its breadcrumb */}
      <div className="[&>div:first-child>div:first-child]:hidden flex-1">
        <WorkspaceDocumentDetailView 
          document={mockDocument}
          taskId={reference}
          primaryId={currentRequest?.reference}
          priority={currentRequest?.priority}
          assignedTo={currentRequest?.requestor}
          status={currentRequest?.status}
          onClose={handleClose}
          showActionsButton={true}
        />
      </div>
    </div>
  );
};

export default PORequestTaskDocumentView;