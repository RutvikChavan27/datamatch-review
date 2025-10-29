import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Users, FileText, HardDrive, Database, TrendingUp, TrendingDown, UserCheck, UsersRound, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadialBarChart, RadialBar, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const Dashboard = () => {
  // Dashboard statistics
  const dashboardStats = [
    {
      title: 'No of Clients',
      value: '520',
      color: 'text-blue-600',
      icon: Users
    },
    {
      title: 'No of Users',
      value: '1,800',
      color: 'text-green-600',
      icon: Users
    },
    {
      title: 'Files uploaded',
      value: '3,000',
      color: 'text-purple-600',
      icon: FileText
    },
    {
      title: 'Storage size',
      value: '2.5 TB',
      color: 'text-orange-600',
      icon: Database
    },
    {
      title: 'Files in AWS S3',
      value: '1,500',
      color: 'text-teal-600',
      icon: HardDrive
    }
  ];

  const handleRefresh = () => {
    console.log('Refreshing dashboard data...');
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          Dashboard
        </h1>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {dashboardStats.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="rounded-xl shadow-sm border border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{metric.title}</p>
                    <p className="text-2xl font-bold text-foreground mb-2">{metric.value}</p>
                  </div>
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                    metric.color === 'text-blue-600' ? 'bg-blue-50' :
                    metric.color === 'text-green-600' ? 'bg-emerald-50' :
                    metric.color === 'text-purple-600' ? 'bg-purple-50' :
                    metric.color === 'text-orange-600' ? 'bg-orange-50' :
                    'bg-teal-50'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${
                      metric.color === 'text-blue-600' ? 'text-blue-600' :
                      metric.color === 'text-green-600' ? 'text-emerald-600' :
                      metric.color === 'text-purple-600' ? 'text-purple-600' :
                      metric.color === 'text-orange-600' ? 'text-orange-600' :
                      'text-teal-600'
                    }`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Dashboard */}
      <div className="space-y-6">
        {/* Tenant Selection */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Analytics Overview</h2>
          <div className="flex items-center space-x-4">
            <Select defaultValue="all-tenants">
              <SelectTrigger className="w-48 bg-background border border-border">
                <SelectValue placeholder="Select Tenant" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-lg z-50">
                <SelectItem value="all-tenants">All Tenants</SelectItem>
                <SelectItem value="tenant-1">Acme Corporation</SelectItem>
                <SelectItem value="tenant-2">TechStart Inc</SelectItem>
                <SelectItem value="tenant-3">Global Solutions</SelectItem>
                <SelectItem value="tenant-4">Enterprise Corp</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Storage Usage Chart */}
          <Card className="rounded-xl shadow-sm border border-border/50 lg:col-span-2 lg:col-start-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle className="text-lg font-semibold">Storage Usage Trend</CardTitle>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-muted-foreground">Storage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-muted-foreground">Files</span>
                    </div>
                  </div>
                </div>
                <Select defaultValue="30-days">
                  <SelectTrigger className="w-[160px] bg-background border border-border">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border shadow-lg z-50">
                    <SelectItem value="7-days">Last 7 days</SelectItem>
                    <SelectItem value="30-days">Last 30 days</SelectItem>
                    <SelectItem value="90-days">Last 90 days</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { month: 'Jan', storage: 1.2, files: 2100 },
                  { month: 'Feb', storage: 1.5, files: 2400 },
                  { month: 'Mar', storage: 1.8, files: 2800 },
                  { month: 'Apr', storage: 2.1, files: 3200 },
                  { month: 'May', storage: 2.3, files: 3800 },
                  { month: 'Jun', storage: 2.5, files: 4500 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} label={{ value: 'Storage (TB)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} label={{ value: 'Files', angle: 90, position: 'insideRight', style: { fontSize: 12 } }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="storage" 
                    stroke="#F97316" 
                    strokeWidth={3}
                    dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }}
                    name="Storage"
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="files" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    name="Files"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart - File Distribution */}
          <Card className="rounded-xl shadow-sm border border-border/50 lg:col-span-1 lg:col-start-3">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">File Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Files Uploaded', value: 3000, color: '#8B5CF6' },
                          { name: 'AWS S3 Files', value: 1500, color: '#14B8A6' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#8B5CF6" />
                        <Cell fill="#14B8A6" />
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="border border-border/50 bg-muted/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-xs text-muted-foreground">Files Uploaded</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">3,000</p>
                        <p className="text-xs text-muted-foreground">66.7%</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-border/50 bg-muted/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                        <span className="text-xs text-muted-foreground">AWS S3 Files</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">1,500</p>
                        <p className="text-xs text-muted-foreground">33.3%</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="rounded-xl shadow-sm border border-border/50">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">Average Files per Client</h3>
                <p className="text-3xl font-bold text-blue-600">8.7</p>
                <p className="text-sm text-muted-foreground mt-1">files per client</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm border border-border/50">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">Storage per User</h3>
                <p className="text-3xl font-bold text-green-600">1.4 GB</p>
                <p className="text-sm text-muted-foreground mt-1">average per user</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm border border-border/50">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">Growth Rate</h3>
                <p className="text-3xl font-bold text-purple-600">+15%</p>
                <p className="text-sm text-muted-foreground mt-1">month over month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Storage Overview, Storage Breakdown & User Management */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Storage Overview */}
          <Card className="rounded-xl shadow-sm border border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Storage Overview</CardTitle>
                <HardDrive className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-center h-[140px]">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-foreground">2.5 TB</p>
                      <p className="text-sm text-muted-foreground mt-2">Total Storage</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-purple-600" />
                      <span className="text-sm text-muted-foreground">Documents</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">3,000</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-teal-600" />
                      <span className="text-sm text-muted-foreground">AWS S3 Files</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">1,500</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-orange-600" />
                      <span className="text-sm text-muted-foreground">Avg File Size</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">0.85 MB</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-muted-foreground">Total Clients</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">520</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Storage Breakdown */}
          <Card className="rounded-xl shadow-sm border border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Storage Breakdown</CardTitle>
                <Database className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mt-1">Total: 2.5 TB of 5 TB</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Invoices', value: 800, color: '#10B981' },
                          { name: 'Purchase Orders', value: 650, color: '#3B82F6' },
                          { name: 'Court Records', value: 420, color: '#F59E0B' },
                          { name: 'Agreements and Contracts', value: 350, color: '#8B5CF6' },
                          { name: 'MoUs and Legal Documents', value: 180, color: '#EC4899' },
                          { name: 'HR Documents', value: 100, color: '#F97316' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        <Cell fill="#10B981" />
                        <Cell fill="#3B82F6" />
                        <Cell fill="#F59E0B" />
                        <Cell fill="#8B5CF6" />
                        <Cell fill="#EC4899" />
                        <Cell fill="#F97316" />
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {[
                    { name: 'Invoices', value: '800 GB', color: 'bg-green-500' },
                    { name: 'Purchase Orders', value: '650 GB', color: 'bg-blue-500' },
                    { name: 'Court Records', value: '420 GB', color: 'bg-amber-500' },
                    { name: 'Agreements', value: '350 GB', color: 'bg-purple-500' },
                    { name: 'Legal Docs', value: '180 GB', color: 'bg-pink-500' },
                    { name: 'HR Docs', value: '100 GB', color: 'bg-orange-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                        <span className="text-xs text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card className="rounded-xl shadow-sm border border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">User Management</CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={140}>
                    <RadialBarChart 
                      cx="50%" 
                      cy="50%" 
                      innerRadius="60%" 
                      outerRadius="100%" 
                      barSize={12}
                      data={[
                        { name: 'Active', value: 14.7, fill: '#10B981' },
                        { name: 'Total', value: 100, fill: '#3B82F6' }
                      ]}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <RadialBar
                        background
                        dataKey="value"
                        cornerRadius={10}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-muted-foreground">Total Users</span>
                    </div>
                    <span className="text-lg font-bold text-foreground">1,800</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-muted-foreground">Active Users</span>
                    </div>
                    <span className="text-lg font-bold text-foreground">265</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-orange-600" />
                      <span className="text-sm text-muted-foreground">Active Sessions</span>
                    </div>
                    <span className="text-lg font-bold text-foreground">142</span>
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

export default Dashboard;
