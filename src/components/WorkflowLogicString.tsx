import React, { useState } from 'react';
import { WorkflowState } from '../types/workflow.types';
import { Code, MessageSquare, ChevronDown, ChevronUp, Copy } from 'lucide-react';

interface WorkflowLogicStringProps {
  workflowState: WorkflowState;
  className?: string;
}

export const WorkflowLogicString: React.FC<WorkflowLogicStringProps> = ({ 
  workflowState, 
  className = '' 
}) => {
  const [showTechnical, setShowTechnical] = useState(false);

  const generateHumanReadableLogic = () => {
    if (!workflowState.trigger.type || workflowState.actions.length === 0) {
      return "Configure your trigger and actions to see workflow logic.";
    }

    const triggerName = workflowState.trigger.type.replace(/_/g, ' ');
    const triggerConfig = workflowState.trigger.config;
    
    let triggerDescription = `When ${triggerName} occurs`;
    
    // Add trigger configuration details
    if (triggerConfig.folder) {
      triggerDescription += ` in ${triggerConfig.folder} folder`;
    }
    if (triggerConfig.fileType) {
      triggerDescription += ` with ${triggerConfig.fileType} files`;
    }
    if (triggerConfig.condition) {
      triggerDescription += ` where ${triggerConfig.condition}`;
    }

    const actionDescriptions = workflowState.actions.map(action => {
      const actionName = action.type.replace(/_/g, ' ');
      const config = action.config;
      
      let desc = actionName;
      
      // Add action-specific configuration details
      switch (action.type) {
        case 'send_email':
          if (config.recipients) desc += ` to ${config.recipients}`;
          if (config.subject) desc += ` with subject "${config.subject}"`;
          break;
        case 'create_ticket':
          if (config.priority) desc += ` with ${config.priority} priority`;
          if (config.department) desc += ` assigned to ${config.department}`;
          break;
        case 'move_document':
          if (config.destinationFolder) desc += ` to ${config.destinationFolder}`;
          break;
        case 'assign_review':
          if (config.assignee) desc += ` to ${config.assignee}`;
          if (config.deadline) desc += ` by ${config.deadline}`;
          break;
        case 'call_workflow':
          if (config.workflowName) {
            desc = `call "${config.workflowName}" workflow`;
            if (config.actionCount) desc += ` (${config.actionCount} nested actions)`;
          }
          break;
      }
      
      return desc;
    });

    return `${triggerDescription}, then ${actionDescriptions.join(' and ')}.`;
  };

  const generateTechnicalLogic = () => {
    if (!workflowState.trigger.type || workflowState.actions.length === 0) {
      return "WHEN [] THEN []";
    }

    const triggerConditions = [`[${workflowState.trigger.type}]`];
    
    // Add trigger conditions
    Object.entries(workflowState.trigger.config).forEach(([key, value]) => {
      if (value) {
        triggerConditions.push(`[${key}="${value}"]`);
      }
    });

    const actionConditions = workflowState.actions.map(action => {
      const parts = [`[${action.type}]`];
      
      Object.entries(action.config).forEach(([key, value]) => {
        if (value) {
          parts.push(`[${key}="${value}"]`);
        }
      });
      
      return parts.join(' AND ');
    });

    return `WHEN ${triggerConditions.join(' AND ')} THEN ${actionConditions.join(' AND ')}`;
  };

  // Don't show if no actions are selected
  if (!workflowState.trigger.type || workflowState.actions.length === 0) {
    return null;
  }

  return (
    <div className={`bg-muted/30 border rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">Workflow Logic</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const logicText = generateHumanReadableLogic();
              navigator.clipboard.writeText(logicText);
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            title="Copy workflow logic"
          >
            <Copy className="w-3 h-3" />
            Copy
          </button>
          <button
            onClick={() => setShowTechnical(!showTechnical)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Code className="w-3 h-3" />
            Technical
            {showTechnical ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {/* Human-readable logic */}
        <div className="text-xs text-foreground leading-relaxed">
          {generateHumanReadableLogic()}
        </div>

        {/* Technical logic (collapsible) */}
        {showTechnical && (
          <div className="pt-1 border-t">
            <div className="text-xs font-mono text-muted-foreground bg-muted p-2 rounded">
              {generateTechnicalLogic()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};