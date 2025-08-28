import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Download, Trash2, RefreshCw, MoreVertical, Eye, EyeOff, Edit, Send, Undo2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';

const GoodsReceiptNoteDetail = () => {
  const { id } = useParams();
  const [showPreview, setShowPreview] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [approvedForDataMatch, setApprovedForDataMatch] = useState(false);
  
  // Sample POD data
  const [podData, setPodData] = useState({
    id: 'POD-001234',
    podNumber: 'POD-2024-0456',
    vendor: 'Acme Corporation',
    receiptDate: '2024-01-15',
    poReference: 'PO-2024-0456',
    total: 12345.67,
    status: 'ready-for-data-match',
    deliveryAddress: '123 Main Street, City, State 12345',
    receivedBy: 'John Smith',
    deliveryNotes: 'Package delivered in good condition',
    readyForMatchAt: '2024-01-16T11:45:00Z',
    readyForMatchBy: 'Emily Chen',
    approvedForDataMatchAt: null,
    approvedForDataMatchBy: null
  });

  // OCR scanned line items from the document
  const ocrLineItems = [
    {
      id: 1,
      sku: 'OFF-001',
      description: 'Office Supplies - Pens, Paper, Clips',
      quantity: 10,
      unitOfMeasure: 'Box',
      unitPrice: 15.50,
      total: 155.00
    },
    {
      id: 2,
      sku: 'LAP-002',
      description: 'Dell Latitude 7420 Laptop',
      quantity: 2,
      unitOfMeasure: 'Each',
      unitPrice: 1250.00,
      total: 2500.00
    },
    {
      id: 3,
      sku: 'MON-003',
      description: '24" LED Monitor',
      quantity: 4,
      unitOfMeasure: 'Each',
      unitPrice: 299.99,
      total: 1199.96
    }
  ];

  const handleApprovalToggle = (checked: boolean) => {
    setApprovedForDataMatch(checked);
    const currentUser = 'Current User'; // In a real app, get from auth context
    const now = new Date().toISOString();
    
    setPodData(prev => ({
      ...prev,
      approvedForDataMatchAt: checked ? now : null,
      approvedForDataMatchBy: checked ? currentUser : null
    }));
  };

  return (
    <div className="h-full flex bg-white">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Breadcrumb */}
        <div className="px-6 py-4 border-b border-gray-200">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/documents/goods-receipt-notes">Proof of Delivery</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{podData.podNumber}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Proof of Delivery Detail: {podData.podNumber}
              </h1>
            </div>
            <div className="flex space-x-2">
              {podData.status === 'ready-for-data-match' && (
                <div className="flex items-center space-x-2">
                  <Label htmlFor="approve-toggle" className="text-sm font-medium">
                    {approvedForDataMatch ? "Approved for Data Match" : "Approve for Data Match"}
                  </Label>
                  <Switch
                    id="approve-toggle"
                    checked={approvedForDataMatch}
                    onCheckedChange={handleApprovalToggle}
                  />
                </div>
              )}
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Re-process OCR
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Show Preview Button (when preview is hidden) */}
        {!showPreview && (
          <div className="px-6 py-4 flex justify-center">
            <Button 
              onClick={() => setShowPreview(true)}
              variant="outline"
              className="h-6 text-xs px-2"
            >
              <Eye className="w-3 h-3 mr-1" />
              Show Preview
            </Button>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="flex-1 flex">
          {/* POD Document Preview (60% when shown) */}
          {showPreview && (
            <div className="w-[60%] p-6">
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Proof of Delivery Document</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-6 text-xs px-2"
                    >
                      Open in New Tab
                    </Button>
                    <Button 
                      onClick={() => setShowPreview(false)}
                      variant="outline"
                      size="sm" 
                      className="h-6 text-xs px-2"
                    >
                      <EyeOff className="w-3 h-3 mr-1" />
                      Hide
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="h-full p-6">
                  <div className="bg-gray-100 h-full rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <img 
                      src="/lovable-uploads/9350d5be-a2a4-40bf-bed5-2cfe0c53c749.png" 
                      alt="Goods Receipt Note Document"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* POD Information Panel - Responsive width */}
          <div className={cn(
            "flex flex-col transition-all duration-300",
            showPreview ? "w-[40%]" : "w-full"
          )}>
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Proof of Delivery Information</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditMode(!isEditMode)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">POD Number</Label>
                      {isEditMode ? (
                        <Input value={podData.podNumber} className="mt-1" />
                      ) : (
                        <div className="mt-1 text-sm text-gray-900">
                          {podData.podNumber}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Status</Label>
                      {isEditMode ? (
                        <Input value={podData.status} className="mt-1" />
                      ) : (
                        <div className="mt-1 text-sm text-gray-900 capitalize">
                          {podData.status}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Vendor</Label>
                      {isEditMode ? (
                        <Input value={podData.vendor} className="mt-1" />
                      ) : (
                        <div className="mt-1 text-sm text-gray-900">
                          {podData.vendor}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Receipt Date</Label>
                      {isEditMode ? (
                        <Input value={podData.receiptDate} className="mt-1" />
                      ) : (
                        <div className="mt-1 text-sm text-gray-900">
                          {podData.receiptDate}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">PO Reference</Label>
                      {isEditMode ? (
                        <Input value={podData.poReference} className="mt-1" />
                      ) : (
                        <div className="mt-1 text-sm text-gray-900">
                          {podData.poReference}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Total Amount</Label>
                      {isEditMode ? (
                        <Input value={`$${podData.total.toFixed(2)}`} className="mt-1" />
                      ) : (
                        <div className="mt-1 text-sm text-gray-900 font-semibold">
                          ${podData.total.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">Delivery Address</Label>
                    {isEditMode ? (
                      <Input value={podData.deliveryAddress} className="mt-1" />
                    ) : (
                      <div className="mt-1 text-sm text-gray-900">
                        {podData.deliveryAddress}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Received By</Label>
                      {isEditMode ? (
                        <Input value={podData.receivedBy} className="mt-1" />
                      ) : (
                        <div className="mt-1 text-sm text-gray-900">
                          {podData.receivedBy}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Delivery Notes</Label>
                      {isEditMode ? (
                        <Input value={podData.deliveryNotes} className="mt-1" />
                      ) : (
                        <div className="mt-1 text-sm text-gray-900">
                          {podData.deliveryNotes}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Line Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Line Items</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ocrLineItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.sku}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.unitOfMeasure}</TableCell>
                          <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                          <TableCell className="font-medium">${item.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Data Match Status Section */}
              {podData.status === 'ready-for-data-match' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Data Match Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Current Status</Label>
                      <div className="mt-1 text-sm text-gray-900">Ready for Data Match</div>
                    </div>
                    {podData.readyForMatchAt && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Marked Ready At</Label>
                          <div className="mt-1 text-sm text-gray-900">
                            {new Date(podData.readyForMatchAt).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Marked Ready By</Label>
                          <div className="mt-1 text-sm text-gray-900">{podData.readyForMatchBy}</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="approve-toggle-detail" className="text-sm font-medium">
                          {approvedForDataMatch ? "Approved for Data Match" : "Approve for Data Match"}
                        </Label>
                        <Switch
                          id="approve-toggle-detail"
                          checked={approvedForDataMatch}
                          onCheckedChange={handleApprovalToggle}
                        />
                      </div>
                      {approvedForDataMatch && (
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setApprovedForDataMatch(false);
                            setPodData(prev => ({
                              ...prev,
                              approvedForDataMatchAt: null,
                              approvedForDataMatchBy: null
                            }));
                          }}
                        >
                          <Undo2 className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                      )}
                    </div>
                     {approvedForDataMatch && podData.approvedForDataMatchAt && (
                       <div className="grid grid-cols-2 gap-4 mt-4">
                         <div>
                           <Label className="text-sm font-medium text-gray-500">Approved At</Label>
                           <div className="mt-1 text-sm text-gray-900">
                             {new Date(podData.approvedForDataMatchAt).toLocaleString()}
                           </div>
                         </div>
                         <div>
                           <Label className="text-sm font-medium text-gray-500">Approved By</Label>
                           <div className="mt-1 text-sm text-gray-900">{podData.approvedForDataMatchBy}</div>
                         </div>
                       </div>
                     )}
                    <p className="text-sm text-gray-500 mt-2">
                      Review extracted information and send to matching engine
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoodsReceiptNoteDetail;
