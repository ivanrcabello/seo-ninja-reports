
import React from 'react';
import { 
  FileBarChart, 
  Layers, 
  SearchCode, 
  KeyRound, 
  FileText, 
  Globe, 
  CheckCircle2, 
  Sparkles,
  Building
} from 'lucide-react';

interface SectionIconProps {
  sectionKey: string;
}

const SectionIcon: React.FC<SectionIconProps> = ({ sectionKey }) => {
  switch (sectionKey) {
    case 'executiveSummary':
      return <FileBarChart className="h-5 w-5 text-blue-500" />;
    case 'technicalAnalysis':
      return <SearchCode className="h-5 w-5 text-green-500" />;
    case 'contentAnalysis':
      return <FileText className="h-5 w-5 text-purple-500" />;
    case 'keywords':
      return <KeyRound className="h-5 w-5 text-cyan-500" />;
    case 'backlinksAnalysis':
      return <Layers className="h-5 w-5 text-amber-500" />;
    case 'localSeo':
      return <Globe className="h-5 w-5 text-indigo-500" />;
    case 'recommendations':
      return <CheckCircle2 className="h-5 w-5 text-red-500" />;
    case 'serviceProposal':
      return <Sparkles className="h-5 w-5 text-yellow-500" />;
    case 'businessProfile':
      return <Building className="h-5 w-5 text-teal-500" />;
    default:
      return null;
  }
};

export default SectionIcon;
