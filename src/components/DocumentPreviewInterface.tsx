
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { X, Download, Printer, ZoomIn, ZoomOut, Maximize, RefreshCw, Eye, FileText, Upload, Trash2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BoundingBox from './BoundingBox';

interface DocumentPreviewInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  documentSet: {
    id: string;
    poNumber: string;
    vendor: string;
    documents: Array<{
      id: string;
      name: string;
      type: string;
      url: string;
    }>;
  };
}

interface ExtractedField {
  value: string;
  confidence: number;
}

interface LineItem {
  item: string;
  quantity: string;
  cost?: string;
  total?: string;
  weight?: string;
  condition?: string;
  confidence: number;
  fromDocument: string;
}

interface ExtractedData {
  metadata: Record<string, ExtractedField>;
  lineItems: LineItem[];
}

const DocumentPreviewInterface: React.FC<DocumentPreviewInterfaceProps> = ({
  isOpen,
  onClose,
  documentSet
}) => {
  // Multi-document management
  const [activeDocumentTab, setActiveDocumentTab] = useState<'all' | 'po' | 'invoice' | 'grn'>('all');
  const [activeDocIndexByTab, setActiveDocIndexByTab] = useState<{ [tab: string]: number }>({
    po: 0,
    invoice: 0,
    grn: 0
  });

  // Document filter for extracted info view
  const [extractedInfoFilter, setExtractedInfoFilter] = useState<string>('all');
  const [zoom, setZoom] = useState(100);

  // Simulate grouped documents per tab with multiple documents
  const docsByTab: { [key: string]: Array<{ id: string; name: string; type: string; url: string }> } = {
    po: [
      { id: 'po-001', name: 'PO-332344.pdf', type: 'Purchase Order', url: '/lovable-uploads/00aad332-2016-4d6e-a7be-aca80f0f4d7f.png' },
      { id: 'po-002', name: 'PO-332344-revised.pdf', type: 'Purchase Order', url: '/lovable-uploads/40a647b5-00f5-4bd4-825e-8b58cca2e7c2.png' }
    ],
    invoice: [
      { id: 'inv-001', name: 'INV-005.pdf', type: 'Invoice', url: '/lovable-uploads/dd02edfb-b909-4512-a7c0-542a9b5663b1.png' },
      { id: 'inv-002', name: 'INV-005-corrected.pdf', type: 'Invoice', url: '/lovable-uploads/dd02edfb-b909-4512-a7c0-542a9b5663b1.png' }
    ],
    grn: [
      { id: 'grn-001', name: 'GRN-123456.pdf', type: 'GRN', url: '/lovable-uploads/9350d5be-a2a4-40bf-bed5-2cfe0c53c749.png' }
    ]
  };

  // Get all documents for "all" tab, or specific tab documents
  const getAllDocs = () => [...docsByTab.po, ...docsByTab.invoice, ...docsByTab.grn];
  const currentDocs = activeDocumentTab === 'all' ? getAllDocs() : docsByTab[activeDocumentTab];
  const currentDocIndex = activeDocumentTab === 'all' ? 0 : (activeDocIndexByTab[activeDocumentTab] || 0);
  const currentDocument = currentDocs[currentDocIndex] ?? currentDocs[0];

  // Enhanced extracted data with multiple documents
  const extractedDataByDoc: Record<string, ExtractedData> = {
    'po-001': {
      metadata: {
        poNumber: { value: '332344', confidence: 95 },
        vendor: { value: 'BANGBANG MOVERS', confidence: 92 },
        date: { value: '07-29-2019', confidence: 78 },
        total: { value: '$5,000.00', confidence: 98 }
      },
      lineItems: [
        { item: 'Small Parcel Unit', quantity: '1000', cost: '$5.00', total: '$5,000.00', confidence: 94, fromDocument: 'PO-332344.pdf' },
        { item: 'Large Parcel Unit', quantity: '350', cost: '$15.00', total: '$5,250.00', confidence: 90, fromDocument: 'PO-332344.pdf' }
      ]
    },
    'po-002': {
      metadata: {
        poNumber: { value: '332344-R1', confidence: 97 },
        vendor: { value: 'BANGBANG MOVERS', confidence: 94 },
        date: { value: '08-01-2019', confidence: 85 },
        total: { value: '$5,200.00', confidence: 96 }
      },
      lineItems: [
        { item: 'Small Parcel Unit', quantity: '1000', cost: '$5.00', total: '$5,000.00', confidence: 96, fromDocument: 'PO-332344-revised.pdf' },
        { item: 'Express Shipping', quantity: '1', cost: '$200.00', total: '$200.00', confidence: 95, fromDocument: 'PO-332344-revised.pdf' }
      ]
    },
    'inv-001': {
      metadata: {
        invoiceNumber: { value: 'INV-005', confidence: 96 },
        vendor: { value: 'Ad4tech Material LLC', confidence: 65 },
        total: { value: '$1,564.00', confidence: 94 }
      },
      lineItems: [
        { item: 'Desktop furniture', quantity: '1', cost: '$232.00', total: '$232.00', confidence: 82, fromDocument: 'INV-005.pdf' },
        { item: 'Plumbing services', quantity: '2', cost: '$514.00', total: '$1,028.00', confidence: 80, fromDocument: 'INV-005.pdf' }
      ]
    },
    'inv-002': {
      metadata: {
        invoiceNumber: { value: 'INV-005-C', confidence: 98 },
        vendor: { value: 'Ad4tech Material LLC', confidence: 88 },
        total: { value: '$1,664.00', confidence: 97 }
      },
      lineItems: [
        { item: 'Desktop furniture', quantity: '1', cost: '$232.00', total: '$232.00', confidence: 85, fromDocument: 'INV-005-corrected.pdf' },
        { item: 'Plumbing services', quantity: '2', cost: '$514.00', total: '$1,028.00', confidence: 83, fromDocument: 'INV-005-corrected.pdf' },
        { item: 'Additional materials', quantity: '1', cost: '$404.00', total: '$404.00', confidence: 91, fromDocument: 'INV-005-corrected.pdf' }
      ]
    },
    'grn-001': {
      metadata: {
        jobNumber: { value: 'JN-123456', confidence: 88 },
        receivedFrom: { value: 'PT Sumber Logistik', confidence: 91 },
        date: { value: '9 January 2025', confidence: 76 }
      },
      lineItems: [
        { item: 'Laptop Dell Inspiron', quantity: '5', weight: '10 kg', condition: 'Good', confidence: 91, fromDocument: 'GRN-123456.pdf' },
        { item: 'Printer HP LaserJet', quantity: '3', weight: '30 kg', condition: 'Good', confidence: 89, fromDocument: 'GRN-123456.pdf' }
      ]
    }
  };

  // Get extracted data for current document or all documents
  const getCurrentExtractedData = (): ExtractedData => {
    if (extractedInfoFilter === 'all') {
      // Merge data from all documents in current tab
      const allData = currentDocs.map(doc => extractedDataByDoc[doc.id]).filter(Boolean);
      return {
        metadata: allData[0]?.metadata || {},
        lineItems: allData.flatMap(data => data.lineItems || [])
      };
    } else {
      // Get data for specific document
      const selectedDoc = currentDocs.find(doc => doc.name === extractedInfoFilter);
      return selectedDoc ? extractedDataByDoc[selectedDoc.id] || { metadata: {}, lineItems: [] } : { metadata: {}, lineItems: [] };
    }
  };

  const currentExtractedData = getCurrentExtractedData();

  const handleUploadDoc = () => {
    const fakeId = `${activeDocumentTab}-new-doc-${Date.now()}`;
    const newDoc = {
      id: fakeId,
      name: `New ${activeDocumentTab.toUpperCase()} Document.pdf`,
      type: activeDocumentTab === 'po' ? 'Purchase Order' : activeDocumentTab === 'invoice' ? 'Invoice' : 'GRN',
      url: '/lovable-uploads/c24bf7a8-2cc8-4ae6-9497-8bc1716e1451.png'
    };
    docsByTab[activeDocumentTab].push(newDoc);
    setActiveDocIndexByTab(prev => ({ ...prev, [activeDocumentTab]: docsByTab[activeDocumentTab].length - 1 }));
  };

  const handleRemoveDoc = () => {
    if (currentDocs.length === 1) return;
    const index = currentDocIndex;
    docsByTab[activeDocumentTab].splice(index, 1);
    setActiveDocIndexByTab(prev => ({
      ...prev,
      [activeDocumentTab]: Math.max(0, index - 1)
    }));
  };

  const getConfidenceBadge = (confidence: number) => {
    const confidenceBadgeClass = confidence >= 90 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : confidence >= 70 
      ? 'bg-yellow-100 text-yellow-800 border-yellow-200' 
      : 'bg-red-100 text-red-800 border-red-200';
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full border font-medium ${confidenceBadgeClass}`}>
        {confidence}%
      </span>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
        <div className="flex flex-col h-[95vh]">
          {/* Header */}
          <div className="h-16 border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Document Set {documentSet.id} | {documentSet.vendor}
                </h1>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-1" />
                  Print
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Document Tabs and Content */}
          <div className="flex-1 flex overflow-hidden">
            <Tabs value={activeDocumentTab} onValueChange={(value: any) => setActiveDocumentTab(value)} className="flex-1 flex flex-col">
              {/* Tab Navigation */}
              <div className="secondary-tabs px-6">
                <button 
                  className={activeDocumentTab === 'all' ? 'secondary-tab secondary-tab-selected' : 'secondary-tab secondary-tab-inactive'}
                  onClick={() => setActiveDocumentTab('all')}
                >
                  ALL DOCS
                </button>
                <button 
                  className={activeDocumentTab === 'po' ? 'secondary-tab secondary-tab-selected' : 'secondary-tab secondary-tab-inactive'}
                  onClick={() => setActiveDocumentTab('po')}
                >
                  PURCHASE ORDER
                  <span className="secondary-count-badge">{docsByTab.po.length}</span>
                </button>
                <button 
                  className={activeDocumentTab === 'invoice' ? 'secondary-tab secondary-tab-selected' : 'secondary-tab secondary-tab-inactive'}
                  onClick={() => setActiveDocumentTab('invoice')}
                >
                  INVOICE
                  <span className="secondary-count-badge">{docsByTab.invoice.length}</span>
                </button>
                <button 
                  className={activeDocumentTab === 'grn' ? 'secondary-tab secondary-tab-selected' : 'secondary-tab secondary-tab-inactive'}
                  onClick={() => setActiveDocumentTab('grn')}
                >
                  GOODS RECEIPT NOTES
                  <span className="secondary-count-badge">{docsByTab.grn.length}</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 flex overflow-hidden border border-gray-200 border-t-0 bg-white">
                <TabsContent value={activeDocumentTab} className="flex-1 flex m-0 p-0">
                  {/* Document Viewer (40% width) */}
                  <div className="w-[40%] flex flex-col border-r border-gray-200 relative">
                    {/* Multi document selector */}
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600">Documents:</span>
                        <div className="flex space-x-1">
                          {currentDocs.map((doc, idx) => (
                            <Button
                              key={doc.id}
                              variant={currentDocIndex === idx ? "default" : "outline"}
                              size="sm"
                              className="h-7 text-xs px-2"
                              onClick={() => setActiveDocIndexByTab(prev => ({ ...prev, [activeDocumentTab]: idx }))}
                            >
                              {doc.name.replace('.pdf', '')}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          onClick={handleUploadDoc}
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-green-600"
                          title="Upload New Document"
                        >
                          <Upload className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={handleRemoveDoc}
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-red-600"
                          title="Remove Current Document"
                          disabled={currentDocs.length === 1}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Document Header */}
                    <div className="h-12 border-b border-gray-200 px-4 py-2 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-gray-900 truncate">
                          {currentDocument?.name || 'No Document Selected'}
                        </div>
                        
                        {/* Zoom Controls */}
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => setZoom(Math.max(50, zoom - 25))}
                          >
                            <ZoomOut className="w-3 h-3" />
                          </Button>
                          <span className="text-xs text-gray-600 px-2">{zoom}%</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => setZoom(Math.min(200, zoom + 25))}
                          >
                            <ZoomIn className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs px-2 ml-2"
                            onClick={() => setZoom(100)}
                          >
                            Fit
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Document Display */}
                    <div className="flex-1 overflow-auto p-4" style={{ backgroundColor: '#212C4C' }}>
                      <div className="relative bg-white shadow-lg" style={{ minHeight: '400px', transform: `scale(${zoom/100})`, transformOrigin: 'top left' }}>
                        {currentDocument && (
                          <img
                            src={currentDocument.url}
                            alt={currentDocument.name}
                            className="w-full h-auto"
                            style={{ minHeight: '300px', objectFit: 'contain' }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Info Panel (60% width) */}
                  <div className="w-[60%] border-l border-gray-200 bg-white flex flex-col">
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-900">Extracted Information</h3>
                      
                      {/* Document Filter Dropdown */}
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600">View data from:</span>
                        <Select value={extractedInfoFilter} onValueChange={setExtractedInfoFilter}>
                          <SelectTrigger className="w-48 h-8 text-xs">
                            <SelectValue />
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
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {/* Document Metadata */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Document Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="grid grid-cols-2 gap-x-6 gap-y-1 px-3 py-2">
                            {Object.entries(currentExtractedData.metadata).map(([key, data]) => (
                              <div className="flex items-center text-xs border-b border-gray-100 py-1 min-h-[2.25rem]" key={key}>
                                <span className="text-xs text-gray-600 capitalize whitespace-nowrap w-[110px] flex-shrink-0">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                                </span>
                                <input
                                  className="border px-1 py-0 rounded text-xs w-32 mx-2 flex-shrink"
                                  value={data.value}
                                  readOnly
                                  style={{ fontWeight: 500 }}
                                />
                                <span className={`
                                  ml-2 text-xs px-2 py-1 rounded-full border font-medium
                                  ${data.confidence >= 90 ? 'bg-green-100 text-green-800 border-green-200' : data.confidence >= 70 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-red-100 text-red-800 border-red-200'}
                                `} style={{ minWidth: '2.5rem', display: 'inline-block', textAlign: 'center' }}>
                                  {data.confidence}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Line Items Table */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">
                            Line Items {extractedInfoFilter !== 'all' && `(from ${extractedInfoFilter})`}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50">
                                <TableHead className="text-xs font-medium">Item</TableHead>
                                <TableHead className="text-xs font-medium">Qty</TableHead>
                                <TableHead className="text-xs font-medium">Cost</TableHead>
                                <TableHead className="text-xs font-medium text-right">Total</TableHead>
                                {extractedInfoFilter === 'all' && (
                                  <TableHead className="text-xs font-medium">From Document</TableHead>
                                )}
                                <TableHead className="text-xs font-medium text-center">Conf%</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {currentExtractedData.lineItems.map((item, index) => (
                                <TableRow key={index} className="text-xs">
                                  <TableCell className="font-medium">
                                    <input
                                      className="border px-1 py-0 rounded text-xs w-32"
                                      value={item.item}
                                      readOnly
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <input
                                      className="border px-1 py-0 rounded text-xs w-12"
                                      value={item.quantity}
                                      readOnly
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <input
                                      className="border px-1 py-0 rounded text-xs w-16"
                                      value={item.cost || item.weight || '-'}
                                      readOnly
                                    />
                                  </TableCell>
                                  <TableCell className="font-medium text-right">
                                    <input
                                      className="border px-1 py-0 rounded text-xs w-16 text-right"
                                      value={item.total || item.condition || '-'}
                                      readOnly
                                    />
                                  </TableCell>
                                  {extractedInfoFilter === 'all' && (
                                    <TableCell className="text-xs">
                                      <span className="truncate max-w-[110px] block">
                                        {item.fromDocument}
                                      </span>
                                    </TableCell>
                                  )}
                                  <TableCell className="text-center">
                                    {getConfidenceBadge(item.confidence)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          <div className="border-t p-3 bg-gray-50">
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>Total items: {currentExtractedData.lineItems.length}</div>
                              <div>
                                Average confidence: {currentExtractedData.lineItems.length
                                  ? Math.round(currentExtractedData.lineItems.reduce((sum, item) => sum + (item.confidence || 0), 0) / currentExtractedData.lineItems.length)
                                  : 0
                                }%
                              </div>
                              {extractedInfoFilter === 'all' && currentDocs.length > 1 && (
                                <div>Documents included: {currentDocs.length}</div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewInterface;
