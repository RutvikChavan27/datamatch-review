import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Download, Trash2, RefreshCw, MoreVertical, Edit, Send, Undo2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DocumentPreviewPanel from './DocumentPreviewPanel';
import ShowHidePreviewButton from './ShowHidePreviewButton';

const InvoiceDetail = () => {
  const { id } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [approvedForDataMatch, setApprovedForDataMatch] = useState(false);
  
  // Sample invoice data
  const [invoiceData, setInvoiceData] = useState({
    id: 'INV-001234',
    invoiceNumber: 'INV-2024-0456',
    vendor: 'Acme Corporation',
    documentSet: 'DS-000123',
    amount: 12345.67,
    glCode: '4000-001',
    uploadDate: '2024-01-15',
    uploadedBy: 'John Smith',
    status: 'ready-for-data-match',
    description: 'Office supplies and equipment',
    dueDate: '2024-02-14',
    taxAmount: 1234.57,
    netAmount: 11111.10,
    paymentTerms: 'Net 30',
    vendorEmail: 'billing@acmecorp.com',
    documentUrl: '/lovable-uploads/8d20aef4-a52a-4ed0-81da-2967f1edeb99.png',
    readyForMatchAt: '2024-01-16T10:30:00Z',
    readyForMatchBy: 'John Smith',
    approvedForDataMatchAt: null,
    approvedForDataMatchBy: null
  });

  // Line items from the invoice with GL codes
  const lineItems = [
    {
      id: 1,
      sku: 'OFF-001',
      description: 'Office Chairs (Executive)',
      quantity: 5,
      unitOfMeasure: 'Each',
      unitPrice: 299.99,
      total: 1499.95,
      glCode: '4100-001'
    },
    {
      id: 2,
      sku: 'DSK-002',
      description: 'Standing Desks',
      quantity: 3,
      unitOfMeasure: 'Each',
      unitPrice: 599.99,
      total: 1799.97,
      glCode: '4100-002'
    },
    {
      id: 3,
      sku: 'LAP-003',
      description: 'Laptop Computers',
      quantity: 2,
      unitOfMeasure: 'Each',
      unitPrice: 1299.99,
      total: 2599.98,
      glCode: '4200-001'
    }
  ];

  const handleApprovalToggle = (checked: boolean) => {
    setApprovedForDataMatch(checked);
    const currentUser = 'Current User'; // In a real app, get from auth context
    const now = new Date().toISOString();
    
    setInvoiceData(prev => ({
      ...prev,
      approvedForDataMatchAt: checked ? now : null,
      approvedForDataMatchBy: checked ? currentUser : null
    }));
  };

  return (
    <div className="h-full bg-background">
      {/* Breadcrumb */}
      <div className="px-6 py-4 border-b">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/documents/invoices">Invoices</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{invoiceData.invoiceNumber}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              Invoice Detail: {invoiceData.invoiceNumber}
            </h1>
          </div>
          <div className="flex space-x-2">
            <ShowHidePreviewButton
              previewVisible={previewVisible}
              onClick={() => setPreviewVisible(!previewVisible)}
            />
              {invoiceData.status === 'ready-for-data-match' && (
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

      {/* Main Content with Split Layout */}
      <div className="flex flex-col md:flex-row gap-4 p-6">
        {/* Document Preview Panel */}
        {previewVisible && (
          <div className="w-full md:w-[45%] mb-4 md:mb-0">
            <DocumentPreviewPanel
              docUrl={invoiceData.documentUrl}
              docName={`${invoiceData.invoiceNumber}.pdf`}
              onHide={() => setPreviewVisible(false)}
            />
          </div>
        )}

        {/* Content Panel */}
        <div className={`w-full ${previewVisible ? "md:w-[55%]" : "md:w-full"} space-y-6`}>
          {/* Invoice Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Invoice Information</CardTitle>
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
                  <Label className="text-sm font-medium text-muted-foreground">Invoice Number</Label>
                  {isEditMode ? (
                    <Input value={invoiceData.invoiceNumber} className="mt-1" />
                  ) : (
                    <div className="mt-1 text-sm">
                      {invoiceData.invoiceNumber}
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  {isEditMode ? (
                    <Input value={invoiceData.status} className="mt-1" />
                  ) : (
                    <div className="mt-1 text-sm capitalize">
                      {invoiceData.status}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Vendor</Label>
                  {isEditMode ? (
                    <Input value={invoiceData.vendor} className="mt-1" />
                  ) : (
                    <div className="mt-1 text-sm">
                      {invoiceData.vendor}
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Upload Date</Label>
                  {isEditMode ? (
                    <Input value={invoiceData.uploadDate} className="mt-1" />
                  ) : (
                    <div className="mt-1 text-sm">
                      {invoiceData.uploadDate}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">GL Code</Label>
                  {isEditMode ? (
                    <Input value={invoiceData.glCode} className="mt-1" />
                  ) : (
                    <div className="mt-1 text-sm">
                      {invoiceData.glCode}
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Total Amount</Label>
                  {isEditMode ? (
                    <Input value={`$${invoiceData.amount.toFixed(2)}`} className="mt-1" />
                  ) : (
                    <div className="mt-1 text-sm font-semibold">
                      ${invoiceData.amount.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                {isEditMode ? (
                  <Input value={invoiceData.description} className="mt-1" />
                ) : (
                  <div className="mt-1 text-sm">
                    {invoiceData.description}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Uploaded By</Label>
                  {isEditMode ? (
                    <Input value={invoiceData.uploadedBy} className="mt-1" />
                  ) : (
                    <div className="mt-1 text-sm">
                      {invoiceData.uploadedBy}
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Due Date</Label>
                  {isEditMode ? (
                    <Input value={invoiceData.dueDate} className="mt-1" />
                  ) : (
                    <div className="mt-1 text-sm">
                      {invoiceData.dueDate}
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
                    <TableHead>GL Code</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.sku}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unitOfMeasure}</TableCell>
                      <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="font-mono text-sm">{item.glCode}</TableCell>
                      <TableCell className="font-medium">${item.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Data Match Status Section */}
          {invoiceData.status === 'ready-for-data-match' && (
            <Card>
              <CardHeader>
                <CardTitle>Data Match Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Current Status</Label>
                  <div className="mt-1 text-sm">Ready for Data Match</div>
                </div>
                {invoiceData.readyForMatchAt && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Marked Ready At</Label>
                      <div className="mt-1 text-sm">
                        {new Date(invoiceData.readyForMatchAt).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Marked Ready By</Label>
                      <div className="mt-1 text-sm">{invoiceData.readyForMatchBy}</div>
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
                        setInvoiceData(prev => ({
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
                     {approvedForDataMatch && invoiceData.approvedForDataMatchAt && (
                       <div className="grid grid-cols-2 gap-4 mt-4">
                         <div>
                           <Label className="text-sm font-medium text-muted-foreground">Approved At</Label>
                           <div className="mt-1 text-sm">
                             {new Date(invoiceData.approvedForDataMatchAt).toLocaleString()}
                           </div>
                         </div>
                         <div>
                           <Label className="text-sm font-medium text-muted-foreground">Approved By</Label>
                           <div className="mt-1 text-sm">{invoiceData.approvedForDataMatchBy}</div>
                         </div>
                       </div>
                     )}
                <p className="text-sm text-muted-foreground">
                  Review extracted information and send to matching engine
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
