import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ArrowLeft, ArrowRight, Printer, MessageSquare, FileText, Package, User, Building, Calendar, DollarSign, StickyNote, Check, Eye, EyeOff, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
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
  status: 'pending_review' | 'in_review' | 'verified' | 'rejected' | 'in_discussion';
  priority: 'high' | 'medium' | 'low';
  vendor?: string;
  deliveryAddress?: string;
  paymentTerms?: string;
  expectedDelivery?: string;
  requestorEmail?: string;
  lineItems?: any[];
  documents?: any[];
  notes?: string;
  discussionThread?: {
    id: string;
    author: string;
    message: string;
    timestamp: string;
    avatar?: string;
  }[];
}

interface PODetailViewProps {
  selectedPO: POData;
  onSelectPO: (po: POData) => void;
  poList: POData[];
  onVerify: () => void;
  onReject: () => void;
  onQuery: (comment: string) => void;
  onPrint: () => void;
  showPreview?: boolean;
  onTogglePreview?: (show: boolean) => void;
}

const PODetailView: React.FC<PODetailViewProps> = ({
  selectedPO,
  onSelectPO,
  poList,
  onVerify,
  onReject,
  onQuery,
  onPrint,
  showPreview = true,
  onTogglePreview
}) => {
  const [selectedLineItems, setSelectedLineItems] = useState<string[]>([]);
  const [newDiscussionMessage, setNewDiscussionMessage] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const { toast } = useToast();

  const currentIndex = poList.findIndex(po => po.id === selectedPO.id);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === poList.length - 1;

  // Check if all line items are verified or rejected
  const allLineItemsReviewed = selectedPO.lineItems?.every(item => 
    item.status === 'verified' || item.status === 'rejected'
  ) || false;

  const handlePrevious = () => {
    if (!isFirst) {
      onSelectPO(poList[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (!isLast) {
      onSelectPO(poList[currentIndex + 1]);
    }
  };

  const handleBatchVerify = () => {
    if (selectedLineItems.length > 0) {
      toast({
        title: "Items Verified",
        description: `${selectedLineItems.length} line items have been verified.`,
      });
      setSelectedLineItems([]);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_review: { color: 'bg-blue-50 text-blue-600', label: 'Pending Review' },
      in_review: { color: 'bg-yellow-50 text-yellow-600', label: 'In Review' },
      verified: { color: 'bg-green-50 text-green-600', label: 'Verified' },
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

  return (
    <div className="h-full flex bg-background">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Clean Breadcrumb */}
        <div className="px-6 py-4 border-b">
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

        {/* Clean Header */}
        <div className="bg-background border-b px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-semibold">{selectedPO.poNumber}</h1>
                {getStatusBadge(selectedPO.status)}
              </div>
              <p className="text-muted-foreground mt-1">{selectedPO.title}</p>
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

          {/* Clean Action Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Progress: {selectedPO.lineItems?.filter(item => item.verified).length || 0}/{selectedPO.lineItems?.length || 0} items
              </div>
              
              {selectedLineItems.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{selectedLineItems.length} selected</span>
                  <Button size="sm" onClick={handleBatchVerify}>
                    <Check className="w-4 h-4 mr-1" />
                    Verify All
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={onPrint}>
                <Printer className="w-4 h-4 mr-1" />
                Print
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-destructive">
                    Reject
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reject Purchase Order</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to reject this purchase order?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onReject} className="bg-destructive hover:bg-destructive/90">
                      Reject
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                size="sm"
                onClick={onVerify}
                disabled={!allLineItemsReviewed}
              >
                Verify
              </Button>
            </div>
          </div>
        </div>

        {/* Show Preview Toggle */}
        {!showPreview && onTogglePreview && (
          <div className="px-6 py-4 flex justify-center">
            <Button 
              onClick={() => onTogglePreview(true)}
              variant="outline"
              size="sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              Show Preview
            </Button>
          </div>
        )}

        {/* Content Layout */}
        <div className="flex-1 flex">
          {/* Document Preview */}
          {showPreview && (
            <div className="w-3/5 p-6">
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle>Document Preview</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Open in Tab
                    </Button>
                    {onTogglePreview && (
                      <Button 
                        onClick={() => onTogglePreview(false)}
                        variant="outline"
                        size="sm"
                      >
                        <EyeOff className="w-4 h-4 mr-1" />
                        Hide
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="h-full">
                  <div className="bg-muted/30 h-full rounded-lg flex items-center justify-center border-2 border-dashed">
                    <img 
                      src="/lovable-uploads/00aad332-2016-4d6e-a7be-aca80f0f4d7f.png" 
                      alt="Purchase Order Document"
                      className="max-w-full max-h-full object-contain rounded"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Content Panel */}
          <div className={cn(
            "flex flex-col transition-all duration-200",
            showPreview ? "w-2/5" : "w-full"
          )}>
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Line Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Line Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <POLineItemsTab 
                    selectedPO={selectedPO} 
                    selectedItems={selectedLineItems}
                    onSelectItems={setSelectedLineItems}
                  />
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <PODocumentsTab selectedPO={selectedPO} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Right Panel */}
      <div className="w-80 border-l bg-muted/20 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <StickyNote className="w-4 h-4 mr-2" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {selectedPO.notes || 'No notes available'}
              </div>
            </CardContent>
          </Card>

          {/* Discussion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Discussion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedPO.status === 'in_discussion' && selectedPO.discussionThread ? (
                <div className="space-y-3">
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedPO.discussionThread.map((message) => (
                      <div key={message.id} className="flex space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {message.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-1">
                            <span className="font-medium text-xs">{message.author}</span>
                            <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newDiscussionMessage}
                      onChange={(e) => setNewDiscussionMessage(e.target.value)}
                      className="min-h-[60px] text-sm"
                    />
                    <Button size="sm" className="w-full">
                      Reply
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">No discussion started</p>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Start a discussion..."
                      value={newDiscussionMessage}
                      onChange={(e) => setNewDiscussionMessage(e.target.value)}
                      className="min-h-[60px] text-sm"
                    />
                    <Button size="sm" variant="outline" className="w-full">
                      Start Discussion
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center space-x-1 mb-2">
                  <User className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium">Requestor</span>
                </div>
                <div className="text-sm">{selectedPO.requestor}</div>
                <div className="text-xs text-muted-foreground">{selectedPO.requestorEmail}</div>
              </div>

              <div>
                <div className="flex items-center space-x-1 mb-2">
                  <Building className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium">Department</span>
                </div>
                <div className="text-sm">{selectedPO.department}</div>
              </div>

              <div>
                <div className="flex items-center space-x-1 mb-2">
                  <DollarSign className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium">Amount</span>
                </div>
                <div className="text-sm font-medium">{formatCurrency(selectedPO.amount)}</div>
              </div>

              <div>
                <div className="flex items-center space-x-1 mb-2">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium">Date</span>
                </div>
                <div className="text-sm">{new Date(selectedPO.date).toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PODetailView;