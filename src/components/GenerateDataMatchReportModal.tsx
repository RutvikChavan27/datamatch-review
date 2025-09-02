import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GenerateDataMatchReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GenerateDataMatchReportModal: React.FC<GenerateDataMatchReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    documentType: '',
    matchStatus: '',
    source: '',
    fromDate: '',
    toDate: '',
    exportFormat: 'PDF'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.documentType) {
      newErrors.documentType = 'Document type is required';
    }
    if (!formData.matchStatus) {
      newErrors.matchStatus = 'Match status is required';
    }
    if (!formData.source) {
      newErrors.source = 'Source is required';
    }
    if (!formData.fromDate) {
      newErrors.fromDate = 'From date is required';
    }
    if (!formData.toDate) {
      newErrors.toDate = 'To date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleGenerateReport = () => {
    if (!validateForm()) {
      return;
    }

    // Generate unique report ID using timestamp
    const reportId = Date.now();
    const reportUrl = `https://784acfb2-52ea-493e-a890-6dd8d4bc71e8.sandbox.lovable.dev/reports/data-match/${reportId}`;
    
    // Open new tab with report URL
    window.open(reportUrl, '_blank');
    
    // Show toast notification
    toast({
      title: "Report Generated",
      description: "Your report has been generated and opened in a new tab",
    });
    
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      documentType: '',
      matchStatus: '',
      source: '',
      fromDate: '',
      toDate: '',
      exportFormat: 'PDF'
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Generate Data Match Report
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Row 1: Document Type & Match Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="documentType">Document Type</Label>
              <Select 
                value={formData.documentType} 
                onValueChange={(value) => handleInputChange('documentType', value)}
              >
                <SelectTrigger className={errors.documentType ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select document types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="purchase-orders">Purchase Orders</SelectItem>
                  <SelectItem value="invoices">Invoices</SelectItem>
                  <SelectItem value="goods-receipt-notes">Goods Receipt Notes</SelectItem>
                </SelectContent>
              </Select>
              {errors.documentType && (
                <p className="text-sm text-destructive">{errors.documentType}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="matchStatus">Match Status</Label>
              <Select 
                value={formData.matchStatus} 
                onValueChange={(value) => handleInputChange('matchStatus', value)}
              >
                <SelectTrigger className={errors.matchStatus ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="successful">Successful</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              {errors.matchStatus && (
                <p className="text-sm text-destructive">{errors.matchStatus}</p>
              )}
            </div>
          </div>

          {/* Row 2: Source Selection */}
          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Select 
              value={formData.source} 
              onValueChange={(value) => handleInputChange('source', value)}
            >
              <SelectTrigger className={errors.source ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="manual-entry">Manual Entry</SelectItem>
                <SelectItem value="automated-processing">Automated Processing</SelectItem>
                <SelectItem value="imported-data">Imported Data</SelectItem>
              </SelectContent>
            </Select>
            {errors.source && (
              <p className="text-sm text-destructive">{errors.source}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromDate">From Date</Label>
              <Input
                id="fromDate"
                type="date"
                value={formData.fromDate}
                onChange={(e) => handleInputChange('fromDate', e.target.value)}
                className={errors.fromDate ? 'border-destructive' : ''}
              />
              {errors.fromDate && (
                <p className="text-sm text-destructive">{errors.fromDate}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="toDate">To Date</Label>
              <Input
                id="toDate"
                type="date"
                value={formData.toDate}
                onChange={(e) => handleInputChange('toDate', e.target.value)}
                className={errors.toDate ? 'border-destructive' : ''}
              />
              {errors.toDate && (
                <p className="text-sm text-destructive">{errors.toDate}</p>
              )}
            </div>
          </div>

          {/* Export Format */}
          <div className="space-y-2">
            <Label htmlFor="exportFormat">Export Format</Label>
            <Select 
              value={formData.exportFormat} 
              onValueChange={(value) => handleInputChange('exportFormat', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="CSV">CSV</SelectItem>
                <SelectItem value="Excel">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleGenerateReport}>
            Generate Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};