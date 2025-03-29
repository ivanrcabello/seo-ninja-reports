
import React from 'react';
import { CalendarIcon, Globe } from 'lucide-react';
import { format } from 'date-fns';
import BlurredCard from '@/components/ui/BlurredCard';

interface PublicReportHeaderProps {
  title: string;
  client?: string;
  website?: string;
  date?: string;
}

const PublicReportHeader: React.FC<PublicReportHeaderProps> = ({ 
  title,
  client,
  website,
  date
}) => {
  const formattedDate = date ? format(new Date(date), 'dd/MM/yyyy') : '';

  return (
    <BlurredCard className="mb-8 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">{title}</h1>
          {client && (
            <div className="mt-2 text-muted-foreground">
              Cliente: {client}
            </div>
          )}
          {date && (
            <div className="mt-1 flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-1 h-4 w-4" />
              {formattedDate}
            </div>
          )}
        </div>
        {website && (
          <a 
            href={website.startsWith('http') ? website : `https://${website}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-md transition-colors"
          >
            <Globe className="h-4 w-4" />
            {website}
          </a>
        )}
      </div>
    </BlurredCard>
  );
};

export default PublicReportHeader;
