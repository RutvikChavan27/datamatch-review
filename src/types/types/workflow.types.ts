
export interface WorkflowState {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: string;
    category: string;
    config: Record<string, any>;
  };
  actions: Array<{
    id: string;
    type: string;
    config: Record<string, any>;
    order: number;
  }>;
  secondaryTriggers: Array<{
    sourceActionId: string;
    condition: string;
    actions: Array<{
      type: string;
      config: Record<string, any>;
    }>;
  }>;
  userAccess?: {
    mode: 'all_users' | 'specific_users' | 'user_groups' | 'department';
    users?: string[];
    groups?: string[];
    departments?: string[];
  };
  currentStep: number;
  isComplete: boolean;
  createdAt: Date;
}

export interface TriggerOption {
  type: string;
  label: string;
  description: string;
  icon: string | React.ReactNode;
  category: string;
}

export interface ActionOption {
  type: string;
  label: string;
  description: string;
  icon: string | React.ReactNode;
  category: string;
}

export interface TriggerActionMap {
  [triggerType: string]: {
    availableActions: string[];
    secondaryTriggers: string[];
  };
}

export const TRIGGER_ACTION_MAP: TriggerActionMap = {
  'document_upload': {
    availableActions: ['send_email', 'assign_review', 'move_document', 'update_index', 'send_notification', 'create_ticket', 'if_condition', 'delay_action'],
    secondaryTriggers: ['approval_granted', 'approval_rejected', 'review_completed']
  },
  'watch_folder_upload': {
    availableActions: ['send_email', 'assign_review', 'move_document', 'update_index', 'send_notification', 'create_ticket', 'if_condition', 'delay_action'],
    secondaryTriggers: ['approval_granted', 'approval_rejected', 'review_completed']
  },
  'document_moved': {
    availableActions: ['send_email', 'send_notification', 'update_index', 'backup_data', 'if_condition'],
    secondaryTriggers: ['move_completed']
  },
  'document_approved': {
    availableActions: ['send_email', 'move_document', 'send_notification', 'create_ticket', 'call_workflow'],
    secondaryTriggers: ['approval_completed']
  },
  'form_submit': {
    availableActions: ['send_email', 'create_ticket', 'assign_user', 'send_notification', 'assign_review', 'if_condition'],
    secondaryTriggers: ['ticket_created', 'assignment_completed']
  },
  'data_updated': {
    availableActions: ['send_email', 'send_notification', 'backup_data', 'update_index', 'if_condition', 'delay_action'],
    secondaryTriggers: ['update_completed']
  },
  'schedule_trigger': {
    availableActions: ['send_email', 'backup_data', 'update_index', 'create_ticket', 'call_workflow', 'delay_action'],
    secondaryTriggers: ['schedule_completed']
  },
  'deadline_approaching': {
    availableActions: ['send_email', 'send_notification', 'assign_user', 'create_ticket', 'if_condition'],
    secondaryTriggers: ['deadline_passed']
  }
};
