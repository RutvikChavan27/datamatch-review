import React, { useState, useRef, useEffect } from 'react';
import { Search, User, FileText, Hash, Calendar, CheckCircle } from 'lucide-react';

interface Variable {
  id: string;
  label: string;
  value: string;
  category: 'user' | 'document' | 'system' | 'workflow';
  icon: React.ComponentType<any>;
}

interface VariableInsertMenuProps {
  isVisible: boolean;
  position: { x: number; y: number };
  searchQuery: string;
  onVariableSelect: (variable: Variable) => void;
  onClose: () => void;
}

const AVAILABLE_VARIABLES: Variable[] = [
  // User Variables
  { id: 'user.name', label: 'User Name', value: '{user.name}', category: 'user', icon: User },
  { id: 'user.email', label: 'User Email', value: '{user.email}', category: 'user', icon: User },
  { id: 'user.department', label: 'User Department', value: '{user.department}', category: 'user', icon: User },
  { id: 'user.manager', label: 'User Manager', value: '{user.manager}', category: 'user', icon: User },
  
  // Document Variables
  { id: 'document.name', label: 'Document Name', value: '{document.name}', category: 'document', icon: FileText },
  { id: 'document.id', label: 'Document ID', value: '{document.id}', category: 'document', icon: Hash },
  { id: 'document.type', label: 'Document Type', value: '{document.type}', category: 'document', icon: FileText },
  { id: 'document.size', label: 'Document Size', value: '{document.size}', category: 'document', icon: FileText },
  { id: 'document.uploadDate', label: 'Upload Date', value: '{document.uploadDate}', category: 'document', icon: Calendar },
  { id: 'document.folder', label: 'Document Folder', value: '{document.folder}', category: 'document', icon: FileText },
  
  // System Variables
  { id: 'system.currentDate', label: 'Current Date', value: '{system.currentDate}', category: 'system', icon: Calendar },
  { id: 'system.currentTime', label: 'Current Time', value: '{system.currentTime}', category: 'system', icon: Calendar },
  { id: 'system.companyName', label: 'Company Name', value: '{system.companyName}', category: 'system', icon: CheckCircle },
  
  // Workflow Variables
  { id: 'workflow.name', label: 'Workflow Name', value: '{workflow.name}', category: 'workflow', icon: CheckCircle },
  { id: 'workflow.id', label: 'Workflow ID', value: '{workflow.id}', category: 'workflow', icon: Hash },
  { id: 'workflow.status', label: 'Workflow Status', value: '{workflow.status}', category: 'workflow', icon: CheckCircle },
  { id: 'workflow.assignee', label: 'Current Assignee', value: '{workflow.assignee}', category: 'workflow', icon: User },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'user': return 'text-blue-600 bg-blue-50';
    case 'document': return 'text-green-600 bg-green-50';
    case 'system': return 'text-purple-600 bg-purple-50';
    case 'workflow': return 'text-orange-600 bg-orange-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

export const VariableInsertMenu: React.FC<VariableInsertMenuProps> = ({
  isVisible,
  position,
  searchQuery,
  onVariableSelect,
  onClose
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredVariables = AVAILABLE_VARIABLES.filter(variable =>
    variable.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    variable.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedVariables = filteredVariables.reduce((groups, variable) => {
    const category = variable.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(variable);
    return groups;
  }, {} as Record<string, Variable[]>);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      ref={menuRef}
      className="absolute z-50 w-80 bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Insert Variable</span>
        </div>
        {searchQuery && (
          <div className="mt-1 text-xs text-muted-foreground">
            Searching for: "{searchQuery}"
          </div>
        )}
      </div>

      <div className="p-2">
        {Object.entries(groupedVariables).map(([category, variables]) => (
          <div key={category} className="mb-3 last:mb-0">
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {category}
            </div>
            <div className="space-y-1">
              {variables.map((variable) => {
                const IconComponent = variable.icon;
                return (
                  <button
                    key={variable.id}
                    onClick={() => onVariableSelect(variable)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted rounded-md transition-colors"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getCategoryColor(variable.category)}`}>
                      <IconComponent className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {variable.label}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {variable.value}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {filteredVariables.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <div className="text-sm">No variables found</div>
            <div className="text-xs">Try a different search term</div>
          </div>
        )}
      </div>
    </div>
  );
};