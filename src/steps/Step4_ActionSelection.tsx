import React, { useState, useMemo, useEffect } from 'react';
import { WorkflowState } from '../types/workflow.types';
import { CompactActionCard } from '../components/CompactActionCard';
import { Alert, AlertDescription } from '../components/ui/alert';
import { FloatingTooltip } from '../components/ui/floating-tooltip';
import { Target, Mail, Users, Database, Code, Zap, GitBranch, CheckCircle, Search, X, AlertCircle, ChevronDown } from 'lucide-react';

interface Step4Props {
  workflowState: WorkflowState;
  updateWorkflow: (updates: Partial<WorkflowState>) => void;
}

export const Step4_ActionSelection: React.FC<Step4Props> = ({ 
  workflowState, 
  updateWorkflow 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showTooltip, setShowTooltip] = useState(true);

  // Hide tooltip when actions are selected
  useEffect(() => {
    if (workflowState.actions.length > 0) {
      const timer = setTimeout(() => setShowTooltip(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [workflowState.actions.length]);

  const allActions = useMemo(() => [
    // Communication Actions
    { type: 'send_email', label: 'Send Email', description: 'Send customized emails to stakeholders and team members', icon: <Mail className="w-4 h-4" />, category: 'Communication' },
    { type: 'send_notification', label: 'Send Notification', description: 'Send in-app notifications or push alerts to users', icon: <Target className="w-4 h-4" />, category: 'Communication' },
    { type: 'post_message', label: 'Post Message', description: 'Send messages to Slack, Teams, or other collaboration tools', icon: <Users className="w-4 h-4" />, category: 'Communication' },
    { type: 'send_sms', label: 'Send SMS', description: 'Send text messages to phone numbers', icon: <Mail className="w-4 h-4" />, category: 'Communication' },
    { type: 'send_webhook', label: 'Send Webhook', description: 'Send HTTP webhook notifications', icon: <Code className="w-4 h-4" />, category: 'Communication' },
    
    // Task Management Actions
    { type: 'create_ticket', label: 'Create Ticket', description: 'Generate support tickets or task items in your system', icon: <Target className="w-4 h-4" />, category: 'Task Management' },
    { type: 'assign_review', label: 'Assign Review', description: 'Route documents or requests to appropriate reviewers', icon: <Users className="w-4 h-4" />, category: 'Task Management' },
    { type: 'assign_user', label: 'Assign Task', description: 'Automatically assign work items to specific team members', icon: <Target className="w-4 h-4" />, category: 'Task Management' },
    { type: 'create_task', label: 'Create Task', description: 'Create new tasks in project management tools', icon: <Target className="w-4 h-4" />, category: 'Task Management' },
    { type: 'update_status', label: 'Update Status', description: 'Change status of tickets or tasks', icon: <Target className="w-4 h-4" />, category: 'Task Management' },
    
    // Data & Files Actions
    { type: 'move_document', label: 'Move Document', description: 'Automatically organize files into appropriate folders', icon: <Database className="w-4 h-4" />, category: 'Data & Files' },
    { type: 'update_index', label: 'Update Database', description: 'Modify records and update searchable indexes', icon: <Database className="w-4 h-4" />, category: 'Data & Files' },
    { type: 'backup_data', label: 'Backup Data', description: 'Create automated backups of important information', icon: <Database className="w-4 h-4" />, category: 'Data & Files' },
    { type: 'copy_file', label: 'Copy File', description: 'Create copies of files in specified locations', icon: <Database className="w-4 h-4" />, category: 'Data & Files' },
    { type: 'extract_data', label: 'Extract Data', description: 'Extract information from documents', icon: <Database className="w-4 h-4" />, category: 'Data & Files' },
    
    // Workflow Management
    { type: 'call_workflow', label: 'Call Another Workflow', description: 'Execute pre-built workflow sequence', icon: <Zap className="w-4 h-4" />, category: 'Workflow Management' },
    { type: 'complete_workflow', label: 'Complete Workflow', description: 'Mark workflow as finished', icon: <Target className="w-4 h-4" />, category: 'Workflow Management' },
    { type: 'pause_workflow', label: 'Pause Workflow', description: 'Temporarily halt workflow execution', icon: <Target className="w-4 h-4" />, category: 'Workflow Management' },
    
    // Logic Blocks
    { type: 'if_condition', label: 'If/Else Logic', description: 'Add conditional branching to your workflow', icon: <GitBranch className="w-4 h-4" />, category: 'Logic Blocks' },
    { type: 'delay_action', label: 'Delay/Wait', description: 'Add time delays between actions', icon: <Target className="w-4 h-4" />, category: 'Logic Blocks' },
    { type: 'switch_case', label: 'Switch/Case Logic', description: 'Multiple condition branching', icon: <GitBranch className="w-4 h-4" />, category: 'Logic Blocks' },
    
    // Integration Actions
    { type: 'api_call', label: 'API Call', description: 'Make HTTP requests to external services', icon: <Code className="w-4 h-4" />, category: 'Integration' },
    { type: 'csv_export', label: 'Export to CSV', description: 'Generate CSV files from data', icon: <Database className="w-4 h-4" />, category: 'Integration' },
    { type: 'pdf_generate', label: 'Generate PDF', description: 'Create PDF documents', icon: <Database className="w-4 h-4" />, category: 'Integration' },
    
    // Security Actions
    { type: 'encrypt_file', label: 'Encrypt File', description: 'Encrypt files for security', icon: <Database className="w-4 h-4" />, category: 'Security' },
    { type: 'audit_log', label: 'Create Audit Log', description: 'Log actions for compliance', icon: <Database className="w-4 h-4" />, category: 'Security' },
    { type: 'check_permissions', label: 'Check Permissions', description: 'Verify user access rights', icon: <Users className="w-4 h-4" />, category: 'Security' }
  ], []);

  const categories = [
    { id: 'all', name: 'All Actions', icon: <Target className="w-4 h-4" /> },
    { id: 'Communication', name: 'Communication', icon: <Mail className="w-4 h-4" /> },
    { id: 'Task Management', name: 'Task Management', icon: <Target className="w-4 h-4" /> },
    { id: 'Data & Files', name: 'Data & Files', icon: <Database className="w-4 h-4" /> },
    { id: 'Workflow Management', name: 'Workflow Management', icon: <Zap className="w-4 h-4" /> },
    { id: 'Logic Blocks', name: 'Logic Blocks', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'Integration', name: 'Integration', icon: <Code className="w-4 h-4" /> },
    { id: 'Security', name: 'Security', icon: <Users className="w-4 h-4" /> }
  ];

  const filteredActions = useMemo(() => {
    let filtered = [...allActions];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(action => 
        action.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(action => action.category === selectedCategory);
    }

    return filtered;
  }, [allActions, searchQuery, selectedCategory]);

  const toggleAction = (actionType: string) => {
    const existingIndex = workflowState.actions.findIndex(
      action => action.type === actionType
    );
    
    if (existingIndex >= 0) {
      const newActions = workflowState.actions.filter(
        (_, index) => index !== existingIndex
      );
      updateWorkflow({ actions: newActions });
    } else {
      const newAction = {
        id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: actionType,
        config: {},
        order: workflowState.actions.length
      };
      updateWorkflow({ 
        actions: [...workflowState.actions, newAction] 
      });
    }
  };

  const isSelected = (actionType: string) => {
    return workflowState.actions.some(action => action.type === actionType);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Floating Tooltip */}
      <FloatingTooltip
        isVisible={showTooltip && workflowState.actions.length === 0}
        message="Select one or more actions that will execute when your trigger fires. You can choose from communication, task management, data operations, and more."
        targetSelector="[data-step-title='select-actions']:first-of-type"
      />

      <div className="space-y-2">
        <h2 className="text-lg font-medium text-foreground font-roboto" data-step-title="select-actions">
          Select Actions
        </h2>
        <p className="text-sm text-muted-foreground font-roboto">
          Choose what happens when your {workflowState.trigger.type?.replace(/_/g, ' ')} trigger activates
        </p>
      </div>


      {/* Search and Category Filter */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search actions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary focus:border-primary font-roboto"
            />
          </div>
        </div>
        
        <div className="lg:w-64 relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 pr-8 border border-border rounded-lg bg-background text-sm focus:ring-1 focus:ring-primary focus:border-primary font-roboto appearance-none"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
        </div>
      </div>


      {/* Actions Grid */}
      <div className="h-96 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-2">
        {filteredActions.map(action => (
          <div
            key={action.type}
            onClick={() => toggleAction(action.type)}
            className={`
              relative p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg
              ${isSelected(action.type)
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-border hover:border-primary/50'
              }
            `}
          >
            {/* Icon in top right */}
            <div className={`
              absolute top-3 right-3 p-2 rounded-lg flex-shrink-0
              ${isSelected(action.type)
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
              }
            `}>
              {action.icon}
            </div>
            
            <div className="pr-12">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`
                  text-sm font-medium truncate
                  ${isSelected(action.type) ? 'text-primary' : 'text-foreground'}
                `}>
                  {action.label}
                </h3>
                {isSelected(action.type) && (
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 font-roboto">
                {action.description}
              </p>
              <div className="mt-2">
                <span className="text-xs px-2 py-1 bg-muted/50 text-muted-foreground rounded-full font-roboto">
                  {action.category}
                </span>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* Selected Actions Summary */}
      {workflowState.actions.length > 0 && (
        <div className="bg-card rounded-xl border p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-primary" />
            <h3 className="text-base font-medium text-foreground font-roboto">
              Selected Actions ({workflowState.actions.length})
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {workflowState.actions.map(action => {
              const actionData = allActions.find(a => a.type === action.type);
              return (
                <div key={action.id} className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="p-1.5 bg-primary rounded text-primary-foreground">
                    {actionData?.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary font-roboto">{actionData?.label}</p>
                    <p className="text-xs text-muted-foreground font-roboto">{actionData?.category}</p>
                  </div>
                  <button
                    onClick={() => toggleAction(action.type)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filteredActions.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Target className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm font-roboto">No actions found matching your search criteria</p>
        </div>
      )}
    </div>
  );
};