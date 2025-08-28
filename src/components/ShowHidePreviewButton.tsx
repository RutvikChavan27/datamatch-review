
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface ShowHidePreviewButtonProps {
  previewVisible: boolean;
  onClick: () => void;
}
const ShowHidePreviewButton: React.FC<ShowHidePreviewButtonProps> = ({ previewVisible, onClick }) => (
  <Button
    variant="ghost"
    size="sm"
    className={`
      flex items-center gap-2 transition-all duration-300 z-50
      ${previewVisible 
        ? 'h-8 px-3 ml-2 relative' 
        : 'fixed left-0 top-1/2 -translate-y-1/2 h-10 w-10 px-0 rounded-none rounded-r-md'
      }
      ${!previewVisible ? 'text-white hover:text-white' : ''}
    `}
    style={!previewVisible ? { backgroundColor: '#212C4C' } : {}}
    onClick={onClick}
    title={previewVisible ? "Hide preview" : "Show preview"}
    aria-label={previewVisible ? "Hide preview" : "Show preview"}
  >
    {previewVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    {previewVisible && (
      <span className="hidden md:inline font-medium">
        Hide Preview
      </span>
    )}
  </Button>
);

export default ShowHidePreviewButton;
