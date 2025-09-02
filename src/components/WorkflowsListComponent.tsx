import React, { useState, useMemo } from 'react';
import { Plus, Search, MoreHorizontal, Trash2, Power, PowerOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { WorkflowState } from '@/types/workflow.types';

import { cn } from '@/lib/utils';

interface WorkflowsListProps {
  workflows: WorkflowState[];
  selectedWorkflow: WorkflowState | null;
  onSelectWorkflow: (workflow: WorkflowState) => void;
  onDeleteWorkflow: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onCreateWorkflow: (type: 'simple' | 'advanced') => void;
}

type SortField = 'name' | 'createdAt' | 'trigger.type';
type SortDirection = 'asc' | 'desc';

export const WorkflowsList: React.FC<WorkflowsListProps> = ({
  workflows,
  selectedWorkflow,
  onSelectWorkflow,
  onDeleteWorkflow,
  onToggleStatus,
  onCreateWorkflow
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const { paginatedWorkflows, totalPages, totalItems } = useMemo(() => {
    let filtered = workflows.filter(workflow => {
      const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           workflow.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && workflow.isComplete) ||
                           (statusFilter === 'inactive' && !workflow.isComplete);
      
      return matchesSearch && matchesStatus;
    });

    const sorted = filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortField === 'trigger.type') {
        aValue = a.trigger.type;
        bValue = b.trigger.type;
      } else {
        aValue = a[sortField as keyof WorkflowState];
        bValue = b[sortField as keyof WorkflowState];
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
      }

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = sorted.slice(startIndex, endIndex);

    return {
      paginatedWorkflows: paginated,
      totalPages: Math.ceil(sorted.length / itemsPerPage),
      totalItems: sorted.length
    };
  }, [workflows, searchQuery, statusFilter, sortField, sortDirection, currentPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getTriggerLabel = (triggerType: string) => {
    const labels: Record<string, string> = {
      'document_upload': 'Document Upload',
      'form_submit': 'Form Submission',
      'schedule_trigger': 'Scheduled',
      'data_updated': 'Data Update',
      'deadline_approaching': 'Deadline Alert'
    };
    return labels[triggerType] || triggerType;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-8 border-b border-border/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2 font-inter">Workflows</h1>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between gap-6">
          {/* Status Pills */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2 font-roboto">Status:</span>
            <div className="flex bg-muted/30 rounded-lg p-1">
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-all font-roboto",
                  statusFilter === 'all'
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                All
              </button>
              <button
                onClick={() => {
                  setStatusFilter('active');
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-all font-roboto",
                  statusFilter === 'active'
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Active
              </button>
              <button
                onClick={() => {
                  setStatusFilter('inactive');
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-all font-roboto",
                  statusFilter === 'inactive'
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Inactive
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 h-10 bg-background border-border/50 font-roboto"
              />
            </div>
            <Button 
              size="lg" 
              variant="default"
              className="gap-2 shadow-lg font-roboto font-semibold"
              onClick={() => window.location.href = '/'}
            >
              <Plus className="w-4 h-4" />
              Create Workflow
            </Button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-hidden">
        <div className="mx-8 my-6 bg-background border border-border/50 rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-border/50">
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 select-none font-medium text-foreground w-[35%] px-6 py-4 font-roboto"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Workflow Name
                    {sortField === 'name' && (
                      <span className="text-xs">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 select-none font-medium text-foreground w-[15%] px-6 py-4 font-roboto"
                  onClick={() => handleSort('trigger.type')}
                >
                  <div className="flex items-center gap-2">
                    Trigger
                    {sortField === 'trigger.type' && (
                      <span className="text-xs">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="font-medium text-foreground w-[12%] px-6 py-4 font-roboto">Status</TableHead>
                <TableHead className="font-medium text-foreground w-[12%] px-6 py-4 font-roboto">Actions</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 select-none font-medium text-foreground w-[16%] px-6 py-4 font-roboto"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-2">
                    Created
                    {sortField === 'createdAt' && (
                      <span className="text-xs">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-[10%] px-6 py-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedWorkflows.map((workflow) => (
                <TableRow
                  key={workflow.id}
                  className={cn(
                    "cursor-pointer hover:bg-muted/50 border-border/30 transition-colors",
                    selectedWorkflow?.id === workflow.id && "bg-primary/5 border-primary/20"
                  )}
                  onClick={() => onSelectWorkflow(workflow)}
                >
                  <TableCell className="px-6 py-4">
                    <div className="min-w-0">
                      <div className="font-medium text-foreground mb-1 truncate font-roboto">{workflow.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1 font-roboto">
                        {workflow.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant="outline" className="font-medium font-roboto">
                      {getTriggerLabel(workflow.trigger.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {workflow.isComplete ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 font-roboto font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-50 text-gray-600 border-gray-200 font-roboto font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5" />
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="text-sm text-muted-foreground font-roboto">
                      {workflow.actions.length} action{workflow.actions.length !== 1 ? 's' : ''}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="text-sm text-muted-foreground font-roboto">
                      {formatDate(workflow.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleStatus(workflow.id);
                          }}
                        >
                          {workflow.isComplete ? (
                            <>
                              <PowerOff className="w-4 h-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Power className="w-4 h-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteWorkflow(workflow.id);
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="p-6 border-t border-border/50 bg-background">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground font-roboto">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems.toLocaleString()} workflows
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="gap-1 font-roboto font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8 p-0 font-roboto font-medium"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="gap-1 font-roboto font-medium"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

          {paginatedWorkflows.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-muted-foreground font-roboto">
                {searchQuery || statusFilter !== 'all' 
                  ? 'No workflows match your search criteria'
                  : 'No workflows created yet'
                }
              </div>
              {!searchQuery && statusFilter === 'all' && (
                <Button 
                  variant="outline" 
                  className="mt-4 font-roboto font-medium"
                  onClick={() => window.location.href = '/'}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Workflow
                </Button>
              )}
            </div>
          )}
    </div>
  );
};