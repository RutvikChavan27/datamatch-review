
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';

interface Field {
  id: string;
  name: string;
  value: string;
  bbox: { x: number; y: number; width: number; height: number };
  confidence: number;
}

interface BoundingBoxProps {
  field: Field;
  isSelected: boolean;
  onClick: () => void;
}

const BoundingBox: React.FC<BoundingBoxProps> = ({ field, isSelected, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getConfidenceStyle = (confidence: number) => {
    if (confidence >= 90) {
      return {
        border: '1px solid #10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        labelColor: 'text-green-700',
        show: isHovered || isSelected
      };
    } else if (confidence >= 70) {
      return {
        border: '2px solid #F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        labelColor: 'text-orange-700',
        show: true
      };
    } else {
      return {
        border: '3px solid #EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        labelColor: 'text-red-700',
        show: true
      };
    }
  };

  const style = getConfidenceStyle(field.confidence);

  if (!style.show && !isHovered && !isSelected) {
    return null;
  }

  return (
    <div
      className={`absolute cursor-pointer transition-all duration-200 ${
        field.confidence < 70 ? 'animate-pulse' : ''
      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        left: `${field.bbox.x}px`,
        top: `${field.bbox.y}px`,
        width: `${field.bbox.width}px`,
        height: `${field.bbox.height}px`,
        border: style.border,
        backgroundColor: style.backgroundColor,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Field Label */}
      <div
        className={`absolute -top-6 left-0 z-10 ${style.labelColor}`}
        style={{ fontSize: '10px', fontWeight: '500' }}
      >
        <div className="flex items-center space-x-1 bg-white px-1 py-0.5 rounded shadow-sm border">
          <span>{field.name}</span>
          {field.confidence < 90 && (
            <span className="text-xs">
              {field.confidence < 70 ? 'Needs Review' : 'Review'}
            </span>
          )}
          {isHovered && (
            <Edit className="w-3 h-3" />
          )}
        </div>
      </div>

      {/* Confidence Badge */}
      {(isHovered || isSelected) && (
        <div className="absolute -bottom-6 right-0 z-10">
          <Badge
            className={`text-xs ${
              field.confidence >= 90
                ? 'bg-green-100 text-green-800'
                : field.confidence >= 70
                ? 'bg-orange-100 text-orange-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {field.confidence}%
          </Badge>
        </div>
      )}
    </div>
  );
};

export default BoundingBox;
