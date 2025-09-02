import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  Check,
  Upload,
  FileText,
  Users,
  Bell,
  FolderOpen,
  X,
  AlertTriangle,
  User,
  UserPlus,
  MapPin,
  Signature,
  Zap,
  Settings,
  Target,
  Wrench,
  CheckCircle,
  PlayCircle,
  Cog,
  Eye,
  Phone,
  MessageCircle,
  Calendar,
  FormInput,
  BarChart3,
} from "lucide-react";
import { WorkflowExecutionPreview } from "./WorkflowExecutionPreview";
import { WorkflowSummary } from "./WorkflowSummary";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui-workflows/accordion";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { FloatingTooltip } from "./ui/floating-tooltip";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
interface ReviewerInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "internal" | "external" | "group";
  requireSignature: boolean;
  signatureFile?: string;
  order: number;
  groupName?: string; // For user groups/departments
}
interface TriggerConfig {
  type:
    | "select-existing"
    | "upload-new"
    | "form-submission"
    | "watch-folder"
    | "";
  // Configuration specific to each trigger type
  folder?: string;
  formId?: string;
  watchFolderId?: string;
  searchCriteria?: string;
  documentTypes?: string[]; // For document type filtering
  folderType?: "internal" | "external"; // For watch folder categorization
  uploadLocation?: "default" | "specific" | "user-choice"; // For upload new file options
  config?: Record<string, any>; // Enhanced: Add config field for compatibility
}
interface ActionConfig {
  review: boolean;
  approve: boolean;
  reject: boolean;
  escalate: boolean;
  sign: boolean;
  // Folder mappings for each action
  reviewFolder?: string;
  approveFolder?: string;
  rejectFolder?: string;
  escalateFolder?: string;
  signFolder?: string;
  // Next reviewer assignments
  nextReviewer?: string;
}
interface SimpleWorkflowState {
  workflowName: string;
  workflowType: "one-time" | "reusable" | "";
  workflowAccess: string[];
  trigger: TriggerConfig;
  actions: ActionConfig;
  reviewers: ReviewerInfo[];
  notifications: {
    emailComplete: boolean;
    inAppComplete: boolean;
    smsComplete: boolean;
    emailTask: boolean;
    inAppTask: boolean;
  };
  auditLog: boolean;
  conflictCheck: {
    hasConflict: boolean;
    conflictingWorkflow?: string;
  };
  // Enhanced: Add access control fields
  userRole: string;
  requiredPermissions: string[];
  isSystemWorkflow: boolean;
}
interface SimpleWorkflowWizardProps {
  onComplete: (workflow: SimpleWorkflowState) => void;
  onBack: () => void;
  existingWorkflows?: Array<{
    name: string;
    trigger: TriggerConfig;
  }>; // For conflict checking
}

