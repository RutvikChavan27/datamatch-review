
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ArrowLeft, ArrowRight, Printer, MessageSquare, FileText, Package, User, Building, Calendar, DollarSign, StickyNote, Check } from 'lucide-react';
import POLineItemsTab from './POLineItemsTab';
import PODocumentsTab from './PODocumentsTab';

interface POData {
  id: string;
  poNumber: string;
  title: string;
  requestor: string;
  department: string;
  amount: number;
  date: string;
  status: 'pending_review' | 'in_review' | 'approved' | 'rejected' | 'in_discussion';
  priority: 'high' | 'medium' | 'low';
  vendor?: string;
  deliveryAddress?: string;
  paymentTerms?: string;
  expectedDelivery?: string;
  requestorEmail?: string;
  notes?: string;
  lineItems?: any[];
  documents?: any[];
  discussionThread?: {
    id: string;
    author: string;
    message: string;
    timestamp: string;
  }[];
}

const PORequestDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [selectedLineItems, setSelectedLineItems] = useState<string[]>([]);
  const [newDiscussionMessage, setNewDiscussionMessage] = useState('');

  // Mock data - in real app this would come from API based on ID
  const poRequests: POData[] = [
    {
      id: '1',
      poNumber: 'PRQ-2024-001',
      title: 'New laptops for development team',
      requestor: 'John Smith',
      department: 'IT',
      amount: 15000.00,
      date: '2024-01-15',
      status: 'pending_review',
      priority: 'high',
      vendor: 'Tech Supplies Inc.',
      deliveryAddress: '123 Corporate HQ, Business City',
      paymentTerms: 'Net 30',
      expectedDelivery: 'June 15, 2024',
      requestorEmail: 'john.smith@company.com',
      notes: 'This purchase request is for the new employees joining next month. Priority items include laptops and monitors for immediate setup.',
      lineItems: [
        {
          id: 'IT-001',
          code: 'IT-001',
          description: 'Dell XPS 13 Laptop',
          quantity: 2,
          unitOfMeasure: 'Each',
          unitPrice: 1200.00,
          total: 2400.00,
          approved: false,
          status: 'pending'
        },
        {
          id: 'IT-002',
          code: 'IT-002',
          description: 'Dell 27-inch Monitor',
          quantity: 4,
          unitOfMeasure: 'Each',
          unitPrice: 350.00,
          total: 1400.00,
          approved: false,
          status: 'pending'
        }
      ],
      documents: [
        {
          id: 'doc-1',
          name: 'Purchase Requisition Form',
          type: 'PDF',
          size: '245 KB',
          uploadDate: '1/20/2024',
          pages: 3,
          previewUrl: '/lovable-uploads/40a647b5-00f5-4bd4-825e-8b58cca2e7c2.png'
        }
      ]
    },
    {
      id: '2',
      poNumber: 'PRQ-2024-002',
      title: 'Marketing materials and promotional items',
      requestor: 'Sarah Johnson',
      department: 'Marketing',
      amount: 8500.00,
      date: '2024-01-14',
      status: 'in_discussion',
      priority: 'medium',
      vendor: 'Marketing Solutions Ltd.',
      deliveryAddress: '456 Business Park, Commerce City',
      paymentTerms: 'Net 45',
      expectedDelivery: 'July 1, 2024',
      requestorEmail: 'sarah.johnson@company.com',
      notes: 'Promotional materials for the upcoming product launch event.',
      discussionThread: [
        {
          id: 'msg-1',
          author: 'Alex Wilson',
          message: 'Please verify these prices with the latest approved vendor catalog.',
          timestamp: 'January 21, 2024, 2:30 PM'
        }
      ],
      lineItems: [],
      documents: []
    },
    {
      id: '3',
      poNumber: 'PRQ-2024-003',
      title: 'Manufacturing equipment upgrade',
      requestor: 'Mike Davis',
      department: 'Operations',
      amount: 25000.00,
      date: '2024-01-13',
      status: 'approved',
      priority: 'high',
      vendor: 'Industrial Equipment Co.',
      deliveryAddress: '789 Industrial Ave, Factory Town',
      paymentTerms: 'Net 15',
      expectedDelivery: 'June 30, 2024',
      requestorEmail: 'mike.davis@company.com',
      notes: 'Critical equipment upgrade for production line efficiency.',
      lineItems: [],
      documents: []
    }
  ];

  // Find the current PO request by ID
  const selectedPORequest = poRequests.find(po => po.id === id) || poRequests[0];

  const currentIndex = poRequests.findIndex(po => po.id === selectedPORequest.id);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === poRequests.length - 1;

  // Check if all line items are approved or rejected
  const allLineItemsReviewed = selectedPORequest.lineItems?.every(item => 
    item.status === 'approved' || item.status === 'rejected'
  ) || false;

  const handlePrevious = () => {
    if (!isFirst) {
      const prevPO = poRequests[currentIndex - 1];
      window.location.href = `/documents/po-requests/${prevPO.id}`;
    }
  };

  const handleNext = () => {
    if (!isLast) {
      const nextPO = poRequests[currentIndex + 1];
      window.location.href = `/documents/po-requests/${nextPO.id}`;
    }
  };

  const handleApprove = () => {
    toast({
      title: "PO Request Approved",
      description: `${selectedPORequest.poNumber} has been approved successfully.`,
    });
  };

  const handleReject = () => {
    toast({
      title: "PO Request Rejected",
      description: `${selectedPORequest.poNumber} has been rejected.`,
    });
  };

  const handleQuery = (comment: string) => {
    toast({
      title: "Query Sent",
      description: `Query sent for ${selectedPORequest.poNumber}: ${comment}`,
    });
  };

  const handlePrint = () => {
    toast({
      title: "Printing...",
      description: `Printing ${selectedPORequest.poNumber}`,
    });
  };

  const handleBatchApprove = () => {
    if (selectedLineItems.length > 0) {
      toast({
        title: "Items Approved",
        description: `${selectedLineItems.length} line items have been approved.`,
      });
      setSelectedLineItems([]);
    }
  };

  const handleStartDiscussion = () => {
    if (newDiscussionMessage.trim()) {
      toast({
        title: "Discussion Started",
        description: "Discussion thread has been created.",
      });
      setNewDiscussionMessage('');
    }
  };

  const handleAddToDiscussion = () => {
    if (newDiscussionMessage.trim()) {
      toast({
        title: "Message Added",
        description: "Your message has been added to the discussion.",
      });
      setNewDiscussionMessage('');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_review: { color: 'bg-blue-50 text-blue-600', label: 'Pending Review' },
      in_review: { color: 'bg-yellow-50 text-yellow-600', label: 'In Review' },
      approved: { color: 'bg-green-50 text-green-600', label: 'Approved' },
      rejected: { color: 'bg-red-50 text-red-600', label: 'Rejected' },
      in_discussion: { color: 'bg-purple-50 text-purple-600', label: 'In Discussion' }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
                <BreadcrumbLink href="/documents/po-requests">PO Requests</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{selectedPORequest.poNumber}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-semibold text-gray-900">{selectedPORequest.poNumber}</h1>
                {getStatusBadge(selectedPORequest.status)}
              </div>
              <p className="text-gray-600 mt-1">{selectedPORequest.title}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={isFirst}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={isLast}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Review status: {selectedPORequest.lineItems?.filter(item => item.approved).length || 0}/{selectedPORequest.lineItems?.length || 0} items reviewed
              </div>
              
              {selectedLineItems.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedLineItems.length} selected</span>
                  <Button 
                    size="sm" 
                    onClick={handleBatchApprove}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approve All
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-1" />
                Print
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                    Reject
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reject Purchase Order</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to reject this purchase order? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReject} className="bg-red-600 hover:bg-red-700">
                      Reject
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                size="sm"
                onClick={handleApprove}
                disabled={!allLineItemsReviewed}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500"
              >
                Approve
              </Button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Line Items Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Line Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <POLineItemsTab 
                selectedPO={selectedPORequest} 
                selectedItems={selectedLineItems}
                onSelectItems={setSelectedLineItems}
              />
            </CardContent>
          </Card>

          {/* Documents Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <PODocumentsTab selectedPO={selectedPORequest} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Notes Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm">
                <StickyNote className="w-4 h-4 mr-2" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-600">
                {selectedPORequest.notes || 'No notes available for this purchase order.'}
              </div>
            </CardContent>
          </Card>

          {/* Discussion Thread Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Discussion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedPORequest.status === 'in_discussion' && selectedPORequest.discussionThread ? (
                <div className="space-y-3">
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedPORequest.discussionThread.map((message) => (
                      <div key={message.id} className="flex space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {message.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-1">
                            <span className="font-medium text-xs">{message.author}</span>
                            <span className="text-xs text-gray-500">{message.timestamp}</span>
                          </div>
                          <p className="text-xs text-gray-700 mt-1">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Need clarification on something? Share your thoughts..."
                      value={newDiscussionMessage}
                      onChange={(e) => setNewDiscussionMessage(e.target.value)}
                      className="min-h-[60px] text-xs"
                    />
                    <Button onClick={handleAddToDiscussion} size="sm" className="w-full">
                      Reply
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 mb-3">No discussion started</p>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Need clarification on something? Share your thoughts..."
                      value={newDiscussionMessage}
                      onChange={(e) => setNewDiscussionMessage(e.target.value)}
                      className="min-h-[60px] text-xs"
                    />
                    <Button onClick={handleStartDiscussion} size="sm" variant="outline" className="w-full text-xs">
                      Start Discussion
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Combined Details Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm">
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Requestor Information */}
              <div>
                <div className="flex items-center space-x-1 mb-2">
                  <User className="w-3 h-3 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700">Requestor</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      {selectedPORequest.requestor.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-xs">{selectedPORequest.requestor}</p>
                    <p className="text-xs text-gray-500">{selectedPORequest.department}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  <span className="text-gray-500">Email:</span>
                  <span className="ml-1">{selectedPORequest.requestorEmail || 'user@example.com'}</span>
                </div>
              </div>

              <Separator />

              {/* Vendor Information */}
              <div>
                <div className="flex items-center space-x-1 mb-2">
                  <Building className="w-3 h-3 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700">Vendor</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-gray-500">Company:</span>
                    <span className="ml-1">{selectedPORequest.vendor || 'Tech Supplies Inc.'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-1">vendor@example.com</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Terms:</span>
                    <span className="ml-1">{selectedPORequest.paymentTerms || 'Net 30'}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Delivery Information */}
              <div>
                <div className="flex items-center space-x-1 mb-2">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700">Delivery</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-gray-500">Address:</span>
                    <span className="ml-1">{selectedPORequest.deliveryAddress || '123 Corporate HQ, Business City'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Expected:</span>
                    <span className="ml-1">{selectedPORequest.expectedDelivery || 'June 15, 2023'}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Order Summary */}
              <div>
                <div className="flex items-center space-x-1 mb-2">
                  <DollarSign className="w-3 h-3 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700">Order Summary</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total:</span>
                    <span className="font-medium">{formatCurrency(selectedPORequest.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span>{formatDate(selectedPORequest.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Priority:</span>
                    <span className="capitalize">{selectedPORequest.priority}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PORequestDetail;
