import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface FloatingTooltipProps {
  isVisible: boolean;
  message: string;
  targetSelector?: string;
  className?: string;
}

export const FloatingTooltip: React.FC<FloatingTooltipProps> = ({
  isVisible,
  message,
  targetSelector,
  className
}) => {
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isVisible && targetSelector) {
      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        // Always position on the right
        const top = rect.top + scrollTop + rect.height / 2;
        const left = rect.right + scrollLeft + 10;
        
        setTooltipPosition({ top, left });
      }
    }
  }, [isVisible, targetSelector]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed z-50 transform -translate-x-1/2 -translate-y-1/2",
        "bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg",
        "text-sm font-medium max-w-xs",
        "animate-in fade-in-0 zoom-in-95 duration-200",
        className
      )}
      style={{
        top: tooltipPosition.top,
        left: tooltipPosition.left,
      }}
    >
      {/* Arrow - always on the left since tooltip is on the right */}
      <div className="absolute w-3 h-3 bg-gray-900 transform rotate-45 top-1/2 right-full -translate-y-1/2 -mr-1.5" />
      {message}
    </div>
  );
};