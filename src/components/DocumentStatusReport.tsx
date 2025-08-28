
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DocumentStatusReportProps {
  statuses: string[];
  dateRange: string;
}

const DocumentStatusReport: React.FC<DocumentStatusReportProps> = ({ statuses, dateRange }) => {
  // Mock data for pie chart
  const statusData = [
    { name: 'Auto-Verified', value: 324, color: '#10B981' },
    { name: 'Manual Review', value: 23, color: '#F59E0B' },
    { name: 'Incomplete', value: 45, color: '#EF4444' },
    { name: 'In Review', value: 12, color: '#3B82F6' },
    { name: 'Verified', value: 89, color: '#059669' },
    { name: 'Rejected', value: 8, color: '#DC2626' }
  ];

  // Mock aging analysis data
  const agingData = [
    { status: 'Auto-Verified', '0-1 days': 298, '2-7 days': 26, '8-30 days': 0, '30+ days': 0 },
    { status: 'Manual Review', '0-1 days': 15, '2-7 days': 6, '8-30 days': 2, '30+ days': 0 },
    { status: 'Incomplete', '0-1 days': 12, '2-7 days': 18, '8-30 days': 12, '30+ days': 3 },
    { status: 'In Review', '0-1 days': 8, '2-7 days': 3, '8-30 days': 1, '30+ days': 0 },
    { status: 'Verified', '0-1 days': 67, '2-7 days': 22, '8-30 days': 0, '30+ days': 0 },
    { status: 'Rejected', '0-1 days': 5, '2-7 days': 3, '8-30 days': 0, '30+ days': 0 }
  ];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Auto-Verified': 'text-green-600',
      'Manual Review': 'text-orange-600', 
      'Incomplete': 'text-red-600',
      'In Review': 'text-blue-600',
      'Verified': 'text-green-700',
      'Rejected': 'text-red-700'
    };
    return colors[status] || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Document Status Overview</h3>
        <div className="text-xs text-gray-500">
          Date range: {dateRange}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Breakdown Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statusData.map((status) => {
                  const total = statusData.reduce((sum, item) => sum + item.value, 0);
                  const percentage = ((status.value / total) * 100).toFixed(1);
                  return (
                    <TableRow key={status.name}>
                      <TableCell className={`font-medium ${getStatusColor(status.name)}`}>
                        {status.name}
                      </TableCell>
                      <TableCell className="text-right">{status.value}</TableCell>
                      <TableCell className="text-right">{percentage}%</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Aging Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Aging Analysis - Documents by Days in System</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">0-1 days</TableHead>
                <TableHead className="text-right">2-7 days</TableHead>
                <TableHead className="text-right">8-30 days</TableHead>
                <TableHead className="text-right">30+ days</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agingData.map((row) => {
                const total = row['0-1 days'] + row['2-7 days'] + row['8-30 days'] + row['30+ days'];
                return (
                  <TableRow key={row.status}>
                    <TableCell className={`font-medium ${getStatusColor(row.status)}`}>
                      {row.status}
                    </TableCell>
                    <TableCell className="text-right">{row['0-1 days']}</TableCell>
                    <TableCell className="text-right">{row['2-7 days']}</TableCell>
                    <TableCell className="text-right">
                      <span className={row['8-30 days'] > 0 ? 'text-orange-600 font-medium' : ''}>
                        {row['8-30 days']}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={row['30+ days'] > 0 ? 'text-red-600 font-medium' : ''}>
                        {row['30+ days']}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">{total}</TableCell>
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

export default DocumentStatusReport;
