
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import BlurredCard from '@/components/ui/BlurredCard';
import { Globe, Calendar, FileText, ExternalLink, Phone, Lock } from 'lucide-react';
import { Client } from '@/types/client.types';
import { Report } from '@/types/report.types';

interface ClientOverviewProps {
  client: Client;
  reports: Report[];
  onViewReports: () => void;
  onCreateReport: () => void;
}

const ClientOverview: React.FC<ClientOverviewProps> = ({ 
  client, 
  reports, 
  onViewReports, 
  onCreateReport 
}) => {
  return (
    <>
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
        
        {(client.wpCredentials || client.hostingCredentials) && (
          <BlurredCard>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Credentials</h3>
                <div className="space-y-1 mt-1">
                  {client.wpCredentials && (
                    <div className="flex items-center gap-1 text-sm">
                      <span className="px-1.5 py-0.5 bg-primary/10 rounded text-xs">WordPress</span>
                      <span className="text-muted-foreground">{client.wpCredentials.username}</span>
                    </div>
                  )}
                  {client.hostingCredentials && (
                    <div className="flex items-center gap-1 text-sm">
                      <span className="px-1.5 py-0.5 bg-primary/10 rounded text-xs">{client.hostingCredentials.provider}</span>
                      <span className="text-muted-foreground">{client.hostingCredentials.username}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </BlurredCard>
        )}
      </div>
      
      <BlurredCard>
        <CardHeader>
          <CardTitle className="text-xl">Client Summary</CardTitle>
          <CardDescription>
            Performance overview and recent activity
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {reports.length > 0 ? (
            <div className="space-y-6">
              <p>
                {client.name} has {reports.length} reports available, with the most recent from {
                  format(new Date(reports[0].date), 'MMMM d, yyyy')
                }.
              </p>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <h4 className="font-medium mb-2">Recent Insights</h4>
                <p className="text-muted-foreground">
                  {reports[0].summary || 'No summary available for the latest report.'}
                </p>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={onViewReports}>
                  View All Reports
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Reports Yet</h3>
              <p className="text-muted-foreground mb-6">
                Generate your first SEO report for {client.name} to get started.
              </p>
              <Button onClick={onCreateReport}>
                Generate Report
              </Button>
            </div>
          )}
        </CardContent>
      </BlurredCard>
    </>
  );
};

export default ClientOverview;
