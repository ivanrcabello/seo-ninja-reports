
import React from 'react';
import { formatReportContent } from '@/utils/reportUtils';

interface FormattedContentProps {
  content: string;
}

const FormattedContent: React.FC<FormattedContentProps> = ({ content }) => {
  const formattedHtml = formatReportContent(content);
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: formattedHtml }} 
      className="prose-headings:text-primary prose-strong:text-primary/90 prose-strong:font-semibold prose-li:my-1" 
    />
  );
};

export default FormattedContent;
