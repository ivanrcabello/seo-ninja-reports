
import React from 'react';
import { Info, Wrench, FileText, Link, MapPin, CheckCircle, Briefcase } from 'lucide-react';

interface SectionIconProps {
  sectionKey: string;
}

const SectionIcon: React.FC<SectionIconProps> = ({ sectionKey }) => {
  switch (sectionKey) {
    case 'executiveSummary':
      return <Info className="h-5 w-5 text-blue-500" />;
    case 'technicalAnalysis':
      return <Wrench className="h-5 w-5 text-green-500" />;
    case 'contentAnalysis':
      return <FileText className="h-5 w-5 text-purple-500" />;
    case 'backlinksAnalysis':
      return <Link className="h-5 w-5 text-amber-500" />;
    case 'localSeo':
      return <MapPin className="h-5 w-5 text-indigo-500" />;
    case 'recommendations':
      return <CheckCircle className="h-5 w-5 text-red-500" />;
    case 'serviceProposal':
      return <Briefcase className="h-5 w-5 text-teal-500" />;
    default:
      return null;
  }
};

export default SectionIcon;
