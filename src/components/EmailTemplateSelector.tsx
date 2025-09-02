import React, { useState } from 'react';
import { Mail, Plus, Save, Edit, Trash2 } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'approval' | 'notification' | 'reminder' | 'custom';
  isSystem: boolean;
}

interface EmailTemplateSelectorProps {
  selectedTemplate?: EmailTemplate;
  currentSubject: string;
  currentBody: string;
  onTemplateSelect: (template: EmailTemplate) => void;
  onSaveAsTemplate: (name: string, category: string) => void;
  onCustomContent: () => void;
}

const PREDEFINED_TEMPLATES: EmailTemplate[] = [
  {
    id: 'approval-request',
    name: 'Approval Request',
    subject: 'Action Required: {document.name} Needs Your Approval',
    body: 'Hello {user.name},\n\nA new document "{document.name}" has been uploaded and requires your approval.\n\nDocument Details:\n- Uploaded by: {document.uploader}\n- Upload Date: {document.uploadDate}\n- Type: {document.type}\n\nPlease review and approve at your earliest convenience.\n\nBest regards,\n{system.companyName}',
    category: 'approval',
    isSystem: true
  },
  {
    id: 'notification-upload',
    name: 'Document Upload Notification',
    subject: 'New Document Uploaded: {document.name}',
    body: 'Hi {user.name},\n\nThis is to notify you that a new document "{document.name}" has been uploaded to the system.\n\nDocument Information:\n- Uploaded by: {document.uploader}\n- Size: {document.size}\n- Location: {document.folder}\n\nYou can access the document through your dashboard.\n\nRegards,\n{system.companyName}',
    category: 'notification',
    isSystem: true
  },
  {
    id: 'reminder-review',
    name: 'Review Reminder',
    subject: 'Reminder: {document.name} Awaiting Your Review',
    body: 'Dear {user.name},\n\nThis is a friendly reminder that the document "{document.name}" is still awaiting your review.\n\nWorkflow: {workflow.name}\nStatus: {workflow.status}\nDays Pending: {workflow.daysPending}\n\nPlease complete your review when possible.\n\nThank you,\n{system.companyName}',
    category: 'reminder',
    isSystem: true
  }
];

export const EmailTemplateSelector: React.FC<EmailTemplateSelectorProps> = ({
  selectedTemplate,
  currentSubject,
  currentBody,
  onTemplateSelect,
  onSaveAsTemplate,
  onCustomContent
}) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateCategory, setTemplateCategory] = useState('custom');
  const [activeTab, setActiveTab] = useState<'templates' | 'custom'>('templates');

  const handleSaveTemplate = () => {
    if (templateName.trim()) {
      onSaveAsTemplate(templateName, templateCategory);
      setShowSaveDialog(false);
      setTemplateName('');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'approval': return 'bg-blue-100 text-blue-800';
      case 'notification': return 'bg-green-100 text-green-800';
      case 'reminder': return 'bg-yellow-100 text-yellow-800';
      case 'custom': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Email Template</label>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              activeTab === 'templates' 
                ? 'bg-[hsl(var(--color-accent-blue))] text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              activeTab === 'custom' 
                ? 'bg-[hsl(var(--color-accent-blue))] text-white' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Custom
          </button>
        </div>
      </div>

      {activeTab === 'templates' && (
        <div className="space-y-3">
          <div className="grid gap-2 max-h-60 overflow-y-auto">
            {PREDEFINED_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => onTemplateSelect(template)}
                className={`p-3 text-left border rounded-lg transition-colors ${
                  selectedTemplate?.id === template.id
                    ? 'border-[hsl(var(--color-accent-blue))] bg-[hsl(var(--color-accent-blue-bg))]'
                    : 'border-border hover:border-[hsl(var(--color-accent-blue))]/50 hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-foreground">{template.name}</div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground line-clamp-2">
                  {template.subject}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="space-y-4">
          <button
            onClick={onCustomContent}
            className="w-full p-4 border-2 border-dashed border-border rounded-lg hover:border-[hsl(var(--color-accent-blue))]/50 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Edit className="w-4 h-4" />
              <span>Create Custom Content</span>
            </div>
          </button>

          {(currentSubject || currentBody) && (
            <div className="p-3 bg-muted/30 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Current Content</span>
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-[hsl(var(--color-accent-blue))] text-white rounded hover:bg-[hsl(var(--color-accent-blue))]/90"
                >
                  <Save className="w-3 h-3" />
                  Save as Template
                </button>
              </div>
              {currentSubject && (
                <div className="text-xs text-muted-foreground mb-1">
                  Subject: {currentSubject}
                </div>
              )}
              {currentBody && (
                <div className="text-xs text-muted-foreground line-clamp-3">
                  {currentBody}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold text-foreground mb-4">Save as Template</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Template Name</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Enter template name"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-[hsl(var(--color-accent-blue))] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                <select
                  value={templateCategory}
                  onChange={(e) => setTemplateCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-[hsl(var(--color-accent-blue))] focus:border-transparent"
                >
                  <option value="custom">Custom</option>
                  <option value="approval">Approval</option>
                  <option value="notification">Notification</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveTemplate}
                disabled={!templateName.trim()}
                className="flex-1 bg-[hsl(var(--color-accent-blue))] text-white px-4 py-2 rounded-md hover:bg-[hsl(var(--color-accent-blue))]/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Template
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 border border-border rounded-md hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};