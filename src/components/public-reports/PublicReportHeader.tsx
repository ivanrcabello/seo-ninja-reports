
import React from 'react';
import { Calendar, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PublicReport } from './useReportData';

interface PublicReportHeaderProps {
  report: PublicReport;
}

const PublicReportHeader: React.FC<PublicReportHeaderProps> = ({ report }) => {
  // Format the date properly
  const formattedDate = report.date ? 
    format(new Date(report.date), 'dd MMMM yyyy', { locale: es }) : 
    'Sin fecha';

  return (
    <div className="text-center mb-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        {report.title}
      </h1>
      
      <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6 text-muted-foreground">
        {report.url && (
          <div className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            <a 
              href={report.url.startsWith('http') ? report.url : `https://${report.url}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              {report.url.replace(/^https?:\/\//i, '')}
            </a>
          </div>
        )}
        
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          {formattedDate}
        </div>
      </div>
      
      {report.client_name && (
        <div className="mt-4 text-sm bg-muted py-2 px-4 rounded-full inline-block">
          Preparado para <span className="font-medium">{report.client_name}</span>
        </div>
      )}
    </div>
  );
};

export default PublicReportHeader;
