
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft, CheckCircle, AlertTriangle, XCircle, Edit } from 'lucide-react';

interface ExtractedField {
  value: string;
  confidence: number;
  status: 'high' | 'medium' | 'low';
}

interface ExtractedFieldsData {
  confidence: number;
  lastProcessed: string;
  fieldsExtracted: number;
  needsReview: number;
  fields: {
    po: Record<string, ExtractedField>;
    invoice: Record<string, ExtractedField>;
    grn: Record<string, ExtractedField>;
  };
}

interface ExtractedFieldsSidebarProps {
  extractedFields: ExtractedFieldsData;
  collapsed: boolean;
  onToggleCollapse: () => void;
  selectedField: string | null;
  onFieldClick: (fieldId: string) => void;
}

const ExtractedFieldsSidebar: React.FC<ExtractedFieldsSidebarProps> = ({
  extractedFields,
  collapsed,
  onToggleCollapse,
  selectedField,
  onFieldClick
}) => {
  const [selectedSection, setSelectedSection] = useState<string | null>('po');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'high':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'low':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const formatFieldName = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/([a-z])([A-Z])/g, '$1 $2');
  };

  if (collapsed) {
    return (
      <div className="w-12 border-l border-gray-200 bg-gray-50 flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0"
          onClick={onToggleCollapse}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-gray-200 bg-white flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">Extracted Fields</h3>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={onToggleCollapse}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Progress value={extractedFields.confidence} className="flex-1 h-2" />
          <span className="text-sm text-gray-600">{extractedFields.confidence}%</span>
        </div>
      </div>

      {/* Fields by Document */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Purchase Order Section */}
        <Card className="border-blue-200">
          <CardHeader 
            className="cursor-pointer py-3 px-4"
            onClick={() => setSelectedSection(selectedSection === 'po' ? null : 'po')}
          >
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Purchase Order</span>
              <Badge className="bg-blue-100 text-blue-800 text-xs">
                {Object.keys(extractedFields.fields.po).length} fields
              </Badge>
            </CardTitle>
          </CardHeader>
          {selectedSection === 'po' && (
            <CardContent className="pt-0 px-4 pb-4 space-y-2">
              {Object.entries(extractedFields.fields.po).map(([key, field]) => (
                <div
                  key={key}
                  className={`flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer ${
                    selectedField === `po-${key}` ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                  onClick={() => onFieldClick(`po-${key}`)}
                >
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    {getStatusIcon(field.status)}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {formatFieldName(key)}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {field.value}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">{field.confidence}%</span>
                    <Edit className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>

        {/* Invoice Section */}
        <Card className="border-green-200">
          <CardHeader 
            className="cursor-pointer py-3 px-4"
            onClick={() => setSelectedSection(selectedSection === 'invoice' ? null : 'invoice')}
          >
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Invoice</span>
              <Badge className="bg-green-100 text-green-800 text-xs">
                {Object.keys(extractedFields.fields.invoice).length} fields
              </Badge>
            </CardTitle>
          </CardHeader>
          {selectedSection === 'invoice' && (
            <CardContent className="pt-0 px-4 pb-4 space-y-2">
              {Object.entries(extractedFields.fields.invoice).map(([key, field]) => (
                <div
                  key={key}
                  className={`flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer ${
                    selectedField === `inv-${key}` ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                  onClick={() => onFieldClick(`inv-${key}`)}
                >
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    {getStatusIcon(field.status)}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {formatFieldName(key)}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {field.value}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">{field.confidence}%</span>
                    <Edit className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>

        {/* GRN Section */}
        <Card className="border-purple-200">
          <CardHeader 
            className="cursor-pointer py-3 px-4"
            onClick={() => setSelectedSection(selectedSection === 'grn' ? null : 'grn')}
          >
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Goods Receipt Note</span>
              <Badge className="bg-purple-100 text-purple-800 text-xs">
                {Object.keys(extractedFields.fields.grn).length} fields
              </Badge>
            </CardTitle>
          </CardHeader>
          {selectedSection === 'grn' && (
            <CardContent className="pt-0 px-4 pb-4 space-y-2">
              {Object.entries(extractedFields.fields.grn).map(([key, field]) => (
                <div
                  key={key}
                  className={`flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer ${
                    selectedField === `grn-${key}` ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                  onClick={() => onFieldClick(`grn-${key}`)}
                >
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    {getStatusIcon(field.status)}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {formatFieldName(key)}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {field.value}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">{field.confidence}%</span>
                    <Edit className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 p-4 space-y-2">
        <Button className="w-full bg-red-600 hover:bg-red-700 text-white text-sm">
          Review All Low Confidence
        </Button>
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm">
          Approve All High Confidence
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex-1 text-sm">
            Reprocess Failed
          </Button>
          <Button variant="outline" className="flex-1 text-sm">
            Manual Entry
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
        <div className="text-xs text-gray-600 space-y-1">
          <div>{extractedFields.fieldsExtracted} of 18 fields processed</div>
          <div>Last updated: {extractedFields.lastProcessed}</div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Auto-save active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtractedFieldsSidebar;
