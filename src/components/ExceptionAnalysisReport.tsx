
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Clock, User, AlertTriangle } from 'lucide-react';

interface ExceptionAnalysisReportProps {
  dateRange: string;
  department: string;
}

const ExceptionAnalysisReport: React.FC<ExceptionAnalysisReportProps> = ({ dateRange, department }) => {
  // Mock exception type data
  const exceptionTypes = [
    { type: 'Amount Variance', count: 28, percentage: 42, avgResolutionTime: '3.2h' },
    { type: 'Missing GRN', count: 15, percentage: 22, avgResolutionTime: '6.1h' },
    { type: 'Date Mismatch', count: 12, percentage: 18, avgResolutionTime: '2.8h' },
    { type: 'Vendor Mismatch', count: 8, percentage: 12, avgResolutionTime: '4.5h' },
    { type: 'Quantity Variance', count: 4, percentage: 6, avgResolutionTime: '2.1h' }
  ];

  // Mock reviewer performance data
  const reviewerPerformance = [
    { reviewer: 'Sarah Johnson', assigned: 23, resolved: 21, avgTime: '3.1h', pending: 2 },
    { reviewer: 'Mike Chen', assigned: 18, resolved: 16, avgTime: '4.2h', pending: 2 },
    { reviewer: 'Emily Davis', assigned: 15, resolved: 14, avgTime: '2.8h', pending: 1 },
    { reviewer: 'David Wilson', assigned: 11, resolved: 9, avgTime: '5.1h', pending: 2 }
  ];

  // Mock resolution time metrics
  const resolutionMetrics = [
    { timeRange: '< 2 hours', count: 24, percentage: 36 },
    { timeRange: '2-4 hours', count: 19, percentage: 28 },
    { timeRange: '4-8 hours', count: 15, percentage: 22 },
    { timeRange: '8-24 hours', count: 7, percentage: 10 },
    { timeRange: '> 24 hours', count: 2, percentage: 3 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Exception Analysis</h3>
        <div className="text-xs text-gray-500">
          Date range: {dateRange} {department !== 'all' && `• Department: ${department}`}
        </div>
      </div>

      {/* Exception Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" />
            Exception Type Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exception Type</TableHead>
                <TableHead className="text-right">Count</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
                <TableHead className="text-right">Avg Resolution Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exceptionTypes.map((exception) => (
                <TableRow key={exception.type}>
                  <TableCell className="font-medium">{exception.type}</TableCell>
                  <TableCell className="text-right">{exception.count}</TableCell>
                  <TableCell className="text-right">{exception.percentage}%</TableCell>
                  <TableCell className="text-right">{exception.avgResolutionTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Resolution Time Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center">
            <Clock className="w-4 h-4 mr-2 text-blue-500" />
            Resolution Time Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time Range</TableHead>
                <TableHead className="text-right">Count</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resolutionMetrics.map((metric) => (
                <TableRow key={metric.timeRange}>
                  <TableCell className="font-medium">{metric.timeRange}</TableCell>
                  <TableCell className="text-right">{metric.count}</TableCell>
                  <TableCell className="text-right">{metric.percentage}%</TableCell>
                  <TableCell>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${metric.percentage}%` }}
                      ></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reviewer Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center">
            <User className="w-4 h-4 mr-2 text-green-500" />
            Reviewer Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reviewer</TableHead>
                <TableHead className="text-right">Assigned</TableHead>
                <TableHead className="text-right">Resolved</TableHead>
                <TableHead className="text-right">Avg Time</TableHead>
                <TableHead className="text-right">Pending</TableHead>
                <TableHead className="text-right">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviewerPerformance.map((reviewer) => {
                const resolutionRate = ((reviewer.resolved / reviewer.assigned) * 100).toFixed(1);
                const performanceColor = parseFloat(resolutionRate) >= 90 ? 'text-green-600' : 
                                       parseFloat(resolutionRate) >= 80 ? 'text-orange-600' : 'text-red-600';
                return (
                  <TableRow key={reviewer.reviewer}>
                    <TableCell className="font-medium">{reviewer.reviewer}</TableCell>
                    <TableCell className="text-right">{reviewer.assigned}</TableCell>
                    <TableCell className="text-right">{reviewer.resolved}</TableCell>
                    <TableCell className="text-right">{reviewer.avgTime}</TableCell>
                    <TableCell className="text-right">
                      <span className={reviewer.pending > 2 ? 'text-orange-600 font-medium' : ''}>
                        {reviewer.pending}
                      </span>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${performanceColor}`}>
                      {resolutionRate}%
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExceptionAnalysisReport;
