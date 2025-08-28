import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ExternalLink, ZoomIn, ZoomOut, RotateCw, Upload, Maximize2, FileText, ImageIcon } from 'lucide-react';

interface DocumentPreviewPanelProps {
  docUrl: string | undefined;
  docName: string | undefined;
  onHide: () => void;
  thumbnails?: React.ReactNode;
  status?: string;
  hoveredFieldId?: string | null;
}

const DocumentPreviewPanel: React.FC<DocumentPreviewPanelProps> = ({
  docUrl,
  docName,
  onHide,
  thumbnails,
  status,
  hoveredFieldId,
}) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [fitToWidth, setFitToWidth] = useState(false);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 300));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleFitToWidth = () => {
    setFitToWidth(!fitToWidth);
    setZoom(100);
  };
  
  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: '#212C4C' }}>
      {/* Main Document Area */}
      <div className="flex-1 flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-3" style={{ backgroundColor: '#1a2332' }}>
          <div className="text-sm font-medium text-white truncate max-w-md">{docName || "Document Preview"}</div>
          <div className="flex items-center gap-2">
            <span className="text-white text-xs">{zoom}%</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={handleZoomOut} className="text-white hover:text-gray-300 transition-colors p-1">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom Out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={handleZoomIn} className="text-white hover:text-gray-300 transition-colors p-1">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom In</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={handleFitToWidth} className={`transition-colors p-1 ${fitToWidth ? 'text-blue-400' : 'text-white hover:text-gray-300'}`}>
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Fit to Width</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={handleRotate} className="text-white hover:text-gray-300 transition-colors p-1">
                    <RotateCw className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Rotate Document</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Thumbnails Panel moved below header */}
        {thumbnails && (
          <div className="w-full" style={{ backgroundColor: '#212C4C' }}>
            {thumbnails}
          </div>
        )}
        
        {/* Image Preview */}
        <div className="flex-1 overflow-auto flex flex-col items-center justify-center px-1 py-2 relative" style={{ backgroundColor: '#212C4C' }}>
          {status === 'Missing Documents' && docName?.toLowerCase().includes('grn') ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <div className="bg-white/10 rounded-lg p-8 mb-4">
                <ImageIcon className="w-16 h-16 text-gray-500" />
              </div>
              <div className="text-sm text-white/70">No Doc</div>
            </div>
          ) : docUrl ? (
            <div className="relative">
              <img
                src={docUrl}
                alt="Document preview"
                className="object-contain shadow-lg"
                style={{ 
                  transform: `scale(${zoom/100}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease-in-out',
                  width: fitToWidth ? '100%' : 'auto',
                  maxWidth: fitToWidth ? '100%' : '80%',
                  maxHeight: fitToWidth ? 'auto' : '80%',
                  height: fitToWidth ? 'auto' : 'auto'
                }}
              />
              {/* Highlight overlays for hovered data */}
              {hoveredFieldId && (
                <>
                  {hoveredFieldId.includes('metadata') && (
                    <>
                      <div className="highlight absolute top-16 left-20">
                        <div className="highlight2"></div>
                      </div>
                      <div className="highlight absolute top-24 left-32">
                        <div className="highlight2"></div>
                      </div>
                    </>
                  )}
                  {hoveredFieldId.includes('lineitem') && (
                    <>
                      <div className="highlight absolute top-32 left-24">
                        <div className="highlight2"></div>
                      </div>
                      <div className="highlight absolute top-40 left-36">
                        <div className="highlight2"></div>
                      </div>
                      <div className="highlight absolute top-48 left-28">
                        <div className="highlight2"></div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FileText className="w-16 h-16 mb-4 opacity-50" />
              <div className="text-sm">No document to preview</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewPanel;
