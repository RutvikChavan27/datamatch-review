import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react';
interface EnhancedDocumentSetHeaderProps {
  documentSetId: string;
  poNumber: string;
  vendor: string;
  totalAmount: string;
  status: string;
  priority: 'high' | 'medium' | 'low';
  issuesSummary: {
    majorIssues: number;
    minorIssues: number;
    totalVariance: string;
  };
  documentCounts?: {
    po: number;
    invoice: number;
    grn: number;
  };
}
const EnhancedDocumentSetHeader: React.FC<EnhancedDocumentSetHeaderProps> = ({
  documentSetId,
  poNumber,
  vendor,
  totalAmount,
  status,
  priority,
  issuesSummary,
  documentCounts
}) => {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High Priority</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50 text-xs">Medium Priority</Badge>;
      case 'low':
        return <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 text-xs">Low Priority</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Unknown Priority</Badge>;
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ready for Verification':
        return <Badge variant="outline" className="bg-blue-100 border-0 text-xs" style={{ color: '#333333' }}>Ready for Verification</Badge>;
      case 'Missing Documents':
        return <Badge variant="outline" className="bg-red-100 border-0 text-xs" style={{ color: '#333333' }}>Missing Documents</Badge>;
      case 'Processing Failed':
        return <Badge variant="outline" className="bg-red-100 border-0 text-xs" style={{ color: '#333333' }}>Processing Failed</Badge>;
      case 'Verified':
        return <Badge variant="outline" className="bg-green-100 border-0 text-xs" style={{ color: '#333333' }}>Verified</Badge>;
      case 'Incomplete':
        return <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50 text-xs">Incomplete</Badge>;
      case 'Rejected':
        return <Badge variant="destructive" className="text-xs">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };
  const isReadyForVerification = status === 'Ready for Verification';
  return <div className="rounded-xl shadow-lg border bg-card">
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* Left section - Document Set Info */}
          <div className="flex items-center gap-6">
            <div className="space-y-2">
              <h2 className="text-heading">
                {vendor} | {poNumber} | {totalAmount}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-caption">Set {documentSetId}</span>
                {getStatusBadge(status)}
                {getPriorityBadge(priority)}
                {/* Document Presence Indicators - Always shown */}
                {documentCounts && <div className="flex items-center gap-4 ml-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-caption">PO: {documentCounts.po}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-caption">INV: {documentCounts.invoice}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-caption">GRN: {documentCounts.grn}</span>
                    </div>
                  </div>}
              </div>
            </div>
          </div>

          {/* Right section - Actions */}
          <div className="flex items-center gap-3">
            <Button 
              variant="secondary" 
              size="sm"
              className="gap-2 inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white border border-gray-500 text-gray-700 hover:bg-gray-50 hover:border-gray-600 shadow-sm hover:shadow-md h-9 px-4 py-2"
              onClick={() => {
                console.log('Issues Summary clicked');
              }}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{isReadyForVerification ? 'Variance Analysis' : 'Issues Summary'}</span>
              {(issuesSummary.majorIssues > 0 || issuesSummary.minorIssues > 0) ? (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {issuesSummary.majorIssues + issuesSummary.minorIssues}
                </Badge>
              ) : (
                isReadyForVerification ? null : <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>;
};
export default EnhancedDocumentSetHeader;