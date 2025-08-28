import React, { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, RefreshCw, Eye, EyeOff, Upload, Trash2, CheckCircle, X, ZoomIn, ZoomOut, FileText, ChevronDown, ChevronLeft, ChevronRight, Bot, ImageIcon, AlertCircle, Edit, Save } from 'lucide-react';
import { AddLineItemDialog } from './AddLineItemDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import DocumentPreviewPanel from './DocumentPreviewPanel';
import EnhancedDocumentSetHeader from './EnhancedDocumentSetHeader';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { AllDocsTab } from './AllDocsTab';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from '@/components/ui/skeleton';
import { getDocumentSetById } from '@/utils/documentSetData';

// Document Set Definition
const documentSet = {
  id: 'DS-00123',
  poNumber: 'PO-2024-0456',
  vendor: 'Acme Corporation'
};

// Define line item keys - removed confidence from main table, added edited value
const allLineItemKeysOriginal = ['srNo', 'item', 'description', 'sku', 'uom', 'discount', 'tax', 'quantity', 'cost', 'total', 'editedValue', 'confidence'];
const allLineItemKeys = ['srNo', 'item', 'description', 'sku', 'uom', 'discount', 'tax', 'quantity', 'cost', 'total'];

// Generate 18+ line items with extra columns
function generateManyLineItems(num: number) {
  const example = [
    { srNo: '1', item: 'Small Parcel Unit', description: 'Boxed', sku: 'SKU1', uom: 'pcs', discount: '$0.00', tax: '$1.00', quantity: '1000', cost: '$5.00', total: '$5,000.00', confidence: 94 },
    { srNo: '2', item: 'Large Parcel Unit', description: 'Oversized', sku: 'SKU2', uom: 'pcs', discount: '$2.00', tax: '$2.50', quantity: '350', cost: '$15.00', total: '$5,250.00', confidence: 90 },
    { srNo: '3', item: 'Express Shipping', description: 'Urgent', sku: 'SKU3', uom: 'service', discount: '$0.00', tax: '$20.00', quantity: '1', cost: '$200.00', total: '$200.00', confidence: 95 }
  ];
  let arr: any[] = [];
  for (let i = 0; i < num; i++) {
    const base = example[i % example.length];
    arr.push({
      ...base,
      srNo: String(i + 1),
      item: base.item + ' #' + (i + 1),
      sku: base.sku + String(i + 1)
    });
  }
  return arr;
}
const lotOfPOItems = generateManyLineItems(20);

// Enhanced document structure with multiple documents per type
const docsByTab: { [key: string]: Array<{ id: string; name: string; type: string; url: string }> } = {
  po: [
    {
      id: 'po-doc-1',
      name: 'Purchase Order PO-2024-0456.pdf',
      type: 'Purchase Order',
      url: '/lovable-uploads/40a647b5-00f5-4bd4-825e-8b58cca2e7c2.png'
    },
    {
      id: 'po-doc-2',
      name: 'Purchase Order PO-2024-0456-revised.pdf',
      type: 'Purchase Order',
      url: '/lovable-uploads/00aad332-2016-4d6e-a7be-aca80f0f4d7f.png'
    }
  ],
  invoice: [
    {
      id: 'inv-doc-1',
      name: 'Invoice INV-2024-0789.pdf',
      type: 'Invoice',
      url: '/lovable-uploads/dd02edfb-b909-4512-a7c0-542a9b5663b1.png'
    },
    {
      id: 'inv-doc-2',
      name: 'Invoice INV-2024-0790.pdf',
      type: 'Invoice',
      url: '/lovable-uploads/dd02edfb-b909-4512-a7c0-542a9b5663b1.png'
    }
  ],
  grn: [
    {
      id: 'grn-doc-1',
      name: 'Goods Receipt Note GRN-2024-0123.pdf',
      type: 'GRN',
      url: '/lovable-uploads/fe9ef048-4144-4080-b58f-6cbe02f0092c.png'
    }
  ]
};

const extractedData = {
  po: [
    {
      docId: 'po-doc-1',
      metadata: {
        poNumber: { value: '332344', confidence: 95 },
        vendor: { value: 'BANGBANG MOVERS', confidence: 92 },
        date: { value: '07-29-2019', confidence: 78 },
        total: { value: '$5,000.00', confidence: 98 },
        email: { value: 'accounting@bang.com', confidence: 85 },
        phone: { value: '+1 92818477', confidence: 89 },
        deliveryTo: { value: 'BONBONG PRETZEL', confidence: 91 },
        contact: { value: 'Eugen Paul', confidence: 87 },
        address: { value: '0077, Yellow County, Jacksonville, Florida', confidence: 82 },
        vendorAddress: { value: '1001, Blue County, Jacksonville, Florida', confidence: 86 },
      },
      lineItems: lotOfPOItems
    },
    {
      docId: 'po-doc-2',
      metadata: {
        poNumber: { value: '332344-R1', confidence: 97 },
        vendor: { value: 'BANGBANG MOVERS', confidence: 94 },
        date: { value: '08-01-2019', confidence: 85 },
        total: { value: '$5,200.00', confidence: 96 }
      },
      lineItems: generateManyLineItems(15)
    }
  ],
  invoice: [
    {
      docId: 'inv-doc-1',
      metadata: {
        invoiceNumber: { value: 'INV-005', confidence: 96 },
        vendor: { value: 'Ad4tech Material LLC', confidence: 65 },
        total: { value: '$1,564.00', confidence: 94 },
        date: { value: '2024-01-15', confidence: 88 },
        billTo: { value: 'Green1 Materials LLC', confidence: 89 },
        address: { value: '123 Business Ave, Commerce City', confidence: 85 }
      },
      lineItems: generateManyLineItems(20)
    },
    {
      docId: 'inv-doc-2',
      metadata: {
        invoiceNumber: { value: 'INV-006', confidence: 93 },
        vendor: { value: 'Beta Office Solutions', confidence: 90 },
        total: { value: '$2,149.60', confidence: 88 },
        date: { value: '2024-01-18', confidence: 92 }
      },
      lineItems: generateManyLineItems(20)
    }
  ],
  grn: [
    {
      docId: 'grn-doc-1',
      metadata: {
        jobNumber: { value: 'JN-123456', confidence: 88 },
        receivedFrom: { value: 'PT Sumber Logistik', confidence: 91 },
        date: { value: '9 January 2025', confidence: 76 },
        totalWeight: { value: '60 kg total', confidence: 73 },
        deliveryAddress: { value: 'Warehouse B, Industrial Zone', confidence: 84 },
        carrier: { value: 'Express Logistics', confidence: 79 }
      },
      lineItems: generateManyLineItems(18)
    }
  ]
};

