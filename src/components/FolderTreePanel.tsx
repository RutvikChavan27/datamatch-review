import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  HardDrive, 
  FolderOpen, 
  Folder, 
  Plus, 
  ChevronRight, 
  ChevronDown, 
  MoreHorizontal,
  Building2,
  Archive,
  Star
} from 'lucide-react';
import { FolderNode } from '@/types/storage';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FolderTreePanelProps {
  rootFolder: FolderNode;
  selectedFolderId?: string;
  onFolderSelect: (folderId: string) => void;
  onCreateFolder: () => void;
}

interface FolderItemProps {
  folder: FolderNode;
  level: number;
  isSelected: boolean;
  selectedFolderId?: string;
  onSelect: (folderId: string) => void;
  expandedFolders: Set<string>;
  onToggleExpand: (folderId: string) => void;
}

const getFolderIcon = (folder: FolderNode, isExpanded: boolean) => {
  if (folder.type === 'storage') return HardDrive;
  if (folder.type === 'department') return isExpanded ? FolderOpen : Folder;
  if (folder.type === 'archived') return Archive;
  return isExpanded ? FolderOpen : Folder;
};

const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  level,
  isSelected,
  selectedFolderId,
  onSelect,
  expandedFolders,
  onToggleExpand
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = folder.children && folder.children.length > 0;
  const isExpanded = expandedFolders.has(folder.id);
  const Icon = getFolderIcon(folder, isExpanded);

  const handleClick = () => {
    onSelect(folder.id);
    if (hasChildren) {
      onToggleExpand(folder.id);
    }
  };

  const handleMoreOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div>
      <div
        className={`px-2 py-2 cursor-pointer rounded-md transition-colors duration-200 group relative border ${
          isSelected 
            ? 'bg-primary/10 border-primary/20 text-primary' 
            : 'hover:bg-muted/50 border-transparent'
        }`}
        style={{ paddingLeft: `${8 + level * 16}px` }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* First Row - Folder Name and Controls */}
        <div className="flex items-center">
          {/* Expand/Collapse Icon */}
          <div className="w-4 flex justify-center mr-1">
            {hasChildren && (
              <Button
                variant="ghost"
                size="sm"
                className="w-4 h-4 p-0 hover:bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(folder.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </Button>
            )}
          </div>

          {/* Folder Icon */}
          <Icon className={`w-4 h-4 mr-2 flex-shrink-0 ${
            folder.type === 'storage' ? 'text-slate-600' :
            folder.type === 'department' ? 'text-blue-600' :
            folder.type === 'archived' ? 'text-amber-600' :
            'text-blue-600'
          }`} />

          {/* Folder Name */}
          <span className="flex-1 text-sm font-medium truncate">
            {folder.name}
          </span>

          {/* More Options Button */}
          {(isHovered || isSelected) && folder.id !== 'root' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={handleMoreOptions}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Subfolder
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="w-4 h-4 mr-2" />
                  Add to Favorites
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Rename Folder
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Properties
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Second Row - Size and Document Count */}
        <div className="flex items-center gap-1 ml-11 text-xs text-muted-foreground mt-1">
          <span className="font-medium">{folder.size}</span>
          <span>•</span>
          <span className="font-medium">{folder.docCount.toLocaleString()}</span>
          <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ml-2">
          {folder.children!.map((child) => (
            <FolderItem
              key={child.id}
              folder={child}
              level={level + 1}
              isSelected={child.id === selectedFolderId}
              selectedFolderId={selectedFolderId}
              onSelect={onSelect}
              expandedFolders={expandedFolders}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FolderTreePanel: React.FC<FolderTreePanelProps> = ({
  rootFolder,
  selectedFolderId,
  onFolderSelect,
  onCreateFolder
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['root', 'finance', 'hr', 'operations', 'it', 'legal'])
  );

  const handleToggleExpand = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  return (
    <div className="h-full flex flex-col bg-white border border-border rounded-lg shadow-sm mb-2">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 border-b border-border rounded-t-lg">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Folders</h2>
          <Button size="sm" onClick={onCreateFolder}>
            <Plus className="w-4 h-4 mr-2" />
            Create Folder
          </Button>
        </div>
      </div>

      {/* Folder Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        <FolderItem
          folder={rootFolder}
          level={0}
          isSelected={rootFolder.id === selectedFolderId}
          selectedFolderId={selectedFolderId}
          onSelect={onFolderSelect}
          expandedFolders={expandedFolders}
          onToggleExpand={handleToggleExpand}
        />
      </div>

      {/* Storage Info */}
      <div className="p-4 border-t border-border bg-muted/20 rounded-b-lg">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Total Documents:</span>
            <span className="font-medium">{rootFolder.docCount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Storage Used:</span>
            <span className="font-medium">{rootFolder.size}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderTreePanel;