
import React from "react";
import { Edit } from "lucide-react";

const HoverEditIcon: React.FC<{ size?: number; className?: string }> = ({ size = 15, className = "" }) => (
  <Edit size={size} className={className + " text-blue-700"} />
);

export default HoverEditIcon;