type TabValue = 'all' | 'po' | 'invoice' | 'grn';

const getFieldLabel = (key: string) => {
  const map: Record<string, string> = {
    srNo: "Sr. No.",
    poNumber: "PO Number",
    vendor: "Vendor",
    date: "Date",
    email: "Email",
    phone: "Phone",
    deliveryTo: "Delivery To",
    contact: "Contact",
    address: "Address",
    vendorAddress: "Vendor Address",
    invoiceNumber: "Invoice Number",
    billTo: "Bill To",
    jobNumber: "Job Number",
    receivedFrom: "Received From",
    totalWeight: "Total Weight",
    deliveryAddress: "Delivery Address",
    carrier: "Carrier",
    item: "Item",
    description: "Description",
    sku: "SKU",
    uom: "UOM",
    discount: "Discount",
    tax: "Tax",
    quantity: "Quantity",
    cost: "Unit Cost",
    confidence: "Conf%",
    total: "Total"
  };
  return map[key] || key.charAt(0).toUpperCase() + key.slice(1);
};

const getSmallConfidence = (n: number) => (
  <Badge 
    variant={n > 92 ? "default" : n > 80 ? "secondary" : "destructive"} 
    className="text-xs"
  >
    {n}%
  </Badge>
);

const DocumentPreviewPage: React.FC = () => {
  const { setId } = useParams<{ setId: string }>();
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const [activeDocIndexByTab, setActiveDocIndexByTab] = useState<{ [tab: string]: number }>({
    all: 0,
    po: 0,
    invoice: 0,
    grn: 0
  });
  const [extractedInfoFilter, setExtractedInfoFilter] = useState<string>('all');
  const [lineItems, setLineItems] = useState<any[]>([]);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [editingMetaKey, setEditingMetaKey] = useState<string | null>(null);
  const [metaDraft, setMetaDraft] = useState<Record<string, string>>({});
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [editedValues, setEditedValues] = useState<{[key: string]: string}>({});
  const [userInputValues, setUserInputValues] = useState<{[key: string]: string}>({});
  const [editingUserInput, setEditingUserInput] = useState<string | null>(null);
  const [isExtractedInfoOpen, setIsExtractedInfoOpen] = useState(true);
  const [showAIConfidence, setShowAIConfidence] = useState(true);
  const [isLineItemsEditMode, setIsLineItemsEditMode] = useState(false);
  const [isAddLineItemDialogOpen, setIsAddLineItemDialogOpen] = useState(false);
  const [hoveredFieldId, setHoveredFieldId] = useState<string | null>(null);

  const navigate = useNavigate();

  // Get document set data from the table list
  const documentSetData = getDocumentSetById(setId || 'DS-00123');

  // Get current documents for active tab
  const getCurrentDocs = () => {
    if (activeTab === 'all') {
      return [
        ...docsByTab.po,
        ...docsByTab.invoice,
        ...docsByTab.grn
      ];
    }
    return docsByTab[activeTab];
  };
  
  const currentDocs = getCurrentDocs();
  const currentDocIndex = activeDocIndexByTab[activeTab] || 0;
  const currentDocument = currentDocs[currentDocIndex];

  // Get document URL for preview
  const docUrl = currentDocument?.url;

  // Get extracted data for current tab and filter
  const getCurrentExtractedData = () => {
    if (activeTab === 'all') {
      const allPOData = extractedData.po || [];
      const allInvoiceData = extractedData.invoice || [];
      const allGRNData = extractedData.grn || [];
      
      const allMetadata = allPOData[0]?.metadata || allInvoiceData[0]?.metadata || allGRNData[0]?.metadata || {};
      
      const allLineItems = [
        ...allPOData.flatMap(data => data.lineItems || []),
        ...allInvoiceData.flatMap(data => data.lineItems || []),
        ...allGRNData.flatMap(data => data.lineItems || [])
      ];
      
      return { metadata: allMetadata, lineItems: allLineItems };
    }
    
    const tabData = extractedData[activeTab] || [];
    
    if (extractedInfoFilter === 'all') {
      const allMetadata = tabData[0]?.metadata || {};
      const allLineItems = tabData.flatMap(data => data.lineItems || []);
      return { metadata: allMetadata, lineItems: allLineItems };
    } else {
      const selectedDoc = currentDocs.find(doc => doc.name === extractedInfoFilter);
      const docData = tabData.find(data => data.docId === selectedDoc?.id);
      return docData ? { metadata: docData.metadata, lineItems: docData.lineItems } : { metadata: {}, lineItems: [] };
    }
  };

  const currentExtractedData = getCurrentExtractedData();

  // Calculate header values
  const headerAmount = currentExtractedData.metadata && 'total' in currentExtractedData.metadata 
    ? (currentExtractedData.metadata.total as any)?.value || '$0.00'
    : '$0.00';
  const headerStatus = documentSetData?.status || "Ready for Verification";
  const headerIssuesSummary = {
    majorIssues: 2,
    minorIssues: 1,
    totalVariance: "$26.00"
  };
  const counts = {
    po: docsByTab.po.length,
    invoice: docsByTab.invoice.length,
    grn: docsByTab.grn.length
  };

  // Set line items for current tab and filter
  React.useEffect(() => {
    setLineItems(currentExtractedData.lineItems.map(li => ({ ...li })));
  }, [activeTab, activeDocIndexByTab, extractedInfoFilter]);

  // Document management handlers
  const handleUploadDoc = () => {
    if (activeTab === 'all') return;
    
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.png,.jpg,.jpeg,.tiff,.tif';
    input.multiple = false;
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        // Create object URL for preview
        const fileUrl = URL.createObjectURL(file);
        
        const fakeId = `${activeTab}-new-doc-${Date.now()}`;
        const newDoc = {
          id: fakeId,
          name: file.name,
          type: activeTab === 'po' ? 'Purchase Order' : activeTab === 'invoice' ? 'Invoice' : 'GRN',
          url: fileUrl
        };
        
        const validTab = activeTab as keyof typeof docsByTab;
        if (validTab in docsByTab) {
          docsByTab[validTab].push(newDoc);
          setActiveDocIndexByTab(prev => ({ ...prev, [activeTab]: docsByTab[validTab].length - 1 }));
        }
      }
    };
    
    // Trigger file selection dialog
    input.click();
  };

  const handleRemoveDoc = () => {
    if (activeTab === 'all' || currentDocs.length === 1) return;
    
    const validTab = activeTab as keyof typeof docsByTab;
    if (validTab in docsByTab) {
      const index = currentDocIndex;
      docsByTab[validTab].splice(index, 1);
      setActiveDocIndexByTab(prev => ({
        ...prev,
        [activeTab]: Math.max(0, index - 1)
      }));
    }
  };

  // Metadata edit handlers
  const handleMetaEditStart = (key: string, val: string) => {
    setEditingMetaKey(key);
    setMetaDraft((d) => ({ ...d, [key]: val }));
  };
  const handleMetaChange = (key: string, val: string) => {
    setMetaDraft((d) => ({ ...d, [key]: val }));
  };
  const handleMetaSave = (key: string) => {
    if (editingMetaKey && currentExtractedData.metadata && key in currentExtractedData.metadata) {
      (currentExtractedData.metadata as any)[key].value = metaDraft[key] ?? (currentExtractedData.metadata as any)[key].value;
      setEditingMetaKey(null);
    }
  };
  const handleMetaCancel = () => setEditingMetaKey(null);

  // Line item add/edit handlers
  const handleLineItemChange = (rowIdx: number, key: string, value: string) => {
    setLineItems(ls => ls.map((li, idx) => idx === rowIdx ? { ...li, [key]: value } : li));
  };

  const handleEditedValueChange = (rowIdx: number, value: string) => {
    const key = `${rowIdx}-editedValue`;
    setEditedValues(prev => ({ ...prev, [key]: value }));
  };

  const handleAddLineItem = () => {
    setIsAddLineItemDialogOpen(true);
  };

  const handleAddLineItemFromDialog = (lineItem: any) => {
    const newLineItem = {
      srNo: (lineItems.length + 1).toString(),
      item: lineItem.itemCode,
      description: lineItem.description,
      sku: lineItem.itemCode,
      uom: lineItem.unitOfMeasure,
      discount: '0.00',
      tax: '0.00',
      quantity: lineItem.quantity.toString(),
      cost: lineItem.unitPrice.toFixed(2),
      total: lineItem.totalPrice.toFixed(2),
      confidence: 100 // Since this is manually added
    };
    setLineItems((items) => [...items, newLineItem]);
  };

  const handleDeleteLineItem = (index: number) => {
    setLineItems((items) => items.filter((_, idx) => idx !== index));
  };

  const handleToggleEditMode = () => {
    setIsLineItemsEditMode(!isLineItemsEditMode);
  };

  const handleSaveLineItems = () => {
    // Here you would typically save the line items to the backend
    setIsLineItemsEditMode(false);
  };

  const handleCancelEditMode = () => {
    // Reset line items to original state if needed
    setIsLineItemsEditMode(false);
  };

  // User input handlers
  const handleUserInputChange = (rowIdx: number, value: string) => {
    const key = `${rowIdx}-userInput`;
    setUserInputValues(prev => ({ ...prev, [key]: value }));
  };

  const handleUserInputClick = (rowIdx: number) => {
    const key = `${rowIdx}-userInput`;
    setEditingUserInput(key);
  };

  const handleUserInputSave = () => {
    setEditingUserInput(null);
  };

  // Overall confidence for meta data section
  const metaConfs = Object.values(currentExtractedData.metadata) as { confidence?: number }[];
  let metaConf: number | undefined = undefined;
  if (metaConfs.length > 0) {
    const sum = metaConfs.reduce((acc, v) => acc + (typeof v.confidence === "number" ? v.confidence : 0), 0);
    metaConf = Math.round(sum / metaConfs.length);
  }

  // AI Confidence for table
  const tableAIConf: string = lineItems.length
    ? `${Math.round(lineItems.reduce((sum, item) => sum + (item.confidence || 0), 0) / lineItems.length)}`
    : "--";

  // For field highlight on image hover
  const shouldHighlightFields = isImageHovered;

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 96px)' }}>
      {/* Clean Breadcrumb */}
      <div className="mb-3 pt-3 px-4">
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
                <Link to={`/matching/sets/${documentSetData?.setId || documentSet.id}?status=${encodeURIComponent(documentSetData?.status || 'Ready for Verification')}`} className="font-medium">
                  {documentSetData ? `${documentSetData.poNumber} • ${documentSetData.status}` : `${documentSet.poNumber} • Ready for Verification`}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage>Document set preview</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="mb-6 px-4">
        <EnhancedDocumentSetHeader
          documentSetId={documentSet.id}
          poNumber={documentSet.poNumber}
          vendor={documentSet.vendor}
          totalAmount={headerAmount}
          status={headerStatus}
          priority="medium"
          issuesSummary={headerIssuesSummary}
          documentCounts={counts}
        />
      </div>

      {/* Chrome-style Group Tabs */}
      <div className="w-full">
        <div className="border-b border-border flex items-center justify-between px-0">
          <div className="flex items-center flex-1 px-4 -mb-px pb-1">
             {['all', 'po', 'invoice', 'grn'].map((tab, index) => (
                <button
                  key={tab}
                  className={`
                    px-4 py-2.5 flex items-center gap-2 justify-center transition-all duration-200 relative
                    ${index > 0 ? '-ml-px' : ''}
                    ${activeTab === tab
                      ? `bg-white text-gray-900 font-semibold z-10 border-b-2 border-b-[#27313e] shadow-md border-transparent rounded-t-md`
                      : "text-muted-foreground font-medium hover:bg-gray-50 hover:text-gray-700"}
                  `}
                  onClick={() => setActiveTab(tab as TabValue)}
                >
                <span className={`
                  text-center text-sm leading-5 flex items-center justify-center font-semibold
                `}>
                  {tab === "all" && "All Documents"}
                  {tab === "po" && "Purchase Orders"}
                  {tab === "invoice" && "Invoices"}
                  {tab === "grn" && "GRN"}
                </span>
                {tab !== "all" && (
                  <div className={`rounded-full px-1 py-0.5 h-4 min-w-[20px] flex items-center justify-center ${
                    (tab === "invoice" && headerStatus === "Processing Failed") || (tab === "grn" && headerStatus === "Missing Documents")
                      ? "bg-red-100 border border-red-200" 
                      : "bg-muted"
                  }`}>
                    {(tab === "invoice" && headerStatus === "Processing Failed") || (tab === "grn" && headerStatus === "Missing Documents") ? (
                      <AlertCircle className="w-3 h-3 text-red-500" />
                    ) : (
                      <span className={`text-[10px] font-medium ${
                        (tab === "invoice" && headerStatus === "Processing Failed") || (tab === "grn" && headerStatus === "Missing Documents")
                          ? "text-red-600"
                          : "text-foreground"
                      }`}>
                        {tab === "po" && counts.po}
                        {tab === "invoice" && counts.invoice}
                        {tab === "grn" && counts.grn}
                      </span>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            {/* Preview button moved to main content area as notch */}
          </div>
        </div>

        {/* Main Content - Edge to Edge */}
        <div className="flex flex-1 relative w-full h-full" style={{ height: 'calc(100vh - 96px)' }}>
          {/* Document Preview with Thumbnails for specific tabs */}
          {previewVisible && activeTab !== 'all' && (
            <div className="flex h-full w-[40%] animate-slide-in-right">
              {/* Left Sidebar with Thumbnails */}
              <div className="w-40 flex flex-col" style={{ backgroundColor: '#212C4C' }}>
                {/* Document Counter */}
                <div className="text-white text-sm font-medium p-3 pb-2">
                  Doc {currentDocIndex + 1}/{currentDocs.length}
                </div>
                
                {/* Upload Button */}
                <div className="px-3 pb-3">
                  <button
                    onClick={handleUploadDoc}
                    className="w-full bg-primary text-primary-foreground text-sm rounded-lg p-3 flex flex-col items-center gap-2 transition-colors hover:bg-primary/90"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-xs font-medium">Upload Document</span>
                  </button>
                </div>
                
                {/* Document Thumbnails */}
                <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3">
                  {currentDocs.map((doc, index) => (
                    <div
                      key={doc.id}
                      className={`relative cursor-pointer transition-all ${
                        index === currentDocIndex 
                          ? 'ring-2 ring-blue-500' 
                          : 'hover:ring-1 hover:ring-gray-400'
                      }`}
                      onClick={() => setActiveDocIndexByTab(prev => ({ ...prev, [activeTab]: index }))}
                    >
                        <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden">
                          {headerStatus === 'Missing Documents' ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                              <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                              <span className="text-xs text-gray-500">No Doc</span>
                            </div>
                          ) : (
                            <img
                              src={doc.url}
                              alt={`Preview of ${doc.name}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY3IiBmaWxsPSIjRjFGNUY5Ii8+CjxwYXRoIGQ9Ik0xMDAgMTMzLjVMMTIwIDExMy41TDEyMCAxMjNIMTQwVjE0NEgxMjBWMTUzLjVMMTAwIDEzMy41WiIgZmlsbD0iIzZCNzI4MCIvPgo8L3N2Zz4K';
                              }}
                            />
                          )}
                        </div>
                      {/* Page indicator */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        1/{Math.floor(Math.random() * 8) + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Document View */}
              <div className="flex-1 border-r bg-background relative">
                <DocumentPreviewPanel
                  docUrl={docUrl}
                  docName={currentDocument?.name}
                  onHide={() => setPreviewVisible(false)}
                  status={headerStatus}
                  hoveredFieldId={hoveredFieldId}
                />
              </div>
            </div>
          )}

          {/* Preview Toggle Button */}
          {activeTab !== 'all' && (
            <Button
              onClick={() => setPreviewVisible(!previewVisible)}
              variant="ghost"
              size="sm"
              className={`
                flex items-center justify-center transition-all duration-300 z-50
                ${previewVisible 
                  ? 'absolute top-2 left-[calc(40%-20px)] h-10 w-10 px-0 rounded-r-md' 
                  : 'fixed top-[calc(12rem+6rem)] left-0 h-10 w-8 px-0 rounded-r-md'
                }
                text-white hover:text-white
              `}
              style={{ backgroundColor: '#212C4C' }}
              title={previewVisible ? 'Hide Preview' : 'Show Preview'}
            >
              {previewVisible ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          )}

          {/* Data Panel */}
          <div className={`${previewVisible && activeTab !== 'all' ? 'w-[60%]' : 'w-full'} flex flex-col max-h-full`}>

            {/* Content based on active tab */}
            {activeTab === 'all' ? (
              <div className="h-full w-full">
                <AllDocsTab />
              </div>
            ) : headerStatus === 'Missing Documents' && activeTab === 'grn' ? (
              <div className="flex-1 overflow-auto">
                {/* GRN Empty State with Skeleton Loader */}
                <div className="card-section">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ChevronDown className="w-5 h-5 text-primary" />
                      <h3 className="text-heading">Document Meta Data</h3>
                      <div className="flex items-center space-x-3 ml-6">
                        <div className="w-80 h-10 bg-muted animate-pulse rounded-md"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-8 bg-muted animate-pulse rounded-md"></div>
                      <div className="w-32 h-8 bg-muted animate-pulse rounded-md"></div>
                    </div>
                  </div>
                  
                  {/* Skeleton for metadata fields */}
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-48 h-4 bg-muted animate-pulse rounded"></div>
                        <div className="flex-1 h-10 bg-muted animate-pulse rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Line Items Section */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-foreground">Line Items</h3>
                    <div className="w-24 h-8 bg-muted animate-pulse rounded-md"></div>
                  </div>
                  <div className="overflow-x-auto overflow-y-auto rounded-lg border border-gray-200 cursor-grab active:cursor-grabbing" style={{ scrollbarWidth: 'thin', maxHeight: '400px' }}>
                    <table className="w-full min-w-[1600px]">
                       <thead className="border-b border-gray-200" style={{ backgroundColor: '#DFE7F3' }}>
                         <tr>
                           {['Sr. No.', 'Item', 'Description', 'SKU', 'UOM', 'Discount', 'Tax', 'Quantity', 'Cost', 'Total', 'AI Conf%'].map((header, index) => (
                             <th key={header} className={`px-4 py-2 text-left font-semibold text-sm text-foreground h-12 border-b border-t ${
                               header === 'Sr. No.' ? 'w-16' :
                               header === 'Item' ? 'w-[220px]' : 
                               header === 'Description' ? 'w-[200px]' : 
                               header === 'SKU' ? 'w-24' :
                               header === 'UOM' ? 'w-20' :
                               header === 'Discount' || header === 'Tax' ? 'w-28' :
                               header === 'Quantity' ? 'w-24' :
                               header === 'Cost' ? 'w-28' :
                               header === 'Total' ? 'w-32' :
                               header === 'AI Conf%' ? 'w-20' : 'w-auto'
                             }`} style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>
                               {header}
                             </th>
                           ))}
                         </tr>
                       </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((j) => (
                              <td key={j} className="px-4 py-2">
                                <div className="h-6 bg-muted animate-pulse rounded"></div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
              {/* Metadata Section */}
              {Object.keys(currentExtractedData.metadata).length > 0 && (
                <div className="card-section">
                  <Collapsible open={isExtractedInfoOpen} onOpenChange={setIsExtractedInfoOpen}>
                       <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <CollapsibleTrigger asChild>
                            <ChevronDown className={`w-5 h-5 transition-transform text-primary cursor-pointer ${isExtractedInfoOpen ? 'rotate-180' : ''}`} />
                          </CollapsibleTrigger>
                          <h3 className="text-heading">Extracted Information</h3>
                          {/* Document Selector moved here */}
                          <div className="flex items-center space-x-3 ml-6">
                             {headerStatus === 'Processing Failed' && activeTab === 'invoice' ? (
                               <div className="w-80 h-10 bg-muted animate-pulse rounded-md"></div>
                             ) : (
                               <Select value={extractedInfoFilter} onValueChange={setExtractedInfoFilter}>
                                 <SelectTrigger className="w-80">
                                   <SelectValue>
                                     {extractedInfoFilter === 'all' ? 'All Documents' : extractedInfoFilter}
                                   </SelectValue>
                                 </SelectTrigger>
                                 <SelectContent>
                                   <SelectItem value="all">All Documents</SelectItem>
                                   {currentDocs.map(doc => (
                                     <SelectItem key={doc.id} value={doc.name}>
                                       {doc.name}
                                     </SelectItem>
                                   ))}
                                 </SelectContent>
                               </Select>
                             )}
                          </div>
                        </div>
                          <div className="flex items-center gap-3">
                             {headerStatus === 'Processing Failed' && activeTab === 'invoice' ? (
                               <div className="relative">
                                 <Button 
                                   size="sm" 
                                   variant="secondary" 
                                   className="gap-2"
                                   onClick={(e) => e.stopPropagation()}
                                 >
                                   <RefreshCw className="w-4 h-4" />
                                   Reprocess
                                 </Button>
                                 <div className="absolute top-full right-0 mt-2 w-80 bg-popover border rounded-md shadow-md z-50">
                                   <div className="flex items-start space-x-3 p-4">
                                     <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                                       <AlertCircle className="w-6 h-6 text-red-500" />
                                     </div>
                                     <div className="flex-1">
                                       <h3 className="text-sm font-semibold text-foreground mb-1">
                                         Processing Failed
                                       </h3>
                                       <p className="text-sm text-muted-foreground mb-3">
                                         AI processing was unsuccessful, please reprocess.
                                       </p>
                                         <Button 
                                            size="sm" 
                                            variant="secondary"
                                            className="gap-2 inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white border border-gray-500 text-gray-700 hover:bg-gray-50 hover:border-gray-600 shadow-sm hover:shadow-md h-9 px-4 py-2"
                                           onClick={(e) => e.stopPropagation()}
                                         >
                                          <RefreshCw className="w-4 h-4" />
                                          Reprocess
                                        </Button>
                                     </div>
                                   </div>
                                 </div>
                               </div>
                             ) : null}
                             {headerStatus === 'Processing Failed' && activeTab === 'invoice' ? (
                               <div className="w-32 h-8 bg-muted animate-pulse rounded-md"></div>
                             ) : (
                               <div className="flex items-center gap-3 text-caption">
                                 {/* AI Confidence Component */}
                                 <div className="bg-gradient-to-r from-cyan-200 to-purple-200 rounded-full px-3 py-1 flex items-center gap-3">
                                   <div className="flex items-center gap-1">
                                     <div className="w-5 h-5 flex items-center justify-center">
                                       <Bot className="w-4 h-4 text-blue-600" />
                                     </div>
                                      <span className="text-xs font-normal text-gray-800">AI Confidence</span>
                                      <span className="text-xs font-bold text-gray-800">{metaConf || tableAIConf}%</span>
                                   </div>
                                   <div className="flex items-center">
                                     <div 
                                       className={`rounded-xl p-0.5 w-6 flex cursor-pointer transition-all duration-200 ${
                                         showAIConfidence ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                                       }`}
                                       onClick={() => setShowAIConfidence(!showAIConfidence)}
                                     >
                                       <div className="bg-white rounded-full w-2.5 h-2.5 shadow-sm"></div>
                                     </div>
                                   </div>
                                 </div>
                                 {/* Reprocess Button moved to right side */}
                                 {headerStatus !== 'Processing Failed' && (
                                   <Button 
                                     size="sm"
                                     variant="secondary"
                                     className="gap-2 inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white border border-gray-500 text-gray-700 hover:bg-gray-50 hover:border-gray-600 shadow-sm hover:shadow-md h-9 px-4 py-2"
                                     onClick={(e) => e.stopPropagation()}
                                   >
                                     <RefreshCw className="w-4 h-4" />
                                     Reprocess
                                   </Button>
                                 )}
                               </div>
                             )}
                          </div>
                       </div>
                    <CollapsibleContent>
                      {headerStatus === 'Processing Failed' && activeTab === 'invoice' ? (
                        /* Skeleton for metadata fields */
                        <div className="space-y-4">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                              <div className="w-48 h-4 bg-muted animate-pulse rounded"></div>
                              <div className="flex-1 h-10 bg-muted animate-pulse rounded-lg"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                       <div className="bg-card rounded-lg border p-6 shadow-sm">
                          {Object.entries(currentExtractedData.metadata).map(([key, field]) => {
                           const confidencePercent = (field as any).confidence || 0;
                           let confidenceBadgeClass = '';
                           
                           if (confidencePercent >= 95) {
                             confidenceBadgeClass = 'bg-green-100 text-green-700 border-green-200';
                           } else if (confidencePercent >= 85) {
                             confidenceBadgeClass = 'bg-orange-100 text-orange-700 border-orange-200';
                           } else {
                             confidenceBadgeClass = 'bg-red-100 text-red-700 border-red-200';
                           }
                           
                           return (
                             <div key={key} className="flex items-center gap-4">
                               <div className="flex items-center gap-2 w-48 shrink-0">
                                 <label className="text-sm text-muted-foreground">
                                   {getFieldLabel(key)}
                                 </label>
                               </div>
                             <div className="flex items-center gap-2 flex-1">
                               {editingMetaKey === key ? (
                                 <div className="flex items-center gap-2 flex-1">
                                   <Input
                                     value={metaDraft[key] || ''}
                                     onChange={(e) => handleMetaChange(key, e.target.value)}
                                     className="flex-1"
                                   />
                                   <Button size="sm" onClick={() => handleMetaSave(key)}>
                                     <CheckCircle className="w-4 h-4" />
                                   </Button>
                                   <Button size="sm" variant="outline" onClick={handleMetaCancel}>
                                     <X className="w-4 h-4" />
                                   </Button>
                                 </div>
                               ) : (
                                  <div className="flex items-center gap-2 flex-1">
                                    <span 
                                      className="cursor-pointer hover:bg-accent p-2 rounded-lg transition-colors text-body"
                                      onClick={() => handleMetaEditStart(key, (field as any).value)}
                                      onMouseEnter={() => setHoveredFieldId(`metadata-${key}`)}
                                      onMouseLeave={() => setHoveredFieldId(null)}
                                    >
                                      {(field as any).value}
                                    </span>
                                   {showAIConfidence && (
                                     <span className={`text-xs px-2 py-1 rounded-full border font-medium ${confidenceBadgeClass}`}>
                                       {confidencePercent}%
                                     </span>
                                   )}
                                 </div>
                               )}
                             </div>
                            </div>
                         );
                         })}
                       </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}

              {/* Line Items Table */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-foreground">Line Items</h3>
                  {headerStatus === 'Processing Failed' && activeTab === 'invoice' ? (
                    <div className="w-24 h-8 bg-muted animate-pulse rounded-md"></div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant="outline" onClick={handleAddLineItem} className="h-8 w-8 p-0">
                              <Plus className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add Item</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {isLineItemsEditMode ? (
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="secondary" onClick={handleCancelEditMode} className="gap-2">
                            <X className="w-4 h-4" />
                            Cancel
                          </Button>
                          <Button size="sm" variant="default" onClick={handleSaveLineItems} className="gap-2">
                            <Save className="w-4 h-4" />
                            Save
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="default" onClick={handleToggleEditMode} className="gap-2 inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm hover:shadow-lg hover:shadow-primary/25 h-9 px-4 py-2">
                          <Edit className="w-4 h-4" />
                          Edit Item
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                <div className="shadow-lg shadow-black/5">
                  <Card className="overflow-hidden">
                    <div className={`${isLineItemsEditMode ? 'border-primary border-2' : ''}`}>
                  {headerStatus === 'Processing Failed' && activeTab === 'invoice' ? (
                    <div className="overflow-auto max-h-[600px] cursor-grab active:cursor-grabbing scrollbar-hide hover:scrollbar-show"
                      style={{ 
                        scrollBehavior: 'smooth'
                      }}
                      onMouseDown={(e) => {
                        const scrollContainer = e.currentTarget;
                        const startX = e.pageX - scrollContainer.offsetLeft;
                        const scrollLeft = scrollContainer.scrollLeft;
                        
                        const handleMouseMove = (e: MouseEvent) => {
                          const x = e.pageX - scrollContainer.offsetLeft;
                          const walk = (x - startX) * 2;
                          scrollContainer.scrollLeft = scrollLeft - walk;
                        };
                        
                        const handleMouseUp = () => {
                          document.removeEventListener('mousemove', handleMouseMove);
                          document.removeEventListener('mouseup', handleMouseUp);
                        };
                        
                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                      }}
                    >
                          <table className="w-full min-w-[1600px]" style={{ tableLayout: 'fixed' }}>
                         <thead className="border-b border-gray-200 sticky top-0 z-20" style={{ backgroundColor: '#DFE7F3' }}>
                         <tr>
                           {['Sr. No.', 'Item', 'Description', 'SKU', 'UOM', 'Discount', 'Tax', 'Quantity', 'Cost', 'Total', 'AI Conf%'].map((header, index) => (
                             <th key={header} className={`px-4 py-2 text-left text-sm font-semibold text-foreground ${
                               header === 'Sr. No.' ? 'w-16' :
                               header === 'Item' ? 'w-[220px]' : 
                               header === 'Description' ? 'w-[200px]' : 
                               header === 'SKU' ? 'w-24' :
                               header === 'UOM' ? 'w-20' :
                               header === 'Discount' || header === 'Tax' ? 'w-28' :
                               header === 'Quantity' ? 'w-24' :
                               header === 'Cost' ? 'w-28' :
                               header === 'Total' ? 'w-32' :
                               header === 'AI Conf%' ? 'w-20' : 'w-auto'
                             }`} style={{ borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>
                               {header}
                             </th>
                           ))}
                         </tr>
                       </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[1, 2, 3, 4, 5].map((i) => (
                              <tr key={i} className="h-10 hover:bg-muted/50 transition-colors">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((j) => (
                              <td key={j} className="px-4 py-2">
                                <div className="h-6 bg-muted animate-pulse rounded"></div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                     </table>
                    </div>
                  ) : (
                    <div className="overflow-auto max-h-[600px] cursor-grab active:cursor-grabbing scrollbar-hide hover:scrollbar-show"
                      style={{ 
                        scrollBehavior: 'smooth'
                      }}
                      onMouseDown={(e) => {
                        const scrollContainer = e.currentTarget;
                        const startX = e.pageX - scrollContainer.offsetLeft;
                        const scrollLeft = scrollContainer.scrollLeft;
                        
                        const handleMouseMove = (e: MouseEvent) => {
                          const x = e.pageX - scrollContainer.offsetLeft;
                          const walk = (x - startX) * 2;
                          scrollContainer.scrollLeft = scrollLeft - walk;
                        };
                        
                        const handleMouseUp = () => {
                          document.removeEventListener('mousemove', handleMouseMove);
                          document.removeEventListener('mouseup', handleMouseUp);
                        };
                        
                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                      }}
                    >
                          <table className="w-full min-w-[1600px]" style={{ tableLayout: 'fixed' }}>
                         <thead className="border-b border-gray-200 sticky top-0 z-20" style={{ backgroundColor: '#DFE7F3' }}>
                           <tr>
                             {allLineItemKeys.map(key => (
                               <th key={key} className={`px-4 py-2 text-left font-semibold text-sm text-foreground h-12 border-b border-t ${
                                 key === 'srNo' ? 'w-16' :
                                 key === 'item' ? 'w-[220px]' : 
                                 key === 'description' ? 'w-[200px]' : 
                                 key === 'sku' ? 'w-24' :
                                 key === 'uom' ? 'w-20' :
                                 key === 'discount' || key === 'tax' ? 'w-28' :
                                 key === 'quantity' ? 'w-24' :
                                 key === 'cost' ? 'w-28' :
                                 key === 'total' ? 'w-32' : 'w-auto'
                               }`} style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>
                                 {getFieldLabel(key)}
                               </th>
                             ))}
                              <th className="px-4 py-2 text-left font-semibold text-sm text-foreground h-12 border-b border-t w-20" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>
                                AI Conf%
                              </th>
                              {isLineItemsEditMode && (
                                <th className="px-4 py-2 text-left font-semibold text-sm text-foreground h-12 border-b border-t w-16 sticky right-0 z-10 border-l border-gray-200" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>
                                  Actions
                                </th>
                              )}
                           </tr>
                         </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {lineItems.map((item, idx) => {
                            const confidence = item.confidence || 0;
                            let confidenceClass = '';
                            
                            if (confidence >= 95) {
                              confidenceClass = 'text-green-700';
                            } else if (confidence >= 85) {
                              confidenceClass = 'text-orange-700';
                            } else {
                              confidenceClass = 'text-red-700';
                            }

                             return (
                               <tr 
                                 key={idx} 
                                   className="h-10 hover:bg-muted/50 transition-colors"
                                 onMouseEnter={() => setHoveredFieldId(`lineitem-${idx}`)}
                                 onMouseLeave={() => setHoveredFieldId(null)}
                               >
                                 {allLineItemKeys.map(key => (
                                  <td key={key} className={`px-4 py-2 ${
                                    key === 'srNo' ? 'w-16' :
                                    key === 'item' ? 'w-[220px]' : 
                                    key === 'description' ? 'w-[200px]' : 
                                    key === 'sku' ? 'w-24' :
                                    key === 'uom' ? 'w-20' :
                                    key === 'discount' || key === 'tax' ? 'w-28' :
                                    key === 'quantity' ? 'w-24' :
                                    key === 'cost' ? 'w-28' :
                                    key === 'total' ? 'w-32' : 'w-auto'
                                  }`}>
                                    {key === 'srNo' ? (
                                      <span className="text-sm text-gray-900">{idx + 1}</span>
                                     ) : isLineItemsEditMode ? (
                                       <Input
                                         value={item[key] || ''}
                                         onChange={(e) => handleLineItemChange(idx, key, e.target.value)}
                                         className={`border border-input focus:border-primary h-9 text-sm px-2 py-2 ${
                                           key === 'discount' || key === 'tax' ? 'font-semibold text-foreground' : ''
                                         }`}
                                       />
                                     ) : (
                                       <span className="text-sm text-gray-900 px-1 py-1 block">
                                         {item[key] || ''}
                                       </span>
                                     )}
                                  </td>
                                ))}
                                 <td className="px-4 py-2 w-20">
                                   <span className={`text-xs font-medium ${confidenceClass}`}>
                                     {confidence}%
                                   </span>
                                 </td>
                                 {isLineItemsEditMode && (
                                       <td className="px-4 py-2 w-16 sticky right-0 bg-white z-10 border-l border-gray-200 hover:bg-muted/50">
                                         <Button
                                           size="sm"
                                           variant="outline"
                                           onClick={() => handleDeleteLineItem(idx)}
                                           className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                         >
                                           <Trash2 className="w-3 h-3" />
                                         </Button>
                                       </td>
                                 )}
                              </tr>
                             );
                           })}
                         </tbody>
                       </table>
                     </div>
                   )}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
      
      {/* Add Line Item Dialog */}
      <AddLineItemDialog
        isOpen={isAddLineItemDialogOpen}
        onClose={() => setIsAddLineItemDialogOpen(false)}
        onAddLineItem={handleAddLineItemFromDialog}
        existingItems={lineItems}
      />
    </div>
  );
};

export default DocumentPreviewPage;