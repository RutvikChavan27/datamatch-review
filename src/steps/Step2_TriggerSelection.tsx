import React, { useState, useEffect } from "react";
import { WorkflowState, TriggerOption } from "../types/workflow.types";
import { TriggerCard } from "../components/TriggerCard";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  FileText,
  Calendar,
  Database,
  Eye,
  FolderOpen,
  CheckCircle,
  Clock,
  Timer,
  FormInput,
  BarChart3,
  AlertCircle,
} from "lucide-react";

interface Step2Props {
  workflowState: WorkflowState;
  updateWorkflow: (updates: Partial<WorkflowState>) => void;
}

export const Step2_TriggerSelection: React.FC<Step2Props> = ({
  workflowState,
  updateWorkflow,
}) => {
  const triggerCategories = [
    {
      category: "Document Management",
      icon: FileText,
      description: "Automate workflows based on document activities",
      triggers: [
        {
          type: "document_upload",
          label: "Document Upload (Manual)",
          description:
            "User manually selects and uploads documents with metadata",
          icon: <FileText className="w-6 h-6" />,
          category: "Documents",
        },
        {
          type: "watch_folder_upload",
          label: "Watch Folder Upload",
          description:
            "Monitor specific folders and trigger when new documents appear",
          icon: <Eye className="w-6 h-6" />,
          category: "Documents",
        },
        {
          type: "document_moved",
          label: "Document Moved",
          description:
            "Activate when documents are moved between folders or statuses",
          icon: <FolderOpen className="w-6 h-6" />,
          category: "Documents",
        },
        {
          type: "document_approved",
          label: "Document Approved",
          description: "Trigger when a document receives approval status",
          icon: <CheckCircle className="w-6 h-6" />,
          category: "Documents",
        },
      ],
    },
    {
      category: "Forms & Submissions",
      icon: FormInput,
      description: "Respond to form submissions and data collection",
      triggers: [
        {
          type: "form_submitted",
          label: "Form Submitted",
          description: "Activate when users submit forms or surveys",
          icon: <FormInput className="w-6 h-6" />,
          category: "Forms",
        },
        {
          type: "survey_completed",
          label: "Survey Completed",
          description: "Trigger when survey responses are fully submitted",
          icon: <BarChart3 className="w-6 h-6" />,
          category: "Forms",
        },
      ],
    },
    {
      category: "Calendar & Scheduling",
      icon: Calendar,
      description: "Time-based triggers and calendar events",
      triggers: [
        {
          type: "scheduled_time",
          label: "Scheduled Time",
          description: "Run workflow at specific times or intervals",
          icon: <Clock className="w-6 h-6" />,
          category: "Schedule",
        },
        {
          type: "deadline_approaching",
          label: "Deadline Approaching",
          description: "Alert when deadlines are coming up",
          icon: <Timer className="w-6 h-6" />,
          category: "Schedule",
        },
        {
          type: "calendar_event",
          label: "Calendar Event",
          description: "Respond to calendar appointments and meetings",
          icon: <Calendar className="w-6 h-6" />,
          category: "Schedule",
        },
      ],
    },
    {
      category: "Data & Updates",
      icon: Database,
      description: "React to data changes and system updates",
      triggers: [
        {
          type: "data_updated",
          label: "Data Updated",
          description: "Activate when specific data fields are modified",
          icon: <Database className="w-6 h-6" />,
          category: "Data",
        },
        {
          type: "record_created",
          label: "Record Created",
          description: "Trigger when new records are added to databases",
          icon: <Database className="w-6 h-6" />,
          category: "Data",
        },
      ],
    },
  ];

  const selectTrigger = (trigger: TriggerOption) => {
    updateWorkflow({
      trigger: {
        type: trigger.type,
        category: trigger.category,
        config: {},
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title and Subtitle */}
      <div className="mb-6">
        <h2
          className="text-lg font-medium text-foreground mb-2 font-inter"
          data-step-title="choose-trigger"
        >
          Choose Your Trigger
        </h2>
        <p className="text-muted-foreground font-roboto">
          Select what event will start your {workflowState.name || "workflow"}{" "}
          workflow
        </p>
      </div>

      <div className="space-y-6">
        {triggerCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <div key={category.category} className="space-y-4">
              <div className="text-left">
                <div className="mb-2">
                  <h3 className="text-lg font-medium text-foreground font-roboto">
                    {category.category}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground max-w-2xl font-roboto">
                  {category.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {category.triggers.map((trigger) => (
                  <TriggerCard
                    key={trigger.type}
                    trigger={trigger}
                    isSelected={workflowState.trigger.type === trigger.type}
                    onSelect={() => selectTrigger(trigger)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Trigger Summary */}
      {workflowState.trigger.type && (
        <div className="mt-6 p-4 bg-accent/50 rounded-2xl border border-accent shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-accent-foreground" />
            <div>
              <p className="text-sm font-medium text-accent-foreground font-roboto">
                Selected Trigger:{" "}
                {workflowState.trigger.type.replace(/_/g, " ")}
              </p>
              <p className="text-xs text-accent-foreground/80 font-roboto">
                Category: {workflowState.trigger.category}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
