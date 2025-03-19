
import React from 'react';
import { Info, CheckCircle, ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react';

interface SectionIconProps {
  sectionKey: string;
}

const SectionIcon: React.FC<SectionIconProps> = ({ sectionKey }) => {
  switch (sectionKey) {
    case 'executiveSummary':
      return <Info className="h-5 w-5 text-blue-500" />;
    case 'technicalAnalysis':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'contentAnalysis':
      return <ArrowUp className="h-5 w-5 text-purple-500" />;
    case 'backlinksAnalysis':
      return <ArrowDown className="h-5 w-5 text-amber-500" />;
    case 'recommendations':
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    default:
      return null;
  }
};

export default SectionIcon;
