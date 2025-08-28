import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { X, Download, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface DocumentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: string | null;
}

export const DocumentHistoryModal = ({ isOpen, onClose, document }: DocumentHistoryModalProps) => {
  const { toast } = useToast();

  const historyData = [
    {
      date: '12/15/2024',
      time: '10:30:25',
      module: 'Storage',
      moduleColor: 'bg-blue-100 text-blue-800',
      action: 'Document Moved',
      description: 'Moved from Processing to Completed folder by automated workflow',
      userName: 'System Auto'
    },
    {
      date: '12/15/2024',
      time: '09:45:12',
      module: 'Data Match',
      moduleColor: 'bg-green-100 text-green-800',
      action: 'Data Match Processing',
      description: 'Successfully matched with Purchase Order PO-2024-456',
      userName: 'Sarah Johnson'
    },
    {
      date: '12/15/2024',
      time: '09:15:08',
      module: 'Advanced Workflow',
      moduleColor: 'bg-purple-100 text-purple-800',
      action: 'Manual Review Completed',
      description: 'Document reviewed and validated, all fields confirmed',
      userName: 'John Smith'
    },
    {
      date: '12/15/2024',
      time: '08:45:33',
      module: 'Data Match',
      moduleColor: 'bg-green-100 text-green-800',
      action: 'OCR Processing',
      description: 'Text extraction completed with 98.5% confidence',
      userName: 'Auto Processor'
    },
    {
      date: '12/15/2024',
      time: '08:30:15',
      module: 'Storage',
      moduleColor: 'bg-blue-100 text-blue-800',
      action: 'Document Uploaded',
      description: 'File uploaded via web interface to Invoices folder',
      userName: 'Mike Davis'
    },
    {
      date: '12/14/2024',
      time: '16:22:41',
      module: 'PO Requests',
      moduleColor: 'bg-orange-100 text-orange-800',
      action: 'Workflow Triggered',
      description: 'Approval workflow initiated for document processing',
      userName: 'Lisa Wong'
    }
  ];

  const handleExportPDF = () => {
    toast({
      title: "PDF Export Started",
      description: "Your document history report is being generated and will download shortly.",
    });
  };

  const handleExportCSV = () => {
    toast({
      title: "CSV Export Started", 
      description: "Your document history data is being exported and will download shortly.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[700px] flex flex-col bg-white">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-gray-900">
            Document History
          </DialogTitle>
        </DialogHeader>

        {/* Document Info */}
        {document && (
          <div className="mb-2 p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Document:</p>
            <p className="font-medium">{document}</p>
          </div>
        )}

        {/* Scrollable Table Container */}
        <div className="flex-1 overflow-auto border rounded-lg">
          <Table>
            <TableHeader className="sticky top-0">
              <TableRow>
                <TableHead 
                  className="font-semibold border-r-0 border-b"
                  style={{ backgroundColor: '#ECF0F7', borderBottomColor: '#D6DEE9' }}
                >
                  Action Date
                </TableHead>
                <TableHead 
                  className="font-semibold border-r-0 border-b"
                  style={{ backgroundColor: '#ECF0F7', borderBottomColor: '#D6DEE9' }}
                >
                  Module
                </TableHead>
                <TableHead 
                  className="font-semibold border-r-0 border-b"
                  style={{ backgroundColor: '#ECF0F7', borderBottomColor: '#D6DEE9' }}
                >
                  Action
                </TableHead>
                <TableHead 
                  className="font-semibold border-r-0 border-b"
                  style={{ backgroundColor: '#ECF0F7', borderBottomColor: '#D6DEE9' }}
                >
                  Description
                </TableHead>
                <TableHead 
                  className="font-semibold border-r-0 border-b"
                  style={{ backgroundColor: '#ECF0F7', borderBottomColor: '#D6DEE9' }}
                >
                  User Name
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyData.map((item, index) => (
                <TableRow key={index} className="bg-white">
                  <TableCell className="font-medium bg-white border-r-0 py-2">
                    <div>
                      <div className="font-medium">{item.date}</div>
                      <div className="text-sm text-muted-foreground">{item.time}</div>
                    </div>
                  </TableCell>
                  <TableCell className="bg-white border-r-0 py-2">
                    <Badge className={`${item.moduleColor} border-0 text-xs font-medium`}>
                      {item.module}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium bg-white border-r-0 py-2">
                    {item.action}
                  </TableCell>
                  <TableCell className="bg-white border-r-0 text-sm py-2">
                    <div className="line-clamp-2">
                      {item.description}
                    </div>
                  </TableCell>
                  <TableCell className="bg-white border-r-0 py-2">
                    {item.userName}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
            Cancel
          </Button>
          <Button variant="outline" onClick={handleExportCSV} className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
            Export to CSV
          </Button>
          <Button onClick={handleExportPDF} className="bg-primary hover:bg-primary/90 text-primary-foreground border-0">
            Export to PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};