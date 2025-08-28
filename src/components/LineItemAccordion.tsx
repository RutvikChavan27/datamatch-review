
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Check, X, AlertTriangle, CheckCircle } from 'lucide-react';

interface FieldComparison {
  name: string;
  po: string;
  invoice: string;
  grn: string;
  variance: {
    status: 'match' | 'variance' | 'mismatch' | 'multi_variance' | 'consistent';
    description: string;
    statusIcon: string;
  };
}

interface LineItemData {
  id: number;
  sku: string;
  description: string;
  status: 'major_issue' | 'minor_issue' | 'perfect_match';
  value: string;
  totalVariance: string;
  variancePercentage: string;
  issueCount: number;
  fields: FieldComparison[];
}

interface LineItemAccordionProps {
  lineItem: LineItemData;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  editedValues: {[key: string]: string};
  approvedFields: Set<string>;
  rejectedFields: Set<string>;
  onValueChange: (itemId: number, fieldName: string, value: string) => void;
  onApprove: (itemId: number, fieldName: string) => void;
  onReject: (itemId: number, fieldName: string) => void;
  onApproveAll: (itemId: number) => void;
  onRejectAll: (itemId: number) => void;
  documentSetStatus?: string;
}

const LineItemAccordion: React.FC<LineItemAccordionProps> = ({
  lineItem,
  isExpanded,
  onToggleExpanded,
  editedValues,
  approvedFields,
  rejectedFields,
  onValueChange,
  onApprove,
  onReject,
  onApproveAll,
  onRejectAll,
  documentSetStatus = 'Ready for Review'
}) => {
  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'major_issue':
        return <div className="w-3 h-3 rounded-full bg-red-500"></div>;
      case 'minor_issue':
        return <div className="w-3 h-3 rounded-full bg-yellow-500"></div>;
      case 'perfect_match':
        return <div className="w-3 h-3 rounded-full bg-green-500"></div>;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-400"></div>;
    }
  };

  const getVarianceBadge = (variance: { status: string; description: string; statusIcon: string }) => {
    switch (variance.status) {
      case 'mismatch':
        return <div className="text-red-600 text-xs">{variance.description}</div>;
      case 'variance':
        return <div className="text-yellow-600 text-xs">{variance.description}</div>;
      case 'multi_variance':
        return (
          <div className="space-y-1">
            <div className="font-medium text-red-600 text-xs">Multi variance 🔴</div>
            {variance.description.split('\n').map((line, i) => (
              <div key={i} className="text-red-600 text-xs">{line}</div>
            ))}
          </div>
        );
      case 'match':
        return (
          <div className="flex items-center text-green-600 text-xs">
            <Check className="w-3 h-3 mr-1" /> Perfect match
          </div>
        );
      case 'consistent':
        return (
          <div className="flex items-center text-green-600 text-xs">
            <Check className="w-3 h-3 mr-1" /> Consistent
          </div>
        );
      default:
        return <div className="text-xs">{variance.description}</div>;
    }
  };

  const isReadyForReview = documentSetStatus === 'Ready for Review';

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Collapsed Row */}
      <div 
        className={`h-12 flex items-center px-4 cursor-pointer hover:bg-gray-50 ${
          isExpanded ? 'bg-blue-50 border-b border-blue-200' : 'bg-white'
        }`}
        onClick={onToggleExpanded}
      >
        {/* Expand/Collapse Icon */}
        <div className="mr-3">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          )}
        </div>

        {/* Status Indicator */}
        <div className="mr-3">
          {getStatusIndicator(lineItem.status)}
        </div>

        {/* Item Name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900 truncate">
              {lineItem.description}
            </span>
            <span className="text-sm text-gray-500">
              ({lineItem.sku})
            </span>
          </div>
        </div>

        {/* Total Variance - More prominent for ready for review */}
        <div className="mx-4">
          <span className={`text-sm font-medium ${
            isReadyForReview ? 'text-gray-900' : 'text-gray-600'
          }`}>
            {lineItem.totalVariance} ({lineItem.variancePercentage})
          </span>
        </div>

        {/* Issue Count - Less prominent for ready for review */}
        <div className="mx-4">
          <span className={`text-sm ${
            isReadyForReview ? 'text-gray-500' : 'text-gray-600'
          }`}>
            {lineItem.issueCount} {lineItem.issueCount === 1 ? 'issue' : 'issues'}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-7 px-3 text-xs border-green-400 text-green-700 hover:bg-green-50"
            onClick={() => onApproveAll(lineItem.id)}
          >
            ✓ Approve
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-7 px-3 text-xs border-red-400 text-red-700 hover:bg-red-50"
            onClick={() => onRejectAll(lineItem.id)}
          >
            ✗ Reject
          </Button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="bg-gray-50 border-t border-gray-200">
          {/* Three-column header for ready for review, simplified for others */}
          <div className="grid grid-cols-7 gap-4 px-4 py-2 bg-gray-100 text-xs font-medium text-gray-700">
            <div>Field</div>
            {isReadyForReview ? (
              <>
                <div>PO</div>
                <div>Invoice</div>
                <div>GRN</div>
              </>
            ) : (
              <div className="col-span-2">Document Values</div>
            )}
            <div>Edited Value</div>
            <div>Variance Analysis</div>
            <div>Actions</div>
          </div>

          {/* Field Rows */}
          {lineItem.fields.map((field, fieldIndex) => {
            const fieldKey = `${lineItem.id}-${field.name}`;
            const isApproved = approvedFields.has(fieldKey);
            const isRejected = rejectedFields.has(fieldKey);
            const editedValue = editedValues[fieldKey] || '';

            return (
              <div 
                key={fieldIndex}
                className={`grid grid-cols-7 gap-4 px-4 py-2 border-b border-gray-200 ${
                  isApproved ? 'bg-green-50' : 
                  isRejected ? 'bg-red-50' : 
                  'bg-white'
                }`}
              >
                <div className="text-sm font-medium text-gray-900">{field.name}</div>
                
                {isReadyForReview ? (
                  <>
                    <div className="text-sm text-gray-700">{field.po}</div>
                    <div className="text-sm text-gray-700">{field.invoice}</div>
                    <div className="text-sm text-gray-700">{field.grn}</div>
                  </>
                ) : (
                  <div className="col-span-2 text-sm text-gray-700">
                    PO: {field.po} | INV: {field.invoice} | GRN: {field.grn}
                  </div>
                )}

                <div>
                  <Input
                    value={editedValue}
                    onChange={(e) => onValueChange(lineItem.id, field.name, e.target.value)}
                    className="h-7 w-full text-sm"
                    placeholder="Edit value..."
                  />
                </div>

                <div>
                  {getVarianceBadge(field.variance)}
                </div>

                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className={`h-6 w-6 p-0 ${
                      isApproved ? 'bg-green-100 border-green-500' : 'border-green-400 hover:bg-green-50'
                    }`}
                    onClick={() => onApprove(lineItem.id, field.name)}
                  >
                    <Check className={`w-3 h-3 ${isApproved ? 'text-green-700' : 'text-green-600'}`} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className={`h-6 w-6 p-0 ${
                      isRejected ? 'bg-red-100 border-red-500' : 'border-red-400 hover:bg-red-50'
                    }`}
                    onClick={() => onReject(lineItem.id, field.name)}
                  >
                    <X className={`w-3 h-3 ${isRejected ? 'text-red-700' : 'text-red-600'}`} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LineItemAccordion;
