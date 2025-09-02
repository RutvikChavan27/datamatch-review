import React from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Settings, X, GripVertical, CheckCircle, AlertTriangle, Clock, ArrowRight, Workflow } from 'lucide-react';
import { WorkflowState } from '../types/workflow.types';

interface SelectedActionsSidebarProps {
  workflowState: WorkflowState;
  updateWorkflow: (updates: Partial<WorkflowState>) => void;
  onConfigureAction: (actionId: string) => void;
}

interface SortableActionItemProps {
  action: any;
  index: number;
  onRemove: () => void;
  onConfigure: () => void;
}

const SortableActionItem: React.FC<SortableActionItemProps> = ({
  action,
  index,
  onRemove,
  onConfigure
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: action.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getStatusIcon = () => {
    const hasConfig = Object.keys(action.config || {}).length > 0;
    if (hasConfig) {
      return <CheckCircle className="w-3 h-3 text-success" />;
    }
    return <Clock className="w-3 h-3 text-warning" />;
  };

  const getStatusText = () => {
    const hasConfig = Object.keys(action.config || {}).length > 0;
    return hasConfig ? 'Configured' : 'Needs Config';
  };

  const isWorkflowAction = action.type === 'call_workflow';
  const workflowName = action.config?.workflowName;
  const nestedActionCount = action.config?.actionCount || 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-card border border-border rounded p-2 transition-all ${
        isDragging ? 'shadow-lg opacity-50' : 'hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-2">
        <div
          {...attributes}
          {...listeners}
          className="flex items-center justify-center w-4 h-4 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-3 h-3" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-4 h-4 bg-primary/10 text-primary text-xs font-semibold rounded-full">
              {index + 1}
            </span>
            {isWorkflowAction && (
              <ArrowRight className="w-3 h-3 text-primary" />
            )}
            <h4 className="text-xs font-medium text-foreground truncate">
              {isWorkflowAction ? 'Call Workflow' : action.type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </h4>
          </div>
          
          {isWorkflowAction && workflowName && (
            <div className="ml-6 mb-1">
              <div className="flex items-center gap-1">
                <Workflow className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate">{workflowName}</span>
              </div>
              {nestedActionCount > 0 && (
                <div className="text-xs text-muted-foreground ml-4">
                  └─ {nestedActionCount} nested actions
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-1">
            {getStatusIcon()}
            <span className="text-xs text-muted-foreground">{getStatusText()}</span>
          </div>
        </div>

        <div className="flex gap-1">
          <button
            onClick={onConfigure}
            className="p-1 text-muted-foreground hover:text-primary transition-colors"
            title="Configure"
          >
            <Settings className="w-3 h-3" />
          </button>
          <button
            onClick={onRemove}
            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
            title="Remove"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const SelectedActionsSidebar: React.FC<SelectedActionsSidebarProps> = ({
  workflowState,
  updateWorkflow,
  onConfigureAction
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = workflowState.actions.findIndex(action => action.id === active.id);
      const newIndex = workflowState.actions.findIndex(action => action.id === over?.id);

      const newActions = arrayMove(workflowState.actions, oldIndex, newIndex).map((action, index) => ({
        ...action,
        order: index
      }));

      updateWorkflow({ actions: newActions });
    }
  };

  const removeAction = (actionId: string) => {
    const newActions = workflowState.actions
      .filter(action => action.id !== actionId)
      .map((action, index) => ({ ...action, order: index }));
    updateWorkflow({ actions: newActions });
  };

  const configuredCount = workflowState.actions.filter(
    action => Object.keys(action.config || {}).length > 0
  ).length;

  const hasConflicts = false; // TODO: Implement conflict detection

  return (
    <div className="w-80 bg-sidebar border-l border-sidebar-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border bg-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-foreground">
            Selected Actions
          </h3>
          <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
            {workflowState.actions.length}
          </span>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {configuredCount} of {workflowState.actions.length} configured
        </div>

        {hasConflicts && (
          <div className="flex items-center gap-2 mt-2 p-2 bg-warning/10 border border-warning/20 rounded">
            <AlertTriangle className="w-3 h-3 text-warning" />
            <span className="text-xs text-warning-foreground">Conflicts detected</span>
          </div>
        )}
      </div>

      {/* Actions List */}
      <div className="flex-1 overflow-y-auto p-4">
        {workflowState.actions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-2">No actions selected</div>
            <div className="text-xs text-muted-foreground">
              Choose actions from the left to build your workflow
            </div>
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={workflowState.actions.map(action => action.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {workflowState.actions.map((action, index) => (
                  <SortableActionItem
                    key={action.id}
                    action={action}
                    index={index}
                    onRemove={() => removeAction(action.id)}
                    onConfigure={() => onConfigureAction(action.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Footer - Always show action info */}
      {workflowState.actions.length > 0 && (
        <div className="p-4 border-t border-sidebar-border bg-card">
          {configuredCount < workflowState.actions.length && (
            <button 
              className="w-full border border-border text-foreground px-3 py-2 rounded hover:bg-accent transition-colors text-sm"
              onClick={() => {/* TODO: Navigate to bulk configuration */}}
            >
              Configure All Actions
            </button>
          )}
          
          <div className="mt-2 text-xs text-muted-foreground text-center">
            Drag to reorder • Click gear to configure
          </div>
        </div>
      )}
    </div>
  );
};