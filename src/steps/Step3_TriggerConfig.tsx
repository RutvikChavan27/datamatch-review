import React, { useState, useEffect } from 'react';
import { WorkflowState } from '../types/workflow.types';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Checkbox } from '../components/ui/checkbox';
import { Settings, FolderOpen, FileText, Calendar, Clock, CheckSquare, AlertCircle } from 'lucide-react';

interface Step3Props {
  workflowState: WorkflowState;
  updateWorkflow: (updates: Partial<WorkflowState>) => void;
}

export const Step3_TriggerConfig: React.FC<Step3Props> = ({ 
  workflowState, 
  updateWorkflow 
}) => {
  const updateTriggerConfig = (config: Record<string, any>) => {
    updateWorkflow({
      trigger: {
        ...workflowState.trigger,
        config: { ...workflowState.trigger.config, ...config }
      }
    });
  };

  const hasRequiredConfig = (): boolean => {
    switch (workflowState.trigger.type) {
      case 'document_upload':
        return !!(workflowState.trigger.config.documentType && 
                  workflowState.trigger.config.indexField1);
      case 'watch_folder_upload':
        return !!workflowState.trigger.config.folder;
      case 'form_submitted':
        return !!workflowState.trigger.config.formId;
      case 'scheduled_time':
        return !!(workflowState.trigger.config.frequency && 
                  workflowState.trigger.config.time);
      case 'deadline_approaching':
        return !!(workflowState.trigger.config.deadline && 
                  workflowState.trigger.config.notifyBefore);
      case 'calendar_event':
        return !!workflowState.trigger.config.calendarId;
      case 'data_updated':
        return !!(workflowState.trigger.config.dataSource && 
                  workflowState.trigger.config.field);
      default:
        return true;
    }
  };

  const renderConfigForTrigger = () => {
    if (!workflowState.trigger.type) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm font-roboto">Please select a trigger first in the previous step</p>
        </div>
      );
    }

    switch (workflowState.trigger.type) {
      case 'document_upload':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 font-roboto">
                Document Type
              </label>
              <select
                value={workflowState.trigger.config.documentType || ''}
                onChange={(e) => updateTriggerConfig({ documentType: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded bg-background text-sm focus:ring-1 focus:ring-ring focus:border-ring font-roboto"
              >
                <option value="">Select document type...</option>
                <option value="invoice">Invoice</option>
                <option value="contract">Contract</option>
                <option value="report">Report</option>
                <option value="form">Form</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 font-roboto">
                Required Index Fields
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="e.g., Client Name"
                  value={workflowState.trigger.config.indexField1 || ''}
                  onChange={(e) => updateTriggerConfig({ indexField1: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded bg-background text-sm focus:ring-1 focus:ring-ring focus:border-ring font-roboto"
                />
                <input
                  type="text"
                  placeholder="e.g., Document Date"
                  value={workflowState.trigger.config.indexField2 || ''}
                  onChange={(e) => updateTriggerConfig({ indexField2: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded bg-background text-sm focus:ring-1 focus:ring-ring focus:border-ring font-roboto"
                />
                <input
                  type="text"
                  placeholder="e.g., Amount (optional)"
                  value={workflowState.trigger.config.indexField3 || ''}
                  onChange={(e) => updateTriggerConfig({ indexField3: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded bg-background text-sm focus:ring-1 focus:ring-ring focus:border-ring font-roboto"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-roboto">
                Users will be prompted to fill these fields when uploading documents
              </p>
            </div>
          </div>
        );

      case 'watch_folder_upload':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1 font-roboto">
                Which folder should we monitor?
              </label>
              <div className="relative">
                <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <select
                  value={workflowState.trigger.config.folder || ''}
                  onChange={(e) => updateTriggerConfig({ folder: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-input rounded bg-background text-sm focus:ring-1 focus:ring-ring focus:border-ring font-roboto"
                >
                  <option value="">Select a folder...</option>
                  <option value="invoices">Invoices</option>
                  <option value="contracts">Contracts</option>
                  <option value="reports">Reports</option>
                  <option value="uploads">General Uploads</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1 font-roboto">
                File type filter (optional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { value: 'PDF', icon: FileText },
                  { value: 'Word', icon: FileText },
                  { value: 'Excel', icon: FileText },
                  { value: 'Images', icon: FileText }
                ].map(type => {
                  const IconComponent = type.icon;
                  return (
                    <label key={type.value} className="flex items-center space-x-2 p-2 border border-border rounded cursor-pointer hover:border-primary/50 transition-colors">
                      <Checkbox
                        checked={workflowState.trigger.config.fileTypes?.includes(type.value) || false}
                        onCheckedChange={(checked) => {
                          const current = workflowState.trigger.config.fileTypes || [];
                          const updated = checked 
                            ? [...current, type.value]
                            : current.filter((t: string) => t !== type.value);
                          updateTriggerConfig({ fileTypes: updated });
                        }}
                      />
                      <IconComponent className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs font-medium font-roboto">{type.value}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'form_submitted':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1 font-roboto">
                Select Form
              </label>
              <select
                value={workflowState.trigger.config.formId || ''}
                onChange={(e) => updateTriggerConfig({ formId: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded bg-background text-sm focus:ring-1 focus:ring-ring focus:border-ring font-roboto"
              >
                <option value="">Select a form...</option>
                <option value="contact">Contact Form</option>
                <option value="support">Support Request</option>
                <option value="feedback">Feedback Survey</option>
                <option value="application">Job Application</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1 font-roboto">
                Required Fields (optional)
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="require-email"
                    checked={workflowState.trigger.config.requireEmail || false}
                    onCheckedChange={(checked) => updateTriggerConfig({ requireEmail: checked })}
                  />
                  <label htmlFor="require-email" className="text-sm text-foreground font-roboto">Require email address</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="require-phone"
                    checked={workflowState.trigger.config.requirePhone || false}
                    onCheckedChange={(checked) => updateTriggerConfig({ requirePhone: checked })}
                  />
                  <label htmlFor="require-phone" className="text-sm text-foreground font-roboto">Require phone number</label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'scheduled_time':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1 font-roboto">
                Frequency
              </label>
              <select
                value={workflowState.trigger.config.frequency || ''}
                onChange={(e) => updateTriggerConfig({ frequency: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded bg-background text-sm focus:ring-1 focus:ring-ring focus:border-ring font-roboto"
              >
                <option value="">Select frequency...</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="once">One-time</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1 font-roboto">
                Time
              </label>
              <input
                type="time"
                value={workflowState.trigger.config.time || ''}
                onChange={(e) => updateTriggerConfig({ time: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded bg-background text-sm focus:ring-1 focus:ring-ring focus:border-ring font-roboto"
              />
            </div>
            
            {workflowState.trigger.config.frequency === 'once' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1 font-roboto">
                  Date
                </label>
                <input
                  type="date"
                  value={workflowState.trigger.config.date || ''}
                  onChange={(e) => updateTriggerConfig({ date: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded bg-background text-sm focus:ring-1 focus:ring-ring focus:border-ring font-roboto"
                />
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm font-roboto">Configuration options for this trigger type are coming soon</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-foreground font-roboto" data-step-title="configure-trigger">
            Configure Your Trigger
          </h2>
          <p className="text-sm text-muted-foreground font-roboto">
            Set up the specific parameters for your {workflowState.trigger.type?.replace(/_/g, ' ')} trigger
          </p>
        </div>


        <div className="bg-card rounded-xl border p-6 shadow-md">
          {renderConfigForTrigger()}
        </div>

        {hasRequiredConfig() && (
          <div className="p-4 bg-accent/50 rounded-2xl border border-accent shadow-lg">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-accent-foreground" />
              <span className="text-sm font-medium text-accent-foreground font-roboto">
                Trigger configured successfully! Ready to choose actions.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};