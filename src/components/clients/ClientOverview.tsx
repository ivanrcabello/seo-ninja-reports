
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import BlurredCard from '@/components/ui/BlurredCard';
import { Globe, Calendar, FileText, ExternalLink, Phone, Activity } from 'lucide-react';
import { Client } from '@/types/client.types';
import { Report } from '@/types/report.types';
import ClientCredentials from './ClientCredentials';
import ClientNotes from './ClientNotes';
import ClientPerformanceCards from './ClientPerformanceCards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientGmbTest from './tests/ClientGmbTest';
import ClientPageSpeedTest from './tests/ClientPageSpeedTest';
import { AnimatePresence, motion } from 'framer-motion';
import { BusinessProfile } from '@/types/report.types';

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
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [businessProfile, setBusinessProfile] = useState<Partial<BusinessProfile> | null>(null);
  const [pageSpeedScore, setPageSpeedScore] = useState<number | null>(null);
  
  // Get latest GMB data and PageSpeed score from most recent report if available
  const latestReport = reports.length > 0 ? reports[0] : null;
  
  const handleBusinessProfileUpdate = (profile: Partial<BusinessProfile>) => {
    setBusinessProfile(profile);
  };
  
  const handlePageSpeedUpdate = (score: number) => {
    setPageSpeedScore(score);
  };
  
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
      </div>
      
      {/* Visual indicators for GMB and PageSpeed */}
      <ClientPerformanceCards 
        businessProfile={businessProfile || (latestReport?.businessProfile || null)}
        pageSpeedScore={pageSpeedScore || (latestReport?.pagespeed?.desktop?.performance 
          ? Math.round(latestReport.pagespeed.desktop.performance * 100) 
          : null)}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="summary">Resumen</TabsTrigger>
          <TabsTrigger value="tests">Tests Rápidos</TabsTrigger>
          <TabsTrigger value="credentials">Credenciales</TabsTrigger>
        </TabsList>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            <TabsContent value="summary" className="space-y-6">
              {/* Client summary and notes */}
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
              
              {/* Client notes section */}
              <ClientNotes clientId={client.id} />
            </TabsContent>
            
            <TabsContent value="tests" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ClientGmbTest 
                  clientId={client.id} 
                  onProfileUpdate={handleBusinessProfileUpdate}
                />
                <ClientPageSpeedTest 
                  websiteUrl={client.website}
                  onScoreUpdate={handlePageSpeedUpdate}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="credentials">
              <ClientCredentials client={client} />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </>
  );
};

export default ClientOverview;
