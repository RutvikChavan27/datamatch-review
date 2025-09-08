import React from "react";
import { WorkflowState } from "../types/workflow.types";
import { WorkflowLogicString } from "./WorkflowLogicString";
import { Button } from "./ui/button";
import {
  FileText,
  Zap,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Calendar,
} from "lucide-react";

interface WorkflowSummaryProps {
  workflowState: WorkflowState;
  currentStep: number;
  maxSteps: number;
  isTemplateMode?: boolean;
  ctaText?: string;
  onStepClick?: (step: number) => void;
  onComplete?: () => void;
}

export const WorkflowSummary: React.FC<WorkflowSummaryProps> = ({
  workflowState,
  currentStep,
  maxSteps,
  isTemplateMode = false,
  ctaText,
  onStepClick,
  onComplete,
}) => {
  const generateWorkflowDescription = () => {
    if (!workflowState.trigger.type || workflowState.actions.length === 0) {
      return "Configure your workflow by completing each step.";
    }

    const triggerName = workflowState.trigger.type.replace(/_/g, " ");
    const actionsList = workflowState.actions
      .map((action) => {
        if (action.type === "call_workflow" && action.config?.workflowName) {
          return `call "${action.config.workflowName}"`;
        }
        return action.type.replace(/_/g, " ");
      })
      .join(", ");

    return `When ${triggerName} occurs, then ${actionsList}.`;
  };

  const getStepStatus = (step: number) => {
    if (step < currentStep) return "completed";
    if (step === currentStep) return "active";
    return "pending";
  };

  const getValidationStatus = () => {
    const issues = [];

    if (!workflowState.name) issues.push("Workflow name required");
    if (!workflowState.trigger.type) issues.push("Trigger not selected");
    if (
      Object.keys(workflowState.trigger.config).length === 0 &&
      workflowState.trigger.type
    ) {
      issues.push("Trigger not configured");
    }
    if (workflowState.actions.length === 0) issues.push("No actions selected");

    const unconfiguredActions = workflowState.actions.filter(
      (action) => Object.keys(action.config).length === 0
    );
    if (unconfiguredActions.length > 0) {
      issues.push(`${unconfiguredActions.length} action(s) need configuration`);
    }

    return issues;
  };

  const getButtonText = () => {
    if (ctaText) return ctaText;
    return isTemplateMode ? "Submit Workflow" : "Submit Workflow";
  };

  const validationIssues = getValidationStatus();
  const isComplete = validationIssues.length === 0;

  return (
    <div className="w-96 bg-gradient-to-b from-slate-50 to-white border-l border-slate-200 flex flex-col sticky top-0 shadow-xl max-h-[calc(100vh-60px)] overflow-y-auto">
      {/* Primary CTA */}
      <div className="p-6 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <Button
          onClick={onComplete}
          disabled={!isComplete}
          className="w-full"
          variant="default"
          size="sm"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {getButtonText()}
        </Button>

        {!isComplete && (
          <div className="mt-2 text-xs text-muted-foreground">
            Complete all steps to continue
          </div>
        )}
      </div>

      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-white/60 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Workflow Summary
        </h3>
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Workflow Name</div>
          <div className="text-sm font-semibold text-foreground">
            {workflowState.name || "Untitled Workflow"}
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-white/80 to-slate-50/80 backdrop-blur-sm">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="text-muted-foreground">
            Progress • Step {currentStep} of {maxSteps}
          </span>
          <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
            {Math.round((currentStep / maxSteps) * 100)}%
          </span>
        </div>
        <div className="relative h-3 bg-muted rounded-full mb-4 overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(currentStep / maxSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Workflow Overview */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-br from-white/70 to-slate-50/90">
        <div className="space-y-3">
          {/* Trigger */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground">Trigger</div>
              <div className="text-xs text-muted-foreground">
                {workflowState.trigger.type
                  ? workflowState.trigger.type.replace(/_/g, " ")
                  : "Not selected"}
              </div>
            </div>
          </div>

          {/* Arrow */}
          {workflowState.trigger.type && (
            <div className="flex justify-center">
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Target className="w-4 h-4 text-purple-600" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground">
                Actions ({workflowState.actions.length})
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                {workflowState.actions.length === 0 ? (
                  <div>No actions selected</div>
                ) : (
                  workflowState.actions.slice(0, 3).map((action, index) => {
                    const hasConfig =
                      Object.keys(action.config || {}).length > 0;
                    const isWorkflowAction = action.type === "call_workflow";
                    const workflowName = action.config?.workflowName;
                    const nestedActionCount = action.config?.actionCount || 0;

                    return (
                      <div key={action.id} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 bg-muted text-muted-foreground text-xs rounded flex items-center justify-center">
                            {index + 1}
                          </span>
                          {isWorkflowAction && (
                            <ArrowRight className="w-3 h-3" />
                          )}
                          <span>
                            {isWorkflowAction
                              ? "call workflow"
                              : action.type.replace(/_/g, " ")}
                          </span>
                          {hasConfig ? (
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          ) : (
                            <Clock className="w-3 h-3 text-orange-500" />
                          )}
                        </div>
                        {isWorkflowAction && workflowName && (
                          <div className="ml-6 text-xs">
                            └─ {workflowName}
                            {nestedActionCount > 0 && (
                              <span className="text-muted-foreground">
                                {" "}
                                ({nestedActionCount} actions)
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                {workflowState.actions.length > 3 && (
                  <div className="text-muted-foreground">
                    +{workflowState.actions.length - 3} more
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="p-6 bg-gradient-to-b from-slate-50/50 to-white/30">
        <div className="text-sm font-medium text-foreground mb-3">Steps</div>
        <div className="space-y-2">
          {[
            {
              step: 1,
              label: "Basic Info",
              details: workflowState.name || "Untitled",
            },
            {
              step: 2,
              label: "Select Trigger",
              details:
                workflowState.trigger.type?.replace(/_/g, " ") ||
                "Not selected",
            },
            {
              step: 3,
              label: "Configure Trigger",
              details:
                Object.keys(workflowState.trigger.config).length > 0
                  ? "Configured"
                  : "Pending",
            },
            {
              step: 4,
              label: "Select Actions",
              details:
                workflowState.actions.length > 0
                  ? `${workflowState.actions.length} selected`
                  : "None",
            },
            {
              step: 5,
              label: "Configure Actions",
              details: workflowState.actions.every(
                (a) => Object.keys(a.config).length > 0
              )
                ? "All configured"
                : "Pending",
            },
            { step: 6, label: "Review & Save", details: "Ready" },
          ].map(({ step, label, details }) => {
            const status = getStepStatus(step);
            return (
              <div
                key={step}
                className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${
                  isTemplateMode && onStepClick
                    ? "cursor-pointer hover:bg-white/60 hover:shadow-sm"
                    : ""
                }`}
                onClick={() => isTemplateMode && onStepClick?.(step)}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                    status === "completed"
                      ? "bg-green-100 text-green-600"
                      : status === "active"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {status === "completed" ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    step
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-sm ${
                      status === "active"
                        ? "font-medium text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">
                    {details}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Workflow Logic Box */}
      <div className="p-6 border-t border-slate-200 bg-gradient-to-br from-white/70 to-slate-50/90">
        <WorkflowLogicString workflowState={workflowState} className="mt-0" />
      </div>
    </div>
  );
};
