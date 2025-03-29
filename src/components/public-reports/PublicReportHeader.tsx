
import React from 'react';
import { PublicReport } from './useReportData';
import { CalendarIcon, GlobeIcon } from 'lucide-react';
import { format } from 'date-fns';

interface PublicReportHeaderProps {
  report: PublicReport;
}

export const PublicReportHeader: React.FC<PublicReportHeaderProps> = ({ report }) => {
  return (
    <div className="p-6 bg-gradient-to-b from-primary/10 to-background border-b border-primary/10">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        {report.title}
      </h1>
      
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm">
        <div className="flex items-center">
          <span className="font-medium">Cliente:</span>
          <span className="ml-2">{report.client_name}</span>
        </div>
        
        {report.website && (
          <div className="flex items-center">
            <GlobeIcon className="h-4 w-4 mr-1 text-muted-foreground" />
            <a 
              href={report.website.startsWith('http') ? report.website : `https://${report.website}`} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline">
              {report.website.replace(/^(https?:\/\/)?(www\.)?/i, '')}
            </a>
          </div>
        )}
        
        <div className="flex items-center text-muted-foreground">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>{format(new Date(report.created_at), 'dd/MM/yyyy')}</span>
        </div>
      </div>
    </div>
  );
};
