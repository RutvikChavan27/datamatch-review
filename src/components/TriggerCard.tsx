import React from 'react';
import { TriggerOption } from '../types/workflow.types';

interface TriggerCardProps {
  trigger: TriggerOption;
  isSelected: boolean;
  onSelect: () => void;
}

export const TriggerCard: React.FC<TriggerCardProps> = ({
  trigger,
  isSelected,
  onSelect
}) => {
  return (
    <div 
      style={{ backgroundColor: '#FFFFFF' }}
      className={`
        relative p-3 rounded-2xl border cursor-pointer transition-all duration-200 group shadow-lg
        ${isSelected 
          ? 'border-primary shadow-xl shadow-primary/10' 
          : 'border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5'
        }
      `}
      onClick={onSelect}
    >
      {/* Radio Button and Content Layout */}
      <div className="flex items-start gap-3">
        {/* Radio Button */}
        <div className={`
          flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200 mt-0.5
          ${isSelected 
            ? 'border-primary bg-primary' 
            : 'border-muted-foreground/30 group-hover:border-primary/50'
          }
        `}>
          {isSelected && (
            <div className="w-full h-full rounded-full bg-primary flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`
              text-sm font-medium transition-colors duration-200
              ${isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'}
            `}>
              {trigger.label}
            </h3>
            
            <div className={`
              inline-block px-2 py-0.5 text-xs font-medium rounded-full
              ${isSelected 
                ? 'bg-primary/10 text-primary' 
                : 'bg-muted text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary'
              }
            `}>
              {trigger.category}
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground leading-snug">
            {trigger.description}
          </p>
        </div>
      </div>
    </div>
  );
};