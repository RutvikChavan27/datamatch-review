import React, { useState, useCallback } from 'react';
import { ArrowLeft, ZoomIn, ZoomOut, RotateCw, FileText, Info, Link, GitBranch, Edit, Save, X, Download, Share, Move, Trash2, Settings, CheckCircle, AlertCircle, AlertTriangle, Sparkles, User, Clock, Calendar, MapPin, Eye, EyeOff, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MousePointer, Hand, MessageSquare, Maximize, Printer, Play, DollarSign, CheckSquare, Archive, List, Circle, Folder, FolderOpen, Search, TrendingUp, File, Home, Check, MoreVertical, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

interface WorkspaceDocumentDetailViewProps {
  document: Document;
  taskId?: string;
  primaryId?: string;
  priority?: string;
  assignedTo?: string;
  status?: string;
  onClose: () => void;
}

// Purchase Order mock data based on reference image
const mockExtractedFields: ExtractedField[] = [
  {
    id: 'po-number',
    label: 'PO Number',
    value: 'PO-2024-001234',
    confidence: 98,
    isEditable: true,
    isRequired: true,
    type: 'text'
  },
  {
    id: 'date',
    label: 'Date',
    value: 'January 25, 2024',
    confidence: 95,
    isEditable: true,
    isRequired: true,
    type: 'date'
  },
  {
    id: 'due-date',
    label: 'Due Date',
    value: 'February 15, 2024',
    confidence: 92,
    isEditable: true,
    isRequired: false,
    type: 'date'
  },
  {
    id: 'vendor-name',
    label: 'Vendor Name',
    value: 'Global Supplies Inc.',
    confidence: 96,
    isEditable: true,
    isRequired: true,
    type: 'text'
  },
  {
    id: 'vendor-address',
    label: 'Vendor Address',
    value: '456 Vendor Avenue, Chicago, IL 606',
    confidence: 89,
    isEditable: true,
    isRequired: false,
    type: 'text'
  },
  {
    id: 'total-amount',
    label: 'Total Amount',
    value: '$6,509.84',
    confidence: 97,
    isEditable: true,
    isRequired: true,
    type: 'currency'
  },
  {
    id: 'subtotal',
    label: 'Subtotal',
    value: '$5,999.85',
    confidence: 94,
    isEditable: true,
    isRequired: false,
    type: 'currency'
  },
  {
    id: 'tax',
    label: 'Tax',
    value: '$509.99',
    confidence: 91,
    isEditable: true,
    isRequired: false,
    type: 'currency'
  },
  {
    id: 'terms',
    label: 'Terms',
    value: 'Net 30 days',
    confidence: 88,
    isEditable: true,
    isRequired: false,
    type: 'text'
  }
];

const mockRelatedDocuments = [
  { id: 'rel-1', name: 'Invoice_INV-5678.pdf', type: 'pdf', modified: new Date('2024-01-18'), similarity: null },
  { id: 'rel-2', name: 'Receipt_REC-9012.pdf', type: 'pdf', modified: new Date('2024-01-20'), similarity: null }
];

const mockSimilarDocuments = [
  { id: 'sim-1', name: 'Purchase_Order_12346.pdf', type: 'pdf', modified: new Date('2024-01-16'), similarity: 94 },
  { id: 'sim-2', name: 'Purchase_Order_12344.pdf', type: 'pdf', modified: new Date('2024-01-14'), similarity: 89 },
  { id: 'sim-3', name: 'PO_Template_Standard.pdf', type: 'pdf', modified: new Date('2024-01-10'), similarity: 76 }
];

const mockWorkflows = [
  {
    id: 'invoice-processing',
    name: 'Invoice Processing',
    description: 'Standard invoice approval workflow',
    estimatedTime: '2-3 business days',
    assignees: 'Finance Team',
    automation: 'Partial Automation',
    icon: DollarSign
  },
  {
    id: 'document-approval',
    name: 'Document Approval',
    description: 'Multi-level approval process',
    estimatedTime: '1-2 business days',
    assignees: 'Manager, Director',
    automation: 'Manual Review',
    icon: CheckSquare
  },
  {
    id: 'archive-document',
    name: 'Archive Document',
    description: 'Move to long-term storage',
    estimatedTime: 'Immediate',
    assignees: 'System',
    automation: 'Fully Automated',
    icon: Archive
  }
];

const mockWorkflowSteps = [
  { id: 'review', name: 'Document Review', status: 'completed', icon: CheckCircle },
  { id: 'approval', name: 'Manager Approval', status: 'current', icon: Clock },
  { id: 'processing', name: 'Final Processing', status: 'pending', icon: Circle }
];

const mockVersionHistory = [
  { version: '1.2', date: '2024-01-16', user: 'Sarah Johnson', action: 'Updated' },
  { version: '1.1', date: '2024-01-15', user: 'Mike Wilson', action: 'Reviewed' },
  { version: '1.0', date: '2024-01-15', user: 'John Smith', action: 'Created' }
];

const getConfidenceBadge = (confidence: number) => {
  if (confidence >= 90) return (
    <Badge className="bg-green-50 text-green-700 border-green-200">
      <CheckCircle className="w-3 h-3 mr-1" />
      {confidence}%
    </Badge>
  );
  if (confidence >= 70) return (
    <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
      <AlertCircle className="w-3 h-3 mr-1" />
      {confidence}%
    </Badge>
  );
  return (
    <Badge className="bg-red-50 text-red-700 border-red-200">
      <AlertTriangle className="w-3 h-3 mr-1" />
      {confidence}%
    </Badge>
  );
};

const WorkspaceDocumentDetailView: React.FC<WorkspaceDocumentDetailViewProps> = ({ document, taskId, primaryId, priority, assignedTo, status, onClose }) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(3);
  
  const [extractedFields, setExtractedFields] = useState<ExtractedField[]>(mockExtractedFields);
  
  const [selectedForm, setSelectedForm] = useState('purchase-order');
  const [activeTool, setActiveTool] = useState<'select' | 'pan'>('select');
  const [selectedWorkflow, setSelectedWorkflow] = useState('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  const handleZoomChange = (value: string) => {
    if (value === 'fit-width') {
      setZoom(100); // Mock fit to width
      toast.success('Fit to width');
    } else if (value === 'fit-page') {
      setZoom(85); // Mock fit to page
      toast.success('Fit to page');
    } else {
      setZoom(parseInt(value));
    }
  };

  const handleSaveChanges = () => {
    toast.success('Changes saved successfully');
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setExtractedFields(prev => 
      prev.map(field => 
        field.id === fieldId ? { ...field, value } : field
      )
    );
  };

  const handleWorkflowStart = () => {
    if (selectedWorkflow) {
      const workflow = mockWorkflows.find(w => w.id === selectedWorkflow);
      toast.success(`Started ${workflow?.name} workflow`);
    } else {
      toast.error('Please select a workflow first');
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 0px)' }}>
      {/* Breadcrumb Navigation */}
      <div className="mb-3 pt-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                }}
                className="font-medium"
              >
                Workspace
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Task Primary ID {primaryId || taskId}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Modern Document Header */}
      <div className="flex-shrink-0 mb-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg">
          <div className="p-4">

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <h1 className="text-lg font-semibold">Purchase_Order_PO-2024-001234.pdf</h1>
                    <p className="text-sm text-muted-foreground">
                      Priority: {priority || 'Normal'} • Assigned to: {assignedTo || 'Unassigned'} • Status: {status || 'Pending'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Conditional CTA buttons for Pending status */}
              {status === 'Pending' && (
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="secondary"
                    onClick={() => toast.success('More options clicked')}
                  >
                    <MoreHorizontal className="w-3 h-3" stroke="none" fill="currentColor" />
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => toast.success('Add Comment clicked')}
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Add Comment
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => toast.success('Rejected')}
                  >
                    <X className="w-3 h-3 mr-1" />
                    Reject
                  </Button>
                  <Button 
                    variant="default"
                    onClick={() => toast.success('Task completed')}
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel - Document Viewer */}
          <ResizablePanel defaultSize={75} minSize={50}>
            <div className="h-full flex flex-col bg-white rounded-lg shadow-sm m-2">
              {/* Toolbar */}
              <div className="flex-shrink-0 p-3 rounded-t-lg" style={{ backgroundColor: '#1a2332' }}>
                <div className="flex items-center justify-between">
                  {/* Left side - Group A (Navigation) + Group B (Zoom) */}
                  <div className="flex items-center space-x-4">
                    {/* Group A - Page Navigation */}
                    <div className="flex items-center space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              disabled={currentPage === 1}
                              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                            >
                              <ChevronLeft className="w-4 h-4 stroke-white" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Previous page</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className="flex items-center space-x-1">
                        <Input 
                          value={currentPage}
                          readOnly
                          className="w-12 h-8 text-center bg-white/10 border-white/20 text-white cursor-default"
                        />
                        <span className="text-sm text-white/70">of {totalPages}</span>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              disabled={currentPage === totalPages}
                              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                            >
                              <ChevronRight className="w-4 h-4 stroke-white" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Next page</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <Separator orientation="vertical" className="h-6 bg-white/20" />

                    {/* Group B - Zoom Controls */}
                    <div className="flex items-center space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setZoom(Math.max(zoom - 25, 25))}
                              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                            >
                              <ZoomOut className="w-4 h-4 stroke-white" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Zoom out</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Select value={zoom.toString()} onValueChange={handleZoomChange}>
                        <SelectTrigger className="w-24 h-8 bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="50">50%</SelectItem>
                          <SelectItem value="75">75%</SelectItem>
                          <SelectItem value="100">100%</SelectItem>
                          <SelectItem value="125">125%</SelectItem>
                          <SelectItem value="150">150%</SelectItem>
                          <SelectItem value="200">200%</SelectItem>
                          <SelectItem value="fit-width">Fit Width</SelectItem>
                          <SelectItem value="fit-page">Fit Page</SelectItem>
                        </SelectContent>
                      </Select>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setZoom(Math.min(zoom + 25, 200))}
                              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                            >
                              <ZoomIn className="w-4 h-4 stroke-white" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Zoom in</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                            >
                              <Maximize className="w-4 h-4 stroke-white" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Fullscreen</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  {/* Right side - Document Actions + Viewer Tools */}
                  <div className="flex items-center space-x-4">
                    {/* Document Actions */}
                    <div className="flex items-center space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setRotation((rotation + 90) % 360)}
                              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                            >
                              <RotateCw className="w-4 h-4 stroke-white" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Rotate</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                            >
                              <Download className="w-4 h-4 stroke-white" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                            >
                              <Printer className="w-4 h-4 stroke-white" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Print</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <Separator orientation="vertical" className="h-6 bg-white/20" />

                    {/* Viewer Tools */}
                    <div className="flex items-center space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant={activeTool === 'select' ? 'default' : 'outline'} 
                              size="sm"
                              onClick={() => setActiveTool('select')}
                              className={activeTool === 'select' 
                                ? "bg-white/20 border-white/20 text-white hover:bg-white/30" 
                                : "border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                              }
                            >
                              <MousePointer className="w-4 h-4 stroke-white" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Select tool</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant={activeTool === 'pan' ? 'default' : 'outline'} 
                              size="sm"
                              onClick={() => setActiveTool('pan')}
                              className={activeTool === 'pan' 
                                ? "bg-white/20 border-white/20 text-white hover:bg-white/30" 
                                : "border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                              }
                            >
                              <Hand className="w-4 h-4 stroke-white" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Pan tool</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                            >
                              <MessageSquare className="w-4 h-4 stroke-white" />
                              <Badge className="ml-1 px-1 text-xs bg-white/20 text-white border-white/20">3</Badge>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Comments (3)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Canvas */}
              <div className="flex-1 p-4 overflow-auto rounded-b-lg" style={{ backgroundColor: '#212C4C' }}>
                <div className="max-w-4xl mx-auto">
                  <div 
                    className="bg-white shadow-lg border border-gray-200 mx-auto"
                    style={{ 
                      transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                      transformOrigin: 'center',
                      width: '794px', // A4 width
                      minHeight: '1123px' // A4 height
                    }}
                  >
                    {/* Mock Purchase Order Content */}
                    <div className="p-8 text-sm">
                      <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold">PURCHASE ORDER</h1>
                        <p className="text-gray-600">PO #: PO-2024-001234</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                          <h3 className="font-bold mb-2">From:</h3>
                          <p>Acme Corporation</p>
                          <p>123 Business Street</p>
                          <p>New York, NY 10001</p>
                          <p>contact@acme.com</p>
                        </div>
                        <div>
                          <h3 className="font-bold mb-2">To:</h3>
                          <p>Global Supplies Inc.</p>
                          <p>456 Vendor Avenue</p>
                          <p>Chicago, IL 60601</p>
                          <p>sales@globalsupplies.com</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                          <p><strong>Date:</strong> January 25, 2024</p>
                        </div>
                        <div>
                          <p><strong>Due:</strong> February 15, 2024</p>
                        </div>
                      </div>

                      <table className="w-full border-collapse border border-gray-300 mb-8">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-left">Item</th>
                            <th className="border border-gray-300 p-2 text-left">Description</th>
                            <th className="border border-gray-300 p-2 text-right">Qty</th>
                            <th className="border border-gray-300 p-2 text-right">Unit Price</th>
                            <th className="border border-gray-300 p-2 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 p-2">001</td>
                            <td className="border border-gray-300 p-2">Office Desk Chairs</td>
                            <td className="border border-gray-300 p-2 text-right">10</td>
                            <td className="border border-gray-300 p-2 text-right">$299.99</td>
                            <td className="border border-gray-300 p-2 text-right">$2,999.90</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2">002</td>
                            <td className="border border-gray-300 p-2">Standing Desks</td>
                            <td className="border border-gray-300 p-2 text-right">5</td>
                            <td className="border border-gray-300 p-2 text-right">$599.99</td>
                            <td className="border border-gray-300 p-2 text-right">$2,999.95</td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="text-right mb-8">
                        <div className="inline-block text-left">
                          <p className="mb-1"><strong>Subtotal:</strong> <span className="ml-8">$5,999.85</span></p>
                          <p className="mb-1"><strong>Tax (8.5%):</strong> <span className="ml-8">$509.99</span></p>
                          <p className="text-lg font-bold border-t pt-1"><strong>Total:</strong> <span className="ml-8">$6,509.84</span></p>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        <p className="mb-1"><strong>Terms:</strong> Net 30 days</p>
                        <p>Please reference PO number on all correspondence.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Document Sidebar */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <div className="h-full flex flex-col bg-white rounded-lg shadow-sm m-2 border border-border">
              {/* Workflow Actions - only show for Completed status */}
              {status === 'Completed' && (
                <div className="flex-shrink-0 p-4 border-b border-border rounded-t-lg">
                  <Button className="w-full mb-3">
                    <Play className="w-4 h-4 mr-2" />
                    Start Workflow
                  </Button>
                </div>
              )}

              {/* Form Selection */}
              <div className="flex-shrink-0 p-4 border-b border-border">
                <Label className="text-sm font-medium">Select Form Template</Label>
                <Select value={selectedForm} onValueChange={setSelectedForm}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase-order">Purchase Order Form</SelectItem>
                    <SelectItem value="invoice">Invoice Form</SelectItem>
                    <SelectItem value="receipt">Receipt Form</SelectItem>
                    <SelectItem value="custom">Custom Form</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* AI-Extracted Data */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Extracted Data</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {extractedFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-muted-foreground">{field.label}</Label>
                        {getConfidenceBadge(field.confidence)}
                      </div>
                      <Input
                        value={field.value}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceDocumentDetailView;