
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PriorityBadgeProps {
  priority: {
    color: string;
    background: string;
    border: string;
    icon?: string;
  };
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  let badgeClass = "";
  let badgeText = "";
  
  if (priority.color.includes("red")) {
    badgeClass = "bg-red-100 text-red-800 border-red-200";
    badgeText = "Alta prioridad";
  } else if (priority.color.includes("amber")) {
    badgeClass = "bg-amber-100 text-amber-800 border-amber-200";
    badgeText = "Media prioridad";
  } else if (priority.color.includes("green")) {
    badgeClass = "bg-green-100 text-green-800 border-green-200";
    badgeText = "Baja prioridad";
  } else {
    badgeClass = "bg-blue-100 text-blue-800 border-blue-200";
    badgeText = "Informativa";
  }
  
  return (
    <Badge className={`${badgeClass} text-xs font-medium border whitespace-nowrap self-start flex-shrink-0`}>
      {badgeText}
    </Badge>
  );
};

export default PriorityBadge;
