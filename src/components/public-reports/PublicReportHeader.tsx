
import React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PublicReportHeaderProps {
  title: string;
  client?: string;
  website?: string;
  date?: string;
}

const PublicReportHeader: React.FC<PublicReportHeaderProps> = ({ title, client, website, date }) => {
  return (
    <div className="w-full bg-gradient-to-br from-primary/5 to-background/50 backdrop-blur-sm p-6 rounded-lg border border-primary/10 shadow-lg">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary/90">{title}</h1>
        
        {client && (
          <div className="text-lg text-muted-foreground">
            {client} {website && <span className="text-sm">({website})</span>}
          </div>
        )}
        
        {date && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {format(new Date(date), 'd MMMM yyyy', { locale: es })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicReportHeader;
