import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Check,
  FolderPlus,
  FileText,
  Users,
  Settings
} from 'lucide-react';
import { FolderNode, FolderConfig, UserPermission } from '@/types/storage';
import { mockIndexForms } from '@/utils/storageData';

interface CreateFolderWizardProps {
  currentPath: FolderNode[];
  onComplete: () => void;
  onCancel: () => void;
}

type Step = 'basic' | 'indexForm' | 'userAccess' | 'settings';

const mockUsers = [
  { id: 'user1', name: 'John Smith', email: 'john.smith@company.com' },
  { id: 'user2', name: 'Sarah Johnson', email: 'sarah.johnson@company.com' },
  { id: 'user3', name: 'Mike Wilson', email: 'mike.wilson@company.com' },
  { id: 'user4', name: 'Lisa Brown', email: 'lisa.brown@company.com' }
];

const CreateFolderWizard: React.FC<CreateFolderWizardProps> = ({
  currentPath,
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [config, setConfig] = useState<Partial<FolderConfig>>({
    name: '',
    description: '',
    parentId: currentPath[currentPath.length - 1]?.id || 'root',
    permissions: []
  });
  const [indexFormSearch, setIndexFormSearch] = useState('');
  const [autoIndexing, setAutoIndexing] = useState(false);
  const [sendNotifications, setSendNotifications] = useState(false);
  const [folderNameTouched, setFolderNameTouched] = useState(false);

  const steps: { key: Step; title: string; description: string; progress: number; icon: React.ReactNode }[] = [
    { key: 'basic', title: 'Basic Information', description: 'Enter basic information about the folder', progress: 25, icon: <FolderPlus className="w-4 h-4" /> },
    { key: 'indexForm', title: 'Index Form', description: 'Choose the default index form for documents', progress: 50, icon: <FileText className="w-4 h-4" /> },
    { key: 'userAccess', title: 'User Access', description: 'Configure user access permissions', progress: 75, icon: <Users className="w-4 h-4" /> },
    { key: 'settings', title: 'Settings', description: 'Set up folder settings and policies', progress: 100, icon: <Settings className="w-4 h-4" /> }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const currentStepData = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      const nextStep = steps[currentStepIndex + 1];
      setCurrentStep(nextStep.key);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      const prevStep = steps[currentStepIndex - 1];
      setCurrentStep(prevStep.key);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'basic':
        return config.name && config.name.trim().length > 0;
      case 'indexForm':
      case 'userAccess':
      case 'settings':
        return true; // Optional steps
      default:
        return false;
    }
  };

  const updateConfig = (updates: Partial<FolderConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const filteredIndexForms = mockIndexForms.filter(form =>
    form.name.toLowerCase().includes(indexFormSearch.toLowerCase())
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <p className="text-muted-foreground">Enter basic information about the folder</p>
            </div>
            
            <div className="space-y-2 relative">
              <Label htmlFor="folderName">Folder Name <span className="text-red-500">*</span></Label>
              <Input
                id="folderName"
                placeholder="Enter folder name"
                value={config.name || ''}
                onChange={(e) => updateConfig({ name: e.target.value })}
                onBlur={() => setFolderNameTouched(true)}
                className={folderNameTouched && (!config.name || config.name.trim().length === 0) ? 'border-red-500' : ''}
              />
              {folderNameTouched && (!config.name || config.name.trim().length === 0) && (
                <div className="absolute top-full left-0 mt-1 px-3 py-2 bg-red-50 border border-red-200 rounded-md shadow-sm">
                  <div className="text-sm text-red-600 font-medium">Folder name is required</div>
                  <div className="absolute -top-1 left-4 w-2 h-2 bg-red-50 border-l border-t border-red-200 transform rotate-45"></div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Parent Path</Label>
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  {currentPath.map((folder, index) => (
                    <React.Fragment key={folder.id}>
                      <span>{folder.name}</span>
                      {index < currentPath.length - 1 && <span>{'>'}</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the purpose of this folder..."
                value={config.description || ''}
                onChange={(e) => updateConfig({ description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        );

      case 'indexForm':
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Index Form</h3>
              <p className="text-muted-foreground">Choose the default form that will be used to index documents in this folder</p>
            </div>
            
            <div className="space-y-2">
              <Label>Select Index Form</Label>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search index forms..."
                  value={indexFormSearch}
                  onChange={(e) => setIndexFormSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {filteredIndexForms.map((form) => (
                <div 
                  key={form.id} 
                  className={`p-4 rounded-xl cursor-pointer transition-colors duration-200 shadow-sm ${
                    config.indexFormId === form.id 
                      ? 'border border-primary bg-muted/50 shadow-md' 
                      : 'border border-border bg-card hover:bg-muted/50 hover:shadow-md'
                  }`}
                  onClick={() => updateConfig({ indexFormId: config.indexFormId === form.id ? '' : form.id })}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="indexForm"
                        checked={config.indexFormId === form.id}
                        onChange={() => updateConfig({ indexFormId: form.id })}
                        className="w-4 h-4 text-foreground border-border focus:ring-2 focus:ring-foreground"
                      />
                      <div>
                        <div className="font-medium text-sm">{form.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {form.fields.length} fields configured
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'userAccess':
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">User Access</h3>
              <p className="text-muted-foreground">Set access and configure their access levels for this folder</p>
            </div>
            
            <div className="space-y-2">
              <Label>User Access Permissions</Label>
            </div>

            <div className="space-y-3 mt-2">
              {mockUsers.map((user) => {
                const userPermission = config.permissions?.find(p => p.userId === user.id);
                return (
                  <div key={user.id} className={`flex items-center justify-between p-4 bg-card rounded-xl shadow-sm hover:shadow-md transition-colors duration-200 border ${
                    userPermission ? 'border-primary' : 'border-border'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={!!userPermission}
                        onCheckedChange={(checked) => {
                          const newPermissions = config.permissions || [];
                          if (checked) {
                            newPermissions.push({
                              userId: user.id,
                              userName: user.name,
                              role: 'view'
                            });
                          } else {
                            const filtered = newPermissions.filter(p => p.userId !== user.id);
                            updateConfig({ permissions: filtered });
                            return;
                          }
                          updateConfig({ permissions: newPermissions });
                        }}
                      />
                      <div>
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {userPermission && (
                        <Select
                          value={userPermission.role}
                          onValueChange={(role) => {
                            const newPermissions = config.permissions?.map(p =>
                              p.userId === user.id ? { ...p, role: role as UserPermission['role'] } : p
                            ) || [];
                            updateConfig({ permissions: newPermissions });
                          }}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background z-50 min-w-40">
                            <SelectItem value="view">
                              <span className="whitespace-nowrap">Read Only</span>
                            </SelectItem>
                            <SelectItem value="edit">Read/Write</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Folder Settings</h3>
              <p className="text-muted-foreground">Set up folder settings and policies</p>
            </div>

            <div className="space-y-2">
              <Label>Retention Policy</Label>
              <Select
                value={config.retentionPolicy || '7years'}
                onValueChange={(value) => updateConfig({ retentionPolicy: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select retention policy" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="30days">30 Days</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="3years">3 Years</SelectItem>
                  <SelectItem value="5years">5 Years</SelectItem>
                  <SelectItem value="7years">
                    <div className="flex items-center justify-between w-full">
                      <span>7 Years</span>
                      <Check className="w-4 h-4 ml-2" />
                    </div>
                  </SelectItem>
                  <SelectItem value="10years">10 Years</SelectItem>
                  <SelectItem value="permanent">Permanent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto-indexing"
                  checked={autoIndexing}
                  onCheckedChange={(checked) => setAutoIndexing(checked === true)}
                />
                <Label htmlFor="auto-indexing">Enable automatic indexing for new documents</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifications"
                  checked={sendNotifications}
                  onCheckedChange={(checked) => setSendNotifications(checked === true)}
                />
                <Label htmlFor="notifications">Send notifications for document changes</Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl h-[700px] flex flex-col bg-white">
        <DialogHeader className="pb-2">
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 rounded-lg px-6 pt-6 mb-4">
          <div className="flex items-center justify-between flex-row">
            {steps.map((step, index) => {
              const getStepColors = () => {
                if (index < currentStepIndex) {
                  return 'bg-muted-foreground text-background shadow-md';
                }
                
                switch (step.key) {
                  case 'basic':
                    return index === currentStepIndex 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'bg-blue-100 text-blue-600 shadow-sm border border-blue-200';
                  case 'indexForm':
                    return index === currentStepIndex 
                      ? 'bg-amber-500 text-white shadow-md' 
                      : 'bg-amber-100 text-amber-600 shadow-sm border border-amber-200';
                  case 'userAccess':
                    return index === currentStepIndex 
                      ? 'bg-purple-500 text-white shadow-md' 
                      : 'bg-purple-100 text-purple-600 shadow-sm border border-purple-200';
                  case 'settings':
                    return index === currentStepIndex 
                      ? 'bg-orange-500 text-white shadow-md' 
                      : 'bg-orange-100 text-orange-600 shadow-sm border border-orange-200';
                  default:
                    return 'bg-muted text-muted-foreground shadow-sm border border-border';
                }
              };

              return (
                <div key={step.key} className="flex items-center flex-row flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${getStepColors()}`}>
                    {index < currentStepIndex ? <Check className="w-5 h-5" /> : step.icon}
                  </div>
                  <div className="ml-3 text-sm flex-1">
                    <div className={`font-medium transition-colors ${index === currentStepIndex ? 'text-foreground' : index < currentStepIndex ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 mx-6 text-muted-foreground" />
                  )}
                </div>
              );
            })}
            
            {/* Progress text as separate 5th element */}
            <div className="ml-6 text-right">
              <div className="text-xs text-muted-foreground">
                <div>Step {currentStepIndex + 1}/ {steps.length}</div>
                <div>{currentStepData.progress}% Complete</div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar - Full Width */}
          <div className="mt-4">
            <Progress value={currentStepData.progress} className="w-full" />
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto pt-2">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-end pt-4 border-t">
          <div className="flex space-x-3">
            {!isFirstStep && (
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            
            {isLastStep ? (
              <Button onClick={onComplete} disabled={!canProceed()}>
                Create Folder
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderWizard;