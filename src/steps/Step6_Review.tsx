
import React, { useState, useEffect } from 'react';
import { WorkflowState } from '../types/workflow.types';
import { FloatingTooltip } from '../components/ui/floating-tooltip';
import { Target, Settings, Trash2, Plus, X } from 'lucide-react';
import { EmailActionConfig } from '../components/action-configs/EmailActionConfig';
import { ReviewActionConfig } from '../components/action-configs/ReviewActionConfig';
import { DocumentActionConfig } from '../components/action-configs/DocumentActionConfig';
import { TicketActionConfig } from '../components/action-configs/TicketActionConfig';
import { WorkflowActionConfig } from '../components/action-configs/WorkflowActionConfig';

interface Step6Props {
  workflowState: WorkflowState;
  updateWorkflow: (updates: Partial<WorkflowState>) => void;
}

export const Step6_Review: React.FC<Step6Props> = ({ 
  workflowState, 
  updateWorkflow
}) => {
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(true);

  // Hide tooltip after user interacts
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(timer);
  }, []);
  
  const editingAction = editingActionId 
    ? workflowState.actions.find(a => a.id === editingActionId)
    : null;

  const handleMoveAction = (actionId: string, direction: 'up' | 'down') => {
    const actions = [...workflowState.actions];
    const currentIndex = actions.findIndex(a => a.id === actionId);
    
    if (direction === 'up' && currentIndex > 0) {
      [actions[currentIndex], actions[currentIndex - 1]] = [actions[currentIndex - 1], actions[currentIndex]];
    } else if (direction === 'down' && currentIndex < actions.length - 1) {
      [actions[currentIndex], actions[currentIndex + 1]] = [actions[currentIndex + 1], actions[currentIndex]];
    }
    
    updateWorkflow({ actions });
  };

  const handleRemoveAction = (actionId: string) => {
    const actions = workflowState.actions.filter(a => a.id !== actionId);
    updateWorkflow({ actions });
  };

  const handleEditAction = (actionId: string) => {
    setEditingActionId(actionId);
  };

  const handleUpdateActionConfig = (config: Record<string, any>) => {
    if (!editingActionId) return;
    
    const updatedActions = workflowState.actions.map(action => 
      action.id === editingActionId 
        ? { ...action, config: { ...action.config, ...config } }
        : action
    );
    updateWorkflow({ actions: updatedActions });
  };

  const renderActionConfigDialog = () => {
    if (!editingAction) return null;

    const renderConfigComponent = () => {
      switch (editingAction.type) {
        case 'send_email':
          return (
            <EmailActionConfig
              config={editingAction.config}
              onConfigUpdate={handleUpdateActionConfig}
            />
          );
        case 'assign_review':
          return (
            <ReviewActionConfig
              config={editingAction.config}
              onConfigUpdate={handleUpdateActionConfig}
            />
          );
        case 'move_document':
          return (
            <DocumentActionConfig
              config={editingAction.config}
              onConfigUpdate={handleUpdateActionConfig}
            />
          );
        case 'create_ticket':
          return (
            <TicketActionConfig
              config={editingAction.config}
              onConfigUpdate={handleUpdateActionConfig}
            />
          );
        case 'call_workflow':
          return (
            <WorkflowActionConfig
              config={editingAction.config}
              onConfigUpdate={handleUpdateActionConfig}
            />
          );
        default:
          return (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                This action uses default settings and is ready to go.
              </p>
            </div>
          );
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-background rounded-lg border shadow-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-foreground">
              Configure {editingAction.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h3>
            <button
              onClick={() => setEditingActionId(null)}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto">
            {renderConfigComponent()}
          </div>
          <div className="flex justify-end gap-2 p-4 border-t">
            <button
              onClick={() => setEditingActionId(null)}
              className="px-4 py-2 text-sm border border-border rounded-md text-foreground hover:bg-muted"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getActionConfigSummary = (action: any) => {
    switch (action.type) {
      case 'send_email':
        return `To: ${action.config.recipients || 'Not set'} | Subject: ${action.config.subject || 'Default'}`;
      case 'assign_review':
        return `Reviewers: ${action.config.reviewers?.length || 0} | Actions: ${action.config.availableActions?.join(', ') || 'Not set'}`;
      case 'move_document':
        return `Destination: ${action.config.destinationFolder || 'Not set'}`;
      case 'create_ticket':
        return `Priority: ${action.config.priority || 'Medium'} | Department: ${action.config.department || 'Auto-assign'}`;
      default:
        return 'Default settings';
    }
  };

  if (workflowState.actions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No actions configured</p>
        <p className="text-xs">Add actions to define what happens when the workflow triggers</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Floating Tooltip */}
      <FloatingTooltip
        isVisible={showTooltip}
        message="Review your workflow configuration. You can reorder actions, edit their settings, or add new ones before saving."
        targetSelector="[data-step-title='actions-pipeline']:first-of-type"
      />

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-foreground font-inter" data-step-title="actions-pipeline">
          Actions Pipeline
        </h2>
        <p className="text-sm text-muted-foreground font-roboto">Configure the order and settings of actions in your workflow pipeline</p>
      </div>
      
      {/* Actions Pipeline */}
      <div className="space-y-4">
        {/* Actions Configuration */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-foreground flex items-center">
            <Target className="w-4 h-4 mr-2 text-primary" />
            Actions Pipeline ({workflowState.actions.length})
          </h3>
          <button 
            className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
            onClick={() => {/* Navigate to action selection */}}
          >
            <Plus className="w-3 h-3" />
            Add Action
          </button>
        </div>
        
        <div className="space-y-3">
          {workflowState.actions.map((action, index) => (
            <div key={action.id} className="bg-card rounded border p-4 group hover:border-primary/20 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground text-sm mb-1">
                      {action.type.replace('_', ' ').toUpperCase()}
                    </div>
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {getActionConfigSummary(action)}
                    </div>
                  </div>
                </div>
                
                {/* Action Controls */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleMoveAction(action.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleMoveAction(action.id, 'down')}
                    disabled={index === workflowState.actions.length - 1}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleEditAction(action.id)}
                    className="p-1 text-muted-foreground hover:text-foreground"
                    title="Edit action"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveAction(action.id)}
                    className="p-1 text-muted-foreground hover:text-red-500"
                    title="Remove action"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      
        {renderActionConfigDialog()}
      </div>
    </div>
  );
};
