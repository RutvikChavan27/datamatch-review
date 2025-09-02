import React, { useState } from "react";
import { WorkflowState } from "../types/workflow.types";
import { WizardProgress } from "./WizardProgress";
import { WorkflowSummary } from "./WorkflowSummary";
import { TemplateWorkflowEditor } from "./TemplateWorkflowEditor";
import { Step1_Basics } from "../steps/Step1_Basics";
import { ManualWorkflowEditor } from "./ManualWorkflowEditor";
import { Button } from "./ui/button";
const initialState: WorkflowState = {
  id: "",
  name: "",
  description: "",
  trigger: {
    type: "",
    category: "",
    config: {},
  },
  actions: [],
  secondaryTriggers: [],
  currentStep: 1,
  isComplete: false,
  createdAt: new Date(),
};
interface WizardContainerProps {
  onBack?: () => void;
  onComplete?: () => void;
}
export const WizardContainer: React.FC<WizardContainerProps> = ({
  onBack,
  onComplete,
}) => {
  const [workflowState, setWorkflowState] =
    useState<WorkflowState>(initialState);
  const [isTemplateMode, setIsTemplateMode] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [activeSection, setActiveSection] = useState<string | undefined>();
  const [stepNavigationFunction, setStepNavigationFunction] = useState<
    ((stepId: string) => void) | null
  >(null);
  const updateWorkflow = (updates: Partial<WorkflowState>) => {
    setWorkflowState((prev) => ({
      ...prev,
      ...updates,
    }));
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

  const handleTemplateSelect = (template: WorkflowState) => {
    setWorkflowState(template);
    setIsTemplateMode(true);
    setActiveSection("basics");
  };

  const handleManualNext = () => {
    setIsManualMode(true);
  };
  const handleNavigateToStep = (stepId: string) => {
    setActiveSection(stepId);
  };
  const handleComplete = () => {
    console.log("Workflow created successfully!", workflowState);
    // Here you would typically save to backend
    if (onComplete) {
      onComplete();
    } else {
      alert("🎉 Workflow created successfully! Your automation is now active.");
    }
  };

  const handleBack = () => {
    if (isTemplateMode) {
      // Reset to initial state and go back to template selection
      setWorkflowState(initialState);
      setIsTemplateMode(false);
      setActiveSection(undefined);
      setStepNavigationFunction(null);
    } else if (isManualMode) {
      // Go back to basic info step
      setIsManualMode(false);
    } else if (onBack) {
      onBack();
    }
  };
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      {/* Floating Back Button */}
      {/* {(isTemplateMode || isManualMode || onBack) && <button onClick={handleBack} className="fixed top-20 left-4 z-40 flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:text-foreground/80 transition-colors rounded-md">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Workflow List
        </button>} */}

      {/* Main Content */}
      {isTemplateMode ? (
        <TemplateWorkflowEditor
          workflowState={workflowState}
          updateWorkflow={updateWorkflow}
          onComplete={handleComplete}
          onNavigateToStep={handleNavigateToStep}
          onStepNavigation={setStepNavigationFunction}
        />
      ) : isManualMode ? (
        <ManualWorkflowEditor
          workflowState={workflowState}
          updateWorkflow={updateWorkflow}
          onComplete={handleComplete}
          onBack={handleBack}
        />
      ) : (
        <div className="flex-1 flex min-h-0 overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto pt-6 px-6 pb-20">
              <div className="max-w-4xl mx-auto">
                <Step1_Basics
                  workflowState={workflowState}
                  updateWorkflow={updateWorkflow}
                  onTemplateSelect={handleTemplateSelect}
                  onNext={handleManualNext}
                  onBack={handleBack}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
