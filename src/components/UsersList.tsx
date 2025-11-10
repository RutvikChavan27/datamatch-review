import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Pencil, RotateCcw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  countryCode: string;
}

const UsersList: React.FC = () => {
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    { id: 1, firstName: "Shreyas", lastName: "Acharya", email: "shreyas.acharya@example.com", mobile: "9876543210", countryCode: "+91" },
    { id: 2, firstName: "John", lastName: "Doe", email: "john.doe@example.com", mobile: "9876543211", countryCode: "+91" },
    { id: 3, firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com", mobile: "9876543212", countryCode: "+91" },
  ]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    countryCode: '+91'
  });

  const handleAddUser = () => {
    if (formData.firstName && formData.lastName && formData.email && formData.mobile) {
      if (editMode && editingUser) {
        // Update existing user
        setUsers(users.map(user => 
          user.id === editingUser.id 
            ? {
                ...user,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                mobile: formData.mobile,
                countryCode: formData.countryCode
              }
            : user
        ));
      } else {
        // Create new user
        const newUser: User = {
          id: users.length + 1,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobile: formData.mobile,
          countryCode: formData.countryCode
        };
        setUsers([...users, newUser]);
      }
      
      setFormData({ firstName: '', lastName: '', email: '', mobile: '', countryCode: '+91' });
      setEditMode(false);
      setEditingUser(null);
      setAddUserOpen(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditMode(true);
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      countryCode: user.countryCode
    });
    setAddUserOpen(true);
  };

  const handleDialogClose = () => {
    setAddUserOpen(false);
    setEditMode(false);
    setEditingUser(null);
    setFormData({ firstName: '', lastName: '', email: '', mobile: '', countryCode: '+91' });
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.mobile;

  return (
    <>
      <Dialog open={addUserOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit User' : 'Add New User'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Enter last name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <div className="flex gap-2">
                <Select value={formData.countryCode} onValueChange={(value) => setFormData({ ...formData, countryCode: value })}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">+91</SelectItem>
                    <SelectItem value="+1">+1</SelectItem>
                    <SelectItem value="+44">+44</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="Enter mobile number"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={!isFormValid}>
              {editMode ? 'Update' : 'Add'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        <div className="flex justify-end gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload CSV
          </Button>
          <Button onClick={() => setAddUserOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        <Card className="overflow-hidden shadow-lg shadow-black/5">
          <div 
            className="overflow-y-auto"
            style={{ 
              maxHeight: `calc(100vh - 380px)`,
              height: users.length > 15 ? `calc(100vh - 380px)` : 'auto'
            }}
          >
            <Table className="w-full" style={{ tableLayout: 'fixed' }}>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                  <TableHead className="w-[10%] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Sr. No</TableHead>
                  <TableHead className="w-[25%] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Name</TableHead>
                  <TableHead className="w-[30%] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Email</TableHead>
                  <TableHead className="w-[20%] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Mobile</TableHead>
                  <TableHead className="w-[15%] font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="h-10 hover:bg-muted/50 transition-colors">
                    <TableCell className="font-mono text-sm font-medium py-2 border-r-0 text-foreground">{user.id}</TableCell>
                    <TableCell className="py-2 border-r-0">
                      <div className="font-medium text-sm text-foreground">
                        {user.firstName} {user.lastName}
                      </div>
                    </TableCell>
                    <TableCell className="py-2 border-r-0 text-sm text-foreground">{user.email}</TableCell>
                    <TableCell className="py-2 border-r-0 text-sm text-foreground">
                      {user.countryCode} {user.mobile}
                    </TableCell>
                    <TableCell className="py-2 border-r-0">
                      <div className="flex items-center gap-3">
                        <button 
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          onClick={() => handleEditUser(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-800 transition-colors">
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      </div>
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

export default UsersList;
