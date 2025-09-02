import React, { useState } from 'react';
import { WorkflowState } from '../types/workflow.types';
import { 
  Copy, 
  Edit, 
  CheckCircle, 
  Clock, 
  ChevronDown, 
  ChevronRight,
  Play,
  Users,
  Settings
} from 'lucide-react';
import { VisualWorkflowPreview } from './VisualWorkflowPreview';

interface EnhancedWorkflowLogicPanelProps {
  workflowState: WorkflowState;
  updateWorkflow: (updates: Partial<WorkflowState>) => void;
  currentStep: number;
  onStepChange: (step: number) => void;
  onCopyWorkflow: () => void;
}

export const EnhancedWorkflowLogicPanel: React.FC<EnhancedWorkflowLogicPanelProps> = ({
  workflowState,
  updateWorkflow,
  currentStep,
  onStepChange,
  onCopyWorkflow
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['progress']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getStepStatus = (step: number) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'current';
    return 'pending';
  };

  const getStepIcon = (step: number, status: string) => {
    if (status === 'completed') return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (status === 'current') return <Clock className="w-4 h-4 text-primary" />;
    return <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />;
  };

  const steps = [
    { number: 1, label: 'Workflow Details', completed: !!workflowState.name },
    { number: 2, label: 'Trigger Selection', completed: !!workflowState.trigger.type },
    { number: 3, label: 'Trigger Configuration', completed: Object.keys(workflowState.trigger.config).length > 0 },
    { number: 4, label: 'Action Selection', completed: workflowState.actions.length > 0 },
    { number: 5, label: 'Action Configuration', completed: workflowState.actions.every(a => Object.keys(a.config).length > 0) },
    { number: 6, label: 'Review & Deploy', completed: false }
  ];

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-foreground">Workflow Builder</h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-colors"
              title={isEditMode ? "Read-only mode" : "Edit mode"}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onCopyWorkflow}
              className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-colors"
              title="Copy workflow"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-1">
          <button
            onClick={() => setShowPreview(false)}
            className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
              !showPreview 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Builder
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
              showPreview 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showPreview ? (
          <div className="p-4">
            <VisualWorkflowPreview workflowState={workflowState} mode="summary" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Progress Section */}
            <div className="border-b border-border">
              <button
                onClick={() => toggleSection('progress')}
                className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-foreground">Progress Tracking</div>
                  <div className="text-xs text-muted-foreground">
                    {steps.filter(s => s.completed).length}/{steps.length}
                  </div>
                </div>
                {expandedSections.includes('progress') ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {expandedSections.includes('progress') && (
                <div className="px-4 pb-4 space-y-2">
                  {steps.map((step) => {
                    const status = getStepStatus(step.number);
                    const canEdit = isEditMode && status !== 'pending';
                    
                    return (
                      <button
                        key={step.number}
                        onClick={() => canEdit && onStepChange(step.number)}
                        disabled={!canEdit}
                        className={`w-full flex items-center gap-3 p-2 rounded text-left transition-colors ${
                          status === 'current' 
                            ? 'bg-primary/10 border border-primary/20' 
                            : canEdit 
                              ? 'hover:bg-accent/50' 
                              : 'opacity-60'
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {getStepIcon(step.number, status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm ${
                            status === 'current' ? 'font-medium text-primary' : 'text-foreground'
                          }`}>
                            {step.label}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Step {step.number}
                          </div>
                        </div>
                        {canEdit && isEditMode && (
                          <Edit className="w-3 h-3 text-muted-foreground" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Configuration Summary */}
            <div className="border-b border-border">
              <button
                onClick={() => toggleSection('summary')}
                className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="text-sm font-medium text-foreground">Configuration Summary</div>
                {expandedSections.includes('summary') ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {expandedSections.includes('summary') && (
                <div className="px-4 pb-4 space-y-3">
                  {/* Workflow Name */}
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Workflow Name</div>
                    <div className="text-sm text-foreground">
                      {workflowState.name || 'Untitled Workflow'}
                    </div>
                  </div>

                  {/* Trigger */}
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Trigger</div>
                    <div className="flex items-center gap-2">
                      <Play className="w-3 h-3 text-muted-foreground" />
                      <div className="text-sm text-foreground">
                        {workflowState.trigger.type ? 
                          workflowState.trigger.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
                          'Not selected'
                        }
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">
                      Actions ({workflowState.actions.length})
                    </div>
                    <div className="space-y-1">
                      {workflowState.actions.length > 0 ? (
                        workflowState.actions.map((action, index) => (
                          <div key={action.id} className="flex items-center gap-2">
                            <div className="text-xs text-muted-foreground">{index + 1}.</div>
                            <div className="text-sm text-foreground truncate">
                              {action.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                            {Object.keys(action.config).length > 0 ? (
                              <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                            ) : (
                              <Settings className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">No actions selected</div>
                      )}
                    </div>
                  </div>

                  {/* User Access */}
                  {workflowState.userAccess && (
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">Access Control</div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        <div className="text-sm text-foreground">
                          {workflowState.userAccess.mode === 'all_users' && 'All Users'}
                          {workflowState.userAccess.mode === 'specific_users' && 'Specific Users'}
                          {workflowState.userAccess.mode === 'user_groups' && 'User Groups'}
                          {workflowState.userAccess.mode === 'department' && 'Departments'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <button
            onClick={onCopyWorkflow}
            className="flex-1 px-3 py-2 text-sm border border-border rounded hover:bg-accent transition-colors"
          >
            <Copy className="w-4 h-4 mr-2 inline" />
            Copy
          </button>
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
              isEditMode 
                ? 'bg-primary text-primary-foreground' 
                : 'border border-border hover:bg-accent'
            }`}
          >
            <Edit className="w-4 h-4 mr-2 inline" />
            {isEditMode ? 'Lock' : 'Edit'}
          </button>
        </div>
      </div>
    </div>
  );
};