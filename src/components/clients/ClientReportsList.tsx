
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import BlurredCard from '@/components/ui/BlurredCard';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { FileText, Plus } from 'lucide-react';
import { Client } from '@/types/client.types';
import { Report } from '@/types/report.types';

interface ClientReportsListProps {
  client: Client;
  reports: Report[];
  onCreateReport: () => void;
}

const ClientReportsList: React.FC<ClientReportsListProps> = ({ 
  client, 
  reports, 
  onCreateReport 
}) => {
  return (
    <BlurredCard>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <CardTitle className="text-xl">All Reports</CardTitle>
          <CardDescription>
            {reports.length} reports for {client.name}
          </CardDescription>
        </div>
        <Button onClick={onCreateReport} className="mt-4 sm:mt-0">
          <Plus className="h-4 w-4 mr-1.5" /> New Report
        </Button>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        {reports.length > 0 ? (
          <div className="space-y-4">
            {reports.map((report, index) => (
              <AnimatedContainer
                key={report.id}
                animation="fade"
                delay={index * 100}
              >
                <Link to={`/reports/${report.id}`}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg bg-background/50 hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10">
                    <div className="mb-3 sm:mb-0">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <h3 className="font-medium">{report.title}</h3>
                      </div>
                      {report.summary && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {report.summary}
                        </p>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground self-end sm:self-auto">
                      {format(new Date(report.date), 'MMM d, yyyy')}
                    </div>
                  </div>
                </Link>
              </AnimatedContainer>
            ))}
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
  );
};

export default ClientReportsList;
