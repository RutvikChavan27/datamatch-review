import React from 'react';
import { FolderOpen } from 'lucide-react';
import { RadioButton, RadioGroup } from '../ui/custom-radio';

interface DocumentActionConfigProps {
  config: Record<string, any>;
  onConfigUpdate: (config: Record<string, any>) => void;
}

export const DocumentActionConfig: React.FC<DocumentActionConfigProps> = ({
  config,
  onConfigUpdate
}) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          <FolderOpen className="w-4 h-4 inline mr-1" />
          Destination Folder
        </label>
        <select
          value={config.destinationFolder || ''}
          onChange={(e) => onConfigUpdate({ destinationFolder: e.target.value })}
          className="w-full px-3 py-2 border border-input rounded bg-background text-sm focus:ring-1 focus:ring-ring focus:border-ring"
        >
          <option value="">Select destination...</option>
          <option value="processed">Processed Documents</option>
          <option value="approved">Approved & Signed</option>
          <option value="pending">Pending Review</option>
          <option value="archive">Archived Documents</option>
          <option value="rejected">Rejected Items</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          File Naming Convention
        </label>
        <RadioGroup 
          name="naming"
          value={config.naming || 'original'} 
          onChange={(value) => onConfigUpdate({ naming: value })}
        >
          <RadioButton
            name="naming"
            value="original"
            label="Keep original filename"
            size="sm"
          />
          <RadioButton
            name="naming"
            value="timestamp"
            label="Add timestamp prefix"
            size="sm"
          />
          <RadioButton
            name="naming"
            value="custom"
            label="Custom naming pattern"
            size="sm"
          />
        </RadioGroup>
      </div>
    </div>
  );
};