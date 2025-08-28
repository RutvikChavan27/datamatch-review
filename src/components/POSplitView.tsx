import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PODetailView from './PODetailView';

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
  discussionThread?: {
    id: string;
    author: string;
    message: string;
    timestamp: string;
  }[];
}

const POSplitView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPO, setSelectedPO] = useState<POData | null>(null);
  const { toast } = useToast();

  const reviewRequests: POData[] = [
    {
      id: 'REQ-001234',
      poNumber: 'PO-2024-0459',
      title: 'Office Supplies & Equipment Purchase',
      requestor: 'Mike Davis',
      department: 'IT',
      amount: 12345.67,
      date: '2024-01-15',
      status: 'pending_review',
      priority: 'high',
      vendor: 'Tech Supplies Inc.',
      deliveryAddress: '123 Corporate HQ, Business City',
      paymentTerms: 'Net 30',
      expectedDelivery: 'June 15, 2023',
      requestorEmail: 'mike.davis@company.com',
      lineItems: [
        {
          id: 'IT-001',
          code: 'IT-001',
          description: 'Dell XPS 13 Laptop',
          quantity: 2,
          unitOfMeasure: 'Each',
          unitPrice: 1200.00,
          total: 2400.00,
          approved: false
        },
        {
          id: 'IT-002',
          code: 'IT-002',
          description: 'Dell 27-inch Monitor',
          quantity: 4,
          unitOfMeasure: 'Each',
          unitPrice: 350.00,
          total: 1400.00,
          approved: false
        },
        {
          id: 'IT-003',
          code: 'IT-003',
          description: 'Microsoft Office 365 License (Annual)',
          quantity: 10,
          unitOfMeasure: 'License',
          unitPrice: 99.00,
          total: 990.00,
          approved: false
        }
      ],
      documents: [
        {
          id: 'doc-1',
          name: 'Purchase Requisition Form',
          type: 'PDF',
          size: '245 KB',
          uploadDate: '5/20/2023'
        },
        {
          id: 'doc-2',
          name: 'Vendor Quote',
          type: 'PDF',
          size: '1.2 MB',
          uploadDate: '5/19/2023'
        },
        {
          id: 'doc-3',
          name: 'Product Specifications',
          type: 'DOC',
          size: '350 KB',
          uploadDate: '5/18/2023'
        },
        {
          id: 'doc-4',
          name: 'Budget Approval',
          type: 'XLS',
          size: '128 KB',
          uploadDate: '5/17/2023'
        }
      ]
    },
    {
      id: 'REQ-001235',
      poNumber: 'PO-2024-0460',
      title: 'Marketing Materials and Promotional Items',
      requestor: 'Sarah Johnson',
      department: 'Marketing',
      amount: 8750.25,
      date: '2024-01-14',
      status: 'in_discussion',
      priority: 'medium',
      vendor: 'Marketing Solutions Ltd.',
      deliveryAddress: '456 Business Park, Commerce City',
      paymentTerms: 'Net 45',
      expectedDelivery: 'July 1, 2023',
      requestorEmail: 'sarah.johnson@company.com',
      discussionThread: [
        {
          id: 'msg-1',
          author: 'Alex Wilson',
          message: 'Please verify these prices with the latest approved vendor catalog.',
          timestamp: 'May 21, 2023, 2:30 PM'
        },
        {
          id: 'msg-2',
          author: 'Mary Johnson',
          message: "I've checked with our vendor and confirmed that these are the current prices according to our contract. They reflect a 5% discount negotiated last quarter.",
          timestamp: 'May 22, 2023, 9:15 AM'
        }
      ],
      lineItems: [],
      documents: []
    },
    {
      id: 'REQ-001236',
      poNumber: 'PO-2024-0461',
      title: 'Maintenance Supplies for Facility',
      requestor: 'Bob Wilson',
      department: 'Facilities',
      amount: 3250.50,
      date: '2024-01-13',
      status: 'pending_review',
      priority: 'low',
      vendor: 'Facility Supplies Co.',
      deliveryAddress: '789 Industrial Ave, Factory Town',
      paymentTerms: 'Net 15',
      expectedDelivery: 'June 30, 2023',
      requestorEmail: 'bob.wilson@company.com',
      lineItems: [],
      documents: []
    },
    {
      id: 'REQ-001237',
      poNumber: 'PO-2024-0462',
      title: 'Emergency Hardware Replacement',
      requestor: 'Alice Chen',
      department: 'IT',
      amount: 15670.00,
      date: '2024-01-12',
      status: 'verified',
      priority: 'high',
      vendor: 'Emergency Tech Solutions',
      deliveryAddress: '321 Tech Center, Silicon Valley',
      paymentTerms: 'Net 7',
      expectedDelivery: 'June 10, 2023',
      requestorEmail: 'alice.chen@company.com',
      lineItems: [],
      documents: []
    }
  ];

  const filteredRequests = reviewRequests.filter(request => {
    const matchesSearch = request.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleSelectPO = (po: POData) => {
    setSelectedPO(po);
  };

  const handleVerify = () => {
    if (selectedPO) {
      toast({
        title: "Purchase Order Verified",
        description: `${selectedPO.poNumber} has been verified successfully.`,
      });
    }
  };

  const handleReject = () => {
    if (selectedPO) {
      toast({
        title: "Purchase Order Rejected",
        description: `${selectedPO.poNumber} has been rejected.`,
      });
    }
  };

  const handleQuery = (comment: string) => {
    if (selectedPO) {
      toast({
        title: "Query Sent",
        description: `Query sent for ${selectedPO.poNumber}: ${comment}`,
      });
    }
  };

  const handlePrint = () => {
    if (selectedPO) {
      toast({
        title: "Printing...",
        description: `Printing ${selectedPO.poNumber}`,
      });
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
      <Badge className={`${config.color} border-0 text-xs`}>
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
    <div className="h-full flex">
      {/* Left Panel - PO List */}
      <div className="w-1/3 border-r border-gray-200 bg-gray-50 overflow-hidden flex flex-col">
        <div className="p-4 bg-white border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Review Requests</h2>
          
          {/* Filters */}
          <div className="space-y-3">
            <Input
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="in_discussion">In Discussion</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className={`p-4 cursor-pointer transition-colors hover:bg-gray-100 ${
                  selectedPO?.id === request.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
                onClick={() => handleSelectPO(request)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-sm text-gray-900">{request.poNumber}</h3>
                    <p className="text-xs text-gray-500 mt-1">{request.title}</p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                  <span>{request.requestor} • {request.department}</span>
                  <span>{formatCurrency(request.amount)}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                  <span>{formatDate(request.date)}</span>
                  <span className="capitalize">{request.priority} priority</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Detail View */}
      <div className="flex-1 overflow-hidden">
        {selectedPO ? (
          <PODetailView
            selectedPO={selectedPO}
            onSelectPO={handleSelectPO}
            poList={filteredRequests}
            onVerify={handleVerify}
            onReject={handleReject}
            onQuery={handleQuery}
            onPrint={handlePrint}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Purchase Order</h3>
              <p className="text-gray-500">Choose a purchase order from the list to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default POSplitView;
