
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, RefreshCw, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManualReview = () => {
  const [filter, setFilter] = useState('all');

  const reviewItems = [
    {
      setId: 'DS-00123',
      poNumber: 'PO-2024-0456',
      issue: 'Amount variance',
      description: 'Invoice amount $12,500 vs PO amount $12,000',
      documents: { invoice: true, po: true, grn: false },
      priority: 'high',
      assignedTo: 'John Smith',
      dueDate: '2024-01-16'
    },
    {
      setId: 'DS-00124',
      poNumber: 'PO-2024-0457',
      issue: 'Missing GRN',
      description: 'Invoice and PO matched, awaiting goods receipt note',
      documents: { invoice: true, po: true, grn: false },
      priority: 'medium',
      assignedTo: 'Sarah Johnson',
      dueDate: '2024-01-17'
    },
    {
      setId: 'DS-00125',
      poNumber: 'PO-2024-0458',
      issue: 'Vendor mismatch',
      description: 'Invoice vendor "ABC Corp" vs PO vendor "ABC Corporation"',
      documents: { invoice: true, po: true, grn: true },
      priority: 'low',
      assignedTo: 'Mike Davis',
      dueDate: '2024-01-18'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentIcon = (docType: 'invoice' | 'po' | 'grn', present: boolean) => {
    const icons = {
      invoice: '📧',
      po: '📄',
      grn: '📦'
    };
    
    return (
      <span className={`text-lg ${present ? 'text-green-600' : 'text-red-500'}`}>
        {icons[docType]} {present ? '✓' : '✗'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/matching">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Matching
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Ready for Verification</h1>
            <p className="text-gray-600">Documents requiring manual attention</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          All Issues
        </Button>
        <Button
          variant={filter === 'high' ? 'default' : 'outline'}
          onClick={() => setFilter('high')}
          size="sm"
        >
          High Priority
        </Button>
        <Button
          variant={filter === 'amount' ? 'default' : 'outline'}
          onClick={() => setFilter('amount')}
          size="sm"
        >
          Amount Variances
        </Button>
        <Button
          variant={filter === 'missing' ? 'default' : 'outline'}
          onClick={() => setFilter('missing')}
          size="sm"
        >
          Missing Documents
        </Button>
      </div>

      {/* Review Items */}
      <div className="space-y-4">
        {reviewItems.map((item) => (
          <Card key={item.setId} className="border-l-4 border-l-orange-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{item.setId}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(item.priority)}>
                    {item.priority.toUpperCase()} PRIORITY
                  </Badge>
                  <Badge variant="outline">Due: {item.dueDate}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Issue Details</h4>
                  <p className="text-sm font-medium text-red-600 mb-1">{item.issue}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-sm text-gray-500 mt-2">PO: {item.poNumber}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Documents Present</h4>
                  <div className="flex items-center space-x-2">
                    {getDocumentIcon('invoice', item.documents.invoice)}
                    {getDocumentIcon('po', item.documents.po)}
                    {getDocumentIcon('grn', item.documents.grn)}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Assignment</h4>
                  <p className="text-sm text-gray-600 mb-2">Assigned to: {item.assignedTo}</p>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Eye className="w-3 h-3 mr-1" />
                      Verify
                    </Button>
                    <Button size="sm" variant="outline">
                      Reassign
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">1</div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">2.5</div>
              <div className="text-sm text-gray-600">Avg Days Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">87%</div>
              <div className="text-sm text-gray-600">Resolution Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualReview;
