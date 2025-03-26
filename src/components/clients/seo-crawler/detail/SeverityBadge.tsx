
import React from 'react';
import { Badge } from '@/components/ui/badge';

type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'info' | string;

interface SeverityBadgeProps {
  severity: SeverityLevel;
  showLabel?: boolean;
}

const SeverityBadge: React.FC<SeverityBadgeProps> = ({ 
  severity,
  showLabel = true 
}) => {
  let variant: 
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'warning';
  
  let label = severity;
  
  // Normalize severity
  const normalizedSeverity = severity.toLowerCase();
  
  switch (normalizedSeverity) {
    case 'critical':
      variant = 'destructive';
      label = 'crítico';
      break;
    case 'high':
      variant = 'destructive';
      label = 'alta';
      break;
    case 'medium':
      variant = 'warning';
      label = 'media';
      break;
    case 'low':
      variant = 'secondary';
      label = 'baja';
      break;
    case 'info':
      variant = 'outline';
      label = 'informativa';
      break;
    default:
      variant = 'outline';
  }
  
  return (
    <Badge variant={variant} className="capitalize">
      {showLabel ? label : ''}
    </Badge>
  );
};

export default SeverityBadge;
