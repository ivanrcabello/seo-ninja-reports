
import React from 'react';
import BlurredCard from '@/components/ui/BlurredCard';
import { Calendar, Globe, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PublicReportHeaderProps {
  title: string;
  date?: string;
  url?: string;
}

const PublicReportHeader: React.FC<PublicReportHeaderProps> = ({ title, date, url }) => {
  return (
    <BlurredCard className="w-full max-w-4xl mb-8 bg-gradient-to-r from-primary/5 to-primary/10 backdrop-blur-lg border-primary/10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gradient-primary">{title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {date && (
              <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(date), 'd MMM yyyy', { locale: es })}</span>
              </div>
            )}
            {url && (
              <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full group hover:bg-primary/20 transition-all">
                <Globe className="h-4 w-4" />
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  {url.replace(/^https?:\/\//, '').split('/')[0]}
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </BlurredCard>
  );
};

export default PublicReportHeader;
