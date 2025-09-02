import React from 'react';
import { ActionOption } from '../types/workflow.types';
import { CheckCircle } from 'lucide-react';

interface CompactActionCardProps {
  action: ActionOption;
  isSelected: boolean;
  onToggle: () => void;
}

export const CompactActionCard: React.FC<CompactActionCardProps> = ({
  action,
  isSelected,
  onToggle
}) => {
  return (
    <div 
      style={{ backgroundColor: '#FFFFFF' }}
      className={`
        relative p-2 rounded-lg border cursor-pointer transition-all duration-200 group h-[60px]
        ${isSelected 
          ? 'border-[hsl(var(--color-accent-blue))] shadow-sm' 
          : 'border-border hover:border-[hsl(var(--color-accent-blue))]/50 hover:shadow-sm'
        }
      `}
      onClick={onToggle}
    >
      {/* Selection Indicator */}
      <div className={`
        absolute top-1.5 right-1.5 w-3 h-3 rounded-full border transition-all duration-200
        ${isSelected 
          ? 'border-[hsl(var(--color-accent-blue))] bg-[hsl(var(--color-accent-blue))]' 
          : 'border-muted-foreground/30 group-hover:border-[hsl(var(--color-accent-blue))]/50'
        }
      `}>
        {isSelected && (
          <CheckCircle className="w-3 h-3 text-white" />
        )}
      </div>
      
      <div className="flex items-start gap-2 h-full">
        {/* Icon */}
        <div className="text-muted-foreground mt-0.5 flex-shrink-0">
          {typeof action.icon === 'string' ? (
            <span className="text-sm">{action.icon}</span>
          ) : (
            React.cloneElement(action.icon as React.ReactElement, { className: "w-3.5 h-3.5" })
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <h4 className={`
            text-xs font-medium transition-colors duration-200 leading-tight mb-0.5
            ${isSelected ? 'text-[hsl(var(--color-accent-blue))]' : 'text-foreground group-hover:text-[hsl(var(--color-accent-blue))]'}
          `}>
            {action.label}
          </h4>
          
          <p className="text-xs text-muted-foreground leading-tight line-clamp-1 mb-1">
            {action.description}
          </p>
          
          {/* Category Tag - inline */}
          <span className={`
            inline-block px-1.5 py-0.5 text-xs rounded-full
            ${isSelected 
              ? 'bg-[hsl(var(--color-accent-blue-bg))] text-[hsl(var(--color-accent-blue))]' 
              : 'bg-muted text-muted-foreground'
            }
          `}>
            {action.category}
          </span>
        </div>
      </div>
    </div>
  );
};