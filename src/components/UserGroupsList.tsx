import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, ArrowLeft } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserGroup {
  id: number;
  groupName: string;
  description: string;
  users: string[];
}

const UserGroupsList: React.FC = () => {
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingGroup, setEditingGroup] = useState<UserGroup | null>(null);
  const [groups, setGroups] = useState<UserGroup[]>([
    { id: 1, groupName: "Sales", description: "Sales team members", users: ["John Smith", "Sarah Johnson", "Michael Brown"] },
    { id: 2, groupName: "Accounts", description: "Accounting and finance team", users: ["Emily Davis", "David Wilson"] },
    { id: 3, groupName: "Legal", description: "Legal department staff", users: ["Lisa Anderson"] },
    { id: 4, groupName: "HR department", description: "Human resources team", users: ["James Martinez", "Jennifer Taylor", "John Smith", "Emily Davis"] },
    { id: 5, groupName: "Demo Group", description: "Demo and testing purposes", users: ["Sarah Johnson"] },
  ]);
  
  const [formData, setFormData] = useState({
    groupName: '',
    description: ''
  });

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  // Mock user data
  const users = [
    { id: 1, name: "John Smith", email: "john.smith@company.com" },
    { id: 2, name: "Sarah Johnson", email: "sarah.johnson@company.com" },
    { id: 3, name: "Michael Brown", email: "michael.brown@company.com" },
    { id: 4, name: "Emily Davis", email: "emily.davis@company.com" },
    { id: 5, name: "David Wilson", email: "david.wilson@company.com" },
    { id: 6, name: "Lisa Anderson", email: "lisa.anderson@company.com" },
    { id: 7, name: "James Martinez", email: "james.martinez@company.com" },
    { id: 8, name: "Jennifer Taylor", email: "jennifer.taylor@company.com" },
  ];

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = () => {
    if (formData.groupName && formData.description) {
      const selectedUserNames = users
        .filter(user => selectedUsers.includes(user.id))
        .map(user => user.name);
      
      if (editMode && editingGroup) {
        // Update existing group
        setGroups(groups.map(group => 
          group.id === editingGroup.id 
            ? { ...group, groupName: formData.groupName, description: formData.description, users: selectedUserNames }
            : group
        ));
      } else {
        // Create new group
        const newGroup: UserGroup = {
          id: groups.length + 1,
          groupName: formData.groupName,
          description: formData.description,
          users: selectedUserNames
        };
        setGroups([...groups, newGroup]);
      }
      
      setFormData({ groupName: '', description: '' });
      setSelectedUsers([]);
      setEditMode(false);
      setEditingGroup(null);
      setCreateGroupOpen(false);
    }
  };

  const handleEditGroup = (group: UserGroup) => {
    setEditMode(true);
    setEditingGroup(group);
    setFormData({
      groupName: group.groupName,
      description: group.description
    });
    
    // Pre-select users based on group's existing users
    const selectedUserIds = users
      .filter(user => group.users.includes(user.name))
      .map(user => user.id);
    setSelectedUsers(selectedUserIds);
    
    setCreateGroupOpen(true);
  };

  const handleDialogClose = () => {
    setCreateGroupOpen(false);
    setEditMode(false);
    setEditingGroup(null);
    setFormData({ groupName: '', description: '' });
    setSelectedUsers([]);
  };

  const isFormValid = formData.groupName && formData.description;

  return (
    <>
      <Dialog open={createGroupOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Group' : 'Create New Group'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 py-4">
            {/* Left side - Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  value={formData.groupName}
                  onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                  placeholder="Enter group name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                  rows={4}
                />
              </div>
            </div>

            {/* Right side - User List */}
            <div className="space-y-2">
              <Label>Select Users ({selectedUsers.length} selected)</Label>
              <ScrollArea className="h-[300px] border rounded-md">
                <div className="p-4 space-y-3">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                        className="mt-1"
                      />
                      <label
                        htmlFor={`user-${user.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button onClick={handleCreateGroup} disabled={!isFormValid}>
              {editMode ? 'Update Group' : 'Create Group'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => setCreateGroupOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Group
          </Button>
        </div>

        <Card className="overflow-hidden shadow-lg shadow-black/5">
          <div 
            className="overflow-y-auto"
            style={{ 
              maxHeight: `calc(100vh - 380px)`,
              height: groups.length > 15 ? `calc(100vh - 380px)` : 'auto'
            }}
          >
            <Table className="w-full" style={{ tableLayout: 'fixed' }}>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                  <TableHead className="w-[8%] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Sr. No.</TableHead>
                  <TableHead className="w-[25%] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Group Name</TableHead>
                  <TableHead className="w-[37%] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Description</TableHead>
                  <TableHead className="w-[15%] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Users</TableHead>
                  <TableHead className="w-[15%] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group) => (
                  <TableRow key={group.id} className="h-10 hover:bg-muted/50 transition-colors">
                    <TableCell className="font-mono text-sm font-medium py-2 border-r-0 text-foreground">{group.id}</TableCell>
                    <TableCell className="py-2 border-r-0">
                      <div className="font-medium text-sm text-foreground">
                        {group.groupName}
                      </div>
                    </TableCell>
                    <TableCell className="py-2 border-r-0 text-sm text-muted-foreground">
                      {group.description}
                    </TableCell>
                    <TableCell className="py-2 border-r-0">
                      <TooltipProvider>
                        <Tooltip delayDuration={200}>
                          <TooltipTrigger asChild>
                            <span className="text-sm text-foreground cursor-default">
                              {group.users.length} {group.users.length === 1 ? 'user' : 'users'}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <div className="space-y-1">
                              {group.users.map((user, index) => (
                                <div key={index} className="text-sm">
                                  {user}
                                </div>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="py-2 border-r-0">
                      <button 
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        onClick={() => handleEditGroup(group)}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </>
  );
};

export default UserGroupsList;
