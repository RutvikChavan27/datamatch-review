
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ArrowLeft, ArrowRight, Download, Trash2, RefreshCw, MoreVertical, Eye, EyeOff, Edit, Send, Undo2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';

interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  documentSet: string;
  amount: number;
  glCode: string;
  createDate: string;
  createdBy: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_review' | 'ready-for-data-match';
  description?: string;
  deliveryDate?: string;
  taxAmount?: number;
  netAmount?: number;
  paymentTerms?: string;
  vendorEmail?: string;
  deliveryAddress?: string;
  readyForMatchAt?: string;
  readyForMatchBy?: string;
  approvedForDataMatchAt?: string | null;
  approvedForDataMatchBy?: string | null;
  lineItems?: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

const PurchaseOrderDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const [showPreview, setShowPreview] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [approvedForDataMatch, setApprovedForDataMatch] = useState(false);

  // Sample data - matches the structure from PurchaseOrdersList
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: 'DOC-001234',
      poNumber: 'PO-2024-0456',
      vendor: 'Tech Supplies Inc.',
      documentSet: 'DS-000123',
      amount: 15750.00,
      glCode: '6000-001',
      createDate: '2024-01-15',
      createdBy: 'John Smith',
      status: 'ready-for-data-match',
      readyForMatchAt: '2024-01-16T09:45:00Z',
      readyForMatchBy: 'Mike Davis',
      description: 'IT Equipment and Software Licenses',
      deliveryDate: '2024-02-15',
      taxAmount: 1575.00,
      netAmount: 14175.00,
      paymentTerms: 'Net 30',
      vendorEmail: 'orders@techsupplies.com',
      deliveryAddress: '123 Corporate HQ, Business City, BC 12345',
      approvedForDataMatchAt: null,
      approvedForDataMatchBy: null,
      lineItems: [
        {
          id: '1',
          description: 'Dell XPS 13 Laptop',
          quantity: 3,
          unitPrice: 1299.99,
          total: 3899.97
        },
        {
          id: '2',
          description: 'Dell 27-inch Monitor',
          quantity: 6,
          unitPrice: 399.99,
          total: 2399.94
        },
        {
          id: '3',
          description: 'Microsoft Office 365 License (Annual)',
          quantity: 10,
          unitPrice: 129.99,
          total: 1299.90
        }
      ]
    }
  ]);

  const selectedPO = purchaseOrders.find(po => po.id === id) || purchaseOrders[0];

  // Line items from the purchase order
  const lineItems = selectedPO.lineItems || [];

  const handleApprovalToggle = (checked: boolean) => {
    setApprovedForDataMatch(checked);
    const currentUser = 'Current User'; // In a real app, get from auth context
    const now = new Date().toISOString();
    
    setPurchaseOrders(prev => prev.map(po => 
      po.id === selectedPO.id 
        ? {
            ...po,
            approvedForDataMatchAt: checked ? now : null,
            approvedForDataMatchBy: checked ? currentUser : null
          }
        : po
    ));
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
                <BreadcrumbLink href="/documents/purchase-orders">Purchase Orders</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{selectedPO.poNumber}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Purchase Order Detail: {selectedPO.poNumber}
              </h1>
            </div>
            <div className="flex space-x-2">
              {selectedPO.status === 'ready-for-data-match' && (
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
          {/* Purchase Order Document Preview (60% when shown) */}
          {showPreview && (
            <div className="w-[60%] p-6">
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Purchase Order Document</CardTitle>
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
                      src="/lovable-uploads/00aad332-2016-4d6e-a7be-aca80f0f4d7f.png" 
                      alt="Purchase Order Document"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Purchase Order Information Panel - Responsive width */}
          <div className={cn(
            "flex flex-col transition-all duration-300",
            showPreview ? "w-[40%]" : "w-full"
          )}>
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Purchase Order Information</CardTitle>
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
                      <Label className="text-sm font-medium text-gray-500">PO Number</Label>
                      {isEditMode ? (
                        <Input value={selectedPO.poNumber} className="mt-1" />
                      ) : (
                        <div className="mt-1 text-sm text-gray-900">
                          {selectedPO.poNumber}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Status</Label>
                      {isEditMode ? (
                        <Input value={selectedPO.status} className="mt-1" />
                      ) : (
                        <div className="mt-1 text-sm text-gray-900 capitalize">
                          {selectedPO.status}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Vendor</Label>
                      {isEditMode ? (
                        <Input value={selectedPO.vendor} className="mt-1" />
                      ) : (
                        <div className="mt-1 text-sm text-gray-900">
                          {selectedPO.vendor}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Create Date</Label>
                      {isEditMode ? (
                        <Input value={selectedPO.createDate} className="mt-1" />
                      ) : (
                        <div className="mt-1 text-sm text-gray-900">
                          {selectedPO.createDate}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">GL Code</Label>
                      {isEditMode ? (
                        <Input value={selectedPO.glCode} className="mt-1" />
                      ) : (
                        <div className="mt-1 text-sm text-gray-900">
                          {selectedPO.glCode}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Total Amount</Label>
                      {isEditMode ? (
                        <Input value={`$${selectedPO.amount.toFixed(2)}`} className="mt-1" />
                      ) : (
                        <div className="mt-1 text-sm text-gray-900 font-semibold">
                          ${selectedPO.amount.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-500">Description</Label>
                    {isEditMode ? (
                      <Input value={selectedPO.description} className="mt-1" />
                    ) : (
                      <div className="mt-1 text-sm text-gray-900">
                        {selectedPO.description}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Created By</Label>
                      {isEditMode ? (
                        <Input value={selectedPO.createdBy} className="mt-1" />
                      ) : (
                        <div className="mt-1 text-sm text-gray-900">
                          {selectedPO.createdBy}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Delivery Date</Label>
                      {isEditMode ? (
                        <Input value={selectedPO.deliveryDate} className="mt-1" />
                      ) : (
                        <div className="mt-1 text-sm text-gray-900">
                          {selectedPO.deliveryDate}
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
                        <TableHead>Description</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lineItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.description}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                          <TableCell className="font-medium">${item.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Data Match Status Section */}
              {selectedPO.status === 'ready-for-data-match' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Data Match Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Current Status</Label>
                      <div className="mt-1 text-sm text-gray-900">Ready for Data Match</div>
                    </div>
                    {selectedPO.readyForMatchAt && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Marked Ready At</Label>
                          <div className="mt-1 text-sm text-gray-900">
                            {new Date(selectedPO.readyForMatchAt).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Marked Ready By</Label>
                          <div className="mt-1 text-sm text-gray-900">{selectedPO.readyForMatchBy}</div>
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
                            setPurchaseOrders(prev => prev.map(po => 
                              po.id === selectedPO.id 
                                ? {
                                    ...po,
                                    approvedForDataMatchAt: null,
                                    approvedForDataMatchBy: null
                                  }
                                : po
                            ));
                          }}
                        >
                          <Undo2 className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                      )}
                    </div>
                     {approvedForDataMatch && purchaseOrders.find(po => po.id === selectedPO.id)?.approvedForDataMatchAt && (
                       <div className="grid grid-cols-2 gap-4 mt-4">
                         <div>
                           <Label className="text-sm font-medium text-gray-500">Approved At</Label>
                           <div className="mt-1 text-sm text-gray-900">
                             {new Date(purchaseOrders.find(po => po.id === selectedPO.id)?.approvedForDataMatchAt!).toLocaleString()}
                           </div>
                         </div>
                         <div>
                           <Label className="text-sm font-medium text-gray-500">Approved By</Label>
                           <div className="mt-1 text-sm text-gray-900">{purchaseOrders.find(po => po.id === selectedPO.id)?.approvedForDataMatchBy}</div>
                         </div>
                       </div>
                     )}
                    <p className="text-sm text-gray-500">
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

export default PurchaseOrderDetailView;
