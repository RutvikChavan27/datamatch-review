import React, { useState, useRef, useCallback } from 'react';
import { Mail, AtSign, Type } from 'lucide-react';
import { VariableInsertMenu } from './VariableInsertMenu';
import { EmailTemplateSelector } from './EmailTemplateSelector';

interface EnhancedEmailEditorProps {
  subject: string;
  body: string;
  onSubjectChange: (subject: string) => void;
  onBodyChange: (body: string) => void;
}

interface MenuState {
  isVisible: boolean;
  position: { x: number; y: number };
  searchQuery: string;
  targetField: 'subject' | 'body';
}

export const EnhancedEmailEditor: React.FC<EnhancedEmailEditorProps> = ({
  subject,
  body,
  onSubjectChange,
  onBodyChange
}) => {
  const [menuState, setMenuState] = useState<MenuState>({
    isVisible: false,
    position: { x: 0, y: 0 },
    searchQuery: '',
    targetField: 'body'
  });
  
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  
  const subjectRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const handleSlashInput = useCallback((
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: 'subject' | 'body'
  ) => {
    if (event.key === '/') {
      const rect = event.currentTarget.getBoundingClientRect();
      const caretPosition = event.currentTarget.selectionStart || 0;
      
      setMenuState({
        isVisible: true,
        position: {
          x: rect.left + 10,
          y: rect.bottom + 5
        },
        searchQuery: '',
        targetField: field
      });
    } else if (menuState.isVisible && event.key === 'Escape') {
      setMenuState(prev => ({ ...prev, isVisible: false }));
    }
  }, [menuState.isVisible]);

  const handleVariableSelect = (variable: any) => {
    const currentText = menuState.targetField === 'subject' ? subject : body;
    const targetRef = menuState.targetField === 'subject' ? subjectRef : bodyRef;
    
    if (targetRef.current) {
      const caretPosition = targetRef.current.selectionStart || 0;
      const beforeSlash = currentText.substring(0, Math.max(0, caretPosition - menuState.searchQuery.length - 1));
      const afterCaret = currentText.substring(caretPosition);
      const newText = beforeSlash + variable.value + afterCaret;
      
      if (menuState.targetField === 'subject') {
        onSubjectChange(newText);
      } else {
        onBodyChange(newText);
      }
    }
    
    setMenuState(prev => ({ ...prev, isVisible: false, searchQuery: '' }));
  };

  const handleTemplateSelect = (template: any) => {
    onSubjectChange(template.subject);
    onBodyChange(template.body);
    setSelectedTemplate(template);
    setShowTemplateSelector(false);
  };

  const handleSaveAsTemplate = (name: string, category: string) => {
    // In a real implementation, this would save to a backend
    console.log('Saving template:', { name, category, subject, body });
  };

  const handleTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: 'subject' | 'body'
  ) => {
    const value = event.target.value;
    
    if (field === 'subject') {
      onSubjectChange(value);
    } else {
      onBodyChange(value);
    }

    // Update search query if menu is visible
    if (menuState.isVisible && menuState.targetField === field) {
      const caretPosition = event.target.selectionStart || 0;
      const textBeforeCaret = value.substring(0, caretPosition);
      const lastSlashIndex = textBeforeCaret.lastIndexOf('/');
      
      if (lastSlashIndex !== -1) {
        const searchQuery = textBeforeCaret.substring(lastSlashIndex + 1);
        setMenuState(prev => ({ ...prev, searchQuery }));
      } else {
        setMenuState(prev => ({ ...prev, isVisible: false }));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">Email Configuration</span>
          <button
            onClick={() => setShowTemplateSelector(!showTemplateSelector)}
            className="text-xs text-[hsl(var(--color-accent-blue))] hover:text-[hsl(var(--color-accent-blue))]/80 underline"
          >
            {showTemplateSelector ? 'Hide Templates' : 'Choose Template'}
          </button>
        </div>
        
        {showTemplateSelector && (
          <EmailTemplateSelector
            selectedTemplate={selectedTemplate}
            currentSubject={subject}
            currentBody={body}
            onTemplateSelect={handleTemplateSelect}
            onSaveAsTemplate={handleSaveAsTemplate}
            onCustomContent={() => setShowTemplateSelector(false)}
          />
        )}
      </div>

      {/* Subject Field */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          <Type className="w-4 h-4 inline mr-2" />
          Email Subject
        </label>
        <input
          ref={subjectRef}
          type="text"
          value={subject}
          onChange={(e) => handleTextChange(e, 'subject')}
          onKeyDown={(e) => handleSlashInput(e, 'subject')}
          placeholder="Enter email subject (use / to insert variables)"
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-[hsl(var(--color-accent-blue))] focus:border-transparent"
        />
        <div className="mt-1 text-xs text-muted-foreground">
          Type "/" to insert variables like {'{user.name}'} or {'{document.name}'}
        </div>
      </div>

      {/* Message Body */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          <Mail className="w-4 h-4 inline mr-2" />
          Message Content
        </label>
        <textarea
          ref={bodyRef}
          value={body}
          onChange={(e) => handleTextChange(e, 'body')}
          onKeyDown={(e) => handleSlashInput(e, 'body')}
          placeholder="Enter your email message (use / to insert variables)"
          rows={6}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-[hsl(var(--color-accent-blue))] focus:border-transparent resize-none"
        />
        <div className="mt-1 text-xs text-muted-foreground">
          Type "/" to insert variables. Use variables for dynamic content like user names, document details, etc.
        </div>
      </div>

      {/* Variable Insert Menu */}
      <VariableInsertMenu
        isVisible={menuState.isVisible}
        position={menuState.position}
        searchQuery={menuState.searchQuery}
        onVariableSelect={handleVariableSelect}
        onClose={() => setMenuState(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};