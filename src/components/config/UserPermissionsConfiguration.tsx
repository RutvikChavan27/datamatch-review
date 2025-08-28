
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UserPermissionsConfiguration = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      role: 'Finance Manager',
      permissions: ['Upload Documents', 'Process Reviews', 'Final Approval', 'Override Rules']
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Data Entry Clerk',
      permissions: ['Upload Documents']
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      role: 'Finance Staff',
      permissions: ['Upload Documents', 'Process Reviews']
    },
    {
      id: 4,
      name: 'Lisa Brown',
      email: 'lisa.brown@company.com',
      role: 'System Administrator',
      permissions: ['Upload Documents', 'Process Reviews', 'Final Approval', 'Override Rules', 'System Admin']
    }
  ]);

  const { toast } = useToast();

  const permissionCategories = {
    'Upload Documents': 'Data entry clerks, receiving staff',
    'Process Reviews': 'Finance staff, auditors',
    'Final Approval': 'Finance managers, controllers',
    'Override Rules': 'Senior managers, controllers',
    'System Admin': 'IT administrators, system managers'
  };

  const handleSave = () => {
    toast({
      title: 'User Permissions Saved',
      description: 'User access levels have been updated successfully.',
    });
  };

  const getPermissionBadgeColor = (permission: string) => {
    switch (permission) {
      case 'System Admin': return 'bg-red-100 text-red-800';
      case 'Final Approval': return 'bg-purple-100 text-purple-800';
      case 'Override Rules': return 'bg-orange-100 text-orange-800';
      case 'Process Reviews': return 'bg-blue-100 text-blue-800';
      case 'Upload Documents': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Permission Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(permissionCategories).map(([permission, description]) => (
              <div key={permission} className="flex items-start justify-between p-3 border rounded-lg">
                <div>
                  <Badge className={getPermissionBadgeColor(permission)}>{permission}</Badge>
                  <p className="text-sm text-gray-600 mt-1">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User Access Management</CardTitle>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.map((permission) => (
                        <Badge
                          key={permission}
                          variant="outline"
                          className={`text-xs ${getPermissionBadgeColor(permission)}`}
                        >
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save User Permissions</Button>
      </div>
    </div>
  );
};

export default UserPermissionsConfiguration;
