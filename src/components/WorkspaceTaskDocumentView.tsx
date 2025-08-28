import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import WorkspaceDocumentDetailView from './WorkspaceDocumentDetailView';
import { Document } from '@/types/storage';

const WorkspaceTaskDocumentView = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  // Get task data to find the primary ID
  // This would normally come from an API call, but using mock data for now
  const getTaskById = (id: string) => {
    const tasksData = [
      {
        id: '1',
        priority: 'Normal' as const,
        workflow: 'Loan Approval',
        type: 'Workflow',
        createdDate: '08/14/2025',
        primaryId: 'LA-001',
        assignedTo: 'Me',
        status: 'Pending' as const,
        stepName: 'Approve',
        dueDate: '08/20/2025'
      },
      {
        id: '2',
        priority: 'High' as const,
        workflow: 'Loan Approval',
        type: 'Workflow',
        createdDate: '08/12/2025',
        primaryId: 'LA-002',
        assignedTo: 'Me',
        status: 'Pending' as const,
        stepName: 'Approve',
        dueDate: '08/18/2025'
      },
      {
        id: '3',
        priority: 'Normal' as const,
        workflow: 'New Patient Records',
        type: 'Workflow',
        createdDate: '08/12/2025',
        primaryId: 'NPR-001',
        assignedTo: 'John Smith',
        status: 'Completed' as const,
        stepName: '',
        dueDate: ''
      },
      {
        id: '4',
        priority: 'Low' as const,
        workflow: 'New Patient Records',
        type: 'Workflow',
        createdDate: '08/10/2025',
        primaryId: 'NPR-002',
        assignedTo: 'Me',
        status: 'Pending' as const,
        stepName: 'Approve',
        dueDate: '08/25/2025'
      },
      {
        id: '5',
        priority: 'Normal' as const,
        workflow: 'New Patient Records',
        type: 'Workflow',
        createdDate: '08/12/2025',
        primaryId: 'NPR-003',
        assignedTo: 'Sarah Johnson',
        status: 'Completed' as const,
        stepName: '',
        dueDate: ''
      },
      // Generate additional tasks with proper primaryIds
      ...Array.from({ length: 95 }, (_, index) => ({
        id: (index + 6).toString(),
        priority: ['High', 'Normal', 'Low'][index % 3] as 'High' | 'Normal' | 'Low',
        workflow: ['Loan Approval', 'New Patient Records', 'Insurance Claims', 'Vendor Onboarding', 'Employee Verification'][index % 5],
        type: 'Workflow',
        createdDate: new Date(2025, 7, Math.floor(Math.random() * 30) + 1).toLocaleDateString('en-US', { 
          month: '2-digit', 
          day: '2-digit', 
          year: 'numeric' 
        }),
        primaryId: `WF-${(index + 6).toString().padStart(3, '0')}`,
        assignedTo: ['Me', 'John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Brown'][index % 5],
        status: ['Pending', 'Completed'][index % 2] as 'Pending' | 'Completed',
        stepName: index % 2 === 0 ? 'Approve' : '',
        dueDate: index % 2 === 0 ? new Date(2025, 7, Math.floor(Math.random() * 15) + 15).toLocaleDateString('en-US', { 
          month: '2-digit', 
          day: '2-digit', 
          year: 'numeric' 
        }) : ''
      }))
    ];
    
    return tasksData.find(task => task.id === id);
  };

  const currentTask = getTaskById(taskId || '');

  // Mock document based on task - in real app, this would come from API
  const mockDocument: Document = {
    id: `task-doc-${taskId}`,
    name: 'Purchase_Order_PO-2024-001234.pdf',
    type: 'pdf',
    size: '2.4 MB',
    url: '/lovable-uploads/40a647b5-00f5-4bd4-825e-8b58cca2e7c2.png',
    folderId: 'finance',
    tags: ['purchase-order', 'urgent'],
    created: new Date('2024-01-25'),
    modified: new Date('2024-01-25'),
    createdBy: 'John Smith',
    isProcessed: true,
    workflowStatus: 'pending',
    version: 1,
    originalName: 'Purchase_Order_PO-2024-001234.pdf'
  };

  const handleClose = () => {
    navigate('/workspace');
  };

  // Override breadcrumb for workspace context
  const customBreadcrumb = (
    <div className="mb-3 pt-3">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <button 
          onClick={() => navigate('/workspace')}
          className="font-medium hover:text-primary cursor-pointer"
        >
          Workspace
        </button>
        <span>›</span>
        <span>Task {taskId}</span>
        <span>›</span>
        <span className="text-foreground">Document Preview</span>
      </div>
    </div>
  );

  return (
    <WorkspaceDocumentDetailView 
      document={mockDocument} 
      taskId={taskId}
      primaryId={currentTask?.primaryId}
      priority={currentTask?.priority}
      assignedTo={currentTask?.assignedTo}
      status={currentTask?.status}
      onClose={handleClose}
    />
  );
};

export default WorkspaceTaskDocumentView;