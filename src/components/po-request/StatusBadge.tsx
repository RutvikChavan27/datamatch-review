import React from "react";
import { Badge } from "@/components/ui/badge";
import { POStatus } from "@/types/po-types";
import { cn } from "@/lib/utils";
import {
  Check,
  Clock,
  X,
  AlertCircle,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

interface StatusBadgeProps {
  status: POStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = (status: POStatus) => {
    console.log("status ", status);
    switch (status) {
      case "submitted":
        return {
          color: "font-medium",
          label: "In Review",
          icon: Clock,
          style: { backgroundColor: "#FFEAB3", color: "#92400e" },
        };
      case "approved":
        return {
          color: "font-medium",
          label: "Approved",
          icon: CheckCircle,
          style: { backgroundColor: "#D1FAE5", color: "#047857" },
        };
      case "rejected":
        return {
          color: "font-medium",
          label: "Rejected",
          icon: X,
          style: { backgroundColor: "#FECACA", color: "#991B1B" },
        };
      case "query":
        return {
          color: "font-medium",
          label: "In Review",
          icon: Clock,
          style: { backgroundColor: "#FFEAB3", color: "#92400e" },
        };
      case "discussion":
        return {
          color: "font-medium",
          label: "Ready For Review",
          icon: Check,
          style: { backgroundColor: "#DBEAFE", color: "#1D4ED8" },
        };
      default:
        return {
          color: "font-medium",
          label: "Unknown",
          icon: AlertCircle,
          style: { backgroundColor: "#F3F4F6", color: "#374151" },
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
      style={style}
    >
      <Icon className="h-3 w-3 flex-shrink-0" />
      <span className="truncate">{label}</span>
    </Badge>
  );
};

export default StatusBadge;
