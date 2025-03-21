
import React from 'react';
import { format } from 'date-fns';
import BlurredCard from '@/components/ui/BlurredCard';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Client } from '@/types/client.types';
import { Report } from '@/types/report.types';
import ClientNotes from '../ClientNotes';

interface ClientSummaryTabProps {
  client: Client;
  reports: Report[];
  onViewReports: () => void;
  onCreateReport: () => void;
}

const ClientSummaryTab: React.FC<ClientSummaryTabProps> = ({
  client,
  reports,
  onViewReports,
  onCreateReport
}) => {
  return (
    <div className="space-y-6">
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
      
      <ClientNotes clientId={client.id} />
    </div>
  );
};

export default ClientSummaryTab;
