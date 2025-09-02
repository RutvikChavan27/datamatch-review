import React, { useState } from 'react';
import { WorkflowsList as WorkflowsListComponent } from '../components/WorkflowsListComponent';
import { WorkflowPreview } from '../components/WorkflowPreview';

import { WorkflowState } from '../types/workflow.types';

// Generate mock data for 1000+ workflows
const generateMockWorkflows = (): WorkflowState[] => {
  const triggers = ['document_upload', 'form_submit', 'schedule_trigger', 'data_updated', 'deadline_approaching'];
  const triggerLabels = ['Document Upload', 'Form Submission', 'Scheduled', 'Data Update', 'Deadline Alert'];
  const actions = ['send_email', 'assign_review', 'create_ticket', 'move_document', 'backup_data'];
  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Legal'];
  
  const workflows: WorkflowState[] = [];
  
  for (let i = 1; i <= 1247; i++) {
    const triggerIndex = Math.floor(Math.random() * triggers.length);
    const actionCount = Math.floor(Math.random() * 4) + 1;
    const isComplete = Math.random() > 0.3; // 70% active
    
    workflows.push({
      id: `wf_${i.toString().padStart(4, '0')}`,
      name: `${['Invoice', 'Document', 'Customer', 'Employee', 'Project', 'Report', 'Contract', 'Order'][Math.floor(Math.random() * 8)]} ${['Processing', 'Review', 'Approval', 'Management', 'Routing', 'Notification'][Math.floor(Math.random() * 6)]} ${i}`,
      description: `Automated workflow for ${triggerLabels[triggerIndex].toLowerCase()} processing and routing`,
      trigger: {
        type: triggers[triggerIndex],
        category: ['Documents', 'Forms', 'Schedule', 'Data', 'Alerts'][triggerIndex],
        config: { folder: `/workflows/${i}` }
      },
      actions: Array.from({ length: actionCount }, (_, idx) => ({
        id: `a${idx + 1}`,
        type: actions[Math.floor(Math.random() * actions.length)],
        config: { priority: ['low', 'normal', 'high'][Math.floor(Math.random() * 3)] },
        order: idx + 1
      })),
      secondaryTriggers: [],
      currentStep: isComplete ? 6 : Math.floor(Math.random() * 5) + 1,
      isComplete,
      createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      userAccess: {
        mode: ['all_users', 'department'][Math.floor(Math.random() * 2)] as any,
        departments: Math.random() > 0.5 ? [departments[Math.floor(Math.random() * departments.length)]] : undefined
      }
    });
  }
  
  return workflows;
};

const mockWorkflows = generateMockWorkflows();

export const WorkflowsPage: React.FC = () => {
  const [workflows] = useState<WorkflowState[]>(mockWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowState | null>(null);

  const handleDeleteWorkflow = (id: string) => {
    // In real app, this would delete from backend
    console.log('Delete workflow:', id);
    if (selectedWorkflow?.id === id) {
      setSelectedWorkflow(null);
    }
  };

  const handleToggleWorkflowStatus = (id: string) => {
    // In real app, this would update backend
    console.log('Toggle workflow status:', id);
  };

  const handleCreateWorkflow = (type: 'simple' | 'advanced') => {
    // Navigate to workflow creation based on type - pass this up to Index component
    window.location.href = `/?mode=${type}`;
  };

  return (
    <div className="h-full flex bg-background">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <WorkflowsListComponent
          workflows={workflows}
          selectedWorkflow={selectedWorkflow}
          onSelectWorkflow={setSelectedWorkflow}
          onDeleteWorkflow={handleDeleteWorkflow}
          onToggleStatus={handleToggleWorkflowStatus}
          onCreateWorkflow={handleCreateWorkflow}
        />
      </div>

      {/* Right Panel */}
      {selectedWorkflow && (
        <div className="w-96 border-l border-border bg-card">
          <WorkflowPreview workflow={selectedWorkflow} />
        </div>
      )}
    </div>
  );
};