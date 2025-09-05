import React, { useState, useCallback } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, Grid3x3, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import FolderTreePanel from "./FolderTreePanel";
import DocumentListPanel from "./DocumentListPanel";
import CreateFolderWizard from "./CreateFolderWizard";
import DocumentDetailView from "./DocumentDetailView";
import { Document, FolderNode } from "@/types/storage";
import {
  mockFolderStructure,
  getMixedContentForFolder,
  getBreadcrumbPath,
} from "@/utils/storageData";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

const Storage: React.FC = () => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>("finance");
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(
    new Set()
  );
  const [viewMode, setViewMode] = useState<string>("list");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  // Get current folder data - both subfolders and documents
  const mixedContent = getMixedContentForFolder(selectedFolderId);
  const breadcrumbPath = getBreadcrumbPath(selectedFolderId);

  // For card view, get all folders from the tree structure
  const getAllFoldersFromTree = (node: any): any[] => {
    let allFolders = [node];
    if (node.children) {
      node.children.forEach((child: any) => {
        allFolders = allFolders.concat(getAllFoldersFromTree(child));
      });
    }
    return allFolders;
  };

  const allFolders = getAllFoldersFromTree(mockFolderStructure);

  const handleFolderSelect = useCallback((folderId: string) => {
    setSelectedFolderId(folderId);
    setSelectedDocuments(new Set()); // Clear selection when changing folders
  }, []);

  const handleDocumentSelect = useCallback((documentId: string) => {
    // Single document selection logic if needed
  }, []);

  const handleDocumentOpen = useCallback((document: Document) => {
    setSelectedDocument(document);
    toast.success(`Opening ${document.name}`);
  }, []);

  const handleSelectionChange = useCallback((selectedIds: Set<string>) => {
    setSelectedDocuments(selectedIds);
  }, []);

  const handleBreadcrumbClick = useCallback(
    (folderId: string) => {
      handleFolderSelect(folderId);
    },
    [handleFolderSelect]
  );

  const handleCreateFolder = useCallback(() => {
    setIsCreateFolderOpen(true);
  }, []);

  const handleCreateFolderComplete = useCallback(() => {
    setIsCreateFolderOpen(false);
    toast.success("Folder created successfully");
  }, []);

  const handleCreateFolderCancel = useCallback(() => {
    setIsCreateFolderOpen(false);
  }, []);

  const handleDocumentDetailClose = useCallback(() => {
    setSelectedDocument(null);
  }, []);

  // If document detail is open, show document viewer
  if (selectedDocument) {
    return (
      <DocumentDetailView
        document={selectedDocument}
        onClose={handleDocumentDetailClose}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="flex items-center justify-between py-1 px-4 pt-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground font-inter">
            Storage
          </h1>
        </div>

        {/* Search and View Mode Toggle */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>

          <TooltipProvider>
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) => {
                console.log("Toggle changed to:", value);
                if (value) {
                  setViewMode(value);
                  console.log("ViewMode set to:", value);
                }
              }}
              className="bg-background rounded-lg p-1 border h-9"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value="list"
                    aria-label="List view"
                    className={`data-[state=on]:text-primary data-[state=on]:border-primary data-[state=off]:bg-background data-[state=off]:text-muted-foreground data-[state=off]:border-transparent hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-md h-7 ${
                      viewMode !== "card" && "border-2"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>List view</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value="card"
                    aria-label="Card view"
                    className={`data-[state=on]:text-primary data-[state=on]:border-2 data-[state=on]:border-primary data-[state=off]:bg-background data-[state=off]:text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-md h-7 ${
                      viewMode === "card" && "border-2"
                    }`}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Card view</p>
                </TooltipContent>
              </Tooltip>
            </ToggleGroup>
          </TooltipProvider>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "card" ? (
          <DocumentListPanel
            folders={mixedContent.folders}
            documents={mixedContent.documents}
            breadcrumbPath={breadcrumbPath}
            selectedDocuments={selectedDocuments}
            onDocumentSelect={handleDocumentSelect}
            onDocumentOpen={handleDocumentOpen}
            onFolderSelect={handleFolderSelect}
            onSelectionChange={handleSelectionChange}
            onBreadcrumbClick={handleBreadcrumbClick}
            viewMode={viewMode}
          />
        ) : (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Left Panel - Folder Tree */}
            <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
              <FolderTreePanel
                rootFolder={mockFolderStructure}
                selectedFolderId={selectedFolderId}
                onFolderSelect={handleFolderSelect}
                onCreateFolder={handleCreateFolder}
              />
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Right Panel - Document List */}
            <ResizablePanel defaultSize={75}>
              <DocumentListPanel
                folders={mixedContent.folders}
                documents={mixedContent.documents}
                breadcrumbPath={breadcrumbPath}
                selectedDocuments={selectedDocuments}
                onDocumentSelect={handleDocumentSelect}
                onDocumentOpen={handleDocumentOpen}
                onFolderSelect={handleFolderSelect}
                onSelectionChange={handleSelectionChange}
                onBreadcrumbClick={handleBreadcrumbClick}
                viewMode={viewMode}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>

      {/* Create Folder Wizard */}
      {isCreateFolderOpen && (
        <CreateFolderWizard
          currentPath={breadcrumbPath}
          onComplete={handleCreateFolderComplete}
          onCancel={handleCreateFolderCancel}
        />
      )}
    </div>
  );
};

export default Storage;
