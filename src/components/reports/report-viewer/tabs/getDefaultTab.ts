
import { Report } from '@/types/report.types';

export const getDefaultTab = (content: Report['content']) => {
  if (!content) return "executiveSummary";
  
  if (content.executiveSummary) return "executiveSummary";
  if (content.technicalAnalysis) return "technicalAnalysis";
  if (content.keywords) return "keywords";
  if (content.contentAnalysis) return "contentAnalysis";
  if (content.backlinksAnalysis) return "backlinksAnalysis";
  if (content.localSeo) return "localSeo";
  if (content.pageSpeedData) return "pageSpeedData";
  if (content.recommendations) return "recommendations";
  if (content.serviceProposal) return "serviceProposal";
  
  return "executiveSummary";
};
