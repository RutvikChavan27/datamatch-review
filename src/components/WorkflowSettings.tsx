import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, MoreHorizontal, Settings, Folder, Cog, FileText, ShoppingCart, ScrollText, Zap } from 'lucide-react';

interface Task {
  id: string;
  taskName: string;
  type: 'System' | 'Custom';
  usedInWorkflows: number;
  status: 'Active' | 'Inactive';
}

const WorkflowSettings = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  
  // Notification toggles state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [webhookNotifications, setWebhookNotifications] = useState(true);
  
  // Reminder and escalation state
  const [applyToAllWorkflows, setApplyToAllWorkflows] = useState(false);
  
  // Workflow settings state
  const [invoiceSettings, setInvoiceSettings] = useState({
    reminderAfter: '3',
    escalationAfter: '7',
    priority: 'Normal'
  });
  
  const [poSettings, setPOSettings] = useState({
    reminderAfter: '2',
    escalationAfter: '5',
    priority: 'Normal'
  });
  
  const [contractSettings, setContractSettings] = useState({
    reminderAfter: '1',
    escalationAfter: '3',
    priority: 'Normal'
  });
  
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      taskName: 'Approve',
      type: 'System',
      usedInWorkflows: 3,
      status: 'Active'
    },
    {
      id: '2',
      taskName: 'Reject',
      type: 'System',
      usedInWorkflows: 3,
      status: 'Active'
    },
    {
      id: '3',
      taskName: 'Sign',
      type: 'System',
      usedInWorkflows: 1,
      status: 'Active'
    },
    {
      id: '4',
      taskName: 'Review',
      type: 'System',
      usedInWorkflows: 2,
      status: 'Active'
    },
    {
      id: '5',
      taskName: 'Escalate',
      type: 'System',
      usedInWorkflows: 1,
      status: 'Active'
    },
    {
      id: '6',
      taskName: 'Request Changes',
      type: 'Custom',
      usedInWorkflows: 2,
      status: 'Active'
    }
  ]);

  const getStatusBadge = (status: string) => {
    if (status === 'Active') {
      return <Badge variant="outline" className="bg-green-100 border-0" style={{ color: '#333333' }}>Active</Badge>;
    }
    return <Badge variant="outline" className="bg-gray-100 border-0" style={{ color: '#333333' }}>Inactive</Badge>;
  };

  const getTypeBadge = (type: string) => {
    if (type === 'System') {
      return <Badge variant="outline" className="bg-blue-100 border-0" style={{ color: '#333333' }}>System</Badge>;
    }
    return <Badge variant="outline" className="bg-orange-100 border-0" style={{ color: '#333333' }}>Custom</Badge>;
  };

  const renderActions = (task: Task) => {
    if (task.type === 'System') {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>More actions</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Edit className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit</p>
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
    );
  };

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
                <BreadcrumbPage>Workflow Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground font-inter">Workflow Settings</h1>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="border-b border-border flex items-center justify-between px-0 -mt-2">
          <div className="flex items-center flex-1 -mb-px pb-1">
            {[
              { key: 'tasks', label: 'Tasks' },
              { key: 'notifications', label: 'Notification Channels' },
              { key: 'reminders', label: 'Reminder and Escalation' }
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
        {activeTab === 'tasks' && (
          <Card className="overflow-hidden shadow-lg shadow-black/5">
            <div 
              className="overflow-y-auto"
              style={{ 
                maxHeight: `calc(100vh - 320px)`,
                height: tasks.length > 15 ? `calc(100vh - 320px)` : 'auto'
              }}
            >
              <Table className="min-w-full" style={{ tableLayout: 'fixed' }}>
                <TableHeader className="sticky top-0 z-10">
                  <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                    <TableHead className="font-semibold w-[200px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Task Name</TableHead>
                    <TableHead className="font-semibold w-[120px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Type</TableHead>
                    <TableHead className="font-semibold w-[160px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Used in Workflows</TableHead>
                    <TableHead className="font-semibold w-[120px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Status</TableHead>
                    <TableHead className="font-semibold w-[140px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id} className="h-10 hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium py-2 border-r-0 text-sm text-foreground truncate w-[200px]">{task.taskName}</TableCell>
                      <TableCell className="py-2 border-r-0 w-[120px]">{getTypeBadge(task.type)}</TableCell>
                      <TableCell className="py-2 border-r-0 text-sm text-foreground w-[160px]">{task.usedInWorkflows}</TableCell>
                      <TableCell className="py-2 border-r-0 w-[120px]">{getStatusBadge(task.status)}</TableCell>
                      <TableCell className="py-2 border-r-0 w-[140px]">
                        {renderActions(task)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {activeTab === 'notifications' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Simple Workflow Card */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Simple Workflow</h3>
                    <p className="text-sm text-muted-foreground mt-1">Basic notification channels for simple workflows</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Send workflow updates via email</p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  {/* In-App Notifications */}
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">In-App Notifications</h4>
                      <p className="text-sm text-muted-foreground">Show notifications within the application</p>
                    </div>
                    <Switch
                      checked={inAppNotifications}
                      onCheckedChange={setInAppNotifications}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Advanced Workflow Card */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Settings className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Advanced Workflow</h3>
                    <p className="text-sm text-muted-foreground mt-1">Premium notification channels for advanced workflows</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* SMS Notifications */}
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">SMS Notifications</h4>
                        <Badge variant="outline" className="bg-orange-100 border-0 text-orange-800 text-xs">Premium</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Send urgent notifications via SMS</p>
                      <p className="text-xs text-muted-foreground mt-1">Note: SMS costs covered in advanced module pricing</p>
                    </div>
                    <Switch
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
                    />
                  </div>
                  
                  {/* Webhook Notifications */}
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">Webhook Notifications</h4>
                      <p className="text-sm text-muted-foreground">Send notifications to external systems</p>
                    </div>
                    <Switch
                      checked={webhookNotifications}
                      onCheckedChange={setWebhookNotifications}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'reminders' && (
          <div className="space-y-4">
            {/* Header with Apply to All Toggle */}
            <div className="flex items-center justify-between pt-6">
              <h3 className="text-lg font-semibold text-foreground">Workflows & Settings</h3>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <span className="font-medium text-foreground">Apply to all workflows</span>
                <Switch
                  checked={applyToAllWorkflows}
                  onCheckedChange={setApplyToAllWorkflows}
                />
              </div>
            </div>
            
            {/* Workflow Cards */}
            <div className="space-y-4">
              {/* Invoice Approval */}
              <Card className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-7 gap-4 text-sm items-start">
                  <div className="flex items-center gap-3 md:col-span-2">
                    <div className="w-12 h-full rounded-lg bg-blue-50 flex items-center justify-center py-4">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground">Invoice Approval</h4>
                      <Badge variant="outline" className="bg-blue-100 border-0 text-blue-800 text-xs mt-1">Simple Workflow</Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reminder After:</span>
                    <div className="mt-1">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={invoiceSettings.reminderAfter}
                          onChange={(e) => setInvoiceSettings({...invoiceSettings, reminderAfter: e.target.value})}
                          className="w-16 h-8 text-sm"
                          min="1"
                        />
                        <span className="text-xs text-muted-foreground">days</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Escalation After:</span>
                    <div className="mt-1">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={invoiceSettings.escalationAfter}
                          onChange={(e) => setInvoiceSettings({...invoiceSettings, escalationAfter: e.target.value})}
                          className="w-16 h-8 text-sm"
                          min="1"
                        />
                        <span className="text-xs text-muted-foreground">days</span>
                      </div>
                    </div>
                  </div>
                    <div>
                      <span className="text-muted-foreground">Reminder Recipients:</span>
                      <div className="mt-1">
                        <Button variant="secondary" size="sm" className="h-8 text-sm">
                          View
                        </Button>
                      </div>
                    </div>
                  <div>
                    <span className="text-muted-foreground">Priority:</span>
                    <div className="mt-1">
                      <Select
                        value={invoiceSettings.priority}
                        onValueChange={(value) => setInvoiceSettings({...invoiceSettings, priority: value})}
                      >
                        <SelectTrigger className="w-24 h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Workflow Settings</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </Card>

              {/* Purchase Order Review */}
              <Card className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-7 gap-4 text-sm items-start">
                  <div className="flex items-center gap-3 md:col-span-2">
                    <div className="w-12 h-full rounded-lg bg-green-50 flex items-center justify-center py-4">
                      <ShoppingCart className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground">Purchase Order Review</h4>
                      <Badge variant="outline" className="bg-blue-100 border-0 text-blue-800 text-xs mt-1">Simple Workflow</Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reminder After:</span>
                    <div className="mt-1">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={poSettings.reminderAfter}
                          onChange={(e) => setPOSettings({...poSettings, reminderAfter: e.target.value})}
                          className="w-16 h-8 text-sm"
                          min="1"
                        />
                        <span className="text-xs text-muted-foreground">days</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Escalation After:</span>
                    <div className="mt-1">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={poSettings.escalationAfter}
                          onChange={(e) => setPOSettings({...poSettings, escalationAfter: e.target.value})}
                          className="w-16 h-8 text-sm"
                          min="1"
                        />
                        <span className="text-xs text-muted-foreground">days</span>
                      </div>
                    </div>
                  </div>
                    <div>
                      <span className="text-muted-foreground">Reminder Recipients:</span>
                      <div className="mt-1">
                        <Button variant="secondary" size="sm" className="h-8 text-sm">
                          View
                        </Button>
                      </div>
                    </div>
                  <div>
                    <span className="text-muted-foreground">Priority:</span>
                    <div className="mt-1">
                      <Select
                        value={poSettings.priority}
                        onValueChange={(value) => setPOSettings({...poSettings, priority: value})}
                      >
                        <SelectTrigger className="w-24 h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Workflow Settings</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </Card>

              {/* Contract Processing */}
              <Card className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-7 gap-4 text-sm items-start">
                  <div className="flex items-center gap-3 md:col-span-2">
                    <div className="w-12 h-full rounded-lg bg-orange-50 flex items-center justify-center py-4">
                      <ScrollText className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground">Contract Processing</h4>
                      <Badge variant="outline" className="bg-orange-100 border-0 text-orange-800 text-xs mt-1">Advanced Workflow</Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reminder After:</span>
                    <div className="mt-1">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={contractSettings.reminderAfter}
                          onChange={(e) => setContractSettings({...contractSettings, reminderAfter: e.target.value})}
                          className="w-16 h-8 text-sm"
                          min="1"
                        />
                        <span className="text-xs text-muted-foreground">days</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Escalation After:</span>
                    <div className="mt-1">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={contractSettings.escalationAfter}
                          onChange={(e) => setContractSettings({...contractSettings, escalationAfter: e.target.value})}
                          className="w-16 h-8 text-sm"
                          min="1"
                        />
                        <span className="text-xs text-muted-foreground">days</span>
                      </div>
                    </div>
                  </div>
                    <div>
                      <span className="text-muted-foreground">Reminder Recipients:</span>
                      <div className="mt-1">
                        <Button variant="secondary" size="sm" className="h-8 text-sm">
                          View
                        </Button>
                      </div>
                    </div>
                  <div>
                    <span className="text-muted-foreground">Priority:</span>
                    <div className="mt-1">
                      <Select
                        value={contractSettings.priority}
                        onValueChange={(value) => setContractSettings({...contractSettings, priority: value})}
                      >
                        <SelectTrigger className="w-24 h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Workflow Settings</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default WorkflowSettings;