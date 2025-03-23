
import React from 'react';
import { AlertTriangle, XCircle, Info } from 'lucide-react';

export const getIssueTypeIcon = (issueType: string) => {
  if (issueType.includes('missing')) {
    return <XCircle className="h-4 w-4 text-red-500" />;
  } else if (issueType.includes('too_long')) {
    return <AlertTriangle className="h-4 w-4 text-orange-500" />;
  } else if (issueType.includes('too_short')) {
    return <AlertTriangle className="h-4 w-4 text-orange-500" />;
  } else if (issueType.includes('error')) {
    return <XCircle className="h-4 w-4 text-red-500" />;
  } else {
    return <Info className="h-4 w-4 text-blue-500" />;
  }
};

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-orange-100 text-orange-800';
    case 'low':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
