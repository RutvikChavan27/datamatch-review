import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertTriangle, FileText, Activity, RefreshCw, Search } from 'lucide-react';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const overviewStats = [
    {
      title: 'Pending',
      value: '23',
      description: 'Need Action',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      icon: Clock,
    },
    {
      title: 'Auto-Matched',
      value: '147',
      description: 'Today',
      change: '+12% yesterday',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: CheckCircle,
    },
    {
      title: 'Ready Review',
      value: '8',
      description: 'Manual Review',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      icon: AlertTriangle,
    },
    {
      title: 'Completed',
      value: '324',
      description: 'This Month',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: FileText,
    }
  ];

  const recentActivity = [
    {
      id: 'DS-00156',
      action: 'Auto-approved (Invoice + PO)',
      time: '2 min ago',
      status: 'success'
    },
    {
      id: 'DS-00157',
      action: 'Needs review (Budget exceeded)',
      time: '5 min ago',
      status: 'warning'
    },
    {
      id: 'DS-00158',
      action: 'New invoice uploaded',
      time: '8 min ago',
      status: 'info'
    },
    {
      id: 'DS-00159',
      action: '3-way match completed',
      time: '15 min ago',
      status: 'success'
    }
  ];

  const unmatchedDocuments = [
    {
      id: 'PO-2024-0789',
      name: 'Office Equipment Purchase Order',
      type: 'PO',
      age: '1 day'
    },
    {
      id: 'INV-2024-456',
      name: 'Tech Solutions Invoice Q4',
      type: 'Invoice',
      age: '3 days'
    },
    {
      id: 'POD-2024-123',
      name: 'Hardware Delivery Receipt',
      type: 'POD',
      age: '2 days'
    },
    {
      id: 'INV-2024-457',
      name: 'Marketing Services Invoice',
      type: 'Invoice',
      age: '1 day'
    },
    {
      id: 'PO-2024-0790',
      name: 'Software License Purchase',
      type: 'PO',
      age: '4 days'
    },
    {
      id: 'INV-2024-458',
      name: 'Consulting Services Bill',
      type: 'Invoice',
      age: '1 day'
    },
    {
      id: 'POD-2024-124',
      name: 'Office Supplies Delivery',
      type: 'POD',
      age: '2 days'
    },
    {
      id: 'PO-2024-0791',
      name: 'Catering Services Order',
      type: 'PO',
      age: '3 days'
    },
    {
      id: 'INV-2024-459',
      name: 'Cloud Storage Invoice',
      type: 'Invoice',
      age: '5 days'
    },
    {
      id: 'POD-2024-125',
      name: 'IT Equipment Receipt',
      type: 'POD',
      age: '1 day'
    },
    {
      id: 'PO-2024-0792',
      name: 'Maintenance Contract',
      type: 'PO',
      age: '1 week'
    },
    {
      id: 'INV-2024-460',
      name: 'Training Program Invoice',
      type: 'Invoice',
      age: '2 days'
    },
    {
      id: 'POD-2024-126',
      name: 'Furniture Delivery Note',
      type: 'POD',
      age: '3 days'
    },
    {
      id: 'PO-2024-0793',
      name: 'Security System Purchase',
      type: 'PO',
      age: '1 day'
    },
    {
      id: 'INV-2024-461',
      name: 'Legal Services Invoice',
      type: 'Invoice',
      age: '4 days'
    },
    {
      id: 'POD-2024-127',
      name: 'Stationery Goods Receipt',
      type: 'POD',
      age: '2 days'
    },
    {
      id: 'PO-2024-0794',
      name: 'Vehicle Lease Agreement',
      type: 'PO',
      age: '1 day'
    },
    {
      id: 'INV-2024-462',
      name: 'Utility Services Bill',
      type: 'Invoice',
      age: '3 days'
    },
    {
      id: 'POD-2024-128',
      name: 'Medical Supplies Receipt',
      type: 'POD',
      age: '6 days'
    },
    {
      id: 'PO-2024-0795',
      name: 'Research Equipment Order',
      type: 'PO',
      age: '2 days'
    },
    {
      id: 'INV-2024-463',
      name: 'Insurance Premium Invoice',
      type: 'Invoice',
      age: '1 day'
    }
  ];

  // Filter documents based on search term
  const filteredDocuments = unmatchedDocuments.filter(doc =>
    doc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (doc: typeof unmatchedDocuments[0]) => {
    console.log('Document clicked:', doc.id);
    
    // Navigate to the appropriate detail view based on document type
    switch (doc.type) {
      case 'PO':
        navigate(`/documents/purchase-orders/${doc.id}`);
        break;
      case 'Invoice':
        navigate(`/documents/invoices/${doc.id}`);
        break;
      case 'POD':
        navigate(`/documents/goods-receipt-notes/${doc.id}`);
        break;
      default:
        console.log('Unknown document type:', doc.type);
    }
  };

  const handleRefresh = () => {
    console.log('Refreshing dashboard...');
    // Handle refresh logic
  };

  // Get current time for last refresh display
  const lastRefresh = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="space-y-8">
      {/* Clean Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-display">Dashboard</h1>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            title={`Last auto refreshed: ${lastRefresh}`}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <span className="text-caption">Last refreshed: {lastRefresh}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Documents List */}
        <div className="lg:col-span-2">
          <div className="card-clean">
            <div className="card-header-clean">
              <div className="flex items-center justify-between">
                <h2 className="text-heading flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  Unmatched Documents ({filteredDocuments.length})
                </h2>
              </div>
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="card-content-clean">
              <div className="overflow-auto">
                <table className="data-table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-header-cell w-[120px]">Document ID</th>
                      <th className="table-header-cell w-[250px]">Document Name</th>
                      <th className="table-header-cell w-[140px]">Type</th>
                      <th className="table-header-cell w-[100px] text-right">Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map((doc) => (
                      <tr 
                        key={doc.id} 
                        className="table-row"
                        onClick={() => handleRowClick(doc)}
                      >
                        <td className="table-cell font-mono">{doc.id}</td>
                        <td className="table-cell font-medium">{doc.name}</td>
                        <td className="table-cell">
                          <Badge variant="outline" className="text-xs">
                            {doc.type}
                          </Badge>
                        </td>
                        <td className="table-cell text-right text-muted-foreground">{doc.age}</td>
                      </tr>
                    ))}
                    {filteredDocuments.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-muted-foreground">
                          No documents found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Overview & Activity */}
        <div className="space-y-6">
          <div className="card-clean">
            <div className="card-header-clean">
              <h3 className="text-heading">Overview & Activity</h3>
            </div>
            <div className="card-content-clean space-y-6">
              {/* Overview Stats */}
              <div className="space-y-3">
                {overviewStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <p className="text-label">{stat.title}</p>
                        <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
                        <p className="text-caption">{stat.description}</p>
                        {stat.change && (
                          <p className="text-caption">{stat.change}</p>
                        )}
                      </div>
                      <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Activity */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4" />
                  <h4 className="text-label">Recent Activity</h4>
                </div>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === 'success' ? 'bg-green-500' : 
                        activity.status === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body">
                          <span className="font-medium">{activity.id}:</span> {activity.action}
                        </p>
                        <p className="text-caption mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
