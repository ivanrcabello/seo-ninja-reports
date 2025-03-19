
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Check, Clock, Info } from 'lucide-react';

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
  let BadgeIcon = Info;
  
  if (priority.color.includes("red")) {
    badgeClass = "bg-red-100 text-red-800 border-red-200";
    badgeText = "Alta prioridad";
    BadgeIcon = AlertTriangle;
  } else if (priority.color.includes("amber")) {
    badgeClass = "bg-amber-100 text-amber-800 border-amber-200";
    badgeText = "Media prioridad";
    BadgeIcon = Clock;
  } else if (priority.color.includes("green")) {
    badgeClass = "bg-green-100 text-green-800 border-green-200";
    badgeText = "Baja prioridad";
    BadgeIcon = Check;
  } else {
    badgeClass = "bg-blue-100 text-blue-800 border-blue-200";
    badgeText = "Informativa";
    BadgeIcon = Info;
  }
  
  return (
    <Badge className={`${badgeClass} text-xs font-medium border whitespace-nowrap self-start flex-shrink-0 flex items-center gap-1.5`}>
      <BadgeIcon className="h-3 w-3" />
      <span>{badgeText}</span>
    </Badge>
  );
};

export default PriorityBadge;
