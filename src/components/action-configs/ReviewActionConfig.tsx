import React from 'react';
import { User, Clock } from 'lucide-react';
import { RadioButton, RadioGroup } from '../ui/custom-radio';
import { Checkbox } from '../ui/checkbox';

interface ReviewActionConfigProps {
  config: Record<string, any>;
  onConfigUpdate: (config: Record<string, any>) => void;
}

export const ReviewActionConfig: React.FC<ReviewActionConfigProps> = ({
  config,
  onConfigUpdate
}) => {
  return (
    <div className="space-y-6">
      {/* What this action does */}
      <div className="bg-muted/50 p-4 rounded-lg border">
        <h4 className="text-sm font-medium text-foreground mb-2">What does "Assign Review" do?</h4>
        <p className="text-xs text-muted-foreground">
          This action sends the document to selected reviewers who can then approve, reject, sign, or forward it. 
          The workflow will pause until all reviewers complete their tasks.
        </p>
      </div>

      {/* Reviewer Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          <User className="w-4 h-4 inline mr-2" />
          Select Reviewers
        </label>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Reviewer Type</label>
            <select
              value={config.reviewerType || 'internal'}
              onChange={(e) => onConfigUpdate({ reviewerType: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded bg-background text-sm focus:ring-1 focus:ring-ring focus:border-ring"
            >
              <option value="internal">Internal Users/Groups</option>
              <option value="external">External Email Addresses</option>
              <option value="mixed">Both Internal & External</option>
            </select>
          </div>

          {config.reviewerType !== 'external' && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Internal Reviewers</label>
              <select
                multiple
                value={config.internalReviewers || []}
                onChange={(e) => onConfigUpdate({ 
                  internalReviewers: Array.from(e.target.selectedOptions, option => option.value)
                })}
                className="w-full px-3 py-2 border border-input rounded bg-background text-sm focus:ring-1 focus:ring-ring focus:border-ring min-h-24"
              >
                <optgroup label="Roles">
                  <option value="manager">Direct Manager</option>
                  <option value="dept_head">Department Head</option>
                  <option value="compliance">Compliance Officer</option>
                </optgroup>
                <optgroup label="Groups">
                  <option value="finance_team">Finance Team</option>
                  <option value="legal_team">Legal Department</option>
                  <option value="exec_team">Executive Team</option>
                </optgroup>
                <optgroup label="Specific Users">
                  <option value="user_john">John Smith</option>
                  <option value="user_jane">Jane Doe</option>
                  <option value="user_mike">Mike Wilson</option>
                </optgroup>
              </select>
              <p className="text-xs text-muted-foreground mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>
          )}

          {config.reviewerType !== 'internal' && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">External Email Addresses</label>
              <textarea
                value={config.externalEmails || ''}
                onChange={(e) => onConfigUpdate({ externalEmails: e.target.value })}
                placeholder="client@company.com&#10;lawyer@lawfirm.com&#10;auditor@audit.com"
                rows={3}
                className="w-full px-3 py-2 border border-input rounded bg-background text-sm focus:ring-1 focus:ring-ring focus:border-ring resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">One email per line</p>
            </div>
          )}
        </div>
      </div>

      {/* Available Actions for Reviewers */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Available Actions for Reviewers
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: 'approve', label: 'Approve', desc: 'Accept the document' },
            { key: 'reject', label: 'Reject', desc: 'Decline with comments' },
            { key: 'sign', label: 'Sign', desc: 'Digital signature' },
            { key: 'forward', label: 'Forward', desc: 'Send to someone else' },
            { key: 'request_changes', label: 'Request Changes', desc: 'Ask for modifications' },
            { key: 'acknowledge', label: 'Acknowledge', desc: 'Mark as reviewed' }
          ].map(action => (
            <label key={action.key} className="flex items-center space-x-2 p-2 border border-input rounded bg-background hover:bg-muted/50 cursor-pointer">
              <Checkbox
                checked={config.allowedActions?.includes(action.key) || false}
                onCheckedChange={(checked) => {
                  const current = config.allowedActions || [];
                  const updated = checked 
                    ? [...current, action.key]
                    : current.filter(a => a !== action.key);
                  onConfigUpdate({ allowedActions: updated });
                }}
              />
              <div>
                <span className="text-sm font-medium">{action.label}</span>
                <p className="text-xs text-muted-foreground">{action.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Review Settings */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          <Clock className="w-4 h-4 inline mr-2" />
          Review Deadline
        </label>
        <RadioGroup 
          name="deadline"
          value={config.deadline || '3_days'} 
          onChange={(value) => onConfigUpdate({ deadline: value })}
        >
          <RadioButton
            name="deadline"
            value="1_day"
            label="24 Hours"
            size="sm"
          />
          <RadioButton
            name="deadline"
            value="3_days"
            label="3 Days"
            size="sm"
          />
          <RadioButton
            name="deadline"
            value="1_week"
            label="1 Week"
            size="sm"
          />
        </RadioGroup>
      </div>

      {/* Review Flow Settings */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Review Flow</label>
        <select
          value={config.reviewFlow || 'all_must_review'}
          onChange={(e) => onConfigUpdate({ reviewFlow: e.target.value })}
          className="w-full px-3 py-2 border border-input rounded bg-background text-sm focus:ring-1 focus:ring-ring focus:border-ring"
        >
          <option value="all_must_review">All reviewers must approve</option>
          <option value="any_can_approve">Any reviewer can approve</option>
          <option value="majority_rule">Majority must approve</option>
          <option value="sequential">Review in sequence</option>
        </select>
      </div>

      {/* Instructions */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Review Instructions
        </label>
        <textarea
          value={config.instructions || ''}
          onChange={(e) => onConfigUpdate({ instructions: e.target.value })}
          placeholder="Please review for accuracy and compliance. Check all calculations and ensure proper documentation is attached."
          rows={3}
          className="w-full px-3 py-2 border border-input rounded bg-background text-sm focus:ring-1 focus:ring-ring focus:border-ring resize-none"
        />
      </div>
    </div>
  );
};