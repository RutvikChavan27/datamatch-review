import React from "react";
import { WorkflowState } from "../types/workflow.types";
import {
  Workflow,
  FileText,
  Target,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
interface Step1Props {
  workflowState: WorkflowState;
  updateWorkflow: (updates: Partial<WorkflowState>) => void;
  onTemplateSelect?: (template: WorkflowState) => void;
  isTemplateMode?: boolean;
  onNext?: () => void;
  onBack?: () => void;
}
// Validation schema
const workflowFormSchema = z.object({
  name: z
    .string()
    .min(1, "Workflow name is required")
    .min(3, "Workflow name must be at least 3 characters")
    .max(100, "Workflow name must not exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
});

type WorkflowFormData = z.infer<typeof workflowFormSchema>;

export const Step1_Basics: React.FC<Step1Props> = ({
  workflowState,
  updateWorkflow,
  onTemplateSelect,
  isTemplateMode = false,
  onNext,
  onBack,
}) => {
  const [selectedTemplate, setSelectedTemplate] = React.useState<
    (typeof workflowTemplates)[0] | null
  >(null);
  const [showValidation, setShowValidation] = React.useState(false);

  // Form setup
  const form = useForm<WorkflowFormData>({
    resolver: zodResolver(workflowFormSchema),
    defaultValues: {
      name: workflowState.name || "",
      description: workflowState.description || "",
    },
    mode: "onBlur",
  });

  const {
    formState: { errors, isValid },
    watch,
    setValue,
  } = form;
  const watchedValues = watch();

  // Update workflow state when form values change
  React.useEffect(() => {
    updateWorkflow({
      name: watchedValues.name || "",
      description: watchedValues.description || "",
    });
  }, [watchedValues, updateWorkflow]);
  const workflowTemplates = [
    {
      id: "invoice-processing",
      name: "Invoice Processing Automation",
      description:
        "Automatically process incoming invoices, extract data, and route for approval",
      trigger: {
        type: "document_uploaded",
        category: "Document Management",
        config: {
          folder: "/invoices",
          fileTypes: ["pdf", "jpg", "png"],
        },
      },
      actions: [
        {
          id: "extract-data",
          type: "document_data_extraction",
          config: {
            fields: ["amount", "vendor", "date", "invoice_number"],
            confidence_threshold: 0.8,
          },
          order: 0,
        },
        {
          id: "review-approval",
          type: "review_approval",
          config: {
            reviewers: ["finance_manager"],
            approvalRequired: true,
            timeLimit: 48,
          },
          order: 1,
        },
      ],
      currentStep: 1,
      isComplete: false,
      createdAt: new Date(),
    },
    {
      id: "document-review",
      name: "Document Review Workflow",
      description:
        "Route new documents to appropriate reviewers based on content type and priority",
      trigger: {
        type: "document_uploaded",
        category: "Document Management",
        config: {
          folder: "/documents",
          fileTypes: ["doc", "pdf", "docx"],
        },
      },
      actions: [
        {
          id: "categorize",
          type: "document_categorization",
          config: {
            categories: ["contract", "policy", "report"],
            autoAssign: true,
          },
          order: 0,
        },
        {
          id: "assign-reviewer",
          type: "assign_reviewer",
          config: {
            rules: [
              {
                category: "contract",
                reviewer: "legal_team",
              },
              {
                category: "policy",
                reviewer: "hr_team",
              },
              {
                category: "report",
                reviewer: "management",
              },
            ],
          },
          order: 1,
        },
      ],
      currentStep: 1,
      isComplete: false,
      createdAt: new Date(),
    },
    {
      id: "ticket-routing",
      name: "Customer Support Ticket Routing",
      description:
        "Automatically categorize and assign support tickets to the right team members",
      trigger: {
        type: "form_submitted",
        category: "Forms & Submissions",
        config: {
          form: "support_ticket",
          source: "customer_portal",
        },
      },
      actions: [
        {
          id: "categorize-ticket",
          type: "ticket_categorization",
          config: {
            categories: ["technical", "billing", "general"],
            priority_levels: ["low", "medium", "high", "urgent"],
          },
          order: 0,
        },
        {
          id: "assign-agent",
          type: "assign_agent",
          config: {
            assignment_rules: "round_robin",
            escalation_time: 24,
          },
          order: 1,
        },
      ],
      currentStep: 1,
      isComplete: false,
      createdAt: new Date(),
    },
    {
      id: "employee-onboarding",
      name: "Employee Onboarding Process",
      description:
        "Streamline new hire paperwork processing and task assignments",
      trigger: {
        type: "form_submitted",
        category: "Forms & Submissions",
        config: {
          form: "new_hire_form",
          source: "hr_system",
        },
      },
      actions: [
        {
          id: "create-tasks",
          type: "create_tasks",
          config: {
            tasks: [
              "setup_email_account",
              "create_id_badge",
              "schedule_orientation",
              "assign_equipment",
            ],
            assign_to: "hr_team",
          },
          order: 0,
        },
        {
          id: "send-welcome",
          type: "send_email",
          config: {
            template: "welcome_new_hire",
            include_attachments: ["employee_handbook", "benefits_guide"],
          },
          order: 1,
        },
      ],
      currentStep: 1,
      isComplete: false,
      createdAt: new Date(),
    },
    {
      id: "invoice-approval",
      name: "Invoice Approval Workflow",
      description: "Route invoices for approval based on amount thresholds",
      trigger: {
        type: "document_uploaded",
        category: "Document Processing",
        config: {
          document_type: "invoice",
          folder: "accounts_payable",
        },
      },
      actions: [
        {
          id: "review-invoice",
          type: "create_review_task",
          config: {
            review_type: "financial_approval",
            escalation_rules: "amount_based",
          },
          order: 0,
        },
      ],
      currentStep: 1,
      isComplete: false,
      createdAt: new Date(),
    },
    {
      id: "meeting-scheduler",
      name: "Meeting Scheduler",
      description:
        "Automatically schedule meetings based on calendar availability",
      trigger: {
        type: "calendar_event",
        category: "Calendar & Scheduling",
        config: {
          event_type: "meeting_request",
          minimum_notice: 24,
        },
      },
      actions: [
        {
          id: "send-invites",
          type: "send_email",
          config: {
            template: "meeting_invitation",
            include_calendar: true,
          },
          order: 0,
        },
      ],
      currentStep: 1,
      isComplete: false,
      createdAt: new Date(),
    },
  ];
  const handleTemplateSelect = (template: (typeof workflowTemplates)[0]) => {
    setSelectedTemplate(template);
    // Don't update the workflow state - keep template selection separate from manual input
  };

  const handleNext = async () => {
    if (selectedTemplate && onTemplateSelect) {
      // User selected a template - go to template editing flow
      onTemplateSelect({
        ...selectedTemplate,
        secondaryTriggers: [],
      });
    } else {
      // Validate form before proceeding
      setShowValidation(true);
      const isFormValid = await form.trigger();

      if (isFormValid && onNext) {
        // User filled in manual details - go to regular workflow creation flow
        onNext();
      }
    }
  };

  const isNextEnabled = () => {
    return (
      selectedTemplate !== null ||
      (watchedValues.name?.trim().length > 0 && isValid)
    );
  };
  return (
    <div className="space-y-6">
      {/* Title and Subtitle */}
      <div className="pt-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50 absolute left-0 top-0"
              title="Back to Workflow List"
              aria-label="Back to Workflow List"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <h2 className="text-lg font-bold text-foreground font-inter">
            Create Your Workflow
          </h2>
        </div>
        <p className="text-muted-foreground font-roboto">
          Choose a pre-built template or start from scratch
        </p>
      </div>

      {/* Manual Setup Section - Always show this for both modes */}
      <div className="bg-card rounded-xl border p-6 shadow-md">
        <div className="flex items-start gap-3 mb-4">
          <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div>
            <h3 className="text-base font-semibold text-foreground font-roboto">
              {isTemplateMode ? "Workflow Details" : "Start from Scratch"}
            </h3>
            <p className="text-sm text-muted-foreground font-roboto">
              {isTemplateMode
                ? "Update the workflow name and description as needed."
                : "Create a custom workflow by configuring each step manually."}
            </p>
          </div>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="workflow-name"
              className="text-sm font-medium text-foreground font-roboto"
            >
              Workflow Name
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="relative">
              <Input
                id="workflow-name"
                type="text"
                placeholder="Enter workflow name..."
                {...form.register("name")}
                className={`
                  ${
                    errors.name && showValidation
                      ? "border-red-500 bg-red-50 focus-visible:ring-red-500"
                      : !errors.name &&
                        watchedValues.name &&
                        watchedValues.name.length > 0
                      ? "border-green-500 bg-green-50 focus-visible:ring-green-500"
                      : ""
                  }
                `}
              />
              {!errors.name &&
                watchedValues.name &&
                watchedValues.name.length > 0 && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
            </div>
            {errors.name && showValidation && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.name.message}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="workflow-description"
              className="text-sm font-medium text-foreground font-roboto"
            >
              Description
            </Label>
            <div className="relative">
              <textarea
                id="workflow-description"
                placeholder="Describe what this workflow does..."
                {...form.register("description")}
                rows={3}
                className={`
                  flex min-h-[60px] w-full rounded-xl border border-border bg-card px-3 py-2 text-body leading-none font-inter text-foreground ring-offset-background placeholder:text-muted-foreground hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted disabled:border-border disabled:text-muted-foreground transition-all duration-200 shadow-md resize-none
                  ${
                    errors.description && showValidation
                      ? "border-red-500 bg-red-50 focus-visible:ring-red-500"
                      : !errors.description &&
                        watchedValues.description &&
                        watchedValues.description.length > 0
                      ? "border-green-500 bg-green-50 focus-visible:ring-green-500"
                      : ""
                  }
                `}
              />
              {!errors.description &&
                watchedValues.description &&
                watchedValues.description.length > 0 && (
                  <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                )}
            </div>
            {errors.description && showValidation && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.description.message}</span>
              </div>
            )}
          </div>
        </form>
      </div>

      {!isTemplateMode && (
        <>
          <div className="flex items-center justify-center my-8">
            <div className="flex-1 h-px bg-border"></div>
            <span className="px-4 text-sm font-medium text-muted-foreground bg-background font-roboto">
              Or Select Pre-built Template
            </span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Pre-built Templates Section */}
          <div className="bg-card rounded-xl border p-6 shadow-md">
            <div className="flex items-start gap-3 mb-4">
              <Workflow className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="text-base font-semibold text-foreground font-roboto">
                  Pre-built Ready to Use Workflow Templates
                </h3>
                <p className="text-sm text-muted-foreground font-roboto">
                  Complete workflows with triggers and actions already
                  configured. Select one to customize or use as-is.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {workflowTemplates.map((template, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        onClick={() => handleTemplateSelect(template)}
                        className={`group p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          selectedTemplate?.id === template.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-accent/30"
                        }`}
                      >
                        <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors mb-2">
                          {template.name}
                        </h4>

                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {template.description}
                        </p>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-muted-foreground">
                              Trigger:
                            </span>
                            <span className="font-medium text-foreground">
                              {template.trigger.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-muted-foreground">
                              Actions:
                            </span>
                            <span className="font-medium text-foreground">
                              {template.actions.length} configured
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-border/50">
                          <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-background text-foreground group-hover:bg-accent/50 transition-colors">
                            Select Template →
                          </span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ready to Use</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Bottom Navigation - Only show when not in template mode */}
      {!isTemplateMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4">
          <div className="flex justify-end">
            <Button
              onClick={handleNext}
              disabled={!isNextEnabled()}
              variant="default"
              className="gap-2 ml-auto"
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
          </div>
        </div>
      )}
    </div>
  );
};