// Mock data for available forms and folders
const AVAILABLE_FORMS = [
  {
    id: "contact-form",
    name: "Contact Form",
    inUse: false,
  },
  {
    id: "support-request",
    name: "Support Request Form",
    inUse: false,
  },
  {
    id: "expense-report",
    name: "Expense Report Form",
    inUse: true,
  },
  // Example of form in use
  {
    id: "leave-request",
    name: "Leave Request Form",
    inUse: false,
  },
  {
    id: "purchase-order",
    name: "Purchase Order Form",
    inUse: false,
  },
  {
    id: "invoice-form",
    name: "Invoice Submission Form",
    inUse: false,
  },
  {
    id: "document-request",
    name: "Document Request Form",
    inUse: false,
  },
];
const FOLDER_OPTIONS = {
  selectExisting: [
    {
      id: "invoices-folder",
      name: "Invoices Folder",
      type: "Financial Documents",
    },
    {
      id: "contracts-folder",
      name: "Contracts Folder",
      type: "Legal Documents",
    },
    {
      id: "reports-folder",
      name: "Reports Folder",
      type: "Business Reports",
    },
    {
      id: "pending-review",
      name: "Pending Review Items",
      type: "Review Queue",
    },
    {
      id: "hr-documents",
      name: "HR Documents",
      type: "Human Resources",
    },
    {
      id: "compliance-docs",
      name: "Compliance Documents",
      type: "Regulatory",
    },
  ],
  uploadNew: [
    {
      id: "default-uploads",
      name: "Default Upload Storage",
      type: "System Managed",
    },
    {
      id: "incoming-documents",
      name: "Incoming Documents",
      type: "Processing Queue",
    },
    {
      id: "review-queue",
      name: "Review Queue",
      type: "Pending Review",
    },
    {
      id: "processing-folder",
      name: "Processing Folder",
      type: "Workflow Processing",
    },
    {
      id: "temp-storage",
      name: "Temporary Storage",
      type: "Temporary Processing",
    },
  ],
  internal: [
    {
      id: "internal-inbox",
      name: "Internal Inbox",
      type: "Internal Processing",
    },
    {
      id: "internal-processing",
      name: "Internal Processing",
      type: "Active Processing",
    },
    {
      id: "internal-archive",
      name: "Internal Archive",
      type: "Completed Items",
    },
    {
      id: "shared-documents",
      name: "Shared Documents",
      type: "Team Collaboration",
    },
  ],
  external: [
    {
      id: "ftp-client-uploads",
      name: "FTP Client Uploads",
      type: "Client Integration",
    },
    {
      id: "ftp-vendor-docs",
      name: "FTP Vendor Documents",
      type: "Vendor Integration",
    },
    {
      id: "ftp-integration",
      name: "FTP Integration Folder",
      type: "System Integration",
    },
    {
      id: "secure-exchange",
      name: "Secure Document Exchange",
      type: "External Secure",
    },
  ],
};
const DOCUMENT_TYPES = [
  {
    id: "pdf",
    name: "PDF Documents",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: "word",
    name: "Word Documents",
    icon: <FormInput className="w-4 h-4" />,
  },
  {
    id: "excel",
    name: "Excel Spreadsheets",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    id: "images",
    name: "Images (JPG, PNG)",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: "presentations",
    name: "Presentations",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    id: "text",
    name: "Text Files",
    icon: <FileText className="w-4 h-4" />,
  },
];
const ACTION_FOLDER_OPTIONS = {
  review: [
    {
      id: "reviewed-items",
      name: "Reviewed Items",
    },
    {
      id: "next-stage",
      name: "Next Stage",
    },
    {
      id: "pending-action",
      name: "Pending Action",
    },
    {
      id: "under-review",
      name: "Under Review",
    },
  ],
  approve: [
    {
      id: "approved-documents",
      name: "Approved Documents",
    },
    {
      id: "completed-items",
      name: "Completed Items",
    },
    {
      id: "final-archive",
      name: "Final Archive",
    },
    {
      id: "ready-for-processing",
      name: "Ready for Processing",
    },
  ],
  reject: [
    {
      id: "rejected-items",
      name: "Rejected Items",
    },
    {
      id: "needs-revision",
      name: "Needs Revision",
    },
    {
      id: "cancelled-requests",
      name: "Cancelled Requests",
    },
    {
      id: "returned-to-sender",
      name: "Returned to Sender",
    },
  ],
  escalate: [
    {
      id: "escalated-items",
      name: "Escalated Items",
    },
    {
      id: "manager-review",
      name: "Manager Review",
    },
    {
      id: "expert-review",
      name: "Expert Review",
    },
    {
      id: "senior-approval",
      name: "Senior Approval",
    },
  ],
  sign: [
    {
      id: "signed-documents",
      name: "Signed Documents",
    },
    {
      id: "executed-contracts",
      name: "Executed Contracts",
    },
    {
      id: "completed-forms",
      name: "Completed Forms",
    },
    {
      id: "finalized-agreements",
      name: "Finalized Agreements",
    },
  ],
};
export const SimpleWorkflowWizard: React.FC<SimpleWorkflowWizardProps> = ({
  onComplete,
  onBack,
  existingWorkflows = [],
}) => {
  const [activeAccordion, setActiveAccordion] = useState<string | undefined>(
    "basics"
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(true);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const stepRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [state, setState] = useState<SimpleWorkflowState>({
    workflowName: "",
    workflowType: "",
    workflowAccess: [],
    trigger: {
      type: "",
    },
    actions: {
      review: false,
      approve: false,
      reject: false,
      escalate: false,
      sign: false,
    },
    reviewers: [],
    notifications: {
      emailComplete: true,
      inAppComplete: true,
      smsComplete: false,
      emailTask: true,
      inAppTask: true,
    },
    auditLog: true,
    conflictCheck: {
      hasConflict: false,
    },
    // Enhanced: Add access control fields
    userRole: "contributor",
    requiredPermissions: [],
    isSystemWorkflow: false,
  });
  const getIconColorClass = (colorKey: string, isActive: boolean) => {
    const colorMap = {
      "accent-blue": isActive
        ? "bg-blue-500 text-white"
        : "bg-blue-100 text-blue-600",
      "accent-yellow": isActive
        ? "bg-yellow-500 text-white"
        : "bg-yellow-100 text-yellow-600",
      "accent-orange": isActive
        ? "bg-orange-500 text-white"
        : "bg-orange-100 text-orange-600",
      "accent-purple": isActive
        ? "bg-purple-500 text-white"
        : "bg-purple-100 text-purple-600",
      "accent-green": isActive
        ? "bg-green-500 text-white"
        : "bg-green-100 text-green-600",
      "accent-red": isActive
        ? "bg-red-500 text-white"
        : "bg-red-100 text-red-600",
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
      // Update current step index
      const stepMap = [
        "basics",
        "trigger-config",
        "actions",
        "reviewers",
        "preview",
      ];
      const index = stepMap.indexOf(stepId);
      if (index !== -1) {
        setCurrentStepIndex(index);
      }
    }
  }, []);
  const updateState = (updates: Partial<SimpleWorkflowState>) => {
    setState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // Check for trigger conflicts
  const checkTriggerConflict = (triggerConfig: TriggerConfig) => {
    const conflict = existingWorkflows.find((workflow) => {
      if (workflow.trigger.type === triggerConfig.type) {
        switch (triggerConfig.type) {
          case "form-submission":
            return workflow.trigger.formId === triggerConfig.formId;
          case "watch-folder":
            return (
              workflow.trigger.watchFolderId === triggerConfig.watchFolderId
            );
          case "select-existing":
            return (
              workflow.trigger.searchCriteria === triggerConfig.searchCriteria
            );
          case "upload-new":
            return workflow.trigger.folder === triggerConfig.folder;
          default:
            return false;
        }
      }
      return false;
    });
    updateState({
      conflictCheck: {
        hasConflict: !!conflict,
        conflictingWorkflow: conflict?.name,
      },
    });
  };
  // Validation function to check mandatory fields and set errors
  const validateFieldsAndShowErrors = (stepId: string): boolean => {
    const newErrors: Record<string, string> = {};

    switch (stepId) {
      case "basics":
        if (!state.workflowName.trim()) {
          newErrors.workflowName = "Workflow name is required";
        }
        if (!state.workflowType) {
          newErrors.workflowType = "Workflow type is required";
        }
        break;
      case "trigger-config":
        if (!state.trigger.type) {
          newErrors.triggerType = "Trigger type is required";
        }
        // Add other trigger validation as needed
        break;
      // Add other steps as needed
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clear errors when field is being edited
  const clearFieldError = (fieldName: string) => {
    setFieldErrors((prev) => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
  };

  // Handle clicks outside of form fields
  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isFormField = target.closest(
        'input, select, textarea, button, [role="button"]'
      );

      if (!isFormField) {
        const currentStep = steps[currentStepIndex];
        validateFieldsAndShowErrors(currentStep.id);
      }
    },
    [currentStepIndex, state]
  );

  // Add click listener
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [handleOutsideClick]);

  const validateStep = (stepId: string): boolean => {
    switch (stepId) {
      case "basics":
        return state.workflowName !== "" && state.workflowType !== "";
      case "trigger-config":
        // Enhanced trigger validation with specific requirements
        const hasValidTriggerConfig = () => {
          switch (state.trigger.type) {
            case "select-existing":
              return !!state.trigger.searchCriteria;
            case "upload-new":
              // Must have upload location strategy, and if specific, must have folder
              return (
                !!state.trigger.uploadLocation &&
                (state.trigger.uploadLocation !== "specific" ||
                  !!state.trigger.folder)
              );
            case "form-submission":
              return !!state.trigger.formId;
            case "watch-folder":
              return (
                !!state.trigger.folderType && !!state.trigger.watchFolderId
              );
            default:
              return false;
          }
        };
        return hasValidTriggerConfig() && !state.conflictCheck.hasConflict;
      case "actions":
        // Enhanced action validation - at least one action with proper folder configuration
        const hasActions = Object.entries(state.actions).some(
          ([key, value]) =>
            key !== "nextReviewer" && typeof value === "boolean" && value
        );
        const hasValidFolderMapping = () => {
          if (state.actions.review && !state.actions.reviewFolder) return false;
          if (state.actions.approve && !state.actions.approveFolder)
            return false;
          if (state.actions.reject && !state.actions.rejectFolder) return false;
          if (state.actions.escalate && !state.actions.escalateFolder)
            return false;
          if (state.actions.sign && !state.actions.signFolder) return false;
          return true;
        };
        return hasActions && hasValidFolderMapping();
      case "reviewers":
        // Enhanced reviewer validation - proper reviewer chain with required fields
        if (state.reviewers.length === 0) return false;
        return state.reviewers.every((reviewer) => {
          if (!reviewer.name || !reviewer.email) return false;
          if (reviewer.type === "external" && !reviewer.phone) return false;
          return true;
        });
      case "preview":
        // Preview step - always valid since it's just for review
        return true;
      default:
        return true;
    }
  };
  const handleComplete = () => {
    onComplete(state);
  };
  const handleAccordionChange = (value: string | undefined) => {
    setActiveAccordion(value);
    if (value) {
      const stepMap = [
        "basics",
        "trigger-config",
        "actions",
        "reviewers",
        "preview",
      ];
      const index = stepMap.indexOf(value);
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
  }, [state, currentStepIndex]);

  const shouldShowTooltip = () => {
    const currentStep = steps[currentStepIndex];
    return (
      showTooltip &&
      !validateStep(currentStep.id) &&
      activeAccordion === currentStep.id
    );
  };

  const getTooltipMessage = () => {
    const currentStep = steps[currentStepIndex];
    const messages = {
      basics:
        "Start by naming your workflow and selecting its type and trigger method",
      "trigger-config":
        "Configure the specific settings for your selected trigger method",
      actions: "Choose what actions will happen when the workflow is triggered",
      reviewers: "Set up the people who will review and approve documents",
      preview: "Review all settings before creating your workflow",
    };
    return (
      messages[currentStep.id as keyof typeof messages] ||
      "Complete this step to continue"
    );
  };

  const nextStep = () => {
    const currentStep = steps[currentStepIndex];
    if (validateStep(currentStep.id) && currentStepIndex < steps.length - 1) {
      const nextStepId = steps[currentStepIndex + 1].id;
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

  // Step components
  const renderWorkflowBasics = () => (
    <div className="space-y-8 pt-6">
      {/* Workflow Name */}
      <div className="space-y-1">
        <label
          htmlFor="workflowName"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
        >
          Workflow Name <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          id="workflowName"
          type="text"
          value={state.workflowName}
          onChange={(e) => {
            updateState({ workflowName: e.target.value });
            clearFieldError("workflowName");
          }}
          placeholder="Enter a descriptive name for your workflow"
          className={`flex h-9 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
            fieldErrors.workflowName
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-input"
          }`}
        />
        {fieldErrors.workflowName && (
          <p className="text-sm text-red-500 mt-1">
            {fieldErrors.workflowName}
          </p>
        )}
      </div>

      {/* Workflow Type */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-3 font-roboto">
          Workflow Type Selection <span className="text-red-500 ml-1">*</span>
        </h3>
        <div className="space-y-3">
          <div
            className={`simple-wizard-option-card ${
              state.workflowType === "one-time" ? "selected" : ""
            }`}
            onClick={() => {
              updateState({
                workflowType: "one-time",
                workflowAccess: [],
              });
              clearFieldError("workflowType");
            }}
          >
            <div className="flex items-start gap-4">
              <RadioGroup
                value={state.workflowType}
                onValueChange={(value) =>
                  updateState({
                    workflowType: value as any,
                    workflowAccess:
                      value === "one-time" ? [] : state.workflowAccess,
                  })
                }
              >
                <RadioGroupItem value="one-time" className="mt-1" />
              </RadioGroup>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground text-lg mb-2">
                      One-Time Workflow
                    </h4>
                    <p className="text-sm text-muted-foreground font-roboto">
                      Create and execute once, then automatically deactivate
                      (audit trail maintained)
                    </p>
                  </div>
                  <div className="text-xs text-green-700 bg-green-50 p-2 rounded font-roboto w-[30%]">
                    <strong>Best for:</strong> Single document reviews, one-off
                    approvals, temporary processes
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`simple-wizard-option-card ${
              state.workflowType === "reusable" ? "selected" : ""
            }`}
            onClick={() => {
              updateState({
                workflowType: "reusable",
              });
              clearFieldError("workflowType");
            }}
          >
            <div className="flex items-start gap-4">
              <RadioGroup
                value={state.workflowType}
                onValueChange={(value) =>
                  updateState({
                    workflowType: value as any,
                  })
                }
              >
                <RadioGroupItem value="reusable" className="mt-1" />
              </RadioGroup>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground text-lg mb-2">
                      Saved Workflow
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Create template for repeated use across multiple documents
                    </p>
                  </div>
                  <div className="text-xs text-green-700 bg-green-50 p-2 rounded w-[30%]">
                    <strong>Best for:</strong> Standard processes, recurring
                    approvals, team templates
                  </div>
                </div>

                {/* Access Control moved inside the card */}
                {state.workflowType === "reusable" && (
                  <div>
                    <h5 className="font-medium text-foreground mb-3">
                      Who will have access to using this workflow?
                    </h5>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {
                          id: "myself",
                          title: "Just me",
                          desc: "Only you can use this workflow",
                        },
                        {
                          id: "my-team",
                          title: "My team",
                          desc: "Members of your team",
                        },
                        {
                          id: "department",
                          title: "My department",
                          desc: "Everyone in your department",
                        },
                        {
                          id: "organization",
                          title: "Entire organization",
                          desc: "All users in the organization",
                        },
                      ].map((option) => {
                        const isSelected = state.workflowAccess.includes(
                          option.id
                        );
                        return (
                          <div
                            key={option.id}
                            className={`p-2 rounded border cursor-pointer transition-colors ${
                              isSelected
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              const newAccess = isSelected
                                ? state.workflowAccess.filter(
                                    (a) => a !== option.id
                                  )
                                : [...state.workflowAccess, option.id];
                              updateState({
                                workflowAccess: newAccess,
                              });
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded border border-primary flex items-center justify-center">
                                {isSelected && (
                                  <Check className="w-3 h-3 text-primary" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-foreground text-sm">
                                  {option.title}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {option.desc}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {fieldErrors.workflowType && (
          <p className="text-sm text-red-500 mt-2">
            {fieldErrors.workflowType}
          </p>
        )}
      </div>

      {/* Recommendation Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-700">
          💡 Recommended: Most users choose "Saved Workflow" for reusability
        </p>
      </div>

      {/* Trigger Selection */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-3">
          How is the workflow triggered? (Select only one){" "}
          <span className="text-red-500">*</span>
        </h3>
        {fieldErrors.triggerType && (
          <div className="text-red-500 text-sm mb-3">
            {fieldErrors.triggerType}
          </div>
        )}
        <div
          className={`grid lg:grid-cols-2 gap-4 ${
            fieldErrors.triggerType
              ? "border border-red-300 rounded-lg p-3"
              : ""
          }`}
        >
          {[
            {
              type: "select-existing",
              title: "Select Existing Document",
              desc: "Choose from documents already in your system",
              icon: FolderOpen,
            },
            {
              type: "upload-new",
              title: "Upload New Document",
              desc: "Start workflow when a new document is uploaded",
              icon: Upload,
            },
            {
              type: "form-submission",
              title: "Form Submission",
              desc: "Trigger when a form is submitted",
              icon: FileText,
            },
            {
              type: "watch-folder",
              title: "Watch Folder",
              desc: "Monitor a folder for new documents",
              icon: Bell,
            },
          ].map((trigger) => (
            <div
              key={trigger.type}
              className={`simple-wizard-trigger-card ${
                state.trigger.type === trigger.type ? "active" : ""
              }`}
              onClick={() => {
                updateState({
                  trigger: {
                    ...state.trigger,
                    type: trigger.type as any,
                  },
                });
                clearFieldError("triggerType");
              }}
            >
              <div className="flex items-center gap-4">
                <RadioGroup
                  value={state.trigger.type}
                  onValueChange={(value) => {
                    updateState({
                      trigger: {
                        ...state.trigger,
                        type: value as any,
                      },
                    });
                    clearFieldError("triggerType");
                  }}
                >
                  <RadioGroupItem value={trigger.type} />
                </RadioGroup>

                <div className="flex-1">
                  <div className="font-medium text-foreground">
                    {trigger.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {trigger.desc}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTriggerSelection = () => (
    <div className="space-y-8">
      {/* Trigger Selection */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-3">
          How will this workflow be triggered?
        </h3>
        <div className="grid lg:grid-cols-2 gap-4">
          {[
            {
              type: "select-existing",
              title: "Select Existing Document",
              desc: "Choose from documents already in your system",
              icon: FolderOpen,
            },
            {
              type: "upload-new",
              title: "Upload New Document",
              desc: "Start workflow when a new document is uploaded",
              icon: Upload,
            },
            {
              type: "form-submission",
              title: "Form Submission",
              desc: "Trigger when a form is submitted",
              icon: FileText,
            },
            {
              type: "watch-folder",
              title: "Watch Folder",
              desc: "Monitor a folder for new documents",
              icon: Bell,
            },
          ].map((trigger) => (
            <div
              key={trigger.type}
              className={`simple-wizard-trigger-card ${
                state.trigger.type === trigger.type ? "active" : ""
              }`}
              onClick={() =>
                updateState({
                  trigger: {
                    ...state.trigger,
                    type: trigger.type as any,
                  },
                })
              }
            >
              <div className="flex items-center gap-4">
                <RadioGroup
                  value={state.trigger.type}
                  onValueChange={(value) =>
                    updateState({
                      trigger: {
                        ...state.trigger,
                        type: value as any,
                      },
                    })
                  }
                >
                  <RadioGroupItem value={trigger.type} />
                </RadioGroup>

                <div className="flex-1">
                  <div className="font-medium text-foreground">
                    {trigger.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {trigger.desc}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTriggerConfig = () => (
    <div className="space-y-4 pt-6">
      {/* Trigger-specific configuration */}
      {state.trigger.type === "select-existing" && (
        <>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Select Existing Document Configuration
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Users will manually select documents from the system to trigger this
            workflow
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Search Scope / Folder Location{" "}
                <span className="text-red-500">*</span>
              </label>
              <Select
                value={state.trigger.searchCriteria || ""}
                onValueChange={(value) => {
                  const newTrigger = {
                    ...state.trigger,
                    searchCriteria: value,
                  };
                  updateState({
                    trigger: newTrigger,
                  });
                  checkTriggerConflict(newTrigger);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select folder/scope to include..." />
                </SelectTrigger>
                <SelectContent>
                  {FOLDER_OPTIONS.selectExisting.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name} ({folder.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {state.trigger.searchCriteria && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Document Type Filter (Optional)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {DOCUMENT_TYPES.map((docType) => (
                    <label
                      key={docType.id}
                      className="simple-wizard-folder-card relative"
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={
                            state.trigger.documentTypes?.includes(docType.id) ||
                            false
                          }
                          onCheckedChange={(checked) => {
                            const current = state.trigger.documentTypes || [];
                            const updated = !!checked
                              ? [...current, docType.id]
                              : current.filter((type) => type !== docType.id);
                            const newTrigger = {
                              ...state.trigger,
                              documentTypes: updated,
                            };
                            updateState({
                              trigger: newTrigger,
                            });
                            checkTriggerConflict(newTrigger);
                          }}
                        />
                        <span className="text-xs font-medium">
                          {docType.name}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 shadow-md">
              <div className="text-sm font-medium text-blue-800 mb-1">
                User Experience:
              </div>
              <div className="text-xs text-blue-700">
                • User sees list of documents from selected scope
                <br />
                • Selecting a document immediately triggers this workflow
                <br />
                • Available from search results, folder views, or document
                listings
                <br />• Workflow starts with the selected document as input
              </div>
            </div>
          </div>
        </>
      )}

      {state.trigger.type === "upload-new" && (
        <div className="simple-wizard-main-container">
          <h3 className="text-lg font-medium text-foreground mb-3">
            When New File is Uploaded Configuration
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Files are automatically uploaded to the default workflow folder, no
            folder selection required
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center space-x-2 mb-3">
                <FolderOpen className="w-4 h-4 text-primary" />
                <h4 className="font-medium text-sm">
                  Automatic Workflow Folder
                </h4>
              </div>
              <div className="bg-background p-3 rounded border border-border">
                <div className="text-xs text-muted-foreground mb-1">
                  Upload destination:
                </div>
                <div className="font-medium text-sm flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  System Workflow Folder
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Similar to Vasion's default workflow folder with recycle bin
                  and delete folder
                </div>
              </div>
            </div>

            <div className="p-3 bg-accent/20 rounded border border-accent/30">
              <div className="flex items-center space-x-2">
                <Upload className="w-4 h-4 text-accent-foreground" />
                <span className="text-sm font-medium text-accent-foreground">
                  Ready for file upload workflow
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Users can browse and select files to upload when starting this
                workflow
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-3 shadow-md">
              <div className="text-sm font-medium text-green-800 mb-1">
                Workflow Process:
              </div>
              <div className="text-xs text-green-700">
                • User uploads file to system
                <br />
                • System asks: "Do you want to kick off a workflow?"
                <br />
                • If yes → workflow initiates with uploaded file
                <br />
                • File moves to temporary workflow folder during processing
                <br />• Final location determined by workflow completion
              </div>
            </div>
          </div>
        </div>
      )}

      {state.trigger.type === "form-submission" && (
        <div className="simple-wizard-main-container">
          <h3 className="text-lg font-medium text-foreground mb-3">
            When [Specific Form] is Submitted Configuration
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Trigger workflow when a specific form is completed and submitted
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Select Specific Form <span className="text-red-500">*</span>
              </label>
              <Select
                value={state.trigger.formId || ""}
                onValueChange={(value) => {
                  const newTrigger = {
                    ...state.trigger,
                    formId: value,
                  };
                  updateState({
                    trigger: newTrigger,
                  });
                  checkTriggerConflict(newTrigger);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a specific form..." />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_FORMS.map((form) => (
                    <SelectItem
                      key={form.id}
                      value={form.id}
                      disabled={form.inUse}
                      className={
                        form.inUse ? "text-muted-foreground bg-muted" : ""
                      }
                    >
                      {form.name} {form.inUse ? "(Already in use)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {state.trigger.formId && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-sm font-medium text-blue-800 mb-1">
                  Form Submission Logic:
                </div>
                <div className="text-xs text-blue-700">
                  • Each form can only trigger ONE workflow at a time
                  <br />
                  • Prevents workflow conflicts and system confusion
                  <br />
                  • Form submissions immediately route to designated workflow
                  <br />• Cannot save workflow without selecting specific form
                </div>
              </div>
            )}

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="text-sm font-medium text-orange-800 mb-1">
                Conflict Prevention:
              </div>
              <div className="text-xs text-orange-700">
                Forms marked as "Already in use" are currently monitored by
                other active workflows. You can copy and modify existing
                workflows or choose a different form.
              </div>
            </div>
          </div>
        </div>
      )}

      {state.trigger.type === "watch-folder" && (
        <>
          <h3 className="text-lg font-medium text-foreground mb-3">
            When File Received in [Folder Name] Configuration
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Continuously monitor designated folders for new file arrivals
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Folder Type
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  {
                    value: "internal",
                    title: "Internal MaxLogic Folders",
                    desc: "Monitor internal system folders",
                  },
                  {
                    value: "external",
                    title: "External Secure FTP Folders",
                    desc: "Monitor external FTP connections",
                  },
                ].map((type) => (
                  <label
                    key={type.value}
                    className={`simple-wizard-option-card ${
                      state.trigger.folderType === type.value ? "selected" : ""
                    }`}
                  >
                    <RadioGroup
                      value={state.trigger.folderType}
                      onValueChange={(value) => {
                        const newTrigger = {
                          ...state.trigger,
                          folderType: value as any,
                          watchFolderId: "", // Reset folder selection when type changes
                        };
                        updateState({
                          trigger: newTrigger,
                        });
                      }}
                    >
                      <RadioGroupItem value={type.value} className="mt-1" />
                    </RadioGroup>
                    <div>
                      <div className="font-medium text-foreground text-sm">
                        {type.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {type.desc}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {state.trigger.folderType && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select{" "}
                  {state.trigger.folderType === "internal"
                    ? "Internal"
                    : "External"}{" "}
                  Watch Folder
                </label>
                <Select
                  value={state.trigger.watchFolderId || ""}
                  onValueChange={(value) => {
                    const newTrigger = {
                      ...state.trigger,
                      watchFolderId: value,
                    };
                    updateState({
                      trigger: newTrigger,
                    });
                    checkTriggerConflict(newTrigger);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a pre-configured folder..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(state.trigger.folderType === "internal"
                      ? FOLDER_OPTIONS.internal
                      : FOLDER_OPTIONS.external
                    ).map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name} ({folder.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {state.trigger.watchFolderId && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="text-sm font-medium text-purple-800 mb-1">
                  Technical Process:
                </div>
                <div className="text-xs text-purple-700">
                  • System continuously monitors designated folder
                  <br />
                  • New file detected → automatic import and processing
                  <br />
                  • File processing (OCR/indexing if needed)
                  <br />
                  • Workflow triggered automatically
                  <br />• File moves to workflow processing queue
                </div>
              </div>
            )}

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="text-sm font-medium text-orange-800 mb-1">
                Important:
              </div>
              <div className="text-xs text-orange-700">
                Select from existing configured folders only. Cannot create new
                folders in this interface. Each folder can only be monitored by
                one active workflow to prevent conflicts.
              </div>
            </div>
          </div>
        </>
      )}

      {/* Conflict Warning */}
      {state.conflictCheck.hasConflict && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">Trigger Conflict Detected</span>
          </div>
          <p className="text-sm text-destructive mt-1">
            This trigger configuration is already used in "
            {state.conflictCheck.conflictingWorkflow}". Please choose a
            different configuration or copy that existing workflow and modify
            it.
          </p>
          <div className="mt-2 text-xs text-destructive">
            <strong>Conflict Prevention:</strong> Only one workflow can monitor
            the same trigger to prevent system confusion and ensure predictable
            workflow execution.
          </div>
        </div>
      )}

      {/* Trigger Summary */}
      {state.trigger.type &&
        !state.conflictCheck.hasConflict &&
        validateStep("trigger-config") && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-800">
              <Check className="w-4 h-4" />
              <span className="font-medium">
                Trigger Configuration Complete
              </span>
            </div>
            <div className="text-sm text-green-700 mt-1">
              {state.trigger.type === "select-existing" &&
                `Monitoring: ${
                  FOLDER_OPTIONS.selectExisting.find(
                    (f) => f.id === state.trigger.searchCriteria
                  )?.name || "Selected folder"
                }`}
              {state.trigger.type === "upload-new" &&
                `Upload strategy: ${
                  state.trigger.uploadLocation === "default"
                    ? "Default storage"
                    : state.trigger.uploadLocation === "specific"
                    ? `Specific folder (${
                        FOLDER_OPTIONS.uploadNew.find(
                          (f) => f.id === state.trigger.folder
                        )?.name || "Selected folder"
                      })`
                    : "User choice at upload"
                }`}
              {state.trigger.type === "form-submission" &&
                `Form: ${
                  AVAILABLE_FORMS.find((f) => f.id === state.trigger.formId)
                    ?.name || "Selected form"
                }`}
              {state.trigger.type === "watch-folder" &&
                `Watching: ${
                  (state.trigger.folderType === "internal"
                    ? FOLDER_OPTIONS.internal
                    : FOLDER_OPTIONS.external
                  ).find((f) => f.id === state.trigger.watchFolderId)?.name ||
                  "Selected folder"
                } (${state.trigger.folderType})`}
            </div>
          </div>
        )}
    </div>
  );
  const renderActionsConfig = () => (
    <div className="space-y-6 pt-6">
      {/* Actions and Folder Destinations - 2 Column Grid */}
      <div className="grid grid-cols-2 gap-8 mb-4">
        {/* Column Headers */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Available Actions
          </h3>
          <p className="text-sm text-muted-foreground">Select Multiple</p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Folder Destinations
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure where documents go after each action
          </p>
        </div>
      </div>

      {/* Action Rows - Each action aligned with its folder destination */}
      <div className="space-y-3">
        {[
          {
            key: "review",
            label: "Review",
            desc: "User acknowledges they have seen the document",
            folderKey: "reviewFolder",
            folderLabel: "After Review:",
            folderOptions: ACTION_FOLDER_OPTIONS.review,
          },
          {
            key: "approve",
            label: "Approve",
            desc: "User approves and moves document forward",
            folderKey: "approveFolder",
            folderLabel: "After Approval:",
            folderOptions: ACTION_FOLDER_OPTIONS.approve,
          },
          {
            key: "reject",
            label: "Reject",
            desc: "User rejects and stops/redirects workflow",
            folderKey: "rejectFolder",
            folderLabel: "After Rejection:",
            folderOptions: ACTION_FOLDER_OPTIONS.reject,
          },
          {
            key: "escalate",
            label: "Escalate/Send to Review",
            desc: "User sends to another person/department",
            folderKey: "escalateFolder",
            folderLabel: "After Escalation:",
            folderOptions: ACTION_FOLDER_OPTIONS.escalate,
          },
          {
            key: "sign",
            label: "Sign",
            desc: "User provides electronic signature",
            folderKey: "signFolder",
            folderLabel: "After Signing:",
            folderOptions: ACTION_FOLDER_OPTIONS.sign,
          },
        ].map((action) => (
          <div key={action.key} className="grid grid-cols-2 gap-8 items-start">
            {/* Left Column - Action Card */}
            <label className="simple-wizard-action-card flex items-start gap-3">
              <Checkbox
                checked={
                  state.actions[action.key as keyof ActionConfig] as boolean
                }
                onCheckedChange={(checked) => {
                  updateState({
                    actions: {
                      ...state.actions,
                      [action.key]: !!checked,
                    },
                  });
                }}
                className="mt-0.5"
              />
              <div className="flex-1">
                <div className="font-medium text-foreground text-sm">
                  {action.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {action.desc}
                </div>
              </div>
            </label>

            {/* Right Column - Folder Destination */}
            <div className="h-full">
              {state.actions[action.key as keyof ActionConfig] ? (
                <div className="h-full p-3 border border-border rounded-lg bg-card flex flex-col">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      {action.folderLabel}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={
                        (state.actions[
                          action.folderKey as keyof ActionConfig
                        ] as string) || ""
                      }
                      onValueChange={(value) =>
                        updateState({
                          actions: {
                            ...state.actions,
                            [action.folderKey]: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination folder..." />
                      </SelectTrigger>
                      <SelectContent>
                        {action.folderOptions.map((folder) => (
                          <SelectItem key={folder.id} value={folder.id}>
                            {folder.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center">
                  <div className="w-full h-[52px] border-2 border-dashed border-muted rounded-md bg-muted/20"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Notifications */}
      <h3 className="text-lg font-medium text-foreground mb-3">
        Notifications
      </h3>
      <div className="flex flex-wrap gap-8">
        <div>
          <h4 className="font-medium text-foreground mb-3 text-sm">
            Notify You:
          </h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={state.notifications.emailComplete}
                onCheckedChange={(checked) =>
                  updateState({
                    notifications: {
                      ...state.notifications,
                      emailComplete: !!checked,
                    },
                  })
                }
              />
              <span className="text-sm text-foreground">
                Email when complete
              </span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={state.notifications.inAppComplete}
                onCheckedChange={(checked) =>
                  updateState({
                    notifications: {
                      ...state.notifications,
                      inAppComplete: !!checked,
                    },
                  })
                }
              />
              <span className="text-sm text-foreground">
                In-app notification
              </span>
            </label>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-foreground mb-3 text-sm">
            Notify Reviewers:
          </h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={state.notifications.emailTask}
                onCheckedChange={(checked) =>
                  updateState({
                    notifications: {
                      ...state.notifications,
                      emailTask: !!checked,
                    },
                  })
                }
              />
              <span className="text-sm text-foreground">
                Email with task details
              </span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={state.notifications.smsComplete}
                onCheckedChange={(checked) =>
                  updateState({
                    notifications: {
                      ...state.notifications,
                      smsComplete: !!checked,
                    },
                  })
                }
              />
              <span className="text-sm text-foreground">SMS notifications</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
  const renderReviewersConfig = () => (
    <div className="space-y-6">
      {/* 2 Column Layout */}
      <div className="grid grid-cols-10 gap-6">
        {/* Left Column - Add Reviewer (30% width) */}
        <div className="col-span-3 space-y-4 pt-6">
          {state.reviewers.length < 4 && (
            <>
              <h3 className="text-lg font-medium text-foreground">
                Add Reviewer {state.reviewers.length + 1}
              </h3>

              <div className="space-y-3">
                {[
                  {
                    type: "internal",
                    icon: User,
                    title: "Internal User",
                    desc: "Select from existing users",
                  },
                  {
                    type: "external",
                    icon: UserPlus,
                    title: "External User",
                    desc: "Add external contact",
                  },
                  {
                    type: "group",
                    icon: Users,
                    title: "User Group",
                    desc: "Assign to department/group",
                  },
                ].map((option) => (
                  <button
                    key={option.type}
                    onClick={() => {
                      const newReviewer: ReviewerInfo = {
                        id: `reviewer_${Date.now()}`,
                        name: "",
                        email: "",
                        phone: "",
                        type: option.type as any,
                        requireSignature: false,
                        order: state.reviewers.length,
                      };
                      updateState({
                        reviewers: [...state.reviewers, newReviewer],
                      });
                    }}
                    className="w-full p-3 border border-border rounded-lg hover:border-primary/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <option.icon className="w-4 h-4 text-primary" />
                      <div className="font-medium text-foreground text-sm">
                        {option.title}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {option.desc}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Column - Review Chain (70% width) */}
        <div className="col-span-7 space-y-4 pt-6">
          {/* Existing Reviewers */}
          {state.reviewers.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">
                Review Chain ({state.reviewers.length}/4)
              </h3>
              <div className="space-y-4">
                {state.reviewers.map((reviewer, index) => (
                  <div
                    key={reviewer.id}
                    className="p-4 bg-muted/30 border rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <div className="font-medium text-foreground">
                            {reviewer.name ||
                              `Configure ${reviewer.type} Reviewer`}
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              reviewer.type === "external"
                                ? "bg-orange-100 text-orange-700"
                                : reviewer.type === "group"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {reviewer.type === "external"
                              ? "External"
                              : reviewer.type === "group"
                              ? "Group"
                              : "Internal"}
                          </div>
                          {reviewer.requireSignature && (
                            <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1">
                              <Signature className="w-3 h-3" />
                              Signature Required
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {reviewer.email && `${reviewer.email} • `}
                          {reviewer.phone}
                          {reviewer.type === "group" &&
                            reviewer.groupName &&
                            ` • Group: ${reviewer.groupName}`}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const newReviewers = state.reviewers.filter(
                            (_, i) => i !== index
                          );
                          updateState({
                            reviewers: newReviewers,
                          });
                        }}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Configuration form inside each reviewer card when not configured */}
                    {reviewer.name === "" && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <h4 className="font-medium text-foreground mb-3">
                          Configure {reviewer.type} Reviewer
                        </h4>

                        {reviewer.type === "internal" && (
                          <div className="space-y-3">
                            <div>
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">
                                  Select Internal User{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <Select
                                  onValueChange={(value) => {
                                    const [name, email] = value.split("|");
                                    const newReviewers = [...state.reviewers];
                                    newReviewers[index] = {
                                      ...newReviewers[index],
                                      name,
                                      email,
                                      phone: "+1 (555) 123-4567",
                                    };
                                    updateState({
                                      reviewers: newReviewers,
                                    });
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select user..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Bruce Malyon|bruce.malyon@company.com">
                                      Bruce Malyon (Manager)
                                    </SelectItem>
                                    <SelectItem value="Kristen Doe|kristen.doe@company.com">
                                      Kristen Doe (Finance)
                                    </SelectItem>
                                    <SelectItem value="Sarah Johnson|sarah.johnson@company.com">
                                      Sarah Johnson (Legal)
                                    </SelectItem>
                                    <SelectItem value="Mike Chen|mike.chen@company.com">
                                      Mike Chen (Operations)
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        )}

                        {reviewer.type === "external" && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="simple-field-trigger-card">
                                <div className="generic-input-label">
                                  <div className="label">Full Name</div>
                                  <div className="mandatory-mark">
                                    <span className="text-red-500 text-xs">
                                      *
                                    </span>
                                  </div>
                                </div>
                                <div className="text-input">
                                  <div className="field2">
                                    <input
                                      type="text"
                                      placeholder="Enter full name"
                                      required
                                      className="text w-full border-0 outline-0 bg-transparent text-sm"
                                      onChange={(e) => {
                                        const newReviewers = [
                                          ...state.reviewers,
                                        ];
                                        newReviewers[index].name =
                                          e.target.value;
                                        updateState({
                                          reviewers: newReviewers,
                                        });
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="simple-field-trigger-card">
                                <div className="generic-input-label">
                                  <div className="label">Email Address</div>
                                  <div className="mandatory-mark">
                                    <span className="text-red-500 text-xs">
                                      *
                                    </span>
                                  </div>
                                </div>
                                <div className="text-input">
                                  <div className="field2">
                                    <input
                                      type="email"
                                      placeholder="email@company.com"
                                      required
                                      className="text w-full border-0 outline-0 bg-transparent text-sm"
                                      onChange={(e) => {
                                        const newReviewers = [
                                          ...state.reviewers,
                                        ];
                                        newReviewers[index].email =
                                          e.target.value;
                                        updateState({
                                          reviewers: newReviewers,
                                        });
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="simple-field-trigger-card">
                              <div className="generic-input-label">
                                <div className="label">Cell Phone Number</div>
                                <div className="mandatory-mark">
                                  <span className="text-red-500 text-xs">
                                    *
                                  </span>
                                </div>
                              </div>
                              <div className="text-input">
                                <div className="field2">
                                  <input
                                    type="tel"
                                    placeholder="(555) 123-4567"
                                    required
                                    className="text w-full border-0 outline-0 bg-transparent text-sm"
                                    onChange={(e) => {
                                      const newReviewers = [...state.reviewers];
                                      newReviewers[index].phone =
                                        e.target.value;
                                      updateState({
                                        reviewers: newReviewers,
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                External User Actions
                              </label>
                              <p className="text-xs text-muted-foreground mb-3">
                                External users get limited actions compared to
                                internal users
                              </p>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                  <div className="text-sm font-medium text-green-800 mb-1">
                                    Available Actions:
                                  </div>
                                  <div className="text-xs text-green-700">
                                    • Approve/Reject decisions
                                    <br />
                                    • Electronic signature (if enabled)
                                    <br />
                                    • Download completed documents
                                    <br />• Upload supporting documents
                                  </div>
                                </div>
                                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                  <div className="text-sm font-medium text-orange-800 mb-1">
                                    Restricted Actions:
                                  </div>
                                  <div className="text-xs text-orange-700">
                                    • No full document management access
                                    <br />
                                    • No complex review workflows
                                    <br />• Single-purpose task focused
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="text-sm font-medium text-blue-800 mb-1">
                                Access Method:
                              </div>
                              <div className="text-xs text-blue-700">
                                • External users receive secure links to
                                complete tasks
                                <br />
                                • No permanent system access required
                                <br />
                                • One-time use links for single workflow
                                completion
                                <br />• Optional registration for recurring
                                external users
                              </div>
                            </div>
                          </div>
                        )}

                        {reviewer.type === "group" && (
                          <div className="space-y-3">
                            <div>
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">
                                  Select Group/Department{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <Select
                                  onValueChange={(value) => {
                                    const newReviewers = [...state.reviewers];
                                    newReviewers[index] = {
                                      ...newReviewers[index],
                                      name: value,
                                      groupName: value,
                                      email: `${value
                                        .toLowerCase()
                                        .replace(" ", "-")}@company.com`,
                                      phone: "Group notification",
                                    };
                                    updateState({
                                      reviewers: newReviewers,
                                    });
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select group..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Department Heads">
                                      Department Heads
                                    </SelectItem>
                                    <SelectItem value="Accounting Team">
                                      Accounting Team
                                    </SelectItem>
                                    <SelectItem value="HR Team">
                                      HR Team
                                    </SelectItem>
                                    <SelectItem value="Legal Team">
                                      Legal Team
                                    </SelectItem>
                                    <SelectItem value="Management Team">
                                      Management Team
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <p className="text-sm text-green-700">
                                When sent to a group, the first person to act
                                will move the workflow forward. Others will be
                                notified of completion.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Signature Requirement */}
                        <div className="mt-4">
                          <label className="flex items-center gap-2">
                            <Checkbox
                              onCheckedChange={(checked) => {
                                const newReviewers = [...state.reviewers];
                                newReviewers[index].requireSignature =
                                  !!checked;
                                updateState({
                                  reviewers: newReviewers,
                                });
                              }}
                            />
                            <span className="text-sm text-foreground">
                              Require signature or signature stamp upload
                            </span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Audit Log Settings */}
      <h3 className="text-lg font-medium text-foreground mb-1">
        Tracking & Compliance
      </h3>
      <div className="simple-wizard-trigger-card">
        <label className="flex items-center gap-3">
          <Checkbox
            checked={state.auditLog}
            onCheckedChange={(checked) =>
              updateState({
                auditLog: !!checked,
              })
            }
          />
          <div>
            <div className="font-medium text-foreground">
              Enable audit logging & status tracking
            </div>
            <div className="text-sm text-muted-foreground">
              Track completion status, timestamps, and maintain full audit trail
              for compliance requirements
            </div>
          </div>
        </label>
      </div>

      {/* Sequential Flow Summary */}
      {state.reviewers.length > 1 && (
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-medium text-foreground mb-3">
            Sequential Flow Overview
          </h3>
          <div className="flex items-center space-x-2">
            {state.reviewers.map((reviewer, index) => (
              <React.Fragment key={reviewer.id}>
                <div className="flex items-center space-x-2 p-2 bg-primary/10 rounded-lg">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {reviewer.name || "Unnamed"}
                  </span>
                </div>
                {index < state.reviewers.length - 1 && (
                  <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180" />
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Documents will flow through reviewers in this exact order. Each
            reviewer must complete their task before the next reviewer is
            notified.
          </p>
        </div>
      )}
    </div>
  );
  const renderWorkflowPreview = () => (
    <div className="space-y-6">
      <WorkflowExecutionPreview
        workflowName={state.workflowName}
        reviewers={state.reviewers}
        actions={state.actions}
      />
    </div>
  );
  const steps = [
    {
      id: "basics",
      title: "Workflow Basics",
      icon: <FileText className="w-4 h-4" strokeWidth={1.5} />,
      iconColor: "accent-blue",
      summary: state.workflowName ? state.workflowName : "No name set",
      description: state.workflowType
        ? `${state.workflowType} workflow`
        : "No type selected",
      component: renderWorkflowBasics(),
    },
    {
      id: "trigger-config",
      title: "Trigger Configuration",
      icon: <Zap className="w-4 h-4" strokeWidth={1.5} />,
      iconColor: "accent-yellow",
      summary: state.trigger.type
        ? state.trigger.type.replace(/-/g, " ")
        : "No trigger configured",
      description: state.trigger.type
        ? "Trigger configured"
        : "Configure trigger settings",
      component: renderTriggerConfig(),
    },
    {
      id: "actions",
      title: "Actions Configuration",
      icon: <Cog className="w-4 h-4" strokeWidth={1.5} />,
      iconColor: "accent-orange",
      summary:
        Object.entries(state.actions).filter(
          ([key, value]) =>
            key !== "nextReviewer" && typeof value === "boolean" && value
        ).length > 0
          ? `${
              Object.entries(state.actions).filter(
                ([key, value]) =>
                  key !== "nextReviewer" && typeof value === "boolean" && value
              ).length
            } action(s) selected`
          : "No actions selected",
      description: "Configure workflow actions",
      component: renderActionsConfig(),
    },
    {
      id: "reviewers",
      title: "Reviewer Configuration",
      icon: <Users className="w-4 h-4" strokeWidth={1.5} />,
      iconColor: "accent-purple",
      summary:
        state.reviewers.length > 0
          ? `${state.reviewers.length} reviewer(s) configured`
          : "No reviewers configured",
      description: "Set up reviewers and approvers",
      component: renderReviewersConfig(),
    },
    {
      id: "preview",
      title: "Workflow Execution Preview",
      icon: <Eye className="w-4 h-4" strokeWidth={1.5} />,
      iconColor: "accent-green",
      summary: "Ready to create",
      description: "Review and finalize your workflow",
      component: renderWorkflowPreview(),
    },
  ];
  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      {/* Floating Tooltip */}
      <FloatingTooltip
        isVisible={shouldShowTooltip()}
        message={getTooltipMessage()}
        targetSelector={`[data-step-id="${steps[currentStepIndex]?.id}"] [data-accordion-chevron]`}
      />

      {/* Content */}
      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-20 pt-6 px-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <div className="max-w-4xl mx-auto space-y-2 pt-2">
            <div className="mb-3">
              {/* Back arrow and heading on same line */}
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => setShowExitConfirmation(true)}
                  aria-label="Back to Workflow List"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md text-foreground hover:bg-muted/60 transition-colors"
                  title="Back to Workflow List"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-2xl font-bold text-foreground">
                  Create Simple Workflow
                </h2>
              </div>
              <p className="text-muted-foreground">
                Set up your workflow step by step. Expand any section to
                configure settings.
              </p>
            </div>

            <Accordion
              type="single"
              value={activeAccordion}
              onValueChange={handleAccordionChange}
              className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto"
              collapsible
            >
              {steps.map((step) => (
                <AccordionItem
                  key={step.id}
                  value={step.id}
                  data-step-id={step.id}
                  className={`border rounded-xl transition-all shadow-md ${
                    activeAccordion === step.id
                      ? "border-blue-300 bg-blue-50 shadow-lg"
                      : "border-border bg-card hover:border-border/80 hover:shadow-lg"
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
                    {step.component}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Workflow Summary Sidebar */}
        <WorkflowSummary
          ctaText="Create Workflow"
          onComplete={handleComplete}
          workflowState={{
            id: "",
            name: state.workflowName,
            description: "",
            trigger: {
              type: state.trigger.type,
              category: state.trigger.type ? "document" : "",
              config: state.trigger,
            },
            actions: Object.entries(state.actions)
              .filter(
                ([key, value]) =>
                  key !== "nextReviewer" && typeof value === "boolean" && value
              )
              .map(([key], index) => ({
                id: `action-${index}`,
                type: key,
                config: {
                  folder:
                    state.actions[`${key}Folder` as keyof ActionConfig] || "",
                },
                order: index + 1,
              })),
            secondaryTriggers: [],
            currentStep:
              steps.findIndex((step) => step.id === activeAccordion) + 1,
            isComplete: steps.every((step) => validateStep(step.id)),
            createdAt: new Date(),
          }}
          currentStep={
            steps.findIndex((step) => step.id === activeAccordion) + 1
          }
          maxSteps={steps.length}
          isTemplateMode={false}
          onStepClick={(stepNum) => {
            const stepMap = [
              "basics",
              "trigger-config",
              "actions",
              "reviewers",
              "preview",
            ];
            const stepId = stepMap[stepNum - 1];
            if (stepId) {
              setActiveAccordion(stepId);
              scrollToStep(stepId);
            }
          }}
        />
      </div>

      {/* Bottom Right Navigation Buttons */}
      <div className="fixed bottom-6 right-6 z-30 flex gap-2">
        <Button
          onClick={currentStepIndex === 0 ? onBack : prevStep}
          variant="outline"
          size="sm"
          className="shadow-lg"
          aria-label={
            currentStepIndex === 0 ? "Back to Workflow List" : "Previous step"
          }
          title={
            currentStepIndex === 0 ? "Back to Workflow List" : "Previous step"
          }
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
        </Button>

        {currentStepIndex < steps.length - 1 ? (
          <Button
            onClick={nextStep}
            disabled={!getCurrentStepValidation()}
            variant="default"
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        ) : (
          <Button
            onClick={handleComplete}
            disabled={!steps.every((step) => validateStep(step.id))}
            variant="default"
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </Button>
        )}
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Confirm Exit
                </h3>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to exit?
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              You will lose all progress on this workflow. Any configuration
              you've made will not be saved.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowExitConfirmation(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setShowExitConfirmation(false);
                  onBack();
                }}
              >
                Exit Anyway
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
