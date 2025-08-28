import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  pages?: number;
  previewUrl?: string;
}

interface PODocumentsTabProps {
  selectedPO: {
    documents?: Document[];
  };
}

const PODocumentsTab: React.FC<PODocumentsTabProps> = ({ selectedPO }) => {
  const documents = selectedPO.documents || [];

  const handlePreview = (document: Document) => {
    if (document.previewUrl) {
      window.open(document.previewUrl, '_blank');
    }
  };

  const handleDownload = (document: Document) => {
    console.log('Downloading:', document.name);
  };

  if (documents.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No documents available
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((document) => (
          <div
            key={document.id}
            className="border rounded-lg p-4 hover:border-primary/50 transition-colors bg-background"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {document.name}
                </h4>
                <div className="mt-1 text-xs text-muted-foreground space-y-1">
                  <div>{document.type} • {document.size}</div>
                  <div>Uploaded {document.uploadDate}</div>
                  {document.pages && <div>{document.pages} pages</div>}
                </div>
                <div className="mt-3 flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePreview(document)}
                    className="flex-1"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(document)}
                    className="flex-1"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PODocumentsTab;