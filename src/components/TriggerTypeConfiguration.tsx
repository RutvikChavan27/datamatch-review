import React from 'react';
import { TriggerCard } from './TriggerCard';
import { FileText, Clock, AlertTriangle, CheckCircle, BarChart3, FileText as FileSubmit, MessageSquare, Globe, Users, Workflow, Settings, Upload, FormInput } from 'lucide-react';
import { Shield, User, Info } from 'lucide-react';

interface TriggerType {
  type: string;
  label: string;
  description: string;
  icon: React.ReactElement;
  category: 'system' | 'user';
  requiresPermissions: boolean;
}

interface TriggerTypeConfigurationProps {
  selectedTrigger: string;
  onTriggerSelect: (triggerType: string) => void;
}

export const TriggerTypeConfiguration: React.FC<TriggerTypeConfigurationProps> = ({
  selectedTrigger,
  onTriggerSelect
}) => {
  const triggerTypes: TriggerType[] = [
    // System-triggered workflows (automatic)
    {
      type: 'document_upload',
      label: 'Document Upload',
      description: 'Automatically trigger when files are uploaded to monitored folders',
      icon: <FileText className="w-6 h-6" />,
      category: 'system',
      requiresPermissions: false
    },
    {
      type: 'schedule_trigger',
      label: 'Scheduled Event',
      description: 'Run workflow at specific times or intervals',
      icon: <Clock className="w-6 h-6" />,
      category: 'system',
      requiresPermissions: false
    },
    {
      type: 'deadline_approaching',
      label: 'Deadline Alert',
      description: 'Trigger when deadlines or due dates are approaching',
      icon: <AlertTriangle className="w-6 h-6" />,
      category: 'system',
      requiresPermissions: false
    },
    {
      type: 'system_event',
      label: 'System Event',
      description: 'Respond to system status changes or error conditions',
      icon: <Settings className="w-6 h-6" />,
      category: 'system',
      requiresPermissions: false
    },
    
    // User-initiated workflows (manual)
    {
      type: 'manual_upload',
      label: 'Manual File Upload',
      description: 'Users can manually start workflow by uploading files',
      icon: <Upload className="w-6 h-6" />,
      category: 'user',
      requiresPermissions: true
    },
    {
      type: 'form_submit',
      label: 'Form Submission',
      description: 'Users submit forms to initiate workflow processes',
      icon: <FormInput className="w-6 h-6" />,
      category: 'user',
      requiresPermissions: true
    },
    {
      type: 'user_request',
      label: 'User Request',
      description: 'Allow users to manually trigger workflows when needed',
      icon: <Users className="w-6 h-6" />,
      category: 'user',
      requiresPermissions: true
    },
    {
      type: 'approval_workflow',
      label: 'Approval Process',
      description: 'Users can initiate approval workflows for documents or requests',
      icon: <CheckCircle className="w-6 h-6" />,
      category: 'user',
      requiresPermissions: true
    }
  ];

  const systemTriggers = triggerTypes.filter(t => t.category === 'system');
  const userTriggers = triggerTypes.filter(t => t.category === 'user');

  return (
    <div className="space-y-6">
      {/* System-Level Workflows */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
            <Shield className="w-4 h-4 text-accent-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">System-Level Workflows</h3>
            <p className="text-xs text-muted-foreground">
              Automatic triggers that run without user intervention
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {systemTriggers.map((trigger) => (
            <TriggerCard
              key={trigger.type}
              trigger={{
                type: trigger.type,
                label: trigger.label,
                description: trigger.description,
                icon: trigger.icon,
                category: trigger.category
              }}
              isSelected={selectedTrigger === trigger.type}
              onSelect={() => onTriggerSelect(trigger.type)}
            />
          ))}
        </div>

        <div className="mt-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-accent-foreground mt-0.5 flex-shrink-0" />
            <div className="text-xs text-accent-foreground">
              <div className="font-medium mb-1">System Workflows</div>
              <div>
                These workflows run automatically based on system events. No user permissions are required since they operate at the system level.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User-Initiated Workflows */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">User-Initiated Workflows</h3>
            <p className="text-xs text-muted-foreground">
              Manual triggers that require user permissions to access
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {userTriggers.map((trigger) => (
            <TriggerCard
              key={trigger.type}
              trigger={{
                type: trigger.type,
                label: trigger.label,
                description: trigger.description,
                icon: trigger.icon,
                category: trigger.category
              }}
              isSelected={selectedTrigger === trigger.type}
              onSelect={() => onTriggerSelect(trigger.type)}
            />
          ))}
        </div>

        <div className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-xs text-primary">
              <div className="font-medium mb-1">User Workflows</div>
              <div>
                These workflows are manually triggered by users. You'll need to configure access permissions to control who can use each workflow.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};