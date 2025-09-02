import React from 'react';
import { Calendar, Clock, Users, Settings, Zap, Power, PowerOff, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { WorkflowState } from '@/types/workflow.types';

interface WorkflowPreviewProps {
  workflow: WorkflowState;
}

export const WorkflowPreview: React.FC<WorkflowPreviewProps> = ({ workflow }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTriggerLabel = (triggerType: string) => {
    const labels: Record<string, string> = {
      'document_upload': 'Document Upload',
      'form_submit': 'Form Submission',
      'schedule_trigger': 'Scheduled Trigger',
      'data_updated': 'Data Update',
      'deadline_approaching': 'Deadline Alert'
    };
    return labels[triggerType] || triggerType;
  };

  const getActionLabel = (actionType: string) => {
    const labels: Record<string, string> = {
      'send_email': 'Send Email',
      'assign_review': 'Assign Review',
      'create_ticket': 'Create Ticket',
      'move_document': 'Move Document',
      'update_index': 'Update Index',
      'send_notification': 'Send Notification',
      'backup_data': 'Backup Data',
      'if_condition': 'Conditional Logic',
      'delay_action': 'Delay Action',
      'call_workflow': 'Call Workflow',
      'assign_user': 'Assign User'
    };
    return labels[actionType] || actionType;
  };

  const getUserAccessLabel = (userAccess?: WorkflowState['userAccess']) => {
    if (!userAccess) return 'All Users';
    
    switch (userAccess.mode) {
      case 'all_users':
        return 'All Users';
      case 'specific_users':
        return `${userAccess.users?.length || 0} Specific Users`;
      case 'user_groups':
        return `${userAccess.groups?.length || 0} User Groups`;
      case 'department':
        return `${userAccess.departments?.length || 0} Departments`;
      default:
        return 'All Users';
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-foreground line-clamp-2 mb-1">
              {workflow.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {workflow.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {workflow.isComplete ? (
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
              Active
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-gray-50 text-gray-600 border-gray-200">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5" />
              Inactive
            </Badge>
          )}
          <Badge variant="outline" className="font-medium">
            {getTriggerLabel(workflow.trigger.type)}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-8">
          {/* Created */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Created</span>
            </div>
            <p className="text-sm text-muted-foreground ml-6">
              {formatDate(workflow.createdAt)}
            </p>
          </div>

          {/* Trigger Details */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Trigger</span>
            </div>
            <div className="ml-6 space-y-2">
              <div className="flex items-start gap-8">
                <span className="text-sm text-muted-foreground min-w-0 w-20">Type</span>
                <span className="text-sm text-foreground">
                  {getTriggerLabel(workflow.trigger.type)}
                </span>
              </div>
              <div className="flex items-start gap-8">
                <span className="text-sm text-muted-foreground min-w-0 w-20">Category</span>
                <span className="text-sm text-foreground">
                  {workflow.trigger.category}
                </span>
              </div>
              {Object.keys(workflow.trigger.config).length > 0 && (
                <div className="flex items-start gap-8">
                  <span className="text-sm text-muted-foreground min-w-0 w-20">Config</span>
                  <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded font-mono">
                    {JSON.stringify(workflow.trigger.config, null, 2)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Actions ({workflow.actions.length})</span>
            </div>
            <div className="ml-6 space-y-4">
              {workflow.actions
                .sort((a, b) => a.order - b.order)
                .map((action, index) => (
                  <div key={action.id} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium mb-1">
                        {getActionLabel(action.type)}
                      </div>
                      {Object.keys(action.config).length > 0 && (
                        <div className="text-xs text-muted-foreground space-y-1">
                          {Object.entries(action.config).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2">
                              <span className="capitalize">{key}:</span>
                              <span className="font-mono bg-muted/50 px-1 py-0.5 rounded">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {index < workflow.actions.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-muted-foreground mt-1.5" />
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* User Access */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">User Access</span>
            </div>
            <div className="ml-6 space-y-2">
              <div className="flex items-start gap-8">
                <span className="text-sm text-muted-foreground min-w-0 w-20">Level</span>
                <span className="text-sm text-foreground">
                  {getUserAccessLabel(workflow.userAccess)}
                </span>
              </div>
              
              {workflow.userAccess?.users && workflow.userAccess.users.length > 0 && (
                <div className="flex items-start gap-8">
                  <span className="text-sm text-muted-foreground min-w-0 w-20">Users</span>
                  <div className="space-y-1">
                    {workflow.userAccess.users.map(user => (
                      <div key={user} className="text-xs text-muted-foreground font-mono bg-muted/50 px-1 py-0.5 rounded">
                        {user}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {workflow.userAccess?.departments && workflow.userAccess.departments.length > 0 && (
                <div className="flex items-start gap-8">
                  <span className="text-sm text-muted-foreground min-w-0 w-20">Departments</span>
                  <div className="space-y-1">
                    {workflow.userAccess.departments.map(dept => (
                      <div key={dept} className="text-xs text-muted-foreground font-mono bg-muted/50 px-1 py-0.5 rounded">
                        {dept}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Setup Progress</span>
            </div>
            <div className="ml-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Step {workflow.currentStep} of 6</span>
                <span className="text-muted-foreground">{Math.round((workflow.currentStep / 6) * 100)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(workflow.currentStep / 6) * 100}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {workflow.isComplete ? 'Workflow setup completed' : 'Setup in progress'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};