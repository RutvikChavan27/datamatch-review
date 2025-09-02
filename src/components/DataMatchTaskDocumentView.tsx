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

const DataMatchTaskDocumentView = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();

  // Get data match record by setId
  // This would normally come from an API call, but using mock data for now
  const getDataMatchBySetId = (id: string) => {
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
        confidence: 65,
        lastUpdated: '08/26/2025 16:45',
        assignedTo: 'Sarah Johnson'
      },
      {
        id: 'dm3',
        vendor: 'Tech Solutions Inc',
        poNumber: 'PO-2025-003',
        setId: 'DS-00125',
        amount: 2100.50,
        status: 'Auto Approved',
        statusType: 'auto-approved',
        confidence: 99,
        lastUpdated: '08/27/2025 09:15',
        assignedTo: 'Mike Davis'
      },
      {
        id: 'dm4',
        vendor: 'Office Depot',
        poNumber: 'PO-2025-004',
        setId: 'DS-00126',
        amount: 450.25,
        status: 'Incomplete Documents',
        statusType: 'incomplete',
        confidence: 75,
        lastUpdated: '08/25/2025 11:20',
        assignedTo: 'Lisa Brown'
      },
      {
        id: 'dm5',
        vendor: 'Global Manufacturing',
        poNumber: 'PO-2025-005',
        setId: 'DS-00127',
        amount: 3200.00,
        status: 'Approved',
        statusType: 'approved',
        confidence: 96,
        lastUpdated: '08/27/2025 13:45',
        assignedTo: 'John Smith'
      },
      // Generate additional records
      ...Array.from({ length: 45 }, (_, index) => ({
        id: `dm${index + 6}`,
        vendor: ['ABC Corp', 'XYZ Supplies', 'Tech Solutions Inc', 'Office Depot', 'Global Manufacturing'][index % 5],
        poNumber: `PO-2025-${(index + 6).toString().padStart(3, '0')}`,
        setId: `DS-${(index + 128).toString().padStart(5, '0')}`,
        amount: Math.round((Math.random() * 5000 + 100) * 100) / 100,
        status: ['Ready for Verification', 'Processing Failed', 'Auto Approved', 'Incomplete Documents', 'Approved'][index % 5],
        statusType: ['ready-for-review', 'failed', 'auto-approved', 'incomplete', 'approved'][index % 5] as any,
        confidence: Math.floor(Math.random() * 35 + 65),
        lastUpdated: new Date(2025, 7, Math.floor(Math.random() * 30) + 1, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60)).toLocaleDateString('en-US', { 
          month: '2-digit', 
          day: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        assignedTo: ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Brown'][index % 4]
      }))
    ];
    
    return dataMatchRecords.find(record => record.setId === id);
  };

  const currentRecord = getDataMatchBySetId(setId || '');

  // Mock document based on data match record - in real app, this would come from API
  const mockDocument: Document = {
    id: `data-match-doc-${setId}`,
    name: `${currentRecord?.vendor || 'Document'}_DataMatch_${setId}.pdf`,
    type: 'pdf',
    size: '1.8 MB',
    url: '/lovable-uploads/40a647b5-00f5-4bd4-825e-8b58cca2e7c2.png',
    folderId: 'data-match',
    tags: ['data-match', 'verification'],
    created: new Date('2024-01-25'),
    modified: new Date('2024-01-25'),
    createdBy: currentRecord?.assignedTo || 'System',
    isProcessed: true,
    workflowStatus: 'pending',
    version: 1,
    originalName: `${currentRecord?.vendor || 'Document'}_DataMatch_${setId}.pdf`
  };

  const handleClose = () => {
    navigate('/workspace');
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden flex flex-col" style={{
      height: 'calc(100vh - 0px)'
    }}>
      {/* Custom Breadcrumb for Data Match */}
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
              <BreadcrumbPage>Task Set ID {currentRecord?.setId} (Data Match)</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Use WorkspaceDocumentDetailView but hide its breadcrumb */}
      <div className="[&>div:first-child>div:first-child]:hidden flex-1">
        <WorkspaceDocumentDetailView 
          document={mockDocument}
          taskId={setId}
          primaryId={currentRecord?.setId}
          priority={currentRecord?.confidence && currentRecord.confidence > 90 ? 'Normal' : 'High'}
          assignedTo={currentRecord?.assignedTo}
          status={currentRecord?.status}
          onClose={handleClose}
          showActionsButton={true}
        />
      </div>
    </div>
  );
};

export default DataMatchTaskDocumentView;