
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { POStatus } from '@/types/po-types';
import { cn } from '@/lib/utils';
import { Check, Clock, X, AlertCircle, MessageSquare, CheckCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: POStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = (status: POStatus) => {
    switch (status) {
      case 'submitted':
        return { 
          color: 'text-yellow-800 font-medium', 
          label: 'In Review',
          icon: Clock,
          style: { backgroundColor: '#FFEAB3' }
        };
      case 'approved':
        return { 
          color: 'bg-emerald-100 text-emerald-700 font-medium', 
          label: 'Approved',
          icon: CheckCircle
        };
      case 'rejected':
        return { 
          color: 'bg-red-100 text-red-700 font-medium', 
          label: 'Rejected',
          icon: X
        };
      case 'query':
        return { 
          color: 'text-yellow-800 font-medium', 
          label: 'In Review',
          icon: Clock,
          style: { backgroundColor: '#FFEAB3' }
        };
      case 'discussion':
        return { 
          color: 'bg-blue-100 text-blue-700 font-medium', 
          label: 'Ready For Review',
          icon: Check
        };
      default:
        return { 
          color: 'bg-gray-200 text-gray-700', 
          label: 'Unknown',
          icon: AlertCircle
        };
    }
  };

  const { color, label, icon: Icon, style } = getStatusConfig(status);

  return (
    <Badge 
      className={cn(
        "inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full font-medium text-xs tracking-wide whitespace-nowrap pointer-events-none",
        color,
        className
      )}
      style={{ ...style, color: '#333333' }}
    >
      <Icon className="h-3 w-3 flex-shrink-0" />
      <span className="truncate">{label}</span>
    </Badge>
  );
};

export default StatusBadge;
