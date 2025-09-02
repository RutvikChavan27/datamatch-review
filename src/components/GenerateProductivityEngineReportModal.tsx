import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GenerateProductivityEngineReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GenerateProductivityEngineReportModal: React.FC<GenerateProductivityEngineReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    workflowType: 'All Workflows',
    performanceMetric: 'All Metrics',
    department: 'All Departments',
    userAssignee: 'All Users',
    workflowStatus: 'All Statuses',
    fromDate: '',
    toDate: '',
    exportFormat: 'PDF'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fromDate) {
      newErrors.fromDate = 'From date is required';
    }
    if (!formData.toDate) {
      newErrors.toDate = 'To date is required';
    }
    
    // Validate that "To Date" is after "From Date"
    if (formData.fromDate && formData.toDate) {
      const fromDate = new Date(formData.fromDate);
      const toDate = new Date(formData.toDate);
      if (toDate <= fromDate) {
        newErrors.toDate = 'To date must be after from date';
      }
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
    const reportUrl = `/reports/productivity/${reportId}`;
    
    // Open new tab with report URL
    window.open(reportUrl, '_blank');
    
    // Show toast notification
    toast({
      title: "Report Generated",
      description: "Productivity Engine report generated successfully",
    });
    
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      workflowType: 'All Workflows',
      performanceMetric: 'All Metrics',
      department: 'All Departments',
      userAssignee: 'All Users',
      workflowStatus: 'All Statuses',
      fromDate: '',
      toDate: '',
      exportFormat: 'PDF'
    });
    setErrors({});
    onClose();
  };

  // Set default date range to last 30 days
  React.useEffect(() => {
    if (isOpen && !formData.fromDate && !formData.toDate) {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      
      setFormData(prev => ({
        ...prev,
        fromDate: thirtyDaysAgo.toISOString().split('T')[0],
        toDate: today.toISOString().split('T')[0]
      }));
    }
  }, [isOpen, formData.fromDate, formData.toDate]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Generate Productivity Engine Report
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Row 1: Workflow Type & Performance Metric */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workflowType">Workflow Type</Label>
              <Select 
                value={formData.workflowType} 
                onValueChange={(value) => handleInputChange('workflowType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Workflows">All Workflows</SelectItem>
                  <SelectItem value="Document Processing">Document Processing</SelectItem>
                  <SelectItem value="Invoice Processing">Invoice Processing</SelectItem>
                  <SelectItem value="Purchase Order">Purchase Order</SelectItem>
                  <SelectItem value="Manual Review">Manual Review</SelectItem>
                  <SelectItem value="Approval Workflow">Approval Workflow</SelectItem>
                  <SelectItem value="Exception Handling">Exception Handling</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="performanceMetric">Performance Metric</Label>
              <Select 
                value={formData.performanceMetric} 
                onValueChange={(value) => handleInputChange('performanceMetric', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Metrics">All Metrics</SelectItem>
                  <SelectItem value="Completion Time">Completion Time</SelectItem>
                  <SelectItem value="Throughput">Throughput</SelectItem>
                  <SelectItem value="Success Rate">Success Rate</SelectItem>
                  <SelectItem value="Error Rate">Error Rate</SelectItem>
                  <SelectItem value="Queue Time">Queue Time</SelectItem>
                  <SelectItem value="Processing Speed">Processing Speed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Department & User/Assignee */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select 
                value={formData.department} 
                onValueChange={(value) => handleInputChange('department', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Departments">All Departments</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Procurement">Procurement</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userAssignee">User/Assignee</Label>
              <Select 
                value={formData.userAssignee} 
                onValueChange={(value) => handleInputChange('userAssignee', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Users">All Users</SelectItem>
                  <SelectItem value="John Smith">John Smith</SelectItem>
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
                  <SelectItem value="Lisa Chen">Lisa Chen</SelectItem>
                  <SelectItem value="David Brown">David Brown</SelectItem>
                  <SelectItem value="System Automated">System Automated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3: Workflow Status */}
          <div className="space-y-2">
            <Label htmlFor="workflowStatus">Workflow Status</Label>
            <Select 
              value={formData.workflowStatus} 
              onValueChange={(value) => handleInputChange('workflowStatus', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Statuses">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
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
                <SelectItem value="Excel">Excel</SelectItem>
                <SelectItem value="CSV">CSV</SelectItem>
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