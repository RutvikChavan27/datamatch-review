import React from "react";
import { Zap, Settings, Clock, CheckCircle, Cog } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface CreateWorkflowDialogProps {
  children: React.ReactNode; // The trigger button
  onSelectType: (type: "simple" | "advanced") => void;
}

export const CreateWorkflowDialog: React.FC<CreateWorkflowDialogProps> = ({
  children,
  onSelectType,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-[900px] p-0 border shadow-lg bg-background z-50"
        align="start"
        side="bottom"
      >
        <div className="max-w-4xl w-full p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Create Your Workflow
            </h1>
            <p className="text-muted-foreground text-lg">
              Choose a pre-built template or start from scratch
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Simple Workflow */}
            <div
              className="card-elevated rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => onSelectType("simple")}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-accent-blue-bg rounded-xl flex items-center justify-center group-hover:bg-accent-blue-bg/80 transition-colors">
                  <Zap className="w-6 h-6 text-accent-blue" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="card-title mb-2">Simple Workflow</h3>
                  <p className="card-description mb-3">
                    Quick 3-step routing for everyday tasks
                  </p>
                  <div className="flex flex-row items-center gap-2 text-caption">
                    <Clock className="w-3 h-3" />
                    <span>5 minutes setup</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle
                    className="w-4 h-4 text-accent-green"
                    strokeWidth={1.5}
                  />
                  <span className="text-foreground">
                    Select document or form
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle
                    className="w-4 h-4 text-accent-green"
                    strokeWidth={1.5}
                  />
                  <span className="text-foreground">Choose recipient</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle
                    className="w-4 h-4 text-accent-green"
                    strokeWidth={1.5}
                  />
                  <span className="text-foreground">Set notifications</span>
                </div>
              </div>

              <Button className="button-primary w-full">
                Create Simple Workflow
              </Button>
            </div>

            {/* Advanced Workflow */}
            <div
              className="card-elevated rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => onSelectType("advanced")}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-accent-purple-bg rounded-xl flex items-center justify-center group-hover:bg-accent-purple-bg/80 transition-colors">
                  <Settings
                    className="w-6 h-6 text-accent-purple"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="card-title mb-2">Advanced Workflow</h3>
                  <p className="card-description mb-3">
                    Enterprise features for building automations that scale
                  </p>
                  <div className="flex items-center gap-2 text-caption">
                    <Clock className="w-3 h-3" />
                    <span>20 minutes setup</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Cog
                    className="w-4 h-4 text-accent-orange"
                    strokeWidth={1.5}
                  />
                  <span className="text-foreground">
                    Complex triggers & conditions
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Cog
                    className="w-4 h-4 text-accent-orange"
                    strokeWidth={1.5}
                  />
                  <span className="text-foreground">
                    Multiple actions & routing
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Cog
                    className="w-4 h-4 text-accent-orange"
                    strokeWidth={1.5}
                  />
                  <span className="text-foreground">
                    Advanced logic & permissions
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Cog
                    className="w-4 h-4 text-accent-orange"
                    strokeWidth={1.5}
                  />
                  <span className="text-foreground">User action buttons</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Cog
                    className="w-4 h-4 text-accent-orange"
                    strokeWidth={1.5}
                  />
                  <span className="text-foreground">
                    Field validation rules
                  </span>
                </div>
              </div>

              <Button variant="secondary" className="w-full">
                Create Advanced Workflow
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
