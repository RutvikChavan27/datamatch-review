
import React, { useState, useEffect } from 'react';
import { WorkflowState } from '../types/workflow.types';
import { Alert, AlertDescription } from '../components/ui/alert';
import { FloatingTooltip } from '../components/ui/floating-tooltip';
import { ChevronLeft, ChevronRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { EmailActionConfig } from '../components/action-configs/EmailActionConfig';
import { ReviewActionConfig } from '../components/action-configs/ReviewActionConfig';
import { DocumentActionConfig } from '../components/action-configs/DocumentActionConfig';
import { TicketActionConfig } from '../components/action-configs/TicketActionConfig';
import { WorkflowActionConfig } from '../components/action-configs/WorkflowActionConfig';

interface Step5Props {
  workflowState: WorkflowState;
  updateWorkflow: (updates: Partial<WorkflowState>) => void;
}

export const Step5_ActionConfig: React.FC<Step5Props> = ({ 
  workflowState, 
  updateWorkflow 
}) => {
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(true);
  const currentAction = workflowState.actions[currentActionIndex];

  // Hide tooltip when all actions are configured
  useEffect(() => {
    const allConfigured = workflowState.actions.every(action => {
      switch (action.type) {
        case 'send_email':
          return action.config.recipients && action.config.subject;
        case 'assign_review':
          return action.config.reviewerType && action.config.deadline;
        case 'move_document':
          return action.config.destinationFolder;
        case 'create_ticket':
          return action.config.priority;
        case 'call_workflow':
          return action.config.workflowId;
        default:
          return true;
      }
    });
    
    if (allConfigured && workflowState.actions.length > 0) {
      const timer = setTimeout(() => setShowTooltip(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [workflowState.actions]);

  const updateActionConfig = (config: Record<string, any>) => {
    const updatedActions = workflowState.actions.map((action, index) => 
      index === currentActionIndex 
        ? { ...action, config: { ...action.config, ...config } }
        : action
    );
    updateWorkflow({ actions: updatedActions });
  };

  const nextAction = () => {
    setCurrentActionIndex(prev => 
      Math.min(prev + 1, workflowState.actions.length - 1)
    );
  };

  const prevAction = () => {
    setCurrentActionIndex(prev => Math.max(prev - 1, 0));
  };

  const renderConfigForAction = () => {
    switch (currentAction.type) {
      case 'send_email':
        return (
          <EmailActionConfig
            config={currentAction.config}
            onConfigUpdate={updateActionConfig}
          />
        );

      case 'assign_review':
        return (
          <ReviewActionConfig
            config={currentAction.config}
            onConfigUpdate={updateActionConfig}
          />
        );

      case 'move_document':
        return (
          <DocumentActionConfig
            config={currentAction.config}
            onConfigUpdate={updateActionConfig}
          />
        );

      case 'create_ticket':
        return (
          <TicketActionConfig
            config={currentAction.config}
            onConfigUpdate={updateActionConfig}
          />
        );

      case 'call_workflow':
        return (
          <WorkflowActionConfig
            config={currentAction.config}
            onConfigUpdate={updateActionConfig}
          />
        );

      default:
        return (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {currentAction.type.replace('_', ' ')} Ready
            </h3>
            <p className="text-gray-600 text-sm">
              This action uses default settings and is ready to go.
            </p>
          </div>
        );
    }
  };

  const isActionConfigured = () => {
    switch (currentAction.type) {
      case 'send_email':
        return currentAction.config.recipients && currentAction.config.subject;
      case 'assign_review':
        return (currentAction.config.reviewerType && 
                currentAction.config.deadline && 
                currentAction.config.allowedActions?.length > 0 &&
                (currentAction.config.reviewerType === 'external' ? 
                  currentAction.config.externalEmails : 
                  currentAction.config.internalReviewers?.length > 0));
      case 'move_document':
        return currentAction.config.destinationFolder;
      case 'create_ticket':
        return currentAction.config.priority;
      case 'call_workflow':
        return currentAction.config.workflowId;
      default:
        return true;
    }
  };

  if (workflowState.actions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No actions selected yet. Please select actions first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Floating Tooltip */}
      <FloatingTooltip
        isVisible={showTooltip && workflowState.actions.some(action => !isActionConfigured())}
        message="Configure each action with specific settings. Use the navigation to move between actions and fill in all required fields."
        targetSelector="[data-step-title='configure-actions']:first-of-type"
      />

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-foreground font-inter" data-step-title="configure-actions">
          Configure Actions
        </h2>
        <p className="text-sm text-muted-foreground font-roboto">Set up details for each action in your workflow</p>
      </div>

      
      {/* Configure Actions Content */}
      <div className="h-full flex gap-6">
        {/* Configuration Panel - 60% width */}
        <div className="flex-1 max-w-[60%]">
          {/* Action Navigation */}
          <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  {currentActionIndex + 1}
                </div>
                <div>
                  <div className="font-medium text-foreground text-sm">
                    {currentAction.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Action {currentActionIndex + 1} of {workflowState.actions.length}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={prevAction}
                  disabled={currentActionIndex === 0}
                  className="p-1 text-primary rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextAction}
                  disabled={currentActionIndex === workflowState.actions.length - 1}
                  className="p-1 text-primary rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Configuration Content */}
          <div className="bg-card rounded-lg border p-4">
            {renderConfigForAction()}
          </div>

          {/* Configuration Status */}
          {isActionConfigured() && (
            <div className="mt-3 p-2 bg-accent/50 rounded border border-accent">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-accent-foreground" />
                <span className="text-sm font-medium text-accent-foreground">
                  Configuration complete
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Sequence Context - 40% width */}
        <div className="w-80 flex flex-col gap-4">
          <div className="bg-card border rounded-lg p-4">
            <div className="text-sm font-medium text-foreground mb-3">
              Action Sequence Context
            </div>
            
            <div className="space-y-2">
              {workflowState.actions.map((action, index) => (
                <button
                  key={action.id}
                  onClick={() => setCurrentActionIndex(index)}
                  className={`
                    w-full text-left p-2 rounded text-xs transition-colors
                    ${index === currentActionIndex 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-current/20 text-current flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span>{action.type.replace('_', ' ')}</span>
                    {Object.keys(action.config).length > 0 ? (
                      <CheckCircle className="w-3 h-3 ml-auto" />
                    ) : (
                      <Clock className="w-3 h-3 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
