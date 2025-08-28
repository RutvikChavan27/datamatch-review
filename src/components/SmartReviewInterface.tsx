import React, { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { CheckCircle, XCircle, MessageSquare, ChevronDown, ChevronRight, ExternalLink, FileText, AlertTriangle, Edit, Save, X, Check, AlertCircle, Upload, RotateCcw } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import DocumentPreviewInterface from './DocumentPreviewInterface';
import { useNavigate } from "react-router-dom";
import { getDocumentSetById } from '@/utils/documentSetData';

type LineItemStatus = 'major_issue' | 'minor_issue' | 'perfect_match' | 'failed';
type VarianceStatus = 'match' | 'variance' | 'mismatch' | 'multi_variance';

interface LineItemField {
  name: string;
  po: string;
  invoice: string;
  grn: string;
  variance: {
    status: VarianceStatus;
    description: string;
  };
}

interface LineItem {
  id: number;
  sku: string;
  description: string;
  status: LineItemStatus;
  value: string;
  totalVariance: string;
  variancePercentage: string;
  issueCount: number;
  fields: LineItemField[];
}

const SmartReviewInterface = () => {
  const { setId } = useParams();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status') || 'Ready for Verification';
  
  // Get document set data from the document matching list
  const documentSetData = getDocumentSetById(setId || '');
  const [comments, setComments] = useState('');
  const [showCommentsDialog, setShowCommentsDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'need-review' | 'all' | 'perfect'>('need-review');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([1]));
  const [editedValues, setEditedValues] = useState<{[key: string]: string}>({});
  const [expandedRecommendation, setExpandedRecommendation] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [userInputValues, setUserInputValues] = useState<{[key: string]: string}>({});
  const [editingUserInput, setEditingUserInput] = useState<string | null>(null);
  const [popoverOpen, setPopoverOpen] = useState<{[key: string]: boolean}>({});
  const [dragState, setDragState] = useState<{[key: string]: {isDragging: boolean, position: {x: number, y: number}, startPos: {x: number, y: number}}}>({});

  // Document set with simplified metadata
  const documentSet = {
    id: setId || 'DS-00123',
    poNumber: 'PO-2024-0456',
    vendor: 'Acme Corporation',
    status: 'Ready for Review',
    daysInQueue: 3,
    criticalItems: 2,
    financialImpact: 500.00,
    queuePosition: { current: 3, total: 12 },
    documents: [
      {
        id: 'po-doc-1',
        name: 'Purchase Order PO-2024-0456.pdf',
        type: 'Purchase Order',
        url: '/lovable-uploads/40a647b5-00f5-4bd4-825e-8b58cca2e7c2.png'
      },
      {
        id: 'inv-doc-1',
        name: 'Invoice INV-2024-0789.pdf',
        type: 'Invoice',
        url: '/lovable-uploads/c24bf7a8-2cc8-4ae6-9497-8bc1716e1451.png'
      },
      {
        id: 'grn-doc-1',
        name: 'Goods Receipt Note GRN-2024-0123.pdf',
        type: 'GRN',
        url: '/lovable-uploads/fe9ef048-4144-4080-b58f-6cbe02f0092c.png'
      }
    ]
  };

  // Enhanced line items with proper types
  const lineItems: LineItem[] = [
    {
      id: 1,
      sku: 'OFF-001',
      description: 'Office Supplies',
      status: 'major_issue',
      value: '$126.00',
      totalVariance: '+$26.00',
      variancePercentage: '+21%',
      issueCount: 4,
      fields: [
        {
          name: 'Item Name',
          po: 'Office Supply Kit Standard',
          invoice: 'Office Supplies Set Premium',
          grn: 'Office Supply Kit',
          variance: {
            status: 'variance',
            description: 'Name variations need fuzzy matching'
          }
        },
        {
          name: 'Quantity',
          po: '12',
          invoice: '12',
          grn: '10',
          variance: {
            status: 'mismatch',
            description: 'GRN -2 units (-16.7%)'
          }
        },
        {
          name: 'Unit Price',
          po: '$10.00',
          invoice: '$10.50',
          grn: '$10.00',
          variance: {
            status: 'variance',
            description: 'INV +$0.50 (5.0%)'
          }
        },
        {
          name: 'GL Code',
          po: '4010',
          invoice: '4010',
          grn: '—',
          variance: {
            status: 'match',
            description: '✓ Consistent'
          }
        },
        {
          name: 'Line Total',
          po: '$120.00',
          invoice: '$126.00',
          grn: '$100.00',
          variance: {
            status: 'multi_variance',
            description: 'INV vs PO: +$6.00 (+5%)\nINV vs GRN: +$26.00 (+26%)'
          }
        }
      ]
    },
    {
      id: 2,
      sku: 'LAP-002',
      description: 'Dell Laptops',
      status: 'perfect_match',
      value: '$8,500.00',
      totalVariance: '$0.00',
      variancePercentage: '0%',
      issueCount: 0,
      fields: [
        {
          name: 'Item Name',
          po: 'Dell XPS 13',
          invoice: 'Dell XPS 13',
          grn: 'Dell XPS 13',
          variance: {
            status: 'match',
            description: 'Perfect match'
          }
        },
        {
          name: 'Quantity',
          po: '5',
          invoice: '5',
          grn: '5',
          variance: {
            status: 'match',
            description: 'Perfect match'
          }
        },
        {
          name: 'Unit Price',
          po: '$1,700.00',
          invoice: '$1,700.00',
          grn: '$1,700.00',
          variance: {
            status: 'match',
            description: 'Perfect match'
          }
        },
        {
          name: 'GL Code',
          po: '6020',
          invoice: '6020',
          grn: '—',
          variance: {
            status: 'match',
            description: '✓ Consistent'
          }
        },
        {
          name: 'Line Total',
          po: '$8,500.00',
          invoice: '$8,500.00',
          grn: '$8,500.00',
          variance: {
            status: 'match',
            description: 'Perfect match'
          }
        }
      ]
    }
  ];

  const filteredLineItems = lineItems.filter(item => {
    if (viewMode === 'need-review') return item.status !== 'perfect_match';
    if (viewMode === 'perfect') return item.status === 'perfect_match';
    return true;
  });

  const summary = {
    needReview: lineItems.filter(item => item.status !== 'perfect_match').length,
    perfectMatches: lineItems.filter(item => item.status === 'perfect_match').length,
    totalItems: lineItems.length
  };

  const handleFieldEdit = (itemId: number, fieldName: string, value: string) => {
    const key = `${itemId}-${fieldName}`;
    setEditedValues(prev => ({ ...prev, [key]: value }));
  };

  const handleStartEdit = (itemId: number, fieldName: string) => {
    setEditingField(`${itemId}-${fieldName}`);
  };

  const handleSaveEdit = (itemId: number, fieldName: string) => {
    setEditingField(null);
    console.log('Saved edit for:', itemId, fieldName);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
  };

  const handleUserInputChange = (itemId: number, value: string) => {
    const key = `${itemId}-userInput`;
    setUserInputValues(prev => ({ ...prev, [key]: value }));
  };

  const handleUserInputClick = (itemId: number) => {
    const key = `${itemId}-userInput`;
    setEditingUserInput(key);
  };

  const handleUserInputSave = () => {
    setEditingUserInput(null);
  };

  const openDocumentContext = () => {
    setShowDocumentPreview(true);
  };

  const getStatusIndicator = (item: LineItem) => {
    if (item.status === 'major_issue') {
      return <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div><span className="text-sm text-red-600">{item.issueCount} issues</span></div>;
    }
    if (item.status === 'minor_issue') {
      return <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div><span className="text-sm text-yellow-600">{item.issueCount} issue</span></div>;
    }
    if (item.status === 'perfect_match') {
      return <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div><span className="text-sm text-green-600">Perfect</span></div>;
    }
    return <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div><span className="text-sm text-gray-600">Failed</span></div>;
  };

  const getVarianceDisplay = (field: LineItemField) => {
    // For non-verification statuses, show neutral styling
    const isNonVerificationStatus = status !== 'Ready for Verification';
    
    if (field.variance.status === 'match') {
      return <span className="text-sm text-gray-500">—</span>;
    }
    if (field.variance.status === 'variance') {
      return <span className={`text-sm ${isNonVerificationStatus ? 'text-gray-600' : 'text-gray-600'}`}>{field.variance.description}</span>;
    }
    if (field.variance.status === 'mismatch') {
      return <span className={`text-sm ${isNonVerificationStatus ? 'text-gray-600' : 'text-red-600'}`}>{field.variance.description}</span>;
    }
    if (field.variance.status === 'multi_variance') {
      return (
        <div className="space-y-1">
          {field.variance.description.split('\n').map((line: string, i: number) => (
            <div key={i} className={`text-sm ${isNonVerificationStatus ? 'text-gray-600' : 'text-red-600'}`}>{line}</div>
          ))}
        </div>
      );
    }
    return <span className="text-sm">{field.variance.description}</span>;
  };

  const hasRedVariance = (field: LineItemField) => {
    // Only show red variance for Ready for Verification status
    return status === 'Ready for Verification' && (field.variance.status === 'mismatch' || field.variance.status === 'multi_variance');
  };

  const handleUserInputSaveForField = (itemId: number, fieldName: string) => {
    const key = `${itemId}-userInput-${fieldName}`;
    setEditingUserInput(null);
    console.log('Saved user input for:', itemId, fieldName);
  };

  const handleUserInputCancelForField = () => {
    setEditingUserInput(null);
  };

  const handlePopoverToggle = (itemId: number, fieldName: string) => {
    const key = `${itemId}-${fieldName}`;
    setPopoverOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const generatePopoverContent = (field: LineItemField, itemId: number) => {
    return `Acme Corporation, PO-2024-0456

Extracted Data: 
- PO: ${field.po}
- Invoice: ${field.invoice}  
- GRN: ${field.grn}

AI Detection: ⚠️ ${field.variance.description}`;
  };

  const handleMouseDown = (e: React.MouseEvent, popoverKey: string) => {
    e.preventDefault();
    setDragState(prev => ({
      ...prev,
      [popoverKey]: {
        isDragging: true,
        position: prev[popoverKey]?.position || { x: 0, y: 0 },
        startPos: { x: e.clientX, y: e.clientY }
      }
    }));
  };

  const handleMouseMove = (e: MouseEvent, popoverKey: string) => {
    const currentDrag = dragState[popoverKey];
    if (!currentDrag?.isDragging) return;

    const deltaX = e.clientX - currentDrag.startPos.x;
    const deltaY = e.clientY - currentDrag.startPos.y;

    setDragState(prev => ({
      ...prev,
      [popoverKey]: {
        ...currentDrag,
        position: {
          x: currentDrag.position.x + deltaX,
          y: currentDrag.position.y + deltaY
        },
        startPos: { x: e.clientX, y: e.clientY }
      }
    }));
  };

  const handleMouseUp = (popoverKey: string) => {
    setDragState(prev => ({
      ...prev,
      [popoverKey]: {
        ...prev[popoverKey],
        isDragging: false
      }
    }));
  };

  React.useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      Object.keys(dragState).forEach(key => {
        if (dragState[key]?.isDragging) {
          handleMouseMove(e, key);
        }
      });
    };

    const handleGlobalMouseUp = () => {
      Object.keys(dragState).forEach(key => {
        if (dragState[key]?.isDragging) {
          handleMouseUp(key);
        }
      });
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [dragState]);

  const navigate = useNavigate();

  // Function to get error icon for column headers based on status
  const getColumnErrorIcon = (columnType: 'invoice' | 'grn') => {
    if (status === 'Missing Documents' && columnType === 'grn') {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-auto ml-1">
              <AlertCircle className="w-4 h-4 text-red-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-3">
              <div className="text-sm font-medium">Missing Documents</div>
              <div className="text-sm text-gray-600">Invoice missing, click to upload document.</div>
              <Button className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      );
    }
    
    if (status === 'Processing Failed' && columnType === 'invoice') {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-auto ml-1">
              <AlertCircle className="w-4 h-4 text-red-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-3">
              <div className="text-sm font-medium">Processing Failed</div>
              <div className="text-sm text-gray-600">AI processing was unsuccessful, please reprocess.</div>
              <Button className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reprocess
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      );
    }
    
    return null;
  };

  // Function to get column content based on status
  const getColumnContent = (field: LineItemField, columnType: 'po' | 'invoice' | 'grn') => {
    if (status === 'Missing Documents' && columnType === 'grn') {
      return '—';
    }
    
    if (status === 'Processing Failed' && columnType === 'invoice') {
      return '—';
    }
    
    return field[columnType];
  };

  // Function to determine if action buttons should be shown
  const shouldShowActionButtons = () => {
    return status === 'Ready for Verification';
  };

  // Function to get status badge with proper semantic colors
  const getStatusBadgeWithDays = (status: string, days: number) => {
    switch (status.toLowerCase()) {
      case 'ready for verification':
        return <Badge className="bg-blue-100 text-[#333333] text-xs hover:bg-blue-100 border-0">{status} • {days} days</Badge>;
      case 'verified':
        return <Badge className="bg-green-100 text-[#333333] text-xs hover:bg-green-100 border-0">{status} • {days} days</Badge>;
      case 'processing failed':
        return <Badge className="bg-red-100 text-[#333333] text-xs hover:bg-red-100 border-0">{status} • {days} days</Badge>;
      case 'missing documents':
        return <Badge className="bg-red-100 text-[#333333] text-xs hover:bg-red-100 border-0">{status} • {days} days</Badge>;
      case 'manual review':
        return <Badge className="bg-blue-100 text-[#333333] text-xs hover:bg-blue-100 border-0">{status} • {days} days</Badge>;
      default:
        return <Badge className="bg-gray-100 text-[#333333] text-xs hover:bg-gray-100 border-0">{status} • {days} days</Badge>;
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-2 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Clean Breadcrumb */}
      <div className="mb-3 pt-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/matching" className="font-medium">Document Matching</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/matching/sets/${setId}`} className="font-medium">
                  {documentSetData ? `${documentSetData.poNumber} • ${status}` : 'Loading...'}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>


      {/* Modern Document Header */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg">
        <div className="p-4">
            <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  {documentSet.vendor} | {documentSet.poNumber} | <span className="text-red-600">{documentSet.criticalItems} Critical ${documentSet.financialImpact.toFixed(2)} Impact</span>
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-500">Set {documentSet.id}</span>
                  {getStatusBadgeWithDays(status, documentSet.daysInQueue)}
                  <span className="text-xs text-gray-600">{summary.needReview} of {summary.totalItems} items need review</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button 
                variant="secondary"
                onClick={() => navigate(`/matching/sets/${documentSet.id}/preview`)}
              >
                <FileText className="w-3 h-3 mr-1" />
                View Docs
              </Button>
              {status !== 'Verified' && (
                <>
                  <Button onClick={() => setShowCommentsDialog(true)} variant="secondary">
                    <XCircle className="w-3 h-3 mr-1" />
                    Reject
                  </Button>
                  <Button onClick={() => setShowCommentsDialog(true)} variant="default">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verify
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modern AI Recommendation */}
      <div className="bg-gradient-to-r from-purple-100 via-blue-100 to-cyan-100 border border-purple-200 rounded-lg overflow-hidden">
        <Collapsible open={expandedRecommendation} onOpenChange={setExpandedRecommendation}>
          <CollapsibleTrigger asChild>
            <div className="p-2 cursor-pointer hover:bg-gradient-to-r hover:from-purple-200/80 hover:via-blue-200/80 hover:to-cyan-200/80 transition-all duration-300">
              <div className="flex items-center gap-2">
                <div className="text-gray-600">
                  {expandedRecommendation ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </div>
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xs">
                  🤖
                </div>
                <div className="flex-1 text-sm font-medium text-gray-700">
                  Office Supplies: 21% variance requires review • Dell Laptops: Perfect match • Historical: 5% avg variance
                </div>
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-3 pb-3 border-t border-blue-200/50">
              <div className="pt-3">
                <div className="text-sm font-semibold text-blue-900 mb-2">Detailed Analysis</div>
                <div className="text-sm text-blue-800 space-y-1">
                  <div>• Vendor risk profile: Low (established 3-year relationship)</div>
                  <div>• Price variance trend: Consistent with Q4 material cost increases</div>
                  <div>• Verification recommendation: Review critical items, auto-verify within tolerance</div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Modern Tab Pills */}
      <div className="flex justify-start pt-6">
        <div className="bg-gray-200 p-1 rounded-full inline-flex items-center gap-1">
          {[
            { key: 'all', label: 'All Items', count: summary.totalItems },
            { key: 'need-review', label: 'Needs Verification', count: summary.needReview },
            { key: 'perfect', label: 'Perfect Matches', count: summary.perfectMatches }
          ].map(tab => (
            <button
              key={tab.key}
              className={`
                px-4 py-2 flex items-center gap-2 rounded-full text-sm font-medium transition-all duration-200
                ${viewMode === tab.key
                  ? "bg-white text-gray-900 shadow-sm font-semibold"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"}
              `}
              onClick={() => setViewMode(tab.key as 'need-review' | 'all' | 'perfect')}
            >
              <span>{tab.label}</span>
              <div className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                viewMode === tab.key ? 'bg-gray-100 text-gray-700' : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modern Line Items */}
      <div className="space-y-3">
        {filteredLineItems.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
            <div 
              className={`h-14 flex items-center px-6 cursor-pointer hover:bg-gray-50 ${
                expandedItems.has(item.id) ? 'bg-white border-b border-gray-200' : 'bg-white'
              }`}
              onClick={() => {
                const newSet = new Set(expandedItems);
                if (newSet.has(item.id)) {
                  newSet.delete(item.id);
                } else {
                  newSet.add(item.id);
                }
                setExpandedItems(newSet);
              }}
            >
              <div className="mr-3">
                {expandedItems.has(item.id) ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
              </div>

              <div className="mr-3">
                {getStatusIndicator(item)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 truncate">
                    {item.description}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({item.sku})
                  </span>
                </div>
              </div>

              <div className="mx-4">
                <span className="text-sm font-medium text-gray-900">
                  {item.totalVariance} ({item.variancePercentage})
                </span>
              </div>

              {shouldShowActionButtons() && (
                <div className="flex space-x-4" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary hover:text-primary/80 hover:bg-primary/10"
                  >
                    <XCircle className="w-4 h-4 mr-0.5" />
                    Reject
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary hover:text-primary/80 hover:bg-primary/10"
                  >
                    <CheckCircle className="w-4 h-4 mr-0.5" />
                    Verify
                  </Button>
                </div>
              )}
            </div>

            {expandedItems.has(item.id) && (
              <div className="bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-6 gap-4 px-6 py-3 bg-muted/50 border-b border-border font-semibold text-sm text-foreground h-12" style={{ backgroundColor: '#ECF0F7', borderBottomColor: '#D6DEE9' }}>
                  <div>Field</div>
                  <div>PO</div>
                  <div className="flex items-center">
                    Invoice
                    {getColumnErrorIcon('invoice')}
                  </div>
                  <div className="flex items-center">
                    GRN
                    {getColumnErrorIcon('grn')}
                  </div>
                  <div>Variance Analysis</div>
                  <div>USER INPUT</div>
                </div>

                {item.fields.map((field, fieldIndex) => {
                  const fieldKey = `${item.id}-${field.name}`;
                  const isEditing = editingField === fieldKey;
                  const editedValue = editedValues[fieldKey] || '';
                  const userInputKey = `${item.id}-userInput-${field.name}`;
                  const isEditingUserInput = editingUserInput === userInputKey;
                  const hasRedText = hasRedVariance(field);
                  const popoverKey = `${item.id}-${field.name}`;

                  return (
                     <div 
                       key={fieldIndex}
                       className={`grid grid-cols-6 gap-4 px-6 py-3 border-b border-gray-100 last:border-b-0 ${hasRedText ? 'bg-white' : 'bg-white'}`}
                       style={hasRedText ? { backgroundColor: '#FFEBEB' } : {}}
                     >
                      <div className="text-sm font-medium text-gray-900">{field.name}</div>
                      
                      <div 
                        className="text-sm text-gray-700 cursor-pointer hover:bg-blue-50 p-1 rounded"
                        onClick={() => !isEditing && handleStartEdit(item.id, field.name)}
                      >
                        {isEditing ? (
                          <div className="flex items-center space-x-1">
                            {field.name === 'GL Code' ? (
                              <Select value={editedValue || field.po} onValueChange={(value) => handleFieldEdit(item.id, field.name, value)}>
                                <SelectTrigger className="h-9 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="4010">4010 - Office Supplies</SelectItem>
                                  <SelectItem value="6020">6020 - Equipment</SelectItem>
                                  <SelectItem value="5010">5010 - Travel</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                value={editedValue || field.po}
                                onChange={(e) => handleFieldEdit(item.id, field.name, e.target.value)}
                                className="h-9 w-full text-sm"
                                onBlur={() => handleSaveEdit(item.id, field.name)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveEdit(item.id, field.name);
                                  if (e.key === 'Escape') handleCancelEdit();
                                }}
                                autoFocus
                              />
                            )}
                          </div>
                        ) : (
                          <div className="group flex items-center">
                            {field.po}
                            <Edit className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        )}
                      </div>
                      
                      <div 
                        className="text-sm text-gray-700 cursor-pointer hover:bg-blue-50 p-1 rounded"
                        onClick={() => !isEditing && handleStartEdit(item.id, field.name)}
                      >
                        <div className="group flex items-center">
                          {getColumnContent(field, 'invoice')}
                          {getColumnContent(field, 'invoice') !== '—' && <Edit className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />}
                        </div>
                      </div>
                      
                      <div 
                        className="text-sm text-gray-700 cursor-pointer hover:bg-blue-50 p-1 rounded"
                        onClick={() => !isEditing && handleStartEdit(item.id, field.name)}
                      >
                        <div className="group flex items-center">
                          {getColumnContent(field, 'grn')}
                          {getColumnContent(field, 'grn') !== '—' && <Edit className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />}
                        </div>
                      </div>

                      <div className="text-sm">
                        {getVarianceDisplay(field)}
                      </div>

                      <div className="pl-2">
                        {hasRedText && (
                          isEditingUserInput ? (
                            <div className="flex items-center space-x-1">
                              <Input
                                className="h-9 flex-1 text-sm bg-white border border-gray-300"
                                value={userInputValues[userInputKey] || ''}
                                onChange={(e) => {
                                  const key = `${item.id}-userInput-${field.name}`;
                                  setUserInputValues(prev => ({ ...prev, [key]: e.target.value }));
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleUserInputSaveForField(item.id, field.name);
                                  if (e.key === 'Escape') handleUserInputCancelForField();
                                }}
                                placeholder="Add..."
                                autoFocus
                              />
                              <Popover open={popoverOpen[popoverKey]} onOpenChange={(open) => setPopoverOpen(prev => ({ ...prev, [popoverKey]: open }))}>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9 w-9 p-0"
                                    onClick={() => handleUserInputSaveForField(item.id, field.name)}
                                    title="Save input"
                                  >
                                    <Check className="w-4 h-4 text-green-600" />
                                  </Button>
                                </PopoverTrigger>
                                 <PopoverContent 
                                   className="w-[480px] p-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                                   side="top" 
                                   align="end" 
                                   sideOffset={8}
                                  style={dragState[popoverKey]?.position ? {
                                    transform: `translate(${dragState[popoverKey].position.x}px, ${dragState[popoverKey].position.y}px)`,
                                    position: 'fixed'
                                  } : {}}
                                >
                                  <div className="space-y-4">
                                    <div 
                                      className="flex items-center justify-between px-6 py-4 border-b border-border cursor-grab active:cursor-grabbing"
                                      onMouseDown={(e) => handleMouseDown(e, popoverKey)}
                                    >
                                      <h3 className="text-lg font-semibold text-foreground">User Input</h3>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 hover:bg-gray-100"
                                        onClick={() => setPopoverOpen(prev => ({ ...prev, [popoverKey]: false }))}
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>
                                    <div className="px-6">
                                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="text-sm font-medium text-blue-900 mb-1">Smart Analysis</div>
                                        <div className="text-sm text-blue-800 whitespace-pre-line">
                                          {generatePopoverContent(field, item.id)}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-gray-50 rounded-b-xl">
                                      <div className="flex items-center space-x-3">
                                        <Checkbox className="h-4 w-4" />
                                        <span className="text-sm text-gray-700">Send email summary</span>
                                      </div>
                                      <div className="flex space-x-3">
                                         <Button variant="outline" onClick={() => setPopoverOpen(prev => ({ ...prev, [popoverKey]: false }))}>
                                           Cancel
                                         </Button>
                                         <Button onClick={() => setPopoverOpen(prev => ({ ...prev, [popoverKey]: false }))}>
                                           Mark as done
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 p-0"
                                onClick={handleUserInputCancelForField}
                                title="Cancel edit"
                              >
                                <X className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <div
                                className="h-9 flex-1 flex items-center px-2 bg-white border border-gray-300 rounded cursor-pointer hover:border-gray-500 transition-colors text-sm"
                                onClick={() => setEditingUserInput(userInputKey)}
                              >
                                <span className={userInputValues[userInputKey] ? 'text-gray-900' : 'text-gray-400'}>
                                  {userInputValues[userInputKey] || 'Add...'}
                                </span>
                              </div>
                              <Popover open={popoverOpen[popoverKey]} onOpenChange={(open) => setPopoverOpen(prev => ({ ...prev, [popoverKey]: open }))}>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="h-9 w-9 p-0 bg-green-600 hover:bg-green-700 text-white"
                                    title="Verify input"
                                  >
                                    <Check className="w-4 h-4 text-white" />
                                  </Button>
                                </PopoverTrigger>
                                 <PopoverContent 
                                   className="w-[480px] p-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                                   side="top" 
                                   align="end" 
                                   sideOffset={8}
                                  style={dragState[popoverKey]?.position ? {
                                    transform: `translate(${dragState[popoverKey].position.x}px, ${dragState[popoverKey].position.y}px)`,
                                    position: 'fixed'
                                  } : {}}
                                >
                                  <div className="space-y-2">
                                    <div 
                                      className="flex items-center justify-between px-6 py-3 cursor-grab active:cursor-grabbing"
                                      onMouseDown={(e) => handleMouseDown(e, popoverKey)}
                                    >
                                      <h3 className="text-lg font-medium text-foreground">User Input</h3>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => setPopoverOpen(prev => ({ ...prev, [popoverKey]: false }))}
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>
                                    <div className="px-6 pb-2">
                                      <div className="space-y-3">
                                        <label className="text-sm font-medium text-blue-900">Smart Analysis</label>
                                        <Textarea
                                          className="min-h-[140px] bg-blue-50 border border-blue-200 text-sm text-blue-800 resize-none rounded-lg p-3"
                                          defaultValue={generatePopoverContent(field, item.id)}
                                          placeholder="Add your analysis..."
                                        />
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between p-6 pt-0">
                                      <div className="flex items-center space-x-2">
                                        <Checkbox />
                                        <span className="text-sm">Send email summary</span>
                                      </div>
                                       <div className="flex space-x-2">
                                          <Button variant="outline" onClick={() => setPopoverOpen(prev => ({ ...prev, [popoverKey]: false }))}>
                                            Cancel
                                          </Button>
                                          <Button onClick={() => setPopoverOpen(prev => ({ ...prev, [popoverKey]: false }))}>
                                            Mark as done
                                          </Button>
                                       </div>
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 w-9 p-0"
                                onClick={handleUserInputCancelForField}
                                title="Cancel edit"
                              >
                                <X className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modern Comments Dialog */}
      <Dialog open={showCommentsDialog} onOpenChange={setShowCommentsDialog}>
        <DialogContent className="max-w-2xl bg-white border border-gray-200 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Review Decision for {documentSet.poNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm font-semibold text-blue-900 mb-2">Smart Analysis</div>
              <div className="text-sm text-blue-800">
                Financial impact of ${documentSet.financialImpact} requires attention to critical items.
              </div>
            </div>
            <Textarea
              placeholder="Add your review comments and reasoning..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400 resize-none"
            />
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowCommentsDialog(false)}>
                Cancel
              </Button>
              <Button variant="secondary">
                <XCircle className="w-4 h-4 mr-2" />
                Reject Document Set
              </Button>
              <Button variant="default">
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify Document Set
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default SmartReviewInterface;
