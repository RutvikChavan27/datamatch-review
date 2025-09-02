import React from 'react';
import { WorkflowState } from '../types/workflow.types';
import { ArrowDown, Play, CheckCircle, User, Users, Clock, Mail, Database } from 'lucide-react';

interface VisualWorkflowPreviewProps {
  workflowState: WorkflowState;
  mode?: 'preview' | 'summary';
}

export const VisualWorkflowPreview: React.FC<VisualWorkflowPreviewProps> = ({
  workflowState,
  mode = 'preview'
}) => {
  const getActionIcon = (actionType: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'send_email': <Mail className="w-4 h-4" />,
      'assign_review': <Users className="w-4 h-4" />,
      'create_ticket': <CheckCircle className="w-4 h-4" />,
      'move_document': <Database className="w-4 h-4" />,
      'call_workflow': <Play className="w-4 h-4" />,
      'delay_action': <Clock className="w-4 h-4" />
    };
    return iconMap[actionType] || <CheckCircle className="w-4 h-4" />;
  };

  const getActionDescription = (action: any) => {
    const descriptions: Record<string, (config: any) => string> = {
      'send_email': (config) => `Send email to ${config.recipients || 'specified recipients'}`,
      'assign_review': (config) => `Assign review to ${config.assignee || 'designated reviewer'}`,
      'create_ticket': (config) => `Create ${config.priority || 'standard'} priority ticket`,
      'move_document': (config) => `Move document to ${config.destinationFolder || 'target folder'}`,
      'call_workflow': (config) => `Execute workflow: ${config.workflowName || 'another workflow'}`,
      'delay_action': (config) => `Wait ${config.delay || '5'} minutes`
    };
    
    const getDescription = descriptions[action.type];
    return getDescription ? getDescription(action.config) : action.type.replace('_', ' ');
  };

  const getTriggerDescription = () => {
    const trigger = workflowState.trigger;
    switch (trigger.type) {
      case 'document_upload':
        return `When new document is uploaded${trigger.config.documentTypes ? ` (${trigger.config.documentTypes.join(', ')})` : ''}`;
      case 'form_submit':
        return `When form "${trigger.config.formName || 'specified form'}" is submitted`;
      case 'schedule_trigger':
        return `Every ${trigger.config.frequency || 'scheduled time'}`;
      case 'deadline_approaching':
        return `When deadline approaches (${trigger.config.timeframe || '24 hours'} before)`;
      default:
        return trigger.type.replace('_', ' ');
    }
  };

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          {mode === 'preview' ? 'Workflow Preview' : 'Workflow Summary'}
        </h3>
        <div className="text-sm text-muted-foreground">
          {workflowState.actions.length} action{workflowState.actions.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-4">
        {/* Trigger */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-accent-foreground" />
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-foreground mb-1">
              Workflow Trigger
            </div>
            <div className="text-sm text-muted-foreground">
              {getTriggerDescription()}
            </div>
          </div>
        </div>

        {/* Arrow */}
        {workflowState.actions.length > 0 && (
          <div className="flex justify-center">
            <ArrowDown className="w-4 h-4 text-muted-foreground" />
          </div>
        )}

        {/* Actions */}
        {workflowState.actions.map((action, index) => (
          <React.Fragment key={action.id}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                  {getActionIcon(action.type)}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground mb-1">
                  Step {index + 1}: {action.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getActionDescription(action)}
                </div>
                
                {/* Configuration Details */}
                {Object.keys(action.config).length > 0 && mode === 'summary' && (
                  <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                    <div className="font-medium text-muted-foreground mb-1">Configuration:</div>
                    {Object.entries(action.config).map(([key, value]) => (
                      <div key={key} className="text-muted-foreground">
                        <span className="font-medium">{key}:</span> {String(value)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Arrow between actions */}
            {index < workflowState.actions.length - 1 && (
              <div className="flex justify-center">
                <ArrowDown className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Completion */}
        {workflowState.actions.length > 0 && (
          <>
            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 border border-green-200 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground mb-1">
                  Workflow Complete
                </div>
                <div className="text-sm text-muted-foreground">
                  All actions have been executed successfully
                </div>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {workflowState.actions.length === 0 && (
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-2">No actions configured</div>
            <div className="text-xs text-muted-foreground">
              Add actions to see the workflow preview
            </div>
          </div>
        )}
      </div>

      {/* User Access Information */}
      {workflowState.userAccess && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="text-sm font-medium text-foreground mb-2">
            Access Permissions
          </div>
          <div className="text-sm text-muted-foreground">
            {workflowState.userAccess.mode === 'specific_users' && 
              `Available to: ${workflowState.userAccess.users?.join(', ') || 'selected users'}`}
            {workflowState.userAccess.mode === 'user_groups' && 
              `Available to groups: ${workflowState.userAccess.groups?.join(', ') || 'selected groups'}`}
            {workflowState.userAccess.mode === 'department' && 
              `Available to: ${workflowState.userAccess.departments?.join(', ') || 'selected departments'}`}
            {workflowState.userAccess.mode === 'all_users' && 'Available to all users'}
          </div>
        </div>
      )}
    </div>
  );
};