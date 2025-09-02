import React, { useState } from 'react';
import { Plus, X, User, Users, MagnifyingGlass, CaretDown } from 'phosphor-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Reviewer {
  id: string;
  type: 'internal' | 'external';
  name: string;
  email?: string;
  role?: string;
  status: 'pending' | 'approved' | 'rejected' | 'current';
}

interface PredefinedReviewer {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  type: 'internal' | 'external';
}

interface QuickReviewerSelectorProps {
  reviewers: Reviewer[];
  onReviewersChange: (reviewers: Reviewer[]) => void;
  maxReviewers?: number;
}

// Mock predefined reviewers - in real app, this would come from API/database
const PREDEFINED_REVIEWERS: PredefinedReviewer[] = [
  { id: 'r1', name: 'John Smith', email: 'john.smith@company.com', role: 'Manager', department: 'Finance', type: 'internal' },
  { id: 'r2', name: 'Sarah Johnson', email: 'sarah.j@company.com', role: 'Director', department: 'IT', type: 'internal' },
  { id: 'r3', name: 'Mike Wilson', email: 'mike.w@company.com', role: 'Lead', department: 'Operations', type: 'internal' },
  { id: 'r4', name: 'Emily Davis', email: 'emily.davis@partner.com', role: 'Consultant', department: 'External', type: 'external' },
  { id: 'r5', name: 'Robert Brown', email: 'robert@vendor.com', role: 'Vendor', department: 'External', type: 'external' },
];

const COMMON_REVIEWER_GROUPS = [
  { name: 'Finance Team', reviewers: ['r1', 'r2'] },
  { name: 'IT Department', reviewers: ['r2', 'r3'] },
  { name: 'Management Review', reviewers: ['r1', 'r2', 'r3'] },
];

