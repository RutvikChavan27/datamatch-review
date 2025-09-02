import React from 'react';
import { Mail, User } from 'lucide-react';
import { EnhancedEmailEditor } from '../EnhancedEmailEditor';
import { RadioButton, RadioGroup } from '../ui/custom-radio';

interface EmailActionConfigProps {
  config: Record<string, any>;
  onConfigUpdate: (config: Record<string, any>) => void;
}

export const EmailActionConfig: React.FC<EmailActionConfigProps> = ({
  config,
  onConfigUpdate
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <Mail className="w-4 h-4 inline mr-2" />
          Email Recipients
        </label>
        <RadioGroup 
          name="recipients"
          value={config.recipients || 'uploader'} 
          onChange={(value) => onConfigUpdate({ recipients: value })}
        >
          <RadioButton
            name="recipients"
            value="uploader"
            label="Document Creator"
            hint="Send to the person who uploaded the document"
            size="sm"
          />
          <RadioButton
            name="recipients"
            value="manager"
            label="Direct Manager"
            hint="Send to the uploader's direct manager"
            size="sm"
          />
          <RadioButton
            name="recipients"
            value="team"
            label="Team Members"
            hint="Send to all team members"
            size="sm"
          />
          <RadioButton
            name="recipients"
            value="custom"
            label="Custom Email"
            hint="Send to specific email addresses"
            size="sm"
          />
        </RadioGroup>
      </div>

      {config.recipients === 'custom' && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Addresses
          </label>
          <input
            type="text"
            value={config.customEmails || ''}
            onChange={(e) => onConfigUpdate({ customEmails: e.target.value })}
            placeholder="user1@company.com, user2@company.com"
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0"
          />
        </div>
      )}

      <EnhancedEmailEditor
        subject={config.subject || ''}
        body={config.message || ''}
        onSubjectChange={(subject) => onConfigUpdate({ subject })}
        onBodyChange={(message) => onConfigUpdate({ message })}
      />
    </div>
  );
};