import React from 'react';
import { RadioButton, RadioGroup } from '../ui/custom-radio';

interface TicketActionConfigProps {
  config: Record<string, any>;
  onConfigUpdate: (config: Record<string, any>) => void;
}

export const TicketActionConfig: React.FC<TicketActionConfigProps> = ({
  config,
  onConfigUpdate
}) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Ticket Priority Level
        </label>
        <RadioGroup 
          name="priority"
          value={config.priority || 'medium'} 
          onChange={(value) => onConfigUpdate({ priority: value })}
        >
          <RadioButton
            name="priority"
            value="low"
            label="Low"
            size="sm"
          />
          <RadioButton
            name="priority"
            value="medium"
            label="Medium"
            size="sm"
          />
          <RadioButton
            name="priority"
            value="high"
            label="High"
            size="sm"
          />
          <RadioButton
            name="priority"
            value="urgent"
            label="Urgent"
            size="sm"
          />
        </RadioGroup>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Assign To Department
        </label>
        <select
          value={config.department || ''}
          onChange={(e) => onConfigUpdate({ department: e.target.value })}
          className="w-full px-3 py-2 border border-input rounded bg-background text-sm focus:ring-1 focus:ring-ring focus:border-ring"
        >
          <option value="">Auto-assign based on content</option>
          <option value="it">IT Support</option>
          <option value="hr">Human Resources</option>
          <option value="finance">Finance Team</option>
          <option value="operations">Operations</option>
        </select>
      </div>
    </div>
  );
};