import React from "react";
import {
  Zap,
  Settings,
  Clock,
  CheckCircle,
  Cog,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkflowTypeSelectionProps {
  onSelectType: (type: "simple" | "advanced") => void;
  onBack?: () => void;
}

export const WorkflowTypeSelection: React.FC<WorkflowTypeSelectionProps> = ({
  onSelectType,
  onBack,
}) => {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Main scrollable content */}
      <div className="flex items-center justify-center h-screen">
        <div className="w-full max-w-6xl p-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <button
                onClick={() => (window.location.href = "/?mode=list")}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50"
                title="Back to Workflow List"
                aria-label="Back to Workflow List"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-semibold text-foreground font-inter tracking-tight">
                Create Your Workflow
              </h1>
            </div>
            <p className="text-base text-muted-foreground font-roboto">
              Setup 1-5 minutes for simple and 5-20 minutes for advanced
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Simple Workflow */}
            <div
              className="workflow-card group"
              onClick={() => onSelectType("simple")}
            >
              <div className="workflow-card-header">
                <div className="workflow-icon-container workflow-icon-blue">
                  <Zap className="w-6 h-6 text-accent-blue" strokeWidth={2} />
                </div>
                <div className="workflow-card-title-section">
                  <h3 className="card-title font-roboto text-xl font-semibold text-foreground">
                    Simple Workflow
                  </h3>
                  <p className="card-description font-roboto text-base text-muted-foreground">
                    Quick 3-step routing for everyday tasks
                  </p>
                  <div className="workflow-setup-time flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-roboto text-sm text-muted-foreground">
                      5 minutes setup
                    </span>
                  </div>
                </div>
              </div>

              <div className="workflow-features-list">
                <div className="workflow-feature">
                  <CheckCircle
                    className="w-5 h-5 text-accent-green"
                    strokeWidth={2}
                  />
                  <span className="font-roboto text-base text-foreground">
                    Select document or form
                  </span>
                </div>
                <div className="workflow-feature">
                  <CheckCircle
                    className="w-5 h-5 text-accent-green"
                    strokeWidth={2}
                  />
                  <span className="font-roboto text-base text-foreground">
                    Choose recipient
                  </span>
                </div>
                <div className="workflow-feature">
                  <CheckCircle
                    className="w-5 h-5 text-accent-green"
                    strokeWidth={2}
                  />
                  <span className="font-roboto text-base text-foreground">
                    Set notifications
                  </span>
                </div>
              </div>

              <Button
                variant="default"
                size="lg"
                className="w-full gap-2 font-roboto font-semibold"
              >
                <Zap className="w-4 h-4" />
                Create Simple Workflow
              </Button>
            </div>

            {/* Advanced Workflow */}
            <div
              className="workflow-card group"
              onClick={() => onSelectType("advanced")}
            >
              <div className="workflow-card-header">
                <div className="workflow-icon-container workflow-icon-purple">
                  <Settings
                    className="w-6 h-6 text-accent-purple"
                    strokeWidth={2}
                  />
                </div>
                <div className="workflow-card-title-section">
                  <h3 className="card-title font-roboto text-xl font-semibold text-foreground">
                    Advanced Workflow
                  </h3>
                  <p className="card-description font-roboto text-base text-muted-foreground">
                    Enterprise features for building automations that scale
                  </p>
                  <div className="workflow-setup-time flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-roboto text-sm text-muted-foreground">
                      20 minutes setup
                    </span>
                  </div>
                </div>
              </div>

              <div className="workflow-features-list">
                <div className="workflow-feature">
                  <Cog className="w-5 h-5 text-accent-orange" strokeWidth={2} />
                  <span className="font-roboto text-base text-foreground">
                    Complex triggers & conditions
                  </span>
                </div>
                <div className="workflow-feature">
                  <Cog className="w-5 h-5 text-accent-orange" strokeWidth={2} />
                  <span className="font-roboto text-base text-foreground">
                    Multiple actions & routing
                  </span>
                </div>
                <div className="workflow-feature">
                  <Cog className="w-5 h-5 text-accent-orange" strokeWidth={2} />
                  <span className="font-roboto text-base text-foreground">
                    Advanced logic & permissions
                  </span>
                </div>
                <div className="workflow-feature">
                  <Cog className="w-5 h-5 text-accent-orange" strokeWidth={2} />
                  <span className="font-roboto text-base text-foreground">
                    User action buttons
                  </span>
                </div>
                <div className="workflow-feature">
                  <Cog className="w-5 h-5 text-accent-orange" strokeWidth={2} />
                  <span className="font-roboto text-base text-foreground">
                    Field validation rules
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                className="button-primary w-full gap-2 font-roboto font-semibold"
              >
                <Settings className="w-4 h-4" />
                Create Advanced Workflow
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
