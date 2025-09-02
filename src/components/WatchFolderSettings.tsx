import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit, Settings, Trash2, Plus } from 'lucide-react';
import HoverEditIcon from './HoverEditIcon';

interface WatchFolder {
  id: string;
  folderName: string;
  path: string;
  status: 'Active' | 'Inactive';
  processType: 'Auto-process' | 'Manual Review';
  lastChecked: string;
  documents: number;
}

const WatchFolderSettings = () => {
  const [folders] = useState<WatchFolder[]>([
    {
      id: '1',
      folderName: 'Invoices Inbox',
      path: '\\\\server\\shared\\invoices\\inbox',
      status: 'Active',
      processType: 'Auto-process',
      lastChecked: '2 mins ago',
      documents: 234
    },
    {
      id: '2',
      folderName: 'Purchase Orders',
      path: '\\\\server\\shared\\po\\incoming',
      status: 'Active',
      processType: 'Manual Review',
      lastChecked: '5 mins ago',
      documents: 156
    },
    {
      id: '3',
      folderName: 'Contracts Staging',
      path: '\\\\server\\shared\\contracts\\staging',
      status: 'Inactive',
      processType: 'Auto-process',
      lastChecked: '1 hour ago',
      documents: 45
    }
  ]);

  const [testConnectionPath, setTestConnectionPath] = useState('\\\\server\\shared\\invoices\\inbox');

  const getStatusBadge = (status: string) => {
    if (status === 'Active') {
      return <Badge variant="outline" className="bg-green-100 border-0" style={{ color: '#333333' }}>Active</Badge>;
    }
    return <Badge variant="outline" className="bg-gray-100 border-0" style={{ color: '#333333' }}>Inactive</Badge>;
  };

  const handleTestConnection = () => {
    // TODO: Implement test connection functionality
    console.log('Testing connection to:', testConnectionPath);
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
              <BreadcrumbPage>Watch Folder Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground font-inter">Watch Folder Settings</h1>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Watch Folder
        </Button>
      </div>

      {/* Test Connection Section */}
      <Card className="p-6 shadow-lg shadow-black/5">
        <div className="flex items-center gap-4">
          <Input
            placeholder="\\server\shared\invoices\inbox"
            value={testConnectionPath}
            onChange={(e) => setTestConnectionPath(e.target.value)}
            className="flex-1 font-mono text-sm"
          />
          <Button 
            onClick={handleTestConnection}
            variant="outline"
            className="whitespace-nowrap"
          >
            Test Connection
          </Button>
        </div>
      </Card>

      {/* Table with MatchingQueue styling */}
      <Card className="overflow-hidden shadow-lg shadow-black/5">
        <div 
          className="overflow-y-auto"
          style={{ 
            maxHeight: `calc(100vh - 320px)`,
            height: folders.length > 15 ? `calc(100vh - 320px)` : 'auto'
          }}
        >
          <Table className="min-w-full" style={{ tableLayout: 'fixed' }}>
            <TableHeader className="sticky top-0 z-10">
              <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
                <TableHead className="font-semibold w-[180px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Folder Name</TableHead>
                <TableHead className="font-semibold w-[300px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Path</TableHead>
                <TableHead className="font-semibold w-[140px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Status</TableHead>
                <TableHead className="font-semibold w-[140px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Process Type</TableHead>
                <TableHead className="font-semibold w-[120px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Last Checked</TableHead>
                <TableHead className="font-semibold w-[100px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Documents</TableHead>
                <TableHead className="font-semibold w-[140px] border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {folders.map((folder) => (
                <TableRow key={folder.id} className="h-10 hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium py-2 border-r-0 text-sm text-foreground truncate w-[180px]">{folder.folderName}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm py-2 border-r-0 truncate w-[300px]" title={folder.path}>
                    {folder.path}
                  </TableCell>
                  <TableCell className="py-2 border-r-0 w-[140px]">{getStatusBadge(folder.status)}</TableCell>
                  <TableCell className="py-2 border-r-0 text-sm text-foreground truncate w-[140px]">{folder.processType}</TableCell>
                  <TableCell className="text-muted-foreground py-2 border-r-0 text-sm truncate w-[120px]">{folder.lastChecked}</TableCell>
                  <TableCell className="font-medium py-2 border-r-0 text-sm text-foreground w-[100px]">{folder.documents}</TableCell>
                  <TableCell className="py-2 border-r-0 w-[140px]">
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Settings</p>
                        </TooltipContent>
                      </Tooltip>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      </div>
    </TooltipProvider>
  );
};

export default WatchFolderSettings;