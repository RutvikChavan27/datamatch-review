
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Download, Trash2, RefreshCw, MoreVertical, Eye, EyeOff, Edit, Package, Building, Calendar, DollarSign, FileText, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const PurchaseOrderQueueDetail = () => {
  const { id } = useParams();
  const [showPreview, setShowPreview] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Sample PO data matching the uploaded document structure
  const [poData] = useState({
    id: 'PO-332344',
    poNumber: '332344',
    date: '07-29-2019',
    email: 'accounting@bang.com',
    phone: '+1 92818477',
    vendor: {
      name: 'BANGBANG MOVERS',
      contact: 'Bran Dawn',
      address: '1001, Blue County, Jacksonville, Florida'
    },
    deliveredTo: {
      name: 'BONBONG PRETZEL',
      contact: 'Eugen Paul',
      phone: '+1 988332244',
      address: '0077, Yellow County, Jacksonville, Florida'
    },
    subtotal: 5000.00,
    grandTotal: 5000.00,
    status: 'pending_review',
    priority: 'high',
    paymentTerms: 'PAYMENT WILL ONLY BE PROCESSED AFTER ALL ITEMS ARE INSPECTED',
    termsAndConditions: 'All Items must be delivered in undamaged conditions and in a punctual manner'
  });

  // Line items from the document
  const lineItems = [
    {
      id: 1,
      item: 'Small Parcel Unit',
      quantity: 1000,
      cost: 5.00,
      total: 5000.00
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_review: { color: 'bg-blue-50 text-blue-600', label: 'Pending Review' },
      in_review: { color: 'bg-yellow-50 text-yellow-600', label: 'In Review' },
      approved: { color: 'bg-green-50 text-green-600', label: 'Approved' },
      rejected: { color: 'bg-red-50 text-red-600', label: 'Rejected' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending_review;
    
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
                  <Link to="/documents/purchase-orders">Purchase Orders</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>PO-{poData.poNumber}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Purchase Order: PO-{poData.poNumber}
                </h1>
                {getStatusBadge(poData.status)}
              </div>
            </div>
            <div className="flex space-x-2">
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
          {/* PO Document Preview (60% when shown) */}
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
                      src="/lovable-uploads/8d20aef4-a52a-4ed0-81da-2967f1edeb99.png" 
                      alt="Purchase Order Document"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* PO Information Panel - Responsive width */}
          <div className={cn(
            "flex flex-col transition-all duration-300",
            showPreview ? "w-[40%]" : "w-full"
          )}>
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Purchase Order Header Information */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Purchase Order Information
                  </CardTitle>
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
                        <Input value={poData.poNumber} className="mt-1" />
                      ) : (
                        <div className="mt-1 text-sm text-gray-900 font-semibold">
                          {poData.poNumber}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Date</Label>
                      {isEditMode ? (
                        <Input value={poData.date} className="mt-1" />
                      ) : (
                        <div className="mt-1 text-sm text-gray-900">
                          {poData.date}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Email</Label>
                      {isEditMode ? (
                        <Input value={poData.email} className="mt-1" />
                      ) : (
                        <div className="mt-1 text-sm text-gray-900">
                          {poData.email}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Phone</Label>
                      {isEditMode ? (
                        <Input value={poData.phone} className="mt-1" />
                      ) : (
                        <div className="mt-1 text-sm text-gray-900">
                          {poData.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vendor Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Vendor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Company Name</Label>
                    <div className="mt-1 text-sm text-gray-900 font-semibold">
                      {poData.vendor.name}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Contact Person</Label>
                    <div className="mt-1 text-sm text-gray-900">
                      {poData.vendor.contact}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Address</Label>
                    <div className="mt-1 text-sm text-gray-900">
                      {poData.vendor.address}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Delivered To
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Company Name</Label>
                    <div className="mt-1 text-sm text-gray-900 font-semibold">
                      {poData.deliveredTo.name}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Contact Person</Label>
                    <div className="mt-1 text-sm text-gray-900">
                      {poData.deliveredTo.contact}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Phone</Label>
                    <div className="mt-1 text-sm text-gray-900">
                      {poData.deliveredTo.phone}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Address</Label>
                    <div className="mt-1 text-sm text-gray-900">
                      {poData.deliveredTo.address}
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
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lineItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.item}</TableCell>
                          <TableCell>{item.quantity.toLocaleString()}</TableCell>
                          <TableCell>{formatCurrency(item.cost)}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(item.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {/* Order Summary */}
                  <div className="border-t p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal:</span>
                      <span className="font-medium">{formatCurrency(poData.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Grand Total:</span>
                      <span>{formatCurrency(poData.grandTotal)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Terms */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Payment Terms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-900">
                    {poData.paymentTerms}
                  </div>
                </CardContent>
              </Card>

              {/* Terms and Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle>Terms and Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-900">
                    {poData.termsAndConditions}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderQueueDetail;
