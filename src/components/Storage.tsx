import React, { useState, useCallback } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import FolderTreePanel from './FolderTreePanel';
import DocumentListPanel from './DocumentListPanel';
import CreateFolderWizard from './CreateFolderWizard';
import DocumentDetailView from './DocumentDetailView';
import { Document, FolderNode } from '@/types/storage';
import { mockFolderStructure, getMixedContentForFolder, getBreadcrumbPath } from '@/utils/storageData';
import { toast } from 'sonner';

const Storage: React.FC = () => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>('finance');
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Get current folder data - both subfolders and documents
  const mixedContent = getMixedContentForFolder(selectedFolderId);
  const breadcrumbPath = getBreadcrumbPath(selectedFolderId);

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


  const handleBreadcrumbClick = useCallback((folderId: string) => {
    handleFolderSelect(folderId);
  }, [handleFolderSelect]);

  const handleCreateFolder = useCallback(() => {
    setIsCreateFolderOpen(true);
  }, []);

  const handleCreateFolderComplete = useCallback(() => {
    setIsCreateFolderOpen(false);
    toast.success('Folder created successfully');
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
          <h1 className="text-xl font-semibold text-foreground font-inter">Storage</h1>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
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
            />
          </ResizablePanel>
        </ResizablePanelGroup>
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