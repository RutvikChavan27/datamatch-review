import React, { useState } from 'react';
import { Plus, X, User, Users, ArrowRight, Clock, CheckCircle } from 'lucide-react';
import { QuickReviewerSelector } from './QuickReviewerSelector';

interface Reviewer {
  id: string;
  type: 'internal' | 'external';
  name: string;
  email?: string;
  role?: string;
  status: 'pending' | 'approved' | 'rejected' | 'current';
}

interface MultiStepReviewConfigProps {
  reviewers: Reviewer[];
  onReviewersChange: (reviewers: Reviewer[]) => void;
  maxReviewers?: number;
}

export const MultiStepReviewConfig: React.FC<MultiStepReviewConfigProps> = ({
  reviewers,
  onReviewersChange,
  maxReviewers = 4
}) => {
  const [useAdvanced, setUseAdvanced] = useState(false);

  // Moved to QuickReviewerSelector component

  const removeReviewer = (reviewerId: string) => {
    const updatedReviewers = reviewers.filter(r => r.id !== reviewerId);
    // Update status for the first reviewer
    if (updatedReviewers.length > 0 && !updatedReviewers.some(r => r.status === 'current')) {
      updatedReviewers[0].status = 'current';
    }
    onReviewersChange(updatedReviewers);
  };

  const moveReviewer = (reviewerId: string, direction: 'up' | 'down') => {
    const currentIndex = reviewers.findIndex(r => r.id === reviewerId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= reviewers.length) return;

    const updatedReviewers = [...reviewers];
    [updatedReviewers[currentIndex], updatedReviewers[newIndex]] = 
    [updatedReviewers[newIndex], updatedReviewers[currentIndex]];

    onReviewersChange(updatedReviewers);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected': return <X className="w-4 h-4 text-red-600" />;
      case 'current': return <Clock className="w-4 h-4 text-primary" />;
      default: return <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'current': return 'Current Reviewer';
      default: return 'Awaiting';
    }
  };

  // Show quick selector by default, advanced on request
  if (!useAdvanced) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Review Sequence</h3>
          <button
            onClick={() => setUseAdvanced(true)}
            className="text-xs text-primary hover:underline"
          >
            Advanced Options
          </button>
        </div>
        <QuickReviewerSelector
          reviewers={reviewers}
          onReviewersChange={onReviewersChange}
          maxReviewers={maxReviewers}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Review Sequence</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUseAdvanced(false)}
            className="text-xs text-primary hover:underline"
          >
            Quick Add
          </button>
          <div className="text-xs text-muted-foreground">
            {reviewers.length}/{maxReviewers} reviewers
          </div>
        </div>
      </div>

      {/* Current Reviewers */}
      {reviewers.length > 0 && (
        <div className="space-y-3">
          {reviewers.map((reviewer, index) => (
            <div key={reviewer.id} className="relative">
              <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                reviewer.status === 'current' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border bg-card'
              }`}>
                {/* Step Number & Status */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    Step {index + 1}
                  </div>
                  {getStatusIcon(reviewer.status)}
                </div>

                {/* Reviewer Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {reviewer.type === 'internal' ? (
                      <User className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Users className="w-4 h-4 text-muted-foreground" />
                    )}
                    <div className="font-medium text-foreground truncate">
                      {reviewer.name}
                    </div>
                    <div className={`text-xs px-2 py-0.5 rounded-full ${
                      reviewer.type === 'internal' 
                        ? 'bg-accent text-accent-foreground' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {reviewer.type}
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    {reviewer.email && <div>Email: {reviewer.email}</div>}
                    {reviewer.role && <div>Role: {reviewer.role}</div>}
                    <div className="font-medium">
                      Status: {getStatusText(reviewer.status)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveReviewer(reviewer.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => removeReviewer(reviewer.id)}
                    className="p-1 text-destructive hover:text-destructive/80"
                    title="Remove reviewer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => moveReviewer(reviewer.id, 'down')}
                    disabled={index === reviewers.length - 1}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    ↓
                  </button>
                </div>
              </div>

              {/* Arrow to next step */}
              {index < reviewers.length - 1 && (
                <div className="flex justify-center my-2">
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick Add moved to QuickReviewerSelector component */}

      {/* Info */}
      <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
        <div className="font-medium mb-1">Review Process</div>
        <div>
          Reviewers will be contacted in sequence. Each reviewer must approve before the next reviewer is notified.
          Maximum {maxReviewers} reviewers allowed per workflow.
        </div>
      </div>
    </div>
  );
};