export const QuickReviewerSelector: React.FC<QuickReviewerSelectorProps> = ({
  reviewers,
  onReviewersChange,
  maxReviewers = 4
}) => {
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [customReviewer, setCustomReviewer] = useState({
    type: 'internal' as 'internal' | 'external',
    name: '',
    email: '',
    role: ''
  });

  const addPredefinedReviewer = (predefined: PredefinedReviewer) => {
    if (reviewers.length >= maxReviewers) return;
    
    const reviewer: Reviewer = {
      id: `reviewer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: predefined.type,
      name: predefined.name,
      email: predefined.email,
      role: predefined.role,
      status: reviewers.length === 0 ? 'current' : 'pending'
    };

    onReviewersChange([...reviewers, reviewer]);
    setSearchOpen(false);
  };

  const addReviewerGroup = (groupName: string) => {
    const group = COMMON_REVIEWER_GROUPS.find(g => g.name === groupName);
    if (!group) return;

    const newReviewers = group.reviewers
      .map(id => PREDEFINED_REVIEWERS.find(r => r.id === id))
      .filter(r => r && reviewers.length < maxReviewers)
      .slice(0, maxReviewers - reviewers.length)
      .map((predefined, index) => ({
        id: `reviewer_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
        type: predefined!.type,
        name: predefined!.name,
        email: predefined!.email,
        role: predefined!.role,
        status: (reviewers.length + index === 0 ? 'current' : 'pending') as 'current' | 'pending'
      }));

    onReviewersChange([...reviewers, ...newReviewers]);
    setSearchOpen(false);
  };

  const addCustomReviewer = () => {
    if (!customReviewer.name.trim() || reviewers.length >= maxReviewers) return;

    const reviewer: Reviewer = {
      id: `reviewer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: customReviewer.type,
      name: customReviewer.name.trim(),
      email: customReviewer.email.trim() || undefined,
      role: customReviewer.role.trim() || undefined,
      status: reviewers.length === 0 ? 'current' : 'pending'
    };

    onReviewersChange([...reviewers, reviewer]);
    setCustomReviewer({ type: 'internal', name: '', email: '', role: '' });
    setIsAddingCustom(false);
  };

  const removeReviewer = (reviewerId: string) => {
    const updatedReviewers = reviewers.filter(r => r.id !== reviewerId);
    if (updatedReviewers.length > 0 && !updatedReviewers.some(r => r.status === 'current')) {
      updatedReviewers[0].status = 'current';
    }
    onReviewersChange(updatedReviewers);
  };

  const availableReviewers = PREDEFINED_REVIEWERS.filter(
    predefined => !reviewers.some(r => r.email === predefined.email)
  );

  return (
    <div className="space-y-4">
      {/* Current Reviewers */}
      {reviewers.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">Selected Reviewers</h3>
          <div className="space-y-2">
            {reviewers.map((reviewer, index) => (
              <div key={reviewer.id} className="flex items-center gap-3 p-3 bg-card border rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{reviewer.name}</span>
                    <Badge variant={reviewer.type === 'internal' ? 'secondary' : 'outline'} className="text-xs">
                      {reviewer.type}
                    </Badge>
                  </div>
                  {reviewer.email && (
                    <div className="text-xs text-muted-foreground">{reviewer.email}</div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeReviewer(reviewer.id)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Add Options */}
      {reviewers.length < maxReviewers && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Add Reviewers</h3>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            {/* Search & Select */}
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <MagnifyingGlass className="h-4 w-4" />
                  Find Reviewer
                  <CaretDown className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search reviewers..." />
                  <CommandList>
                    <CommandEmpty>No reviewers found.</CommandEmpty>
                    
                    {/* Predefined Reviewers */}
                    {availableReviewers.length > 0 && (
                      <CommandGroup heading="Available Reviewers">
                        {availableReviewers.map((reviewer) => (
                          <CommandItem
                            key={reviewer.id}
                            onSelect={() => addPredefinedReviewer(reviewer)}
                            className="flex items-center gap-3"
                          >
                            {reviewer.type === 'internal' ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Users className="h-4 w-4" />
                            )}
                            <div className="flex-1">
                              <div className="font-medium">{reviewer.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {reviewer.role} • {reviewer.department}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}

                    {/* Reviewer Groups */}
                    <CommandGroup heading="Quick Groups">
                      {COMMON_REVIEWER_GROUPS.map((group) => (
                        <CommandItem
                          key={group.name}
                          onSelect={() => addReviewerGroup(group.name)}
                          className="flex items-center gap-3"
                        >
                          <Users className="h-4 w-4" />
                          <div className="flex-1">
                            <div className="font-medium">{group.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {group.reviewers.length} reviewers
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Add Custom */}
            <Button 
              variant="outline" 
              onClick={() => setIsAddingCustom(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Custom Reviewer
            </Button>
          </div>

          {/* Custom Reviewer Form */}
          {isAddingCustom && (
            <div className="bg-muted/50 border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Add Custom Reviewer</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingCustom(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <Button
                  variant={customReviewer.type === 'internal' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCustomReviewer(prev => ({ ...prev, type: 'internal' }))}
                  className="gap-2"
                >
                  <User className="h-3 w-3" />
                  Internal
                </Button>
                <Button
                  variant={customReviewer.type === 'external' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCustomReviewer(prev => ({ ...prev, type: 'external' }))}
                  className="gap-2"
                >
                  <Users className="h-3 w-3" />
                  External
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Input
                  placeholder="Name *"
                  value={customReviewer.name}
                  onChange={(e) => setCustomReviewer(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={customReviewer.email}
                  onChange={(e) => setCustomReviewer(prev => ({ ...prev, email: e.target.value }))}
                />
                <Input
                  placeholder="Role/Title"
                  value={customReviewer.role}
                  onChange={(e) => setCustomReviewer(prev => ({ ...prev, role: e.target.value }))}
                />
              </div>

              <Button
                onClick={addCustomReviewer}
                disabled={!customReviewer.name.trim()}
                className="w-full"
                size="sm"
              >
                Add Reviewer
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
        {reviewers.length}/{maxReviewers} reviewers added. Reviewers will be notified in sequence.
      </div>
    </div>
  );
};