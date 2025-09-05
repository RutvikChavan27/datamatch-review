import React, { useState, useRef, useCallback, useEffect } from "react";
import { WorkflowState } from "../types/workflow.types";
import { Button } from "./ui/button";
import { FloatingTooltip } from "./ui/floating-tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui-workflows/accordion";
import { Step2_TriggerSelection } from "../steps/Step2_TriggerSelection";
import { Step3_TriggerConfig } from "../steps/Step3_TriggerConfig";
import { Step4_ActionSelection } from "../steps/Step4_ActionSelection";
import { Step5_ActionConfig } from "../steps/Step5_ActionConfig";
import { Step6_Review } from "../steps/Step6_Review";
import { WorkflowSummary } from "./WorkflowSummary";
import {
  Zap,
  Settings,
  Target,
  Wrench,
  Eye,
  Cog,
  GitBranch,
  ChevronLeft,
} from "lucide-react";

interface ManualWorkflowEditorProps {
  workflowState: WorkflowState;
  updateWorkflow: (updates: Partial<WorkflowState>) => void;
  onComplete: () => void;
  onBack: () => void;
}

export const ManualWorkflowEditor: React.FC<ManualWorkflowEditorProps> = ({
  workflowState,
  updateWorkflow,
  onComplete,
  onBack,
}) => {
  const [activeAccordion, setActiveAccordion] = useState<string | undefined>(
    "trigger-selection"
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(true);

  const stepRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const getIconColorClass = (colorKey: string, isActive: boolean) => {
    const colorMap = {
      "accent-yellow": isActive
        ? "bg-yellow-500 text-white"
        : "bg-yellow-100 text-yellow-600",
      "accent-orange": isActive
        ? "bg-orange-500 text-white"
        : "bg-orange-100 text-orange-600",
      "accent-purple": isActive
        ? "bg-purple-500 text-white"
        : "bg-purple-100 text-purple-600",
      "accent-red": isActive
        ? "bg-red-500 text-white"
        : "bg-red-100 text-red-600",
      "accent-green": isActive
        ? "bg-green-500 text-white"
        : "bg-green-100 text-green-600",
      "accent-blue": isActive
        ? "bg-blue-500 text-white"
        : "bg-blue-100 text-blue-600",
    };
    return (
      colorMap[colorKey as keyof typeof colorMap] || "bg-gray-100 text-gray-600"
    );
  };

  const scrollToStep = useCallback((stepId: string) => {
    const element = stepRefs.current[stepId];
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
      setActiveAccordion(stepId);
    }
  }, []);

  const steps = [
    {
      id: "trigger-selection",
      title: "Choose Your Trigger",
      icon: <Zap className="w-4 h-4" strokeWidth={1.5} />,
      iconColor: "accent-yellow",
      summary: workflowState.trigger.type
        ? workflowState.trigger.type.replace(/_/g, " ")
        : "No trigger selected",
      description:
        workflowState.trigger.category ||
        "Select what event will start your workflow",
      component: (
        <Step2_TriggerSelection
          workflowState={workflowState}
          updateWorkflow={updateWorkflow}
        />
      ),
    },
    {
      id: "trigger-config",
      title: "Configure Your Trigger",
      icon: <Settings className="w-4 h-4" strokeWidth={1.5} />,
      iconColor: "accent-orange",
      summary:
        Object.keys(workflowState.trigger.config).length > 0
          ? "Configured"
          : "Not configured",
      description: workflowState.trigger.type
        ? "Configure trigger settings"
        : "Select a trigger first",
      component: (
        <Step3_TriggerConfig
          workflowState={workflowState}
          updateWorkflow={updateWorkflow}
        />
      ),
    },
    {
      id: "action-selection",
      title: "Select Actions",
      icon: <Target className="w-4 h-4" strokeWidth={1.5} />,
      iconColor: "accent-purple",
      summary:
        workflowState.actions.length > 0
          ? `${workflowState.actions.length} action(s) selected`
          : "No actions selected",
      description:
        workflowState.actions
          .map((a) => a.type.replace(/_/g, " "))
          .join(", ") || "Choose what happens when the trigger activates",
      component: (
        <Step4_ActionSelection
          workflowState={workflowState}
          updateWorkflow={updateWorkflow}
        />
      ),
    },
    {
      id: "action-config",
      title: "Configure Actions",
      icon: <Wrench className="w-4 h-4" strokeWidth={1.5} />,
      iconColor: "accent-red",
      summary:
        workflowState.actions.every((a) => Object.keys(a.config).length > 0) &&
        workflowState.actions.length > 0
          ? "All actions configured"
          : workflowState.actions.length === 0
          ? "No actions to configure"
          : `${
              workflowState.actions.filter(
                (a) => Object.keys(a.config).length === 0
              ).length
            } action(s) need configuration`,
      description: "Configure individual action settings",
      component: (
        <Step5_ActionConfig
          workflowState={workflowState}
          updateWorkflow={updateWorkflow}
        />
      ),
    },
    {
      id: "actions-pipeline",
      title: "Actions Pipeline",
      icon: <GitBranch className="w-4 h-4" strokeWidth={1.5} />,
      iconColor: "accent-blue",
      summary: "Review workflow execution",
      description: "Preview how your actions will execute",
      component: (
        <Step6_Review
          workflowState={workflowState}
          updateWorkflow={updateWorkflow}
        />
      ),
    },
  ];

  const validateStep = (stepId: string): boolean => {
    switch (stepId) {
      case "trigger-selection":
        return workflowState.trigger.type !== "";
      case "trigger-config":
        return (
          workflowState.trigger.type !== "" &&
          Object.keys(workflowState.trigger.config).length > 0
        );
      case "action-selection":
        return workflowState.actions.length > 0;
      case "action-config":
        return (
          workflowState.actions.length > 0 &&
          workflowState.actions.every(
            (action) => Object.keys(action.config).length > 0
          )
        );
      case "actions-pipeline":
        return true;
      default:
        return true;
    }
  };

  const getValidationMessage = (stepId: string): string => {
    switch (stepId) {
      case "trigger-selection":
        return workflowState.trigger.type === ""
          ? "Please select a trigger type to continue"
          : "";
      case "trigger-config":
        if (workflowState.trigger.type === "")
          return "Please select a trigger type first";
        if (Object.keys(workflowState.trigger.config).length === 0)
          return "Please configure your trigger settings";
        return "";
      case "action-selection":
        return workflowState.actions.length === 0
          ? "Please select at least one action to continue"
          : "";
      case "action-config":
        if (workflowState.actions.length === 0)
          return "Please select actions first";
        const unconfiguredActions = workflowState.actions.filter(
          (action) => Object.keys(action.config).length === 0
        );
        if (unconfiguredActions.length > 0)
          return `Please configure ${unconfiguredActions.length} remaining action(s)`;
        return "";
      default:
        return "";
    }
  };

  const nextStep = () => {
    const currentStep = steps[currentStepIndex];
    if (validateStep(currentStep.id) && currentStepIndex < steps.length - 1) {
      const nextStepId = steps[currentStepIndex + 1].id;
      setCurrentStepIndex(currentStepIndex + 1);
      scrollToStep(nextStepId);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      const prevStepId = steps[currentStepIndex - 1].id;
      scrollToStep(prevStepId);
    }
  };

  const getCurrentStepValidation = (): boolean => {
    const currentStep = steps[currentStepIndex];
    return validateStep(currentStep.id);
  };

  const handleAccordionChange = (value: string | undefined) => {
    setActiveAccordion(value);
    if (value) {
      // Update current step index
      const index = steps.findIndex((step) => step.id === value);
      if (index !== -1) {
        setCurrentStepIndex(index);
        setShowTooltip(true); // Show tooltip when user opens a step
      }
    }
  };

  // Hide tooltip when step becomes valid
  useEffect(() => {
    const currentStep = steps[currentStepIndex];
    if (validateStep(currentStep.id)) {
      const timer = setTimeout(() => setShowTooltip(false), 2000); // Hide after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [workflowState, currentStepIndex]);

  const shouldShowTooltip = () => {
    const currentStep = steps[currentStepIndex];
    const message = getTooltipMessage();
    return (
      showTooltip &&
      !validateStep(currentStep.id) &&
      activeAccordion === currentStep.id &&
      message.length > 0 // Only show if there's actually a message
    );
  };

  const getTooltipMessage = () => {
    // Only show existing tooltip messages that were already defined in the codebase
    // Don't add any new messages - return empty string since none exist here
    return "";
  };

  const isWorkflowComplete = (): boolean => {
    return (
      workflowState.name.length > 0 &&
      workflowState.trigger.type !== "" &&
      Object.keys(workflowState.trigger.config).length > 0 &&
      workflowState.actions.length > 0 &&
      workflowState.actions.every(
        (action) => Object.keys(action.config).length > 0
      )
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      {/* Floating Tooltip */}
      <FloatingTooltip
        isVisible={shouldShowTooltip()}
        message={getTooltipMessage()}
        targetSelector={`[data-step-id="${steps[currentStepIndex]?.id}"] [data-accordion-chevron]`}
      />

      <div className="flex-1 flex">
        <div className="flex-1 pb-20 pt-6 px-6 max-h-[calc(100vh-60px)] overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={onBack}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50"
                  title="Back to Workflow List"
                  aria-label="Back to Workflow List"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold text-foreground">
                  Create New Workflow from Scratch
                </h2>
              </div>
              <p className="text-muted-foreground">
                Build your workflow step by step. Complete each section to
                configure your automation process.
              </p>
            </div>

            <Accordion
              type="single"
              value={activeAccordion}
              onValueChange={handleAccordionChange}
              className="space-y-4"
              collapsible
            >
              {steps.map((step) => (
                <AccordionItem
                  key={step.id}
                  value={step.id}
                  data-step-id={step.id}
                  className={`border rounded-2xl transition-all shadow-lg ${
                    activeAccordion === step.id
                      ? "border-blue-300 bg-blue-50 shadow-xl"
                      : "border-border bg-card hover:border-border/80 hover:shadow-xl"
                  }`}
                  ref={(el) => (stepRefs.current[step.id] = el)}
                >
                  <AccordionTrigger
                    className="px-6 py-4 hover:no-underline"
                    icon={step.icon}
                    iconColor={getIconColorClass(
                      step.iconColor,
                      activeAccordion === step.id
                    )}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="text-left">
                        <div className="font-semibold text-foreground">
                          {step.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {step.summary}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="border-t border-border pt-6">
                      {step.component}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Workflow Summary Sidebar */}
        <WorkflowSummary
          workflowState={workflowState}
          currentStep={currentStepIndex + 1}
          maxSteps={steps.length}
          isTemplateMode={false}
          onComplete={onComplete}
        />
      </div>

      {/* Bottom Right Navigation Buttons */}
      <div className="fixed bottom-6 right-6 z-30 flex gap-2">
        <Button
          onClick={currentStepIndex === 0 ? onBack : prevStep}
          variant="outline"
          size="sm"
          className="shadow-lg"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {currentStepIndex === 0 ? "Previous" : "Previous"}
        </Button>

        {currentStepIndex < steps.length - 1 ? (
          <Button
            onClick={nextStep}
            disabled={!getCurrentStepValidation()}
            variant="default"
            size="sm"
            className="shadow-lg"
          >
            Next
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        ) : (
          <Button
            onClick={onComplete}
            disabled={!isWorkflowComplete()}
            variant="default"
            size="sm"
            className="shadow-lg"
          >
            Save Template
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
};
