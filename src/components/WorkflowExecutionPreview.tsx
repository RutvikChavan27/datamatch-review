import React from 'react';
import { Clock, CheckCircle, ArrowRight, User, Users, UserPlus, FolderOpen, AlertTriangle } from 'lucide-react';

interface ReviewerInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'internal' | 'external' | 'group';
  requireSignature: boolean;
  signatureFile?: string;
  order: number;
  groupName?: string;
}

interface ActionConfig {
  review: boolean;
  approve: boolean;
  reject: boolean;
  escalate: boolean;
  sign: boolean;
  reviewFolder?: string;
  approveFolder?: string;
  rejectFolder?: string;
  escalateFolder?: string;
  signFolder?: string;
}

interface WorkflowExecutionPreviewProps {
  workflowName: string;
  reviewers: ReviewerInfo[];
  actions: ActionConfig;
}

export const WorkflowExecutionPreview: React.FC<WorkflowExecutionPreviewProps> = ({
  workflowName,
  reviewers,
  actions
}) => {
  const getReviewerIcon = (type: string) => {
    switch (type) {
      case 'internal': return User;
      case 'external': return UserPlus;
      case 'group': return Users;
      default: return User;
    }
  };

  const getAvailableActions = () => {
    return Object.entries(actions).filter(([key, value]) => 
      typeof value === 'boolean' && value && key !== 'nextReviewer'
    ).map(([key]) => key);
  };

  const getFolderForAction = (action: string) => {
    const folderKey = `${action}Folder` as keyof ActionConfig;
    return actions[folderKey] as string || 'Default Folder';
  };

  const availableActions = getAvailableActions();

  return (
    <div className="space-y-8 pt-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Workflow Execution Preview</h3>
        <p className="text-muted-foreground">
          Review how your workflow will execute before creating it.
        </p>
      </div>

      {/* Step-by-Step Preview */}
      <div className="space-y-6">
        <h4 className="text-lg font-medium text-foreground flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Review Sequence
        </h4>

        <div className="space-y-4 ml-7">
          {/* Workflow Start */}
          <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-medium">
              START
            </div>
            <div>
              <div className="font-medium text-foreground">Workflow Initiated</div>
              <div className="text-sm text-muted-foreground">Document enters the review process</div>
            </div>
          </div>

          {/* Reviewer Steps */}
          {reviewers.map((reviewer, index) => {
            const ReviewerIcon = getReviewerIcon(reviewer.type);
            
            return (
              <div key={reviewer.id} className="space-y-3">
                {/* Step Arrow */}
                {index > 0 && (
                  <div className="flex justify-center">
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}

                {/* Reviewer Step */}
                <div className="flex items-start gap-4 p-5 border border-border rounded-lg bg-card">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    {/* Reviewer Info */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <ReviewerIcon className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-foreground">{reviewer.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          reviewer.type === 'internal' 
                            ? 'bg-green-100 text-green-600' 
                            : reviewer.type === 'group'
                            ? 'bg-purple-100 text-purple-600'
                            : 'bg-orange-100 text-orange-600'
                        }`}>
                          {reviewer.type === 'internal' ? 'Internal' : 
                           reviewer.type === 'group' ? 'Group' : 'External'}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Will receive notification: {reviewer.email}
                      </div>
                    </div>

                    {/* Available Actions */}
                    <div>
                      <div className="text-sm font-medium text-foreground mb-2">Available Actions:</div>
                      <div className="flex flex-wrap gap-2">
                        {availableActions.map(action => (
                          <span 
                            key={action}
                            className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded-full capitalize"
                          >
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Status Progression */}
                    <div className="text-sm">
                      <span className="text-muted-foreground">Status: </span>
                      <span className="text-blue-600 font-medium">
                        Awaiting {reviewer.name}
                      </span>
                      <span className="text-muted-foreground"> → </span>
                      <span className="text-green-600 font-medium">
                        Approved by {reviewer.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Final Arrow */}
          <div className="flex justify-center">
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </div>

          {/* Workflow End */}
          <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium text-foreground">Workflow Complete</div>
              <div className="text-sm text-muted-foreground">All reviewers have approved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Folder Destination Mapping */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-foreground flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-purple-600" />
          Folder Destination Mapping
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
          {availableActions.map(action => (
            <div key={action} className="p-4 border border-border rounded-lg bg-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded flex items-center justify-center text-xs font-semibold capitalize">
                  {action[0]}
                </div>
                <span className="font-medium text-foreground capitalize">{action}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Documents will be moved to: <span className="font-medium text-foreground">{getFolderForAction(action)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estimated Completion */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Estimated Completion Time</h4>
            <p className="text-sm text-blue-700">
              Based on {reviewers.length} reviewer(s): <span className="font-semibold">
                {reviewers.length * 2}-{reviewers.length * 4} business days
              </span>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Actual time may vary based on reviewer availability and complexity
            </p>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
          <div>
            <h4 className="font-medium text-destructive mb-1">Important Notes</h4>
            <ul className="text-sm text-destructive space-y-1">
              <li>• Reviewers will be notified in sequence, not simultaneously</li>
              <li>• Each reviewer must complete their action before the next is notified</li>
              <li>• All selected actions are available to every reviewer</li>
              <li>• Workflow will stop if any reviewer rejects the document</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};