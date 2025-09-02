
import React from 'react';
import { ActionOption } from '../types/workflow.types';

interface ActionCardProps {
  action: ActionOption;
  isSelected: boolean;
  onToggle: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  action,
  isSelected,
  onToggle
}) => {
  return (
    <div 
      style={{ backgroundColor: '#FFFFFF' }}
      className={`
        relative p-4 rounded-xl border cursor-pointer transition-all duration-200 group shadow-sm
        ${isSelected 
          ? 'border-[hsl(var(--color-accent-blue))] shadow-md shadow-primary/10' 
          : 'border-border hover:border-[hsl(var(--color-accent-blue))]/50 hover:shadow-md hover:shadow-primary/5'
        }
      `}
      onClick={onToggle}
    >
      {/* Selection Indicator */}
      <div className={`
        absolute top-2 right-2 w-4 h-4 rounded-full border transition-all duration-200
        ${isSelected 
          ? 'border-[hsl(var(--color-accent-blue))] bg-[hsl(var(--color-accent-blue))]' 
          : 'border-muted-foreground/30 group-hover:border-[hsl(var(--color-accent-blue))]/50'
        }
      `}>
        {isSelected && (
          <div className="w-full h-full rounded-full bg-[hsl(var(--color-accent-blue))] flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="text-2xl">{action.icon}</div>
        
        {/* Content */}
        <div className="flex-1 space-y-1">
          <h4 className={`
            text-sm font-medium transition-colors duration-200
            ${isSelected ? 'text-[hsl(var(--color-accent-blue))]' : 'text-foreground group-hover:text-[hsl(var(--color-accent-blue))]'}
          `}>
            {action.label}
          </h4>
          
          <p className="text-xs text-muted-foreground leading-relaxed">
            {action.description}
          </p>
        </div>
      </div>
    </div>
  );
};
