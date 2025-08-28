import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, ExternalLink, FileText } from 'lucide-react';
import { DocumentHistoryModal } from './DocumentHistoryModal';

const RecentActivity = () => {
  const [selectedRow, setSelectedRow] = useState<number | null>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const recentActivities = [
    {
      id: 1,
      date: '12/15/2024',
      time: '10:30 AM',
      module: 'Storage',
      moduleColor: 'bg-blue-100 text-blue-800',
      action: 'Document Moved',
      description: 'Invoice_2024_001.pdf moved to Processed folder',
      userName: 'John Smith',
      document: 'Invoice_2024_001.pdf'
    },
    {
      id: 2,
      date: '12/15/2024',
      time: '09:45 AM',
      module: 'Data Match',
      moduleColor: 'bg-green-100 text-green-800',
      action: 'Data Match Processing',
      description: 'PO-2024-456 successfully matched with invoice',
      userName: 'Sarah Johnson',
      document: 'PO-2024-456.pdf'
    },
    {
      id: 3,
      date: '12/15/2024',
      time: '09:12 AM',
      module: 'Advanced Workflow',
      moduleColor: 'bg-purple-100 text-purple-800',
      action: 'Workflow Triggered',
      description: 'Approval workflow initiated for Contract_ABC_2024',
      userName: 'Mike Davis',
      document: 'Contract_ABC_2024.pdf'
    },
    {
      id: 4,
      date: '12/15/2024',
      time: '08:30 AM',
      module: 'PO Requests',
      moduleColor: 'bg-orange-100 text-orange-800',
      action: 'PO Approval',
      description: 'Purchase Order PO-2024-789 approved by manager',
      userName: 'Lisa Wong',
      document: 'PO-2024-789.pdf'
    },
    {
      id: 5,
      date: '12/14/2024',
      time: '04:45 PM',
      module: 'Storage',
      moduleColor: 'bg-blue-100 text-blue-800',
      action: 'Document Access',
      description: 'Financial_Report_Q4.xlsx accessed and downloaded',
      userName: 'Robert Chen',
      document: 'Financial_Report_Q4.xlsx'
    },
    {
      id: 6,
      date: '12/14/2024',
      time: '03:20 PM',
      module: 'Data Match',
      moduleColor: 'bg-green-100 text-green-800',
      action: 'Manual Review',
      description: 'Invoice INV-2024-890 flagged for manual review',
      userName: 'Emily Rodriguez',
      document: 'INV-2024-890.pdf'
    }
  ];

  const getDocumentActivities = (documentName: string) => [
    {
      type: 'uploaded',
      color: 'bg-blue-500',
      action: 'Document Uploaded',
      description: `${documentName} uploaded to system`,
      timestamp: '12/15/2024 08:00 AM',
      user: 'System Auto'
    },
    {
      type: 'processing',
      color: 'bg-yellow-500',
      action: 'Processing Started',
      description: 'OCR and data extraction initiated',
      timestamp: '12/15/2024 08:02 AM',
      user: 'Auto Processor'
    },
    {
      type: 'reviewed',
      color: 'bg-green-500',
      action: 'Manual Review',
      description: 'Document reviewed and validated',
      timestamp: '12/15/2024 09:15 AM',
      user: 'John Smith'
    },
    {
      type: 'matched',
      color: 'bg-purple-500',
      action: 'Data Matched',
      description: 'Successfully matched with existing records',
      timestamp: '12/15/2024 09:45 AM',
      user: 'Sarah Johnson'
    },
    {
      type: 'approved',
      color: 'bg-emerald-500',
      action: 'Approved',
      description: 'Document approved and moved to final folder',
      timestamp: '12/15/2024 10:30 AM',
      user: 'Mike Davis'
    }
  ];

  const selectedDocument = selectedRow !== null ? recentActivities[selectedRow]?.document : null;
  const documentActivities = selectedDocument ? getDocumentActivities(selectedDocument) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
          <p className="text-sm text-muted-foreground">Track all system activities and document changes</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left Side - Recent Activity Table (70%) */}
        <div className="flex-1">
          <div className="shadow-lg shadow-black/5">
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="overflow-y-auto" style={{ maxHeight: `calc(100vh - 320px)` }}>
                <Table className="min-w-full" style={{ tableLayout: 'fixed' }}>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                      <TableHead 
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}
                      >
                        Action Date
                      </TableHead>
                      <TableHead 
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}
                      >
                        Module
                      </TableHead>
                      <TableHead 
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}
                      >
                        Action
                      </TableHead>
                      <TableHead 
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}
                      >
                        Description
                      </TableHead>
                      <TableHead 
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t"
                        style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}
                      >
                        User Name
                      </TableHead>
                      <TableHead 
                        className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t w-12"
                        style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}
                      >
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActivities.map((activity, index) => (
                      <TableRow 
                        key={activity.id} 
                        className={`cursor-pointer h-10 hover:bg-muted/50 transition-colors ${
                          selectedRow === index 
                            ? 'bg-primary/5 border-l-4 border-l-primary' 
                            : 'bg-white'
                        }`}
                        onClick={() => setSelectedRow(index)}
                      >
                        <TableCell className="font-medium py-2 border-r-0 text-sm text-foreground">
                          <div>
                            <div className="font-medium">{activity.date}</div>
                            <div className="text-sm text-muted-foreground">{activity.time}</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-sm">
                          <Badge className={`${activity.moduleColor} border-0 text-xs font-medium`}>
                            {activity.module}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium py-2 border-r-0 text-sm text-foreground">
                          {activity.action}
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">
                          {activity.description}
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground">
                          {activity.userName}
                        </TableCell>
                        <TableCell className="py-2 border-r-0 text-center">
                          <button
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsModalOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Document History Panel (30%) */}
        <div className="w-96 relative">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Document History</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  Full History
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selected Document */}
              <div className={`relative p-4 rounded-lg border-2 transition-all ${
                selectedRow !== null 
                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                  : 'bg-muted/30 border-muted'
              }`}>
                {/* Triangle notch on left edge of document box */}
                {selectedRow !== null && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-primary z-10" />
                )}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Document</h4>
                    <p className="font-bold text-base text-foreground">
                      {selectedDocument || 'Select a row to view document history'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Last 5 Activities */}
              {selectedDocument && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-3">Last 5 Activities</h4>
                  <div className="space-y-3">
                    {documentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full ${activity.color} mt-2 flex-shrink-0`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">{activity.action}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{activity.description}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                            <p className="text-xs text-muted-foreground">{activity.user}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <DocumentHistoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        document={selectedDocument}
      />
    </div>
  );
};

export default RecentActivity;