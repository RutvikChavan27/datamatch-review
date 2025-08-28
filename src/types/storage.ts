// Storage system type definitions

export interface FolderNode {
  id: string;
  name: string;
  type: 'storage' | 'department' | 'project' | 'archived';
  docCount: number;
  size: string;
  children?: FolderNode[];
  parentId?: string;
  icon?: string;
  color?: string;
  created: Date;
  createdBy: string;
  permissions?: UserPermission[];
  retentionPolicy?: string;
  isWatchFolder?: boolean;
  isSmartFolder?: boolean;
  indexFormId?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'xls' | 'img' | 'txt';
  size: string;
  modified: Date;
  created: Date;
  createdBy: string;
  thumbnail?: string;
  dimensions?: string;
  folderId: string;
  url: string;
  tags?: string[];
  isProcessed?: boolean;
  extractedFields?: ExtractedField[];
  workflowStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  version?: number;
  originalName?: string;
}

export interface ExtractedField {
  id: string;
  label: string;
  value: string;
  confidence: number;
  isEditable: boolean;
  isRequired: boolean;
  type: 'text' | 'number' | 'date' | 'currency';
}

export interface UserPermission {
  userId: string;
  userName: string;
  role: 'view' | 'edit' | 'admin';
}

export interface IndexForm {
  id: string;
  name: string;
  fields: FormField[];
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
}

export interface FolderConfig {
  name: string;
  description: string;
  icon: string;
  color: string;
  type: 'standard' | 'watch' | 'smart' | 'archive';
  parentId: string;
  indexFormId?: string;
  permissions: UserPermission[];
  retentionPolicy?: string;
  watchSettings?: {
    processingRules: string[];
    autoRouting: string[];
    notifications: boolean;
  };
  smartSettings?: {
    filterCriteria: FilterCriteria[];
    autoUpdate: boolean;
    updateFrequency: string;
  };
}

export interface FilterCriteria {
  field: string;
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than';
  value: string;
}

export type ViewMode = 'table' | 'grid';
export type SortField = 'name' | 'type' | 'size' | 'modified' | 'created';
export type SortOrder = 'asc' | 'desc';