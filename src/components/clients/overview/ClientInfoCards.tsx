
import React from 'react';
import { Globe, Calendar, FileText, ExternalLink, Phone } from 'lucide-react';
import { format } from 'date-fns';
import BlurredCard from '@/components/ui/BlurredCard';
import { Client } from '@/types/client.types';
import { Report } from '@/types/report.types';

interface ClientInfoCardsProps {
  client: Client;
  reports: Report[];
}

const ClientInfoCards: React.FC<ClientInfoCardsProps> = ({ client, reports }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <BlurredCard>
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Website</h3>
            <a 
              href={client.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-lg font-medium hover:text-primary transition-colors flex items-center gap-1"
            >
              {client.website.replace(/^https?:\/\//, '')}
              <ExternalLink className="h-3.5 w-3.5 inline-block" />
            </a>
          </div>
        </div>
      </BlurredCard>
      
      {client.phoneNumber && (
        <BlurredCard>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Teléfono</h3>
              <p className="text-lg font-medium">
                {client.phoneNumber}
              </p>
            </div>
          </div>
        </BlurredCard>
      )}
      
      <BlurredCard>
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Client Since</h3>
            <p className="text-lg font-medium">
              {format(new Date(client.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
      </BlurredCard>
      
      <BlurredCard>
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Reports</h3>
            <p className="text-lg font-medium">{reports.length} reports</p>
            <p className="text-sm text-muted-foreground">
              Last report: {reports.length > 0 
                ? format(new Date(reports[0].date), 'MMM d, yyyy')
                : 'No reports yet'
              }
            </p>
          </div>
        </div>
      </BlurredCard>
    </div>
  );
};

export default ClientInfoCards;
