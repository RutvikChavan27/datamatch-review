
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, ArrowRight } from 'lucide-react';

const StandardReports = () => {
  const [dateRange, setDateRange] = useState('last-30-days');

  // Sample data for the table
  const documentData = [
    {
      type: 'Purchase Orders',
      total: 415,
      autoApproved: 362,
      autoApprovedPercentage: 87,
      manualReview: 53,
      manualReviewPercentage: 13,
      avgProcessingTime: 2.1
    },
    {
      type: 'Invoices',
      total: 416,
      autoApproved: 354,
      autoApprovedPercentage: 85,
      manualReview: 62,
      manualReviewPercentage: 15,
      avgProcessingTime: 2.4
    },
    {
      type: 'GRNs',
      total: 416,
      autoApproved: 373,
      autoApprovedPercentage: 90,
      manualReview: 43,
      manualReviewPercentage: 10,
      avgProcessingTime: 2.2
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between h-16">
        <div>
          <nav className="text-sm text-gray-500 mb-1">Reports</nav>
          <h1 className="text-xl font-semibold text-gray-900" style={{ fontSize: '20px', fontWeight: 600, color: '#333333' }}>
            Reports
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Basic Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Documents Processed */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4" style={{ minHeight: '120px' }}>
            <div className="space-y-2">
              <div className="text-3xl font-semibold" style={{ fontSize: '32px', fontWeight: 600, color: '#333333' }}>
                1,247
              </div>
              <div className="text-xs text-gray-500" style={{ fontSize: '12px', color: '#6B7280' }}>
                Total Documents
              </div>
              <div className="text-sm" style={{ fontSize: '14px', color: '#333333' }}>
                PO: 415 | Invoice: 416 | GRN: 416
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Matching Status */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4" style={{ minHeight: '120px' }}>
            <div className="space-y-2">
              <div className="text-3xl font-semibold text-green-600" style={{ fontSize: '32px', fontWeight: 600, color: '#10B981' }}>
                87%
              </div>
              <div className="text-xs text-gray-500" style={{ fontSize: '12px', color: '#6B7280' }}>
                Auto-Approved Rate
              </div>
              <div className="text-sm text-gray-500" style={{ fontSize: '14px', color: '#6B7280' }}>
                163 required manual review
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Processing Time */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4" style={{ minHeight: '120px' }}>
            <div className="space-y-2">
              <div className="text-3xl font-semibold" style={{ fontSize: '32px', fontWeight: 600, color: '#333333' }}>
                2.3
              </div>
              <div className="text-xs text-gray-500" style={{ fontSize: '12px', color: '#6B7280' }}>
                Average Days to Process
              </div>
              <div className="text-sm text-gray-500" style={{ fontSize: '14px', color: '#6B7280' }}>
                Target: &lt;3 days
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Exception Summary */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4" style={{ minHeight: '120px' }}>
            <div className="space-y-2">
              <div className="text-3xl font-semibold text-yellow-500" style={{ fontSize: '32px', fontWeight: 600, color: '#FBBF24' }}>
                42
              </div>
              <div className="text-xs text-gray-500" style={{ fontSize: '12px', color: '#6B7280' }}>
                Pending Exceptions
              </div>
              <button className="flex items-center text-sm text-blue-600 hover:text-blue-700" style={{ fontSize: '14px', color: '#2564CF' }}>
                View Exceptions
                <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Summary Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Document Summary</h2>
        <Card className="border border-gray-200">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="h-12">
                  <TableHead className="font-medium">Document Type</TableHead>
                  <TableHead className="font-medium">Total</TableHead>
                  <TableHead className="font-medium">Auto-Approved</TableHead>
                  <TableHead className="font-medium">Manual Review</TableHead>
                  <TableHead className="font-medium">Avg. Processing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documentData.map((row, index) => (
                  <TableRow key={index} className="h-12">
                    <TableCell className="font-medium">{row.type}</TableCell>
                    <TableCell>{row.total.toLocaleString()}</TableCell>
                    <TableCell>
                      {row.autoApproved.toLocaleString()} ({row.autoApprovedPercentage}%)
                    </TableCell>
                    <TableCell>
                      {row.manualReview.toLocaleString()} ({row.manualReviewPercentage}%)
                    </TableCell>
                    <TableCell>{row.avgProcessingTime} days</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StandardReports;
