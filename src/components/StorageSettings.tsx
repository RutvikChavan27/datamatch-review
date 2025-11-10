import React, { useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Edit2, Copy, Trash2, CheckCircle, Users, InfoIcon, GripVertical, Check, X, Tag, Type, Calendar, DollarSign, ChevronDown, ChevronUp, FileText, Hash, File, AlertTriangle, Eye, Server } from 'lucide-react';
import FolderTreePanel from './FolderTreePanel';
import DocumentListPanel from './DocumentListPanel';
import { Document, FolderNode } from '@/types/storage';
import { mockFolderStructure, getMixedContentForFolder, getBreadcrumbPath } from '@/utils/storageData';

interface IndexField {
  displayName: string;
  fieldName: string;
  type: string;
  required: string;
  status: string;
  helpText: string;
}

interface IndexForm {
  formName: string;
  description: string;
  fields: number;
  status: string;
  assignedFolders: string;
  lastModified: string;
}

const StorageSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('index-fields');
  
  // Check if we should return to a specific tab
  React.useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string[]>(['all']);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  
  // Forms specific state
  const [formSearchQuery, setFormSearchQuery] = useState('');
  const [formStatusFilter, setFormStatusFilter] = useState('all');
  
  // Create Field Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [displayName, setDisplayName] = useState('Customer Name');
  const [selectedFieldType, setSelectedFieldType] = useState('text');
  const [isRequired, setIsRequired] = useState(false);
  const [defaultValue, setDefaultValue] = useState('');
  const [helperText, setHelperText] = useState('');
  const [showFormFilter, setShowFormFilter] = useState(false);
  const [displayNameError, setDisplayNameError] = useState('');
  const [fieldTypeError, setFieldTypeError] = useState('');
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [selectedField, setSelectedField] = useState<IndexField | null>(null);
  
  // Edit Field Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingField, setEditingField] = useState<IndexField | null>(null);
  
  // Create Form Modal state
  const [showCreateFormModal, setShowCreateFormModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formNameError, setFormNameError] = useState('');

  // Folders tab state
  const [selectedFolderId, setSelectedFolderId] = useState<string>('finance');
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [folderSubTab, setFolderSubTab] = useState('overview');
  const [selectedIndexForm, setSelectedIndexForm] = useState('finance-invoice-form');

  // Retention tab state
  const [retentionLevel, setRetentionLevel] = useState('folder');
  const [retentionPeriod, setRetentionPeriod] = useState('7-years');
  const [trackingMethod, setTrackingMethod] = useState('document-date');
  const [retentionAction, setRetentionAction] = useState('move-to-records');
  const [reviewPeriod, setReviewPeriod] = useState('90');
  const [maintainAuditTrail, setMaintainAuditTrail] = useState(true);

  // Sorting state
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // View Config tab state
  const [displayFields, setDisplayFields] = useState([
    { id: 'document-name', name: 'Document Name', type: 'Text Field', shown: true },
    { id: 'invoice-number', name: 'Invoice Number', type: 'Text Field', shown: true },
    { id: 'vendor-name', name: 'Vendor Name', type: 'Text Field', shown: true },
    { id: 'invoice-date', name: 'Invoice Date', type: 'Date Field', shown: true },
    { id: 'total-amount', name: 'Total Amount', type: 'Currency Field', shown: true },
    { id: 'status', name: 'Status', type: 'Select Field', shown: false },
    { id: 'purchase-order', name: 'Purchase Order', type: 'Text Field', shown: false },
    { id: 'department', name: 'Department', type: 'Select Field', shown: false },
  ]);

  const indexFields: IndexField[] = [
    { displayName: 'Invoice Number', fieldName: 'invoice_number', type: 'Text', required: 'Yes', status: 'Active', helpText: 'Enter the invoice number as it appears on the document' },
    { displayName: 'Invoice Date', fieldName: 'invoice_date', type: 'Date', required: 'Yes', status: 'Active', helpText: 'Date when the invoice was issued' },
    { displayName: 'Vendor Name', fieldName: 'vendor_name', type: 'Text', required: 'Yes', status: 'Active', helpText: 'Full legal name of the vendor or supplier' },
    { displayName: 'Total Amount', fieldName: 'total_amount', type: 'Currency', required: 'Yes', status: 'Active', helpText: 'Total invoice amount including taxes and fees' },
    { displayName: 'Priority', fieldName: 'priority_level', type: 'Dropdown', required: 'No', status: 'Inactive', helpText: 'Set priority level for this invoice' },
    { displayName: 'Purchase Order', fieldName: 'purchase_order', type: 'Text', required: 'No', status: 'Active', helpText: 'Reference purchase order number' },
    { displayName: 'Tax Amount', fieldName: 'tax_amount', type: 'Currency', required: 'No', status: 'Active', helpText: 'Total tax amount for this invoice' },
    { displayName: 'Due Date', fieldName: 'due_date', type: 'Date', required: 'No', status: 'Active', helpText: 'Payment due date for this invoice' },
    { displayName: 'Payment Terms', fieldName: 'payment_terms', type: 'Dropdown', required: 'No', status: 'Active', helpText: 'Payment terms for this vendor' },
    { displayName: 'Billing Address', fieldName: 'billing_address', type: 'TextArea', required: 'No', status: 'Active', helpText: 'Complete billing address from invoice' },
    { displayName: 'Approval Status', fieldName: 'approval_status', type: 'Dropdown', required: 'Yes', status: 'Active', helpText: 'Current approval status of the invoice' },
    { displayName: 'Department', fieldName: 'department', type: 'Dropdown', required: 'No', status: 'Active', helpText: 'Department responsible for this invoice' },
    { displayName: 'Cost Center', fieldName: 'cost_center', type: 'Text', required: 'No', status: 'Active', helpText: 'Cost center code for accounting' },
    { displayName: 'Description', fieldName: 'description', type: 'TextArea', required: 'No', status: 'Active', helpText: 'Brief description of invoice items' },
    { displayName: 'Currency', fieldName: 'currency_code', type: 'Dropdown', required: 'No', status: 'Active', helpText: 'Currency code for invoice amounts' },
    { displayName: 'Exchange Rate', fieldName: 'exchange_rate', type: 'Number', required: 'No', status: 'Active', helpText: 'Exchange rate if different from base currency' },
    { displayName: 'Attachments', fieldName: 'attachments', type: 'File', required: 'No', status: 'Active', helpText: 'Supporting documents for this invoice' },
    { displayName: 'Notes', fieldName: 'notes', type: 'TextArea', required: 'No', status: 'Active', helpText: 'Additional notes or comments' },
    { displayName: 'Project Code', fieldName: 'project_code', type: 'Text', required: 'No', status: 'Active', helpText: 'Project code for tracking purposes' },
    { displayName: 'GL Account', fieldName: 'gl_account', type: 'Text', required: 'No', status: 'Active', helpText: 'General ledger account code' },
    { displayName: 'Submission Date', fieldName: 'submission_date', type: 'Date', required: 'No', status: 'Active', helpText: 'Date when invoice was submitted' }
  ];

  const indexForms: IndexForm[] = [
    { formName: 'Invoice Processing Form', description: 'Standard form for invoice document processing and data extraction', fields: 8, status: 'Active', assignedFolders: 'Invoices, Accounts Payable', lastModified: '2 days ago' },
    { formName: 'Contract Document Form', description: 'Legal document indexing with contract-specific fields', fields: 12, status: 'Active', assignedFolders: 'Contracts, Legal Documents', lastModified: '1 week ago' },
    { formName: 'Purchase Order Form', description: 'PO document processing with vendor and line item details', fields: 10, status: 'Active', assignedFolders: 'Purchase Orders', lastModified: '3 days ago' },
    { formName: 'HR Document Form', description: 'Employee document processing and classification', fields: 6, status: 'Inactive', assignedFolders: '–', lastModified: '2 weeks ago' },
    { formName: 'Receipt Processing Form', description: 'Form for processing receipts and expense documentation', fields: 7, status: 'Active', assignedFolders: 'Receipts, Expenses', lastModified: '5 days ago' },
    { formName: 'Tax Document Form', description: 'Tax-related document processing and categorization', fields: 15, status: 'Active', assignedFolders: 'Tax Documents', lastModified: '1 week ago' },
    { formName: 'Insurance Claims Form', description: 'Processing insurance claims and related documentation', fields: 11, status: 'Active', assignedFolders: 'Insurance', lastModified: '3 days ago' },
    { formName: 'Vendor Registration Form', description: 'New vendor onboarding and registration process', fields: 9, status: 'Active', assignedFolders: 'Vendors', lastModified: '1 day ago' },
    { formName: 'Banking Document Form', description: 'Bank statements and financial document processing', fields: 8, status: 'Active', assignedFolders: 'Banking, Financial', lastModified: '4 days ago' },
    { formName: 'Legal Agreement Form', description: 'Processing legal agreements and contracts', fields: 13, status: 'Active', assignedFolders: 'Legal Documents', lastModified: '6 days ago' },
    { formName: 'Property Document Form', description: 'Real estate and property-related documentation', fields: 10, status: 'Inactive', assignedFolders: 'Property', lastModified: '2 weeks ago' },
    { formName: 'Medical Record Form', description: 'Healthcare and medical document processing', fields: 14, status: 'Active', assignedFolders: 'Medical', lastModified: '1 week ago' },
    { formName: 'Customer Application Form', description: 'Customer onboarding and application processing', fields: 12, status: 'Active', assignedFolders: 'Customers', lastModified: '2 days ago' },
    { formName: 'Compliance Document Form', description: 'Regulatory compliance and audit documentation', fields: 16, status: 'Active', assignedFolders: 'Compliance, Audit', lastModified: '5 days ago' },
    { formName: 'Research Document Form', description: 'Research papers and academic documentation', fields: 9, status: 'Active', assignedFolders: 'Research', lastModified: '1 week ago' },
    { formName: 'Project Document Form', description: 'Project-related documentation and deliverables', fields: 11, status: 'Active', assignedFolders: 'Projects', lastModified: '3 days ago' },
    { formName: 'Training Material Form', description: 'Training documents and educational materials', fields: 9, status: 'Active', assignedFolders: 'Training', lastModified: '6 days ago' },
    { formName: 'Quality Assurance Form', description: 'QA documentation and testing reports', fields: 13, status: 'Active', assignedFolders: 'QA, Testing', lastModified: '4 days ago' },
    { formName: 'Maintenance Record Form', description: 'Equipment and facility maintenance records', fields: 10, status: 'Active', assignedFolders: 'Maintenance', lastModified: '6 days ago' }
  ];

  const getTypeIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('date')) {
      return <Calendar className="w-3 h-3" />;
    } else if (lowerType.includes('text')) {
      return <Type className="w-3 h-3" />;
    } else if (lowerType.includes('currency')) {
      return <DollarSign className="w-3 h-3" />;
    } else if (lowerType.includes('select') || lowerType.includes('dropdown')) {
      return <ChevronDown className="w-3 h-3" />;
    } else if (lowerType.includes('textarea')) {
      return <FileText className="w-3 h-3" />;
    } else if (lowerType.includes('number')) {
      return <Hash className="w-3 h-3" />;
    } else if (lowerType.includes('file')) {
      return <File className="w-3 h-3" />;
    } else {
      return <Tag className="w-3 h-3" />;
    }
  };

  // Generate field name from display name
  const generateFieldName = (displayName: string) => {
    return displayName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '');
  };

  // Field type options
  const fieldTypeOptions = [
    { id: 'text', label: 'Text Input', description: 'Single line text', icon: Type },
    { id: 'textarea', label: 'Text Area', description: 'Multi-line text', icon: FileText },
    { id: 'number', label: 'Number', description: 'Numeric values', icon: Hash },
    { id: 'currency', label: 'Currency', description: 'Monetary amounts', icon: DollarSign },
    { id: 'date', label: 'Date', description: 'Date picker', icon: Calendar },
    { id: 'dropdown', label: 'Dropdown', description: 'Single selection from list', icon: ChevronDown },
    { id: 'checkbox', label: 'Checkbox', description: 'Boolean true/false', icon: CheckCircle },
    { id: 'radio', label: 'Radio Buttons', description: 'Single choice from options', icon: Type },
    { id: 'multiselect', label: 'Multi-Select', description: 'Multiple selections', icon: ChevronDown }
  ];

  // Handle edit field
  const handleEditField = (field: IndexField) => {
    setEditingField(field);
    setDisplayName(field.displayName);
    setSelectedFieldType(field.type.toLowerCase());
    setIsRequired(field.required === 'Yes');
    setDefaultValue('');
    setHelperText(field.helpText);
    setShowEditModal(true);
  };

  // Handle delete field
  const handleDeleteField = (field: IndexField) => {
    if (field.status.toLowerCase() === 'active') {
      setSelectedField(field);
      setShowWarningModal(true);
    } else {
      // Proceed with normal delete for inactive fields
      console.log('Deleting field:', field.displayName);
    }
  };

  // Handle form save
  const handleSaveForm = () => {
    // Reset errors
    setFormNameError('');
    
    let hasErrors = false;
    
    // Validate Form Name
    if (!formName.trim()) {
      setFormNameError('Form Name is required');
      hasErrors = true;
    }
    
    // If there are errors, don't proceed
    if (hasErrors) {
      return;
    }
    
    // Navigate to form creation page with form data
    navigate('/settings/storage/form/create', {
      state: {
        formName,
        formDescription,
        returnTab: 'index-forms'
      }
    });
    
    // Clean up modal state
    setShowCreateFormModal(false);
    setFormName('');
    setFormDescription('');
  };

  // Handle modal save
  const handleSaveField = () => {
    // Reset errors
    setDisplayNameError('');
    setFieldTypeError('');
    
    let hasErrors = false;
    
    // Validate Display Name
    if (!displayName.trim()) {
      setDisplayNameError('Display Name is required');
      hasErrors = true;
    }
    
    // Validate Field Type
    if (!selectedFieldType) {
      setFieldTypeError('Field Type is required');
      hasErrors = true;
    }
    
    // If there are errors, don't proceed
    if (hasErrors) {
      return;
    }
    
    // Here you would typically save to backend
    console.log('Saving field:', {
      displayName,
      fieldName: generateFieldName(displayName),
      fieldType: selectedFieldType,
      required: isRequired,
      defaultValue,
      helperText
    });
    setShowCreateModal(false);
    // Reset form
    setDisplayName('Customer Name');
    setSelectedFieldType('text');
    setIsRequired(false);
    setDefaultValue('');
    setHelperText('');
  };

  // Handle edit modal save
  const handleSaveEditField = () => {
    // Reset errors
    setDisplayNameError('');
    setFieldTypeError('');
    
    let hasErrors = false;
    
    // Validate Display Name
    if (!displayName.trim()) {
      setDisplayNameError('Display Name is required');
      hasErrors = true;
    }
    
    // Validate Field Type
    if (!selectedFieldType) {
      setFieldTypeError('Field Type is required');
      hasErrors = true;
    }
    
    // If there are errors, don't proceed
    if (hasErrors) {
      return;
    }
    
    // Here you would typically update the backend
    console.log('Updating field:', {
      originalField: editingField,
      displayName,
      fieldName: generateFieldName(displayName),
      fieldType: selectedFieldType,
      required: isRequired,
      defaultValue,
      helperText
    });
    
    setShowEditModal(false);
    setEditingField(null);
    // Reset form
    setDisplayName('Customer Name');
    setSelectedFieldType('text');
    setIsRequired(false);
    setDefaultValue('');
    setHelperText('');
  };

  const toggleFieldVisibility = (fieldId: string) => {
    setDisplayFields(fields => 
      fields.map(field => 
        field.id === fieldId ? { ...field, shown: !field.shown } : field
      )
    );
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge 
        variant={status === 'Active' ? 'default' : 'secondary'}
        className={status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}
      >
        {status}
      </Badge>
    );
  };

  const getRequiredBadge = (required: string) => {
    return (
      <Badge 
        variant={required === 'Yes' ? 'destructive' : 'outline'}
        className={required === 'Yes' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}
      >
        {required}
      </Badge>
    );
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredFields = indexFields.filter(field => {
    const matchesSearch = field.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         field.fieldName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter.includes('all') || typeFilter.includes(field.type.toLowerCase());
    const matchesStatus = statusFilter === 'all' || field.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesType && matchesStatus;
  }).sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue = '';
    let bValue = '';
    
    switch (sortField) {
      case 'displayName':
        aValue = a.displayName.toLowerCase();
        bValue = b.displayName.toLowerCase();
        break;
      case 'fieldName':
        aValue = a.fieldName.toLowerCase();
        bValue = b.fieldName.toLowerCase();
        break;
      case 'type':
        aValue = a.type.toLowerCase();
        bValue = b.type.toLowerCase();
        break;
      case 'status':
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      default:
        return 0;
    }
    
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  const filteredForms = indexForms.filter(form => {
    const matchesSearch = form.formName.toLowerCase().includes(formSearchQuery.toLowerCase()) ||
                         form.description.toLowerCase().includes(formSearchQuery.toLowerCase());
    const matchesStatus = formStatusFilter === 'all' || form.status.toLowerCase() === formStatusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Folders tab handlers
  const mixedContent = getMixedContentForFolder(selectedFolderId);
  const breadcrumbPath = getBreadcrumbPath(selectedFolderId);

  const handleFolderSelect = useCallback((folderId: string) => {
    setSelectedFolderId(folderId);
    setSelectedDocuments(new Set());
  }, []);

  const handleDocumentSelect = useCallback((documentId: string) => {
    // Single document selection logic if needed
  }, []);

  const handleDocumentOpen = useCallback((document: Document) => {
    // Handle document opening
  }, []);

  const handleSelectionChange = useCallback((selectedIds: Set<string>) => {
    setSelectedDocuments(selectedIds);
  }, []);

  const handleBreadcrumbClick = useCallback((folderId: string) => {
    setSelectedFolderId(folderId);
    setSelectedDocuments(new Set());
  }, []);

  const handleCreateFolder = useCallback(() => {
    // Handle folder creation
  }, []);

  return (
    <TooltipProvider>
      <div className="space-y-2 px-4 pt-4 pb-2 max-w-full overflow-x-hidden">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/settings">Settings</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Storage Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground font-inter">Storage Settings</h1>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="border-b border-border flex items-center justify-between px-0 -mt-2">
          <div className="flex items-center flex-1 -mb-px pb-1">
            {[
              { key: 'index-fields', label: 'Index Fields' },
              { key: 'index-forms', label: 'Index Forms' },
              { key: 'folders', label: 'Folders' }
            ].map((tab, index) => (
              <button
                key={tab.key}
                className={`
                  px-4 py-2.5 flex items-center gap-2 justify-center transition-all duration-200 relative
                  ${index > 0 ? '-ml-px' : ''}
                  ${activeTab === tab.key
                    ? `bg-white text-gray-900 font-semibold z-10 border-b-2 border-b-[#27313e] shadow-md border-transparent rounded-t-md`
                    : "text-muted-foreground font-medium hover:bg-gray-50 hover:text-gray-700"}
                `}
                onClick={() => setActiveTab(tab.key)}
              >
                <span className="text-center text-sm leading-5 flex items-center justify-center font-semibold">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'index-fields' && (
          <div className="space-y-4">
            {/* Header with Search and Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Status Filter Tabs */}
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-full w-fit">
                  {[
                    { key: 'all', label: 'All Fields' },
                    { key: 'active', label: 'Active' },
                    { key: 'inactive', label: 'Inactive' },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      className={`
                        px-4 py-2 flex items-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 border border-b-2
                        ${statusFilter === tab.key
                          ? "text-gray-900 shadow-lg shadow-black/10 border-[#95A3C2]"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-200 border-transparent"}
                      `}
                      style={statusFilter === tab.key ? {
                        backgroundColor: '#d8f1ff',
                        borderRadius: '19.5px'
                      } : {}}
                      onClick={() => setStatusFilter(tab.key)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search fields..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 w-80"
                  />
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowTypeFilter(!showTypeFilter)}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Types Filter Dropdown */}
                  {showTypeFilter && (
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                      <div className="p-3 relative">
                        <button
                          onClick={() => setShowTypeFilter(false)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <div className="space-y-2 mb-3">
                          <p className="text-sm font-medium text-gray-700">Filters</p>
                          <div className="space-y-1">
                            {['all', 'text', 'date', 'currency', 'dropdown', 'textarea', 'number', 'file'].map((type) => (
                              <button
                                key={type}
                                className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 flex items-center gap-2 ${
                                  typeFilter.includes(type) ? 'bg-primary/10 text-primary' : 'text-gray-700'
                                }`}
                                onClick={() => {
                                  if (type === 'all') {
                                    setTypeFilter(['all']);
                                  } else {
                                    const newFilter = typeFilter.includes(type)
                                      ? typeFilter.filter(t => t !== type)
                                      : [...typeFilter.filter(t => t !== 'all'), type];
                                    setTypeFilter(newFilter.length === 0 ? ['all'] : newFilter);
                                  }
                                }}
                              >
                                <div className={`w-4 h-4 border border-gray-300 rounded ${
                                  typeFilter.includes(type) ? 'bg-primary border-primary' : ''
                                }`}>
                                  {typeFilter.includes(type) && (
                                    <svg className="w-3 h-3 text-white ml-0.5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-gray-200">
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => setShowTypeFilter(false)}
                          >
                            Apply Filter
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              setTypeFilter(['all']);
                              setStatusFilter('all');
                              setSearchQuery('');
                              setShowTypeFilter(false);
                            }}
                          >
                            Clear All
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <Button className="gap-2" onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4" />
                  Create New Field
                </Button>
              </div>
            </div>

            {/* Table */}
            <Card className="overflow-hidden shadow-lg shadow-black/5">
              <div 
                className="overflow-y-auto"
                style={{ 
                  maxHeight: `calc(100vh - 400px)`,
                  height: filteredFields.length > 15 ? `calc(100vh - 400px)` : 'auto'
                }}
              >
                <Table className="min-w-full" style={{ tableLayout: 'fixed' }}>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                      <TableHead 
                        className="font-semibold w-[200px] border-r-0 text-sm text-foreground h-12 border-b border-t cursor-pointer hover:bg-blue-50 transition-colors" 
                        style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}
                        onClick={() => handleSort('displayName')}
                      >
                        <div className="flex items-center justify-between">
                          Display Name
                          <div className="flex flex-col">
                            <ChevronUp className={`w-3 h-3 ${sortField === 'displayName' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} />
                            <ChevronDown className={`w-3 h-3 -mt-1 ${sortField === 'displayName' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} />
                          </div>
                        </div>
                      </TableHead>
                      <TableHead 
                        className="font-semibold w-[180px] border-r-0 text-sm text-foreground h-12 border-b border-t cursor-pointer hover:bg-blue-50 transition-colors" 
                        style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}
                        onClick={() => handleSort('fieldName')}
                      >
                        <div className="flex items-center justify-between">
                          Field Name
                          <div className="flex flex-col">
                            <ChevronUp className={`w-3 h-3 ${sortField === 'fieldName' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} />
                            <ChevronDown className={`w-3 h-3 -mt-1 ${sortField === 'fieldName' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} />
                          </div>
                        </div>
                      </TableHead>
                      <TableHead 
                        className="font-semibold w-[120px] border-r-0 text-sm text-foreground h-12 border-b border-t cursor-pointer hover:bg-blue-50 transition-colors" 
                        style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}
                        onClick={() => handleSort('type')}
                      >
                        <div className="flex items-center justify-between">
                          Type
                          <div className="flex flex-col">
                            <ChevronUp className={`w-3 h-3 ${sortField === 'type' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} />
                            <ChevronDown className={`w-3 h-3 -mt-1 ${sortField === 'type' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} />
                          </div>
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold w-[100px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Required</TableHead>
                      <TableHead 
                        className="font-semibold w-[100px] border-r-0 text-sm text-foreground h-12 border-b border-t cursor-pointer hover:bg-blue-50 transition-colors" 
                        style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center justify-between">
                          Status
                          <div className="flex flex-col">
                            <ChevronUp className={`w-3 h-3 ${sortField === 'status' && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} />
                            <ChevronDown className={`w-3 h-3 -mt-1 ${sortField === 'status' && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} />
                          </div>
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold w-[300px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Help Text</TableHead>
                      <TableHead className="font-semibold w-[140px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFields.map((field, index) => (
                      <TableRow key={index} className="h-10 hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium py-2 border-r-0 text-sm text-foreground truncate w-[200px]">{field.displayName}</TableCell>
                        <TableCell className="py-2 border-r-0 text-gray-600 font-mono text-sm w-[180px]">{field.fieldName}</TableCell>
                        <TableCell className="py-2 border-r-0">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1.5">
                            {getTypeIcon(field.type)}
                            {field.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 border-r-0 w-[100px]">{getRequiredBadge(field.required)}</TableCell>
                        <TableCell className="py-2 border-r-0 w-[100px]">{getStatusBadge(field.status)}</TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-gray-600 w-[300px] truncate">{field.helpText}</TableCell>
                        <TableCell className="py-2 border-r-0 w-[140px]">
                          <div className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleEditField(field)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                                  onClick={() => handleDeleteField(field)}
                                  disabled={field.status.toLowerCase() === 'active'}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'index-forms' && (
          <div className="space-y-4">
            {/* Header with Search and Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Status Filter Tabs */}
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-full w-fit">
                  {[
                    { key: 'all', label: 'All Index Forms' },
                    { key: 'active', label: 'Active' },
                    { key: 'inactive', label: 'Inactive' },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      className={`
                        px-4 py-2 flex items-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 border border-b-2
                        ${formStatusFilter === tab.key
                          ? "text-gray-900 shadow-lg shadow-black/10 border-[#95A3C2]"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-200 border-transparent"}
                      `}
                      style={formStatusFilter === tab.key ? {
                        backgroundColor: '#d8f1ff',
                        borderRadius: '19.5px'
                      } : {}}
                      onClick={() => setFormStatusFilter(tab.key)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search forms..."
                    value={formSearchQuery}
                    onChange={(e) => setFormSearchQuery(e.target.value)}
                    className="pl-10 pr-10 w-80"
                  />
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowFormFilter(!showFormFilter)}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Forms Filter Dropdown */}
                  {showFormFilter && (
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                      <div className="p-3 relative">
                        <button
                          onClick={() => setShowFormFilter(false)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <div className="space-y-2 mb-3">
                          <p className="text-sm font-medium text-gray-700">Filters</p>
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-gray-200">
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => setShowFormFilter(false)}
                          >
                            Apply Filter
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              setFormStatusFilter('all');
                              setFormSearchQuery('');
                              setShowFormFilter(false);
                            }}
                          >
                            Clear All
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <Button 
                  className="gap-2"
                  onClick={() => setShowCreateFormModal(true)}
                >
                  <Plus className="h-4 w-4" />
                  Create New Form
                </Button>
              </div>
            </div>

            {/* Table */}
            <Card className="overflow-hidden shadow-lg shadow-black/5">
              <div 
                className="overflow-y-auto"
                style={{ 
                  maxHeight: `calc(100vh - 400px)`,
                  height: filteredForms.length > 15 ? `calc(100vh - 400px)` : 'auto'
                }}
              >
                <Table className="min-w-full" style={{ tableLayout: 'fixed' }}>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                      <TableHead className="font-semibold w-[250px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Form Name</TableHead>
                      <TableHead className="font-semibold w-[300px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Description</TableHead>
                      <TableHead className="font-semibold w-[80px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Fields</TableHead>
                      <TableHead className="font-semibold w-[100px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Status</TableHead>
                      <TableHead className="font-semibold w-[200px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Assigned Folders</TableHead>
                      <TableHead className="font-semibold w-[120px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Last Modified</TableHead>
                      <TableHead className="font-semibold w-[160px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredForms.map((form, index) => (
                      <TableRow key={index} className="h-10 hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium py-2 border-r-0 text-sm text-foreground truncate w-[250px]">{form.formName}</TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-gray-600 w-[300px] truncate">{form.description}</TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-foreground w-[80px] text-center">{form.fields}</TableCell>
                        <TableCell className="py-2 border-r-0 w-[100px]">{getStatusBadge(form.status)}</TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-gray-600 w-[200px] truncate">{form.assignedFolders}</TableCell>
                        <TableCell className="py-2 border-r-0 text-sm text-gray-600 w-[120px]">{form.lastModified}</TableCell>
                        <TableCell className="py-2 border-r-0 w-[160px]">
                          <div className="flex items-center gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => navigate('/settings/storage/form/edit', { 
                                    state: { 
                                      formName: form.formName, 
                                      formDescription: form.description,
                                      isEditMode: true,
                                      returnTab: 'index-forms'
                                    } 
                                  })}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'folders' && (
          <div className="h-[calc(100vh-200px)] overflow-hidden">
            <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg">
              {/* Left Panel - Folder Tree */}
              <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                <FolderTreePanel
                  rootFolder={mockFolderStructure}
                  selectedFolderId={selectedFolderId}
                  onFolderSelect={handleFolderSelect}
                  onCreateFolder={handleCreateFolder}
                />
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Right Panel - Document List with Tabs */}
              <ResizablePanel defaultSize={75}>
                <div className="h-full flex flex-col">
                  {/* Folder Title */}
                  <div className="px-4 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {breadcrumbPath[breadcrumbPath.length - 1]?.name || 'Documents'}
                        </h2>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tabs for Storage Settings only - Hide when All Documents is selected */}
                  {selectedFolderId !== 'root' && (
                    <div className="px-4 border-b border-gray-100">
                      <nav className="-mb-px flex space-x-8 border-b border-gray-200">
                        {[
                          { key: 'overview', label: 'Overview' },
                          { key: 'access', label: 'Access' },
                          { key: 'view-config', label: 'View Config' },
                          { key: 'retention', label: 'Retention' }
                        ].map(tab => (
                          <button
                            key={tab.key}
                            className={`border-b-2 py-2 px-1 text-sm font-medium transition-colors ${
                              folderSubTab === tab.key
                                ? 'border-[#27313e] text-gray-900 font-semibold'
                                : 'border-transparent text-muted-foreground hover:text-gray-700 hover:border-gray-300'
                            }`}
                            onClick={() => setFolderSubTab(tab.key)}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </nav>
                    </div>
                  )}

                  {/* All Documents Content - Show when root is selected */}
                  {selectedFolderId === 'root' && (
                    <div>
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                            <Server className="w-8 h-8 text-blue-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Productivity Engine Storage</h3>
                          <p className="text-gray-600 max-w-md leading-relaxed">
                            This is your main storage location (S3 bucket). Configuration settings are managed at the folder level. 
                            Select a department folder to configure settings and permissions.
                          </p>
                        </div>
                      </div>
                      
                      {/* Document List Panel for All Documents */}
                      <div className="flex-1">
                        <DocumentListPanel
                          folders={mixedContent.folders}
                          documents={mixedContent.documents}
                          breadcrumbPath={breadcrumbPath}
                          selectedDocuments={selectedDocuments}
                          onDocumentSelect={handleDocumentSelect}
                          onDocumentOpen={handleDocumentOpen}
                          onFolderSelect={handleFolderSelect}
                          onSelectionChange={handleSelectionChange}
                          onBreadcrumbClick={handleBreadcrumbClick}
                        />
                      </div>
                    </div>
                  )}

                  {/* Overview Tab Content - Only show for non-root folders */}
                  {folderSubTab === 'overview' && selectedFolderId !== 'root' && (
                    <div className="p-4 border-b border-gray-200">
                      <Card className="shadow-sm">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">Default Index Form Assignment</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                Determines which fields show in folder view. Users can change index form per document.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-6 items-start">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assigned Index Form
                              </label>
                              <Select value={selectedIndexForm} onValueChange={setSelectedIndexForm}>
                                <SelectTrigger className="w-full max-w-md">
                                  <SelectValue placeholder="Select an index form" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                  <SelectItem value="finance-invoice-form" className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 w-full">
                                      <span>Finance Invoice Form</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="purchase-order-form">
                                    Purchase Order Form
                                  </SelectItem>
                                  <SelectItem value="contract-form">
                                    Contract Form
                                  </SelectItem>
                                  <SelectItem value="employee-record-form">
                                    Employee Record Form
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg min-w-48">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Form Details</h4>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <p>12 fields configured</p>
                                <p>Last updated: 2 days ago</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}

                  {/* Access Tab Content - Only show for non-root folders */}
                  {folderSubTab === 'access' && selectedFolderId !== 'root' && (
                    <div className="p-4 border-b border-gray-200 space-y-6">
                      {/* Users with Access Section */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Users with Access</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Individual users who have access to this folder
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add User
                        </Button>
                      </div>

                      <div className="shadow-lg shadow-black/5">
                        <div className="border border-border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader className="sticky top-0 z-10">
                              <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                                <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>User</TableHead>
                                <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Role</TableHead>
                                <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Email</TableHead>
                                <TableHead className="w-20 font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow className="h-10 hover:bg-muted/50 transition-colors cursor-pointer bg-white">
                                <TableCell className="py-2 border-r-0 text-sm text-foreground">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                      <div className="flex items-center justify-center w-full h-full bg-primary text-primary-foreground text-sm font-medium">
                                        SJ
                                      </div>
                                    </Avatar>
                                    <span className="font-medium">Sarah Johnson</span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-2 border-r-0 text-sm text-foreground">Finance Admin</TableCell>
                                <TableCell className="py-2 border-r-0 text-sm text-foreground">sarah.johnson@company.com</TableCell>
                                <TableCell className="py-2 border-r-0 text-sm">
                                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-destructive hover:text-destructive/80">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                              <TableRow className="h-10 hover:bg-muted/50 transition-colors cursor-pointer bg-white">
                                <TableCell className="py-2 border-r-0 text-sm text-foreground">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                      <div className="flex items-center justify-center w-full h-full bg-primary text-primary-foreground text-sm font-medium">
                                        MC
                                      </div>
                                    </Avatar>
                                    <span className="font-medium">Mike Chen</span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-2 border-r-0 text-sm text-foreground">Accountant</TableCell>
                                <TableCell className="py-2 border-r-0 text-sm text-foreground">mike.chen@company.com</TableCell>
                                <TableCell className="py-2 border-r-0 text-sm">
                                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-destructive hover:text-destructive/80">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                              <TableRow className="h-10 hover:bg-muted/50 transition-colors cursor-pointer bg-white">
                                <TableCell className="py-2 border-r-0 text-sm text-foreground">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                      <div className="flex items-center justify-center w-full h-full bg-primary text-primary-foreground text-sm font-medium">
                                        ED
                                      </div>
                                    </Avatar>
                                    <span className="font-medium">Emily Davis</span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-2 border-r-0 text-sm text-foreground">Finance Analyst</TableCell>
                                <TableCell className="py-2 border-r-0 text-sm text-foreground">emily.davis@company.com</TableCell>
                                <TableCell className="py-2 border-r-0 text-sm">
                                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-destructive hover:text-destructive/80">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      {/* User Groups with Access Section */}
                      <div className="flex items-center justify-between mb-4 mt-8">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">User Groups with Access</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Groups that have access to this folder
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Group
                        </Button>
                      </div>

                      <div className="shadow-lg shadow-black/5">
                        <div className="border border-border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader className="sticky top-0 z-10">
                              <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                                <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Group Name</TableHead>
                                <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Members</TableHead>
                                <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Description</TableHead>
                                <TableHead className="w-20 font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow className="h-10 hover:bg-muted/50 transition-colors cursor-pointer bg-white">
                                <TableCell className="py-2 border-r-0 text-sm text-foreground">
                                  <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-medium">Finance Team</span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-2 border-r-0 text-sm text-foreground">
                                  <Badge variant="secondary">12 users</Badge>
                                </TableCell>
                                <TableCell className="py-2 border-r-0 text-sm text-foreground">Full access to finance documents</TableCell>
                                <TableCell className="py-2 border-r-0 text-sm">
                                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-destructive hover:text-destructive/80">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                              <TableRow className="h-10 hover:bg-muted/50 transition-colors cursor-pointer bg-white">
                                <TableCell className="py-2 border-r-0 text-sm text-foreground">
                                  <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-medium">Audit Team</span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-2 border-r-0 text-sm text-foreground">
                                  <Badge variant="secondary">3 users</Badge>
                                </TableCell>
                                <TableCell className="py-2 border-r-0 text-sm text-foreground">Read-only access for audit purposes</TableCell>
                                <TableCell className="py-2 border-r-0 text-sm">
                                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-destructive hover:text-destructive/80">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                              <TableRow className="h-10 hover:bg-muted/50 transition-colors cursor-pointer bg-white">
                                <TableCell className="py-2 border-r-0 text-sm text-foreground">
                                  <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-medium">Management</span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-2 border-r-0 text-sm text-foreground">
                                  <Badge variant="secondary">5 users</Badge>
                                </TableCell>
                                <TableCell className="py-2 border-r-0 text-sm text-foreground">Executive access to reports</TableCell>
                                <TableCell className="py-2 border-r-0 text-sm">
                                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-destructive hover:text-destructive/80">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Retention Tab Content - Only show for non-root folders */}
                  {folderSubTab === 'retention' && selectedFolderId !== 'root' && (
                    <div className="p-4 border-b border-gray-200 space-y-6">
                      {/* Section 1: Retention Configuration */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Retention Configuration</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Configure document retention policies for this folder
                          </p>
                        </div>

                        <Card className="p-6">
                          {/* Retention Level */}
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-base font-medium text-gray-900 mb-3">Retention Level</h4>
                              <RadioGroup value={retentionLevel} onValueChange={setRetentionLevel} className="space-y-4">
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="folder" id="folder-level" />
                                    <Label htmlFor="folder-level" className="font-medium">Folder Level</Label>
                                  </div>
                                  <p className="text-sm text-gray-600 ml-6">Apply the same retention period to all documents in this folder</p>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="index-form" id="index-form-level" />
                                    <Label htmlFor="index-form-level" className="font-medium">Index Form Level</Label>
                                  </div>
                                  <p className="text-sm text-gray-600 ml-6">Use retention settings defined in the assigned index form</p>
                                </div>
                              </RadioGroup>
                            </div>

                            {/* Retention Settings */}
                            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Retention Period</Label>
                                <Select value={retentionPeriod} onValueChange={setRetentionPeriod}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                    <SelectItem value="1-year">1 Year</SelectItem>
                                    <SelectItem value="3-years">3 Years</SelectItem>
                                    <SelectItem value="5-years">5 Years</SelectItem>
                                    <SelectItem value="7-years">7 Years</SelectItem>
                                    <SelectItem value="10-years">10 Years</SelectItem>
                                    <SelectItem value="permanent">Permanent</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Tracking Method</Label>
                                <Select value={trackingMethod} onValueChange={setTrackingMethod}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                    <SelectItem value="document-date">Document Date</SelectItem>
                                    <SelectItem value="upload-date">Upload Date</SelectItem>
                                    <SelectItem value="last-accessed">Last Accessed Date</SelectItem>
                                    <SelectItem value="last-modified">Last Modified Date</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Section 2: Retention Actions */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Retention Actions</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Define what happens when documents reach their retention period
                          </p>
                        </div>

                        <Card className="p-6">
                          {/* Action After Retention */}
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-base font-medium text-gray-900 mb-3">Action After Retention</h4>
                              <RadioGroup value={retentionAction} onValueChange={setRetentionAction} className="space-y-4">
                                <div className="space-y-3">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="move-to-records" id="move-to-records" />
                                    <Label htmlFor="move-to-records" className="font-medium">Move to Records Management</Label>
                                  </div>
                                  {retentionAction === 'move-to-records' && (
                                    <div className="ml-6 flex items-center gap-3">
                                      <Label className="text-sm font-medium text-gray-700">Review Period:</Label>
                                      <div className="flex items-center gap-2">
                                        <Input
                                          value={reviewPeriod}
                                          onChange={(e) => setReviewPeriod(e.target.value)}
                                          className="w-20"
                                        />
                                        <span className="text-sm text-gray-600">days before action</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="space-y-3">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="automated-deletion" id="automated-deletion" />
                                    <Label htmlFor="automated-deletion" className="font-medium">Automated Deletion</Label>
                                  </div>
                                  {retentionAction === 'automated-deletion' && (
                                    <div className="ml-6">
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          id="maintain-audit-trail"
                                          checked={maintainAuditTrail}
                                          onCheckedChange={(checked) => setMaintainAuditTrail(checked === true)}
                                        />
                                        <Label htmlFor="maintain-audit-trail" className="text-sm font-medium">
                                          Maintain audit trail
                                        </Label>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </RadioGroup>
                            </div>
                          </div>
                        </Card>

                        {/* Info Note */}
                        <Alert className="border-blue-200 bg-blue-50">
                          <InfoIcon className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-blue-800">
                            <strong>Info Note:</strong> Deleted documents show "Document deleted on [date]" in audit trails. 
                            Primarily used by government and financial organizations for compliance.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>
                  )}

                  {/* View Config Tab Content - Only show for non-root folders */}
                  {folderSubTab === 'view-config' && selectedFolderId !== 'root' && (
                    <div className="p-4 border-b border-gray-200 space-y-6">
                      {/* Folder View Configuration */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Folder View Configuration</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Configure which fields from the assigned index form display in the folder view. Field order can be customized.
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-gray-700">Based on Index Form:</span>
                          <span className="text-sm font-semibold text-gray-900">Finance Invoice Form</span>
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                            12 fields available
                          </Badge>
                        </div>

                        <Card className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-base font-medium text-gray-900">Display Fields (Drag to reorder)</h4>
                              <span className="text-sm font-medium text-gray-700">
                                Fields currently displayed in folder view: 5 of 8 fields
                              </span>
                            </div>
                            
                            <div className="space-y-3">
                              {displayFields.map((field) => (
                                <div
                                  key={field.id}
                                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-move"
                                >
                                  <div className="flex items-center gap-3">
                                    <GripVertical className="w-4 h-4 text-gray-400" />
                                     <div className="flex items-center justify-between w-full">
                                       <div className="font-medium text-gray-900 flex-1 min-w-0 pr-4">{field.name}</div>
                                       <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 flex items-center gap-1">
                                         {getTypeIcon(field.type)}
                                         {field.type}
                                       </Badge>
                                     </div>
                                  </div>
                                  
                                   <div className="flex items-center gap-3">
                                     {field.shown && (
                                       <Check className="w-4 h-4 text-green-600" />
                                     )}
                                     <Button
                                       variant="outline"
                                       size="sm"
                                       onClick={() => toggleFieldVisibility(field.id)}
                                       className={field.shown ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                                     >
                                       {field.shown ? 'Hide' : 'Show'}
                                     </Button>
                                   </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Card>

                        {/* Footer */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">
                            Fields currently displayed in folder view:
                          </span>
                          <Badge variant="outline" className="bg-white">
                            {displayFields.filter(field => field.shown).length} of {displayFields.length} fields
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Document List Panel - Only show for Overview tab and non-root folders */}
                  {folderSubTab === 'overview' && selectedFolderId !== 'root' && (
                    <div className="flex-1">
                      <DocumentListPanel
                        folders={mixedContent.folders}
                        documents={mixedContent.documents}
                        breadcrumbPath={breadcrumbPath}
                        selectedDocuments={selectedDocuments}
                        onDocumentSelect={handleDocumentSelect}
                        onDocumentOpen={handleDocumentOpen}
                        onFolderSelect={handleFolderSelect}
                        onSelectionChange={handleSelectionChange}
                        onBreadcrumbClick={handleBreadcrumbClick}
                      />
                    </div>
                  )}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        )}
      </div>
      
      {/* Create New Index Field Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Create New Index Field</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Input Fields */}
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="display-name" className="text-sm font-medium">
                  Display Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter display name"
                  className={`w-full ${displayNameError ? 'border-red-500' : ''}`}
                />
                {displayNameError && (
                  <p className="text-xs text-red-500">{displayNameError}</p>
                )}
              </div>
              
              <div className="flex-1 space-y-2">
                <Label htmlFor="field-name" className="text-sm font-medium">
                  Field Name
                </Label>
                <Input
                  id="field-name"
                  value={generateFieldName(displayName)}
                  disabled
                  className="w-full bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Note: It is derived automatically from the Display Name.
                </p>
              </div>
            </div>
            
            {/* Field Type Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Field Type <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {fieldTypeOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <div
                      key={option.id}
                      className={`
                        relative p-3 rounded-lg border cursor-pointer transition-all
                        ${selectedFieldType === option.id 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }
                      `}
                      onClick={() => setSelectedFieldType(option.id)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm font-medium">{option.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                      {selectedFieldType === option.id && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {fieldTypeError && (
                <p className="text-xs text-red-500">{fieldTypeError}</p>
              )}
            </div>
            
            {/* Additional Configurations */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="required"
                  checked={isRequired}
                  onCheckedChange={(checked) => setIsRequired(checked === true)}
                />
                <Label htmlFor="required" className="text-sm font-medium">
                  Required Field
                </Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default-value" className="text-sm font-medium">
                  Default Value
                </Label>
                <Input
                  id="default-value"
                  value={defaultValue}
                  onChange={(e) => setDefaultValue(e.target.value)}
                  placeholder="Enter default value (optional)"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="helper-text" className="text-sm font-medium">
                  Helper Text
                </Label>
                <Textarea
                  id="helper-text"
                  value={helperText}
                  onChange={(e) => setHelperText(e.target.value)}
                  placeholder="Non-mandatory subtext for guidance"
                  className="w-full min-h-[80px]"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveField}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create New Index Form Modal */}
      <Dialog open={showCreateFormModal} onOpenChange={setShowCreateFormModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Create New Index Form</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Form Name */}
            <div className="space-y-2">
              <Label htmlFor="form-name" className="text-sm font-medium">
                Form Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="form-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter form name..."
                className={`w-full ${formNameError ? 'border-red-500' : ''}`}
              />
              {formNameError && (
                <p className="text-xs text-red-500">{formNameError}</p>
              )}
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="form-description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="form-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Describe the purpose of this form..."
                className="w-full min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateFormModal(false);
                setFormName('');
                setFormDescription('');
                setFormNameError('');
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveForm}
              disabled={!formName.trim()}
            >
              Create Form
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Index Field Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Index Field</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Input Fields */}
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="edit-display-name" className="text-sm font-medium">
                  Display Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter display name"
                  className={`w-full ${displayNameError ? 'border-red-500' : ''}`}
                />
                {displayNameError && (
                  <p className="text-xs text-red-500">{displayNameError}</p>
                )}
              </div>
              
              <div className="flex-1 space-y-2">
                <Label htmlFor="edit-field-name" className="text-sm font-medium">
                  Field Name
                </Label>
                <Input
                  id="edit-field-name"
                  value={generateFieldName(displayName)}
                  disabled
                  className="w-full bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Note: It is derived automatically from the Display Name.
                </p>
              </div>
            </div>
            
            {/* Field Type Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Field Type <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {fieldTypeOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <div
                      key={option.id}
                      className={`
                        relative p-3 rounded-lg border cursor-pointer transition-all
                        ${selectedFieldType === option.id 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }
                      `}
                      onClick={() => setSelectedFieldType(option.id)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm font-medium">{option.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                      {selectedFieldType === option.id && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {fieldTypeError && (
                <p className="text-xs text-red-500">{fieldTypeError}</p>
              )}
            </div>
            
            {/* Additional Configurations */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-required"
                  checked={isRequired}
                  onCheckedChange={(checked) => setIsRequired(checked === true)}
                />
                <Label htmlFor="edit-required" className="text-sm font-medium">
                  Required Field
                </Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-default-value" className="text-sm font-medium">
                  Default Value
                </Label>
                <Input
                  id="edit-default-value"
                  value={defaultValue}
                  onChange={(e) => setDefaultValue(e.target.value)}
                  placeholder="Enter default value (optional)"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-helper-text" className="text-sm font-medium">
                  Helper Text
                </Label>
                <Textarea
                  id="edit-helper-text"
                  value={helperText}
                  onChange={(e) => setHelperText(e.target.value)}
                  placeholder="Non-mandatory subtext for guidance"
                  className="w-full min-h-[80px]"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false);
                setEditingField(null);
                setDisplayName('Customer Name');
                setSelectedFieldType('text');
                setIsRequired(false);
                setDefaultValue('');
                setHelperText('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEditField}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Warning Modal for Inactive Field Deletion */}
      <Dialog open={showWarningModal} onOpenChange={setShowWarningModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              <DialogTitle className="text-lg font-semibold">Cannot Delete Field</DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              This field cannot be deleted because it is currently in use by documents or forms. 
              To delete this field, first remove it from all associated documents and forms.
            </p>
          </div>
          
          <DialogFooter className="flex justify-end">
            <Button onClick={() => setShowWarningModal(false)}>
              Understood
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default StorageSettings;