
import React from 'react';
import { CalendarDays, Link2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PublicReport } from './useReportData';

interface PublicReportHeaderProps {
  report: PublicReport;
}

const PublicReportHeader: React.FC<PublicReportHeaderProps> = ({ report }) => {
  return (
    <div className="w-full max-w-5xl mx-auto mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-primary/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h1 className="text-2xl font-bold mb-2 md:mb-0">{report.title}</h1>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 mr-1" />
            <span>{format(new Date(report.date), 'd MMMM yyyy', { locale: es })}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1">
            <h2 className="text-sm font-medium text-muted-foreground mb-1">Cliente</h2>
            <p className="font-medium">{report.client_name}</p>
          </div>
          
          {report.url && (
            <div className="flex-1">
              <h2 className="text-sm font-medium text-muted-foreground mb-1">URL analizada</h2>
              <a 
                href={report.url} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center"
              >
                {report.url}
                <Link2 className="h-3 w-3 ml-1" />
              </a>
            </div>
          )}
        </div>
        
        {report.summary && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-muted-foreground">{report.summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicReportHeader;
