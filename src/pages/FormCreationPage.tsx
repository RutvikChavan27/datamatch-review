import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Search, Plus, GripVertical, Settings, Trash2, FileText, Calendar, DollarSign, ChevronDown, Hash, Save, Type, CheckCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface FieldDefinition {
  id: string;
  name: string;
  type: string;
  icon: React.ElementType;
  subLabel: string;
}

interface FormField {
  id: string;
  fieldName: string;
  displayName: string;
  type: string;
  required: boolean;
  placeholder?: string;
  defaultValue?: string;
  helperText?: string;
  options?: string[];
}

const availableFields: FieldDefinition[] = [
  { id: 'invoice-number', name: 'Invoice Number', type: 'text', icon: Hash, subLabel: 'text' },
  { id: 'invoice-date', name: 'Invoice Date', type: 'date', icon: Calendar, subLabel: 'date' },
  { id: 'vendor-name', name: 'Vendor Name', type: 'text', icon: FileText, subLabel: 'text' },
  { id: 'total-amount', name: 'Total Amount', type: 'currency', icon: DollarSign, subLabel: 'currency' },
  { id: 'department', name: 'Department', type: 'dropdown', icon: ChevronDown, subLabel: 'dropdown' },
  { id: 'priority-level', name: 'Priority Level', type: 'dropdown', icon: ChevronDown, subLabel: 'dropdown' },
];

const FormCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formName, formDescription, isEditMode, returnTab } = location.state || { 
    formName: 'Untitled Index Form', 
    formDescription: '',
    isEditMode: false,
    returnTab: 'index-forms'
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [draggedFieldId, setDraggedFieldId] = useState<string | null>(null);
  const [draggedFormFieldId, setDraggedFormFieldId] = useState<string | null>(null);
  const [dragOverFieldId, setDragOverFieldId] = useState<string | null>(null);
  const [showCreateFieldDialog, setShowCreateFieldDialog] = useState(false);
  const [currencyFormat, setCurrencyFormat] = useState<string>('USD ($)');
  const [dateFormat, setDateFormat] = useState<string>('MM/DD/YYYY');

  // Pre-populate fields if in edit mode
  React.useEffect(() => {
    if (isEditMode) {
      // Sample pre-populated fields for edit mode
      const sampleFields: FormField[] = [
        {
          id: 'field-1',
          fieldName: 'vendor_name',
          displayName: 'Vendor Name',
          type: 'text',
          required: true,
          placeholder: 'Enter vendor name…',
          defaultValue: '',
          helperText: ''
        },
        {
          id: 'field-2',
          fieldName: 'total_amount',
          displayName: 'Total Amount',
          type: 'currency',
          required: true,
          placeholder: '$0.00',
          defaultValue: '',
          helperText: ''
        },
        {
          id: 'field-3',
          fieldName: 'department',
          displayName: 'Department',
          type: 'dropdown',
          required: false,
          placeholder: '',
          defaultValue: '',
          helperText: '',
          options: ['Finance', 'Operations', 'HR', 'Procurement']
        },
        {
          id: 'field-4',
          fieldName: 'priority_level',
          displayName: 'Priority Level',
          type: 'dropdown',
          required: false,
          placeholder: '',
          defaultValue: '',
          helperText: '',
          options: ['High', 'Medium', 'Low']
        }
      ];
      setFormFields(sampleFields);
      if (sampleFields.length > 0) {
        setSelectedFieldId(sampleFields[0].id);
      }
    }
  }, [isEditMode]);
  
  // Create field dialog state
  const [newFieldDisplayName, setNewFieldDisplayName] = useState('');
  const [newFieldFieldName, setNewFieldFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldDefaultValue, setNewFieldDefaultValue] = useState('');
  const [newFieldHelperText, setNewFieldHelperText] = useState('');
  const [displayNameError, setDisplayNameError] = useState('');
  const [fieldTypeError, setFieldTypeError] = useState('');

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

  const generateFieldName = (displayName: string) => {
    return displayName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '');
  };

  const selectedField = formFields.find(f => f.id === selectedFieldId);

  const handleFieldUpdate = (fieldId: string, updates: Partial<FormField>) => {
    setFormFields(fields => 
      fields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
    );
  };

  const handleDeleteField = (fieldId: string) => {
    setFormFields(fields => fields.filter(f => f.id !== fieldId));
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(formFields[0]?.id || null);
    }
  };

  const filteredFields = availableFields.filter(field =>
    field.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addFieldToCanvas = (fieldDef: FieldDefinition) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      fieldName: fieldDef.id.replace(/-/g, '_'),
      displayName: fieldDef.name,
      type: fieldDef.type,
      required: false,
      placeholder: fieldDef.type === 'currency' ? '$0.00' : fieldDef.type === 'date' ? 'Select date...' : `Enter ${fieldDef.name.toLowerCase()}...`,
      defaultValue: '',
      helperText: '',
      ...(fieldDef.type === 'dropdown' && { options: ['Option 1', 'Option 2', 'Option 3'] })
    };

    setFormFields(fields => [...fields, newField]);
    setSelectedFieldId(newField.id);
  };

  const handleDragStart = (fieldDef: FieldDefinition) => {
    setDraggedFieldId(fieldDef.id);
  };

  const handleFormFieldDragStart = (fieldId: string) => {
    setDraggedFormFieldId(fieldId);
  };

  const handleFormFieldDragOver = (e: React.DragEvent, fieldId: string) => {
    e.preventDefault();
    setDragOverFieldId(fieldId);
  };

  const handleFormFieldDrop = (e: React.DragEvent, targetFieldId: string) => {
    e.preventDefault();
    if (!draggedFormFieldId) return;

    const draggedIndex = formFields.findIndex(f => f.id === draggedFormFieldId);
    const targetIndex = formFields.findIndex(f => f.id === targetFieldId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newFields = [...formFields];
    const [draggedField] = newFields.splice(draggedIndex, 1);
    newFields.splice(targetIndex, 0, draggedField);

    setFormFields(newFields);
    setDraggedFormFieldId(null);
    setDragOverFieldId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedFieldId) return;

    const fieldDef = availableFields.find(f => f.id === draggedFieldId);
    if (!fieldDef) return;

    addFieldToCanvas(fieldDef);
    setDraggedFieldId(null);
  };

  const handleCreateCustomField = () => {
    // Validation
    let hasError = false;
    
    if (!newFieldDisplayName.trim()) {
      setDisplayNameError('Display name is required');
      hasError = true;
    } else {
      setDisplayNameError('');
    }

    if (!newFieldType) {
      setFieldTypeError('Please select a field type');
      hasError = true;
    } else {
      setFieldTypeError('');
    }

    if (hasError) return;

    const newField: FormField = {
      id: `field-${Date.now()}`,
      fieldName: generateFieldName(newFieldDisplayName),
      displayName: newFieldDisplayName,
      type: newFieldType,
      required: newFieldRequired,
      placeholder: '',
      defaultValue: newFieldDefaultValue,
      helperText: newFieldHelperText,
      ...(newFieldType === 'dropdown' && { options: ['Option 1', 'Option 2', 'Option 3'] })
    };

    setFormFields(fields => [...fields, newField]);
    setShowCreateFieldDialog(false);
    
    // Reset form
    setNewFieldDisplayName('');
    setNewFieldFieldName('');
    setNewFieldType('');
    setNewFieldRequired(false);
    setNewFieldDefaultValue('');
    setNewFieldHelperText('');
    setDisplayNameError('');
    setFieldTypeError('');
    
    toast.success('Custom field created');
  };

  const handleSaveForm = () => {
    toast.success(isEditMode ? 'Form updated successfully' : 'Form saved successfully');
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 96px)' }}>
      {/* Header with Breadcrumb and Save Button */}
      <div className="mb-3 pt-3 px-4 flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/settings">Settings</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/settings/storage" state={{ activeTab: returnTab }}>Storage Settings</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{isEditMode ? 'Edit Form' : 'Create Form'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/settings/storage', { state: { activeTab: returnTab } })}>
            Cancel
          </Button>
          <Button onClick={handleSaveForm} className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="flex-1 overflow-hidden px-4 pb-4 flex gap-4">
        {/* Left Panel - Available Fields Library */}
        <Card className="w-80 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">Available Fields</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setShowCreateFieldDialog(true)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create New Index Field</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search fields…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </CardHeader>
          <Separator />
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-1">
              {filteredFields.map((field) => {
                const Icon = field.icon;
                return (
                  <div
                    key={field.id}
                    draggable
                    onDragStart={() => handleDragStart(field)}
                    onClick={() => addFieldToCanvas(field)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 cursor-pointer transition-all shadow-sm"
                  >
                    <div className="flex items-center justify-center h-9 w-9 rounded-md bg-primary/10 flex-shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{field.name}</div>
                      <div className="text-xs text-muted-foreground">{field.subLabel}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </Card>

        {/* Center Panel - Form Canvas */}
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <Input
              value={formName}
              className="text-xl font-semibold border-none px-0 focus-visible:ring-0"
              placeholder="Untitled Index Form"
              readOnly
            />
            <Textarea
              placeholder="Add form description…"
              className="resize-none border-none p-0 focus-visible:ring-0 text-sm text-muted-foreground"
              rows={2}
              readOnly
            />
          </CardHeader>
          <Separator />
          <ScrollArea className="flex-1">
            <div 
              className="p-4 space-y-3 min-h-[400px]"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {formFields.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[400px]">
                  <div className="text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Add fields from the left panel to build your index form</p>
                  </div>
                </div>
              ) : (
                formFields.map((field) => (
                  <Card
                    key={field.id}
                    draggable
                    onDragStart={() => handleFormFieldDragStart(field.id)}
                    onDragOver={(e) => handleFormFieldDragOver(e, field.id)}
                    onDrop={(e) => handleFormFieldDrop(e, field.id)}
                    className={`border transition-colors cursor-pointer ${
                      selectedFieldId === field.id ? 'border-primary shadow-sm' : 'border-border hover:border-muted-foreground/50'
                    } ${dragOverFieldId === field.id ? 'border-primary border-2' : ''}`}
                    onClick={() => setSelectedFieldId(field.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <GripVertical 
                          className="h-5 w-5 text-muted-foreground mt-1 cursor-move flex-shrink-0"
                          onMouseDown={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-2">
                            <Label className="font-medium">
                              {field.displayName}
                              {field.required && <span className="text-destructive ml-1">*</span>}
                            </Label>
                            <span className="text-xs text-muted-foreground">({field.type})</span>
                          </div>
                          {field.type === 'dropdown' ? (
                            <div className="relative">
                              <Input
                                value={field.options?.[0] || ''}
                                disabled
                                className="pr-8"
                              />
                              <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            </div>
                          ) : (
                            <Input
                              placeholder={field.placeholder}
                              disabled
                            />
                          )}
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteField(field.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Right Panel - Field Properties */}
        <Card className="w-96 flex flex-col">
          <CardHeader className="pb-3">
            <h3 className="font-semibold text-sm">Field Properties</h3>
          </CardHeader>
          <Separator />
          <ScrollArea className="flex-1">
            {selectedField ? (
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="field-name" className="text-sm font-medium">
                    Field Name
                  </Label>
                  <Input
                    id="field-name"
                    value={selectedField.fieldName}
                    onChange={(e) => handleFieldUpdate(selectedField.id, { fieldName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display-name" className="text-sm font-medium">
                    Display Name
                  </Label>
                  <Input
                    id="display-name"
                    value={selectedField.displayName}
                    onChange={(e) => handleFieldUpdate(selectedField.id, { displayName: e.target.value })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="required" className="text-sm font-medium">
                    Required
                  </Label>
                  <Switch
                    id="required"
                    checked={selectedField.required}
                    onCheckedChange={(checked) => handleFieldUpdate(selectedField.id, { required: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-value" className="text-sm font-medium">
                    Default Value
                  </Label>
                  <Input
                    id="default-value"
                    value={selectedField.defaultValue || ''}
                    onChange={(e) => handleFieldUpdate(selectedField.id, { defaultValue: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="helper-text" className="text-sm font-medium">
                    Helper Text
                  </Label>
                  <Textarea
                    id="helper-text"
                    value={selectedField.helperText || ''}
                    onChange={(e) => handleFieldUpdate(selectedField.id, { helperText: e.target.value })}
                    className="min-h-[80px] resize-none"
                  />
                </div>

                {selectedField.type === 'currency' && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm">Currency Settings</h4>
                      <div className="space-y-2">
                        <Label htmlFor="currency-format" className="text-sm font-medium">
                          Currency Format
                        </Label>
                        <Select value={currencyFormat} onValueChange={setCurrencyFormat}>
                          <SelectTrigger id="currency-format">
                            <SelectValue placeholder="Select currency format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD ($)">USD ($)</SelectItem>
                            <SelectItem value="EUR (€)">EUR (€)</SelectItem>
                            <SelectItem value="GBP (£)">GBP (£)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                {selectedField.type === 'date' && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm">Date Settings</h4>
                      <div className="space-y-2">
                        <Label htmlFor="date-format" className="text-sm font-medium">
                          Global Date/Time Format
                        </Label>
                        <Select value={dateFormat} onValueChange={setDateFormat}>
                          <SelectTrigger id="date-format">
                            <SelectValue placeholder="Select date format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          This setting applies to all date fields globally
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Select a field to view properties
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>

      {/* Create Field Dialog */}
      <Dialog open={showCreateFieldDialog} onOpenChange={setShowCreateFieldDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Create New Index Field</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Input Fields */}
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="new-display-name" className="text-sm font-medium">
                  Display Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="new-display-name"
                  value={newFieldDisplayName}
                  onChange={(e) => setNewFieldDisplayName(e.target.value)}
                  placeholder="Enter display name"
                  className={`w-full ${displayNameError ? 'border-red-500' : ''}`}
                />
                {displayNameError && (
                  <p className="text-xs text-red-500">{displayNameError}</p>
                )}
              </div>
              
              <div className="flex-1 space-y-2">
                <Label htmlFor="new-field-name" className="text-sm font-medium">
                  Field Name
                </Label>
                <Input
                  id="new-field-name"
                  value={generateFieldName(newFieldDisplayName)}
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
                        ${newFieldType === option.id 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }
                      `}
                      onClick={() => setNewFieldType(option.id)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm font-medium">{option.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                      {newFieldType === option.id && (
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
                  id="new-required"
                  checked={newFieldRequired}
                  onCheckedChange={(checked) => setNewFieldRequired(checked === true)}
                />
                <Label htmlFor="new-required" className="text-sm font-medium">
                  Required Field
                </Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-default-value" className="text-sm font-medium">
                  Default Value
                </Label>
                <Input
                  id="new-default-value"
                  value={newFieldDefaultValue}
                  onChange={(e) => setNewFieldDefaultValue(e.target.value)}
                  placeholder="Enter default value (optional)"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-helper-text" className="text-sm font-medium">
                  Helper Text
                </Label>
                <Textarea
                  id="new-helper-text"
                  value={newFieldHelperText}
                  onChange={(e) => setNewFieldHelperText(e.target.value)}
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
                setShowCreateFieldDialog(false);
                setNewFieldDisplayName('');
                setNewFieldFieldName('');
                setNewFieldType('');
                setNewFieldRequired(false);
                setNewFieldDefaultValue('');
                setNewFieldHelperText('');
                setDisplayNameError('');
                setFieldTypeError('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateCustomField}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormCreationPage;
