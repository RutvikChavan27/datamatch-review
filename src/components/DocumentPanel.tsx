
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ZoomIn, ZoomOut, Maximize, ChevronLeft, ChevronRight } from 'lucide-react';
import BoundingBox from './BoundingBox';

interface Field {
  id: string;
  name: string;
  value: string;
  bbox: { x: number; y: number; width: number; height: number };
  confidence: number;
}

interface DocumentPanelProps {
  title: string;
  subtitle: string;
  confidence: number;
  document?: { id: string; name: string; type: string; url: string };
  zoom: number;
  onZoomChange: (zoom: number) => void;
  selectedField: string | null;
  onFieldClick: (fieldId: string) => void;
  fields: Field[];
}

const DocumentPanel: React.FC<DocumentPanelProps> = ({
  title,
  subtitle,
  confidence,
  document,
  zoom,
  onZoomChange,
  selectedField,
  onFieldClick,
  fields
}) => {
  const getConfidenceBadge = (conf: number) => {
    if (conf >= 90) return <Badge className="bg-green-100 text-green-800 text-xs">{conf}% extraction</Badge>;
    if (conf >= 70) return <Badge className="bg-orange-100 text-orange-800 text-xs">{conf}% extraction</Badge>;
    return <Badge className="bg-red-100 text-red-800 text-xs">{conf}% extraction</Badge>;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Panel Header */}
      <div className="h-12 border-b border-gray-200 px-4 py-2 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-gray-900 truncate">{title}</div>
            <div className="text-xs text-gray-600 truncate">{subtitle}</div>
          </div>
          <div className="flex items-center space-x-2">
            {getConfidenceBadge(confidence)}
            <span className="text-xs text-gray-500">1 of 1</span>
          </div>
        </div>
      </div>

      {/* Document Controls */}
      <div className="h-10 border-b border-gray-200 px-4 py-1 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onZoomChange(zoom - 25)}
            >
              <ZoomOut className="w-3 h-3" />
            </Button>
            <span className="text-xs text-gray-600 px-2">{zoom}%</span>
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onZoomChange(zoom + 25)}
            >
              <ZoomIn className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-xs px-2 ml-2"
              onClick={() => onZoomChange(100)}
            >
              Fit
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-6 w-6 p-0"
          >
            <Maximize className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Document Viewer */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        <div className="relative bg-white shadow-lg" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}>
          {document && (
            <div className="relative">
              <img
                src={document.url}
                alt={document.name}
                className="w-full h-auto"
                style={{ minHeight: '600px', objectFit: 'contain' }}
              />
              
              {/* Bounding Boxes */}
              {fields.map((field) => (
                <BoundingBox
                  key={field.id}
                  field={field}
                  isSelected={selectedField === field.id}
                  onClick={() => onFieldClick(field.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPanel;
