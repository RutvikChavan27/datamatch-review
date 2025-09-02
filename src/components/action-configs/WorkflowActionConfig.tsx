import React from 'react';
import { ChevronDown, Workflow, Play, Database, Clock } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';

interface WorkflowActionConfigProps {
  config: Record<string, any>;
  onConfigUpdate: (config: Record<string, any>) => void;
}

const AVAILABLE_WORKFLOWS = [
  {
    id: 'invoice_processing',
    name: 'Invoice Processing Automation',
    description: 'Complete invoice validation and approval workflow',
    actionCount: 5,
    estimatedTime: '2-5 minutes'
  },
  {
    id: 'document_review',
    name: 'Document Review Workflow',
    description: 'Multi-stage document review and approval process',
    actionCount: 3,
    estimatedTime: '1-3 minutes'
  },
  {
    id: 'customer_support',
    name: 'Customer Support Ticket Routing',
    description: 'Intelligent ticket categorization and assignment',
    actionCount: 4,
    estimatedTime: '30 seconds'
  },
  {
    id: 'employee_onboarding',
    name: 'Employee Onboarding Process',
    description: 'Complete new employee setup and task assignment',
    actionCount: 7,
    estimatedTime: '5-10 minutes'
  }
];

export const WorkflowActionConfig: React.FC<WorkflowActionConfigProps> = ({
  config,
  onConfigUpdate
}) => {
  const selectedWorkflow = AVAILABLE_WORKFLOWS.find(w => w.id === config.workflowId);

  const handleWorkflowSelect = (workflowId: string) => {
    const workflow = AVAILABLE_WORKFLOWS.find(w => w.id === workflowId);
    onConfigUpdate({
      ...config,
      workflowId,
      workflowName: workflow?.name,
      actionCount: workflow?.actionCount
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Select Workflow to Execute
        </label>
        <div className="relative">
          <select
            value={config.workflowId || ''}
            onChange={(e) => handleWorkflowSelect(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
          >
            <option value="">Choose a workflow...</option>
            {AVAILABLE_WORKFLOWS.map(workflow => (
              <option key={workflow.id} value={workflow.id}>
                {workflow.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {selectedWorkflow && (
        <div className="p-3 bg-muted/30 border rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Workflow className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground text-sm">{selectedWorkflow.name}</h4>
              <p className="text-xs text-muted-foreground mb-2">{selectedWorkflow.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Play className="w-3 h-3" />
                  <span>{selectedWorkflow.actionCount} actions</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{selectedWorkflow.estimatedTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Data Transfer Options
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={config.passDocumentInfo !== false}
                onCheckedChange={(checked) => onConfigUpdate({ ...config, passDocumentInfo: checked })}
              />
              <span className="text-foreground">Pass document information</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={config.passUserContext !== false}
                onCheckedChange={(checked) => onConfigUpdate({ ...config, passUserContext: checked })}
              />
              <span className="text-foreground">Pass user context</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={config.passPreviousResults !== false}
                onCheckedChange={(checked) => onConfigUpdate({ ...config, passPreviousResults: checked })}
              />
              <span className="text-foreground">Pass previous action results</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Execution Control
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={config.waitForCompletion !== false}
                onCheckedChange={(checked) => onConfigUpdate({ ...config, waitForCompletion: checked })}
              />
              <span className="text-foreground">Wait for nested workflow completion</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={config.continueOnFailure || false}
                onCheckedChange={(checked) => onConfigUpdate({ ...config, continueOnFailure: checked })}
              />
              <span className="text-foreground">Continue if nested workflow fails</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};