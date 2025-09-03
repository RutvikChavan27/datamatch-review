import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  List,
  Download,
  Share,
  Move,
  Trash2,
  FileText,
  FileSpreadsheet,
  Image,
  File,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Eye,
  Upload,
  Filter,
  Folder,
  FolderOpen,
  Archive,
  ChevronDown
} from 'lucide-react';
import { Document, FolderNode, ViewMode, SortField, SortOrder } from '@/types/storage';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';

interface DocumentListPanelProps {
  folders: FolderNode[];
  documents: Document[];
  breadcrumbPath: FolderNode[];
  selectedDocuments: Set<string>;
  onDocumentSelect: (documentId: string) => void;
  onDocumentOpen: (document: Document) => void;
  onFolderSelect: (folderId: string) => void;
  onSelectionChange: (selectedIds: Set<string>) => void;
  onBreadcrumbClick: (folderId: string) => void;
  viewMode?: string;
}

const getFileIcon = (type: Document['type']) => {
  switch (type) {
    case 'pdf': return FileText;
    case 'xls': return FileSpreadsheet;
    case 'img': return Image;
    case 'doc': return FileText;
    default: return File;
  }
};

const getFileTypeColor = (type: Document['type']) => {
  switch (type) {
    case 'pdf': return 'text-red-600 bg-red-50';
    case 'xls': return 'text-green-600 bg-green-50';
    case 'img': return 'text-blue-600 bg-blue-50';
    case 'doc': return 'text-indigo-600 bg-indigo-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const getWorkflowStatusColor = (status?: Document['workflowStatus']) => {
  switch (status) {
    case 'completed': return 'text-green-600 bg-green-50';
    case 'processing': return 'text-blue-600 bg-blue-50';
    case 'pending': return 'text-yellow-600 bg-yellow-50';
    case 'failed': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const DocumentListPanel: React.FC<DocumentListPanelProps> = ({
  folders,
  documents,
  breadcrumbPath,
  selectedDocuments,
  onDocumentSelect,
  onDocumentOpen,
  onFolderSelect,
  onSelectionChange,
  onBreadcrumbClick,
  viewMode = 'list'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('modified');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterType, setFilterType] = useState<string>('all');

  // Combine folders and documents for mixed content
  type MixedItem = (FolderNode & { itemType: 'folder' }) | (Document & { itemType: 'document' });
  
  const mixedContent = useMemo((): MixedItem[] => {
    const folderItems: MixedItem[] = folders.map(folder => ({ ...folder, itemType: 'folder' as const }));
    const documentItems: MixedItem[] = documents.map(doc => ({ ...doc, itemType: 'document' as const }));
    return [...folderItems, ...documentItems];
  }, [folders, documents]);

  // Filter and sort mixed content
  const filteredAndSortedContent = useMemo(() => {
    let filtered = mixedContent.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterType !== 'all') {
      filtered = filtered.filter(item => 
        item.itemType === 'document' && (item as Document).type === filterType
      );
    }

    filtered.sort((a, b) => {
      // Always show folders first
      if (a.itemType === 'folder' && b.itemType === 'document') return -1;
      if (a.itemType === 'document' && b.itemType === 'folder') return 1;
      
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'type':
          if (a.itemType === 'folder' && b.itemType === 'folder') {
            comparison = a.type.localeCompare(b.type);
          } else if (a.itemType === 'document' && b.itemType === 'document') {
            comparison = (a as Document).type.localeCompare((b as Document).type);
          }
          break;
        case 'size':
          if (a.itemType === 'folder' && b.itemType === 'folder') {
            comparison = a.size.localeCompare(b.size);
          } else if (a.itemType === 'document' && b.itemType === 'document') {
            comparison = (a as Document).size.localeCompare((b as Document).size);
          }
          break;
        case 'modified':
          if (a.itemType === 'document' && b.itemType === 'document') {
            comparison = (a as Document).modified.getTime() - (b as Document).modified.getTime();
          } else if (a.itemType === 'folder' && b.itemType === 'folder') {
            comparison = a.created.getTime() - b.created.getTime();
          }
          break;
        case 'created':
          comparison = a.created.getTime() - b.created.getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [mixedContent, searchTerm, sortField, sortOrder, filterType]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const documentIds = filteredAndSortedContent
        .filter(item => item.itemType === 'document')
        .map(item => item.id);
      onSelectionChange(new Set(documentIds));
    } else {
      onSelectionChange(new Set());
    }
  };

  const handleDocumentCheck = (documentId: string, checked: boolean) => {
    const newSelection = new Set(selectedDocuments);
    if (checked) {
      newSelection.add(documentId);
    } else {
      newSelection.delete(documentId);
    }
    onSelectionChange(newSelection);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const renderTableView = () => (
    <div className="shadow-lg shadow-black/5">
      <div className="rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50">
            <TableHead className="w-12 font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>
              <Checkbox
                checked={selectedDocuments.size === documents.length && documents.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="cursor-pointer font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }} onClick={() => handleSort('name')}>
              <div className="flex items-center space-x-2">
                <span>Name</span>
                <SortIcon field="name" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }} onClick={() => handleSort('type')}>
              <div className="flex items-center space-x-2">
                <span>Type</span>
                <SortIcon field="type" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }} onClick={() => handleSort('size')}>
              <div className="flex items-center space-x-2">
                <span>Size</span>
                <SortIcon field="size" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }} onClick={() => handleSort('modified')}>
              <div className="flex items-center space-x-2">
                <span>Modified</span>
                <SortIcon field="modified" />
              </div>
            </TableHead>
            <TableHead className="font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}>Created By</TableHead>
            <TableHead className="w-12 font-semibold border-r-0 text-sm text-foreground h-12 border-b border-t" style={{ backgroundColor: '#DFE7F3', borderBottomColor: '#c9d1e0', borderTopColor: '#c9d1e0' }}></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedContent.map((item) => {
            if (item.itemType === 'folder') {
              const folder = item as FolderNode & { itemType: 'folder' };
              const FolderIcon = folder.type === 'archived' ? Archive : Folder;
              return (
                <TableRow 
                  key={`folder-${folder.id}`} 
                  className="h-10 hover:bg-muted/50 transition-colors cursor-pointer bg-white"
                  onClick={() => onFolderSelect(folder.id)}
                >
                  <TableCell className="py-2 border-r-0 text-sm text-foreground">
                    {/* Empty for folders - can't select folders */}
                  </TableCell>
                  <TableCell className="py-2 border-r-0 text-sm text-foreground">
                    <div className="flex items-center space-x-2">
                      <FolderIcon className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">{folder.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 border-r-0 text-sm text-foreground">
                    <Badge variant="outline" className="text-blue-600 bg-blue-50">
                      {folder.type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2 border-r-0 text-sm text-foreground">{folder.size}</TableCell>
                  <TableCell className="py-2 border-r-0 text-sm text-foreground">
                    {format(folder.created, 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="py-2 border-r-0 text-sm text-foreground">{folder.createdBy}</TableCell>
                  <TableCell className="py-2 border-r-0 text-sm">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-8 h-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFolderSelect(folder.id);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            } else {
              const document = item as Document & { itemType: 'document' };
              const FileIcon = getFileIcon(document.type);
              return (
                <TableRow 
                  key={`doc-${document.id}`} 
                  className="h-10 hover:bg-muted/50 transition-colors cursor-pointer bg-white"
                  onClick={() => onDocumentOpen(document)}
                >
                  <TableCell className="py-2 border-r-0 text-sm text-foreground" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedDocuments.has(document.id)}
                      onCheckedChange={(checked) => handleDocumentCheck(document.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="py-2 border-r-0 text-sm text-foreground">
                    <div className="flex items-center space-x-2">
                      <FileIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{document.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 border-r-0 text-sm text-foreground">
                    <Badge variant="outline" className={getFileTypeColor(document.type)}>
                      {document.type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2 border-r-0 text-sm text-foreground">{document.size}</TableCell>
                  <TableCell className="py-2 border-r-0 text-sm text-foreground">
                    {format(document.modified, 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="py-2 border-r-0 text-sm text-foreground">User name</TableCell>
                  <TableCell className="py-2 border-r-0 text-sm" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-8 h-8 p-0"
                        onClick={() => onDocumentOpen(document)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onDocumentOpen(document)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Open
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share className="w-4 h-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Move className="w-4 h-4 mr-2" />
                            Move
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            }
          })}
        </TableBody>
      </Table>
      </div>
    </div>
  );

  const renderCardView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
      {filteredAndSortedContent.map((item) => {
        if (item.itemType === 'folder') {
          const folder = item as FolderNode & { itemType: 'folder' };
          const FolderIcon = folder.type === 'archived' ? Archive : Folder;
          const subfolderCount = folder.children?.length || 0;
          const fileCount = folder.docCount || 0;
          
          return (
             <Card 
               key={`folder-${folder.id}`} 
               className="cursor-pointer hover:shadow-md transition-all duration-200 border border-border hover:border-primary/30 bg-card relative group"
               onClick={() => onFolderSelect(folder.id)}
             >
                <CardContent className="p-3">
                  {/* Folder icon and details */}
                  <div className="flex items-start space-x-3">
                   {/* Folder icon - left */}
                   <div className="flex-shrink-0">
                     <div className="w-8 h-8 rounded-md flex items-center justify-center text-blue-600 bg-blue-50">
                       <FolderIcon className="w-4 h-4" />
                     </div>
                   </div>
                   
                   {/* Folder details - right */}
                   <div className="flex-1 min-w-0">
                     <h3 className="text-sm font-medium text-foreground truncate" title={folder.name}>
                       {folder.name}
                     </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {folder.size} • {subfolderCount} Folder{subfolderCount !== 1 ? 's' : ''}, {fileCount} File{fileCount !== 1 ? 's' : ''}
                      </p>
                     <p className="text-xs text-muted-foreground mt-1">
                       {format(folder.created, 'MMM dd, yyyy')}
                     </p>
                   </div>
                 </div>
              </CardContent>
            </Card>
          );
        } else {
          const document = item as Document & { itemType: 'document' };
          const FileIcon = getFileIcon(document.type);
          return (
            <Card 
              key={`doc-${document.id}`} 
              className="cursor-pointer hover:shadow-md transition-all duration-200 border border-border hover:border-primary/30 bg-card relative group"
              onClick={() => onDocumentOpen(document)}
            >
               <CardContent className="p-3">
                  {/* Checkbox for selection - top right */}
                   <div 
                     className={`absolute top-2 right-2 transition-opacity z-10 ${
                       hasSelectedDocuments ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                     }`}
                     onClick={(e) => e.stopPropagation()}
                   >
                   <Checkbox
                     checked={selectedDocuments.has(document.id)}
                     onCheckedChange={(checked) => handleDocumentCheck(document.id, checked as boolean)}
                   />
                 </div>
                 
                 {/* Document icon and details */}
                 <div className="flex items-start space-x-3">
                   {/* Document icon - left */}
                   <div className="flex-shrink-0">
                     <div className={`w-8 h-8 rounded-md flex items-center justify-center ${getFileTypeColor(document.type)}`}>
                       <FileIcon className="w-4 h-4" />
                     </div>
                   </div>
                   
                    {/* Document details - right */}
                    <div className="flex-1 min-w-0 pr-8">
                      <h3 className="text-sm font-medium text-foreground truncate" title={document.name}>
                        {document.name}
                      </h3>
                     <p className="text-xs text-muted-foreground mt-1">
                       {document.size}
                     </p>
                     <p className="text-xs text-muted-foreground mt-1">
                       {format(document.modified, 'MMM dd, yyyy')}
                     </p>
                   </div>
                 </div>
              </CardContent>
            </Card>
          );
        }
      })}
    </div>
  );

  const hasSelectedDocuments = selectedDocuments.size > 0;

  return (
    <div className="h-full flex flex-col">
      {/* Header Section with Folder Title and Breadcrumb */}
      <div className="border-b border-border px-4 pt-4 pb-1">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            {breadcrumbPath.map((folder, index) => (
              <React.Fragment key={folder.id}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {index === breadcrumbPath.length - 1 ? (
                    <BreadcrumbPage>{folder.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onBreadcrumbClick(folder.id);
                      }}
                      className="cursor-pointer"
                    >
                      {folder.name}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
         </Breadcrumb>

      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Folder Title */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">
            {breadcrumbPath.length > 0 ? breadcrumbPath[breadcrumbPath.length - 1].name : 'All Files'}
          </h1>
          
          {/* Bulk Actions Dropdown */}
          {hasSelectedDocuments && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {selectedDocuments.size} document{selectedDocuments.size > 1 ? 's' : ''} selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0 hover:bg-muted"
                  onClick={() => onSelectionChange(new Set())}
                >
                  ✕
                </Button>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    Bulk Actions
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Move className="w-4 h-4 mr-2" />
                    Move Files
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        
        {filteredAndSortedContent.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <FileText className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No items found</p>
            <p className="text-sm">
              {searchTerm ? 'Try adjusting your search terms' : 'This folder is empty'}
            </p>
          </div>
        ) : (
          <>
            {console.log('Rendering with viewMode:', viewMode)}
            {viewMode === 'card' ? renderCardView() : renderTableView()}
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentListPanel;