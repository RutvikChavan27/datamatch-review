import React from 'react';
import { ActionOption } from '../types/workflow.types';
import { Plus } from 'lucide-react';

interface ActionSuggestionsProps {
  suggestions: ActionOption[];
  onSelectAction: (actionType: string) => void;
  className?: string;
}

export const ActionSuggestions: React.FC<ActionSuggestionsProps> = ({
  suggestions,
  onSelectAction,
  className = ''
}) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className={`bg-card border rounded-lg ${className}`}>
      <div className="p-3 border-b border-border">
        <h4 className="text-sm font-medium text-foreground">Suggested Actions</h4>
        <p className="text-xs text-muted-foreground">Quick add actions based on your workflow</p>
      </div>
      
      <div className="max-h-40 overflow-y-auto">
        <div className="p-2 space-y-1">
          {suggestions.map((action) => (
            <button
              key={action.type}
              onClick={() => onSelectAction(action.type)}
              className="w-full flex items-center gap-3 p-2 rounded hover:bg-accent/50 transition-colors text-left"
            >
              <div className="flex-shrink-0">
                {typeof action.icon === 'string' ? (
                  <span className="text-sm">{action.icon}</span>
                ) : (
                  React.cloneElement(action.icon as React.ReactElement, { className: "w-4 h-4 text-muted-foreground" })
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {action.label}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {action.description}
                </div>
              </div>
              
              <Plus className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};