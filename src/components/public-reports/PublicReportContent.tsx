
import React from 'react';
import { PublicReport } from './useReportData';

interface PublicReportContentProps {
  report: PublicReport;
}

const PublicReportContent: React.FC<PublicReportContentProps> = ({ report }) => {
  // Function to render content sections from JSON
  const renderContent = (content: any) => {
    if (!content) return null;
    
    return (
      <div className="space-y-8">
        {Array.isArray(content) ? (
          content.map((section, index) => (
            <div key={index} className="space-y-4">
              <h2 className="text-xl font-bold">{section.title || 'Sección'}</h2>
              {section.content && (
                <div className="prose max-w-none dark:prose-invert">
                  {typeof section.content === 'string' ? (
                    <p>{section.content}</p>
                  ) : (
                    <pre className="text-sm overflow-x-auto p-4 bg-muted rounded-md">
                      {JSON.stringify(section.content, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="prose max-w-none dark:prose-invert">
            <pre className="text-sm overflow-x-auto p-4 bg-muted rounded-md">
              {JSON.stringify(content, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {report.summary && (
        <div className="bg-primary/5 p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Resumen Ejecutivo</h2>
          <p>{report.summary}</p>
        </div>
      )}
      
      {renderContent(report.content)}
    </div>
  );
};

export default PublicReportContent;
