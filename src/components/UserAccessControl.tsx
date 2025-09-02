import React, { useState } from 'react';
import { Shield, Users, Settings, Lock, Unlock, Crown, User } from 'lucide-react';
import { RadioButton, RadioGroup } from './ui/custom-radio';
import { Checkbox } from './ui/checkbox';

interface Permission {
  id: string;
  name: string;
  description: string;
  level: 'basic' | 'advanced' | 'admin';
}

interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  color: string;
  icon: React.ComponentType<any>;
}

interface UserAccessControlProps {
  currentUserRole: string;
  workflowType: 'system' | 'user';
  onWorkflowTypeChange: (type: 'system' | 'user') => void;
  requiredPermissions: string[];
  onPermissionsChange: (permissions: string[]) => void;
}

const AVAILABLE_PERMISSIONS: Permission[] = [
  {
    id: 'create_workflow',
    name: 'Create Workflows',
    description: 'Create new workflow configurations',
    level: 'basic'
  },
  {
    id: 'edit_workflow',
    name: 'Edit Workflows',
    description: 'Modify existing workflow configurations',
    level: 'basic'
  },
  {
    id: 'delete_workflow',
    name: 'Delete Workflows',
    description: 'Remove workflow configurations',
    level: 'advanced'
  },
  {
    id: 'manage_system_workflows',
    name: 'Manage System Workflows',
    description: 'Create and manage automatic system workflows',
    level: 'admin'
  },
  {
    id: 'view_all_workflows',
    name: 'View All Workflows',
    description: 'Access to view all workflows in the system',
    level: 'advanced'
  },
  {
    id: 'assign_reviewers',
    name: 'Assign Reviewers',
    description: 'Ability to assign workflow reviewers',
    level: 'basic'
  },
  {
    id: 'configure_triggers',
    name: 'Configure Triggers',
    description: 'Set up workflow triggers and conditions',
    level: 'advanced'
  },
  {
    id: 'manage_templates',
    name: 'Manage Templates',
    description: 'Create and edit email templates',
    level: 'basic'
  }
];

const USER_ROLES: UserRole[] = [
  {
    id: 'viewer',
    name: 'Viewer',
    permissions: [],
    color: 'text-gray-600 bg-gray-100',
    icon: User
  },
  {
    id: 'contributor',
    name: 'Contributor',
    permissions: ['create_workflow', 'edit_workflow', 'assign_reviewers', 'manage_templates'],
    color: 'text-blue-600 bg-blue-100',
    icon: Users
  },
  {
    id: 'manager',
    name: 'Manager',
    permissions: ['create_workflow', 'edit_workflow', 'delete_workflow', 'view_all_workflows', 'assign_reviewers', 'configure_triggers', 'manage_templates'],
    color: 'text-green-600 bg-green-100',
    icon: Shield
  },
  {
    id: 'admin',
    name: 'Administrator',
    permissions: ['create_workflow', 'edit_workflow', 'delete_workflow', 'manage_system_workflows', 'view_all_workflows', 'assign_reviewers', 'configure_triggers', 'manage_templates'],
    color: 'text-purple-600 bg-purple-100',
    icon: Crown
  }
];

const getPermissionLevelColor = (level: string) => {
  switch (level) {
    case 'basic': return 'text-green-600 bg-green-50 border-green-200';
    case 'advanced': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'admin': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const UserAccessControl: React.FC<UserAccessControlProps> = ({
  currentUserRole,
  workflowType,
  onWorkflowTypeChange,
  requiredPermissions,
  onPermissionsChange
}) => {
  const [expandedSection, setExpandedSection] = useState<'type' | 'permissions' | null>('type');
  
  const currentRole = USER_ROLES.find(role => role.id === currentUserRole);
  const hasPermission = (permission: string) => currentRole?.permissions.includes(permission) || false;
  
  const canCreateSystemWorkflows = hasPermission('manage_system_workflows');
  const canConfigureTriggers = hasPermission('configure_triggers');

  const handlePermissionToggle = (permissionId: string) => {
    if (requiredPermissions.includes(permissionId)) {
      onPermissionsChange(requiredPermissions.filter(p => p !== permissionId));
    } else {
      onPermissionsChange([...requiredPermissions, permissionId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current User Role Display */}
      <div className="p-4 bg-muted/30 border rounded-lg">
        <div className="flex items-center gap-3">
          {currentRole && (
            <>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentRole.color}`}>
                <currentRole.icon className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium text-foreground">Current Role: {currentRole.name}</div>
                <div className="text-xs text-muted-foreground">
                  {currentRole.permissions.length} permissions granted
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Workflow Type Selection */}
      <div>
        <button
          onClick={() => setExpandedSection(expandedSection === 'type' ? null : 'type')}
          className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-foreground">Workflow Type</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground capitalize">{workflowType}</span>
            {workflowType === 'system' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </div>
        </button>

        {expandedSection === 'type' && (
          <div className="mt-3 p-4 bg-muted/20 border rounded-lg space-y-3">
            <div className="space-y-3">
              <RadioGroup 
                name="workflowType"
                value={workflowType} 
                onChange={(value) => onWorkflowTypeChange(value as 'system' | 'user')}
              >
                <RadioButton
                  name="workflowType"
                  value="user"
                  label="User-Initiated Workflow"
                  hint="Manual workflow that requires user permission to execute. Users can start this workflow when needed."
                  size="sm"
                />
                <RadioButton
                  name="workflowType"
                  value="system"
                  label="System-Level Workflow"
                  hint="Automatic workflow triggered by system events. Runs without user intervention."
                  disabled={!canCreateSystemWorkflows}
                  error={!canCreateSystemWorkflows ? "You need Administrator role to create system-level workflows" : undefined}
                  size="sm"
                />
              </RadioGroup>
            </div>
          </div>
        )}
      </div>

      {/* Required Permissions */}
      <div>
        <button
          onClick={() => setExpandedSection(expandedSection === 'permissions' ? null : 'permissions')}
          className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-foreground">Required Permissions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {requiredPermissions.length} selected
            </span>
          </div>
        </button>

        {expandedSection === 'permissions' && (
          <div className="mt-3 p-4 bg-muted/20 border rounded-lg">
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {AVAILABLE_PERMISSIONS.map((permission) => (
                <label key={permission.id} className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={requiredPermissions.includes(permission.id)}
                    onCheckedChange={() => handlePermissionToggle(permission.id)}
                    disabled={!hasPermission(permission.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${hasPermission(permission.id) ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {permission.name}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded border ${getPermissionLevelColor(permission.level)}`}>
                        {permission.level}
                      </span>
                      {!hasPermission(permission.id) && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">No Access</span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {permission.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Access Summary */}
      {(workflowType === 'system' && !canCreateSystemWorkflows) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <Lock className="w-4 h-4" />
            <span className="font-medium">Insufficient Permissions</span>
          </div>
          <div className="text-sm text-red-700 mt-1">
            You need Administrator role to create system-level workflows. Contact your system administrator.
          </div>
        </div>
      )}
    </div>
  );
};