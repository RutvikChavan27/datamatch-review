import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { RefreshCw, FileText, BarChart3, Settings, AlertTriangle, Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const DocumentMatchingDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Tab counts
  const allCount = 156;
  const pendingCount = 23;
  const autoMatchedCount = 147;
  const manualReviewCount = 8;
  const completedCount = 324;

  const recentActivity = [
    {
      id: 'DS-00123',
      action: 'Auto-matched',
      documents: 'Invoice + PO + GRN',
      time: '2 minutes ago',
      status: 'success'
    },
    {
      id: 'DS-00124',
      action: 'Manual review required',
      documents: 'Invoice + PO (amount variance)',
      time: '15 minutes ago',
      status: 'warning'
    },
    {
      id: 'DS-00125',
      action: 'Partially matched',
      documents: 'Invoice + PO (missing GRN)',
      time: '1 hour ago',
      status: 'pending'
    },
    {
      id: 'DS-00126',
      action: 'Auto-matched',
      documents: 'Invoice + PO + GRN',
      time: '2 hours ago',
      status: 'success'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'pending': return 'text-blue-600 bg-blue-50';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Clean Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          Document Matching
        </h1>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Reports
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Simplified Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted">
            <TabsTrigger value="pending" className="data-[state=active]:bg-background">
              Pending
              <Badge variant="secondary" className="ml-2">
                {pendingCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="auto-matched" className="data-[state=active]:bg-background">
              Auto-Matched
              <Badge variant="secondary" className="ml-2">
                {autoMatchedCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="manual-review" className="data-[state=active]:bg-background">
              Manual Review
              <Badge variant="secondary" className="ml-2">
                {manualReviewCount}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Clean Search */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                type="search"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-80"
              />
            </div>
            
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Rule
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="space-y-6">
          {/* Clean Stats Grid */}
          <div className="grid grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-2xl font-semibold text-yellow-600">{pendingCount}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-600 opacity-60" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Auto-Matched</p>
                    <p className="text-2xl font-semibold text-green-600">{autoMatchedCount}</p>
                  </div>
                  <FileText className="w-8 h-8 text-green-600 opacity-60" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Manual Review</p>
                    <p className="text-2xl font-semibold text-red-600">{manualReviewCount}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600 opacity-60" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-2xl font-semibold text-primary">{completedCount}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-primary opacity-60" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Simplified Actions */}
          <div className="grid grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Queue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Manage document matching queue</p>
                <Button asChild className="w-full">
                  <Link to="/matching/queue">
                    View Queue
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Manual Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Review flagged documents</p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/matching/manual-review">
                    Review Items
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Configure matching rules</p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/matching/rules">
                    Manage Rules
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Clean Activity List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-600' : activity.status === 'warning' ? 'bg-yellow-600' : 'bg-blue-600'}`}></div>
                      <div>
                        <p className="font-medium text-sm">{activity.id}</p>
                        <p className="text-xs text-muted-foreground">{activity.documents}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={getStatusColor(activity.status)}>
                        {activity.action}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Placeholder tabs */}
        <TabsContent value="pending">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Pending matches view</p>
          </div>
        </TabsContent>

        <TabsContent value="auto-matched">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Auto-matched documents view</p>
          </div>
        </TabsContent>

        <TabsContent value="manual-review">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Manual review items view</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentMatchingDashboard;