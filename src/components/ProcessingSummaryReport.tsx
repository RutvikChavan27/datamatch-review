
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface ProcessingSummaryReportProps {
  dateRange: string;
  department: string;
}

const ProcessingSummaryReport: React.FC<ProcessingSummaryReportProps> = ({ dateRange, department }) => {
  // Mock data - in real app this would come from API
  const reportData = [
    {
      date: '2024-06-09',
      poCount: 45,
      invoiceCount: 42,
      grnCount: 38,
      completeSets: { count: 35, percentage: 83 },
      autoApproved: { count: 28, percentage: 67 },
      manualReview: { count: 7, percentage: 17 },
      avgProcessingTime: '2.4h'
    },
    {
      date: '2024-06-08',
      poCount: 38,
      invoiceCount: 36,
      grnCount: 35,
      completeSets: { count: 32, percentage: 89 },
      autoApproved: { count: 26, percentage: 72 },
      manualReview: { count: 6, percentage: 17 },
      avgProcessingTime: '2.1h'
    },
    {
      date: '2024-06-07',
      poCount: 52,
      invoiceCount: 48,
      grnCount: 44,
      completeSets: { count: 41, percentage: 85 },
      autoApproved: { count: 35, percentage: 73 },
      manualReview: { count: 6, percentage: 12 },
      avgProcessingTime: '1.9h'
    },
    {
      date: '2024-06-06',
      poCount: 41,
      invoiceCount: 39,
      grnCount: 37,
      completeSets: { count: 34, percentage: 87 },
      autoApproved: { count: 29, percentage: 76 },
      manualReview: { count: 5, percentage: 13 },
      avgProcessingTime: '2.2h'
    },
    {
      date: '2024-06-05',
      poCount: 47,
      invoiceCount: 44,
      grnCount: 41,
      completeSets: { count: 38, percentage: 86 },
      autoApproved: { count: 31, percentage: 70 },
      manualReview: { count: 7, percentage: 16 },
      avgProcessingTime: '2.6h'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Processing Summary by Date</h3>
        <div className="text-xs text-gray-500">
          Showing data for: {dateRange} {department !== 'all' && `• Department: ${department}`}
        </div>
      </div>
      
      <div className="shadow-lg shadow-black/5">
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-y-auto" style={{ maxHeight: `calc(100vh - 320px)` }}>
            <Table className="min-w-full" style={{ tableLayout: 'fixed' }}>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                  <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Date/Period</TableHead>
                  <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Documents Uploaded</TableHead>
                  <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Complete Sets</TableHead>
                  <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Auto-Approved</TableHead>
                  <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Manual Review</TableHead>
                  <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Avg Processing Time</TableHead>
                  <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((row) => (
                  <TableRow key={row.date} className="h-10 hover:bg-muted/50 transition-colors">
                    <TableCell className="py-2 border-r-0 text-sm text-foreground">{row.date}</TableCell>
                    <TableCell className="py-2 border-r-0 text-sm text-foreground">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          PO: {row.poCount}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          INV: {row.invoiceCount}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          GRN: {row.grnCount}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 border-r-0 text-sm text-foreground">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{row.completeSets.count}</span>
                        <span className="text-xs text-muted-foreground">({row.completeSets.percentage}%)</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 border-r-0 text-sm text-foreground">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-green-600">{row.autoApproved.count}</span>
                        <span className="text-xs text-muted-foreground">({row.autoApproved.percentage}%)</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 border-r-0 text-sm text-foreground">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-amber-600">{row.manualReview.count}</span>
                        <span className="text-xs text-muted-foreground">({row.manualReview.percentage}%)</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 border-r-0 text-sm text-foreground">{row.avgProcessingTime}</TableCell>
                    <TableCell className="py-2 border-r-0 text-sm">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingSummaryReport;
