
import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ReportGenerator from '@/components/reports/ReportGenerator';
import BlurredCard from '@/components/ui/BlurredCard';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import useAuth from '@/hooks/useAuth';
import useClients from '@/hooks/useClients';
import useReports from '@/hooks/useReports';
import { Loader2, ChevronLeft, Plus, FileText, Globe, Calendar, Trash2, PenLine, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const { getClient, isLoading: clientsLoading, deleteClient } = useClients();
  const { getClientReports, isLoading: reportsLoading } = useReports();
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'new-report'>('overview');

  // Redirect if not logged in
  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  if (!id) {
    return <Navigate to="/dashboard" replace />;
  }

  const client = getClient(id);
  const reports = getClientReports(id);
  const isLoading = authLoading || clientsLoading || reportsLoading;

  const handleDeleteClient = async () => {
    if (!client) return;
    
    setIsDeleting(true);
    try {
      await deleteClient(client.id);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error deleting client:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6 mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : !client ? (
            <AnimatedContainer animation="fade" className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Client Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The client you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link to="/dashboard">Return to Dashboard</Link>
              </Button>
            </AnimatedContainer>
          ) : (
            <>
              <AnimatedContainer animation="slide-up" className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to="/dashboard">
                        <ChevronLeft className="h-4 w-4" />
                      </Link>
                    </Button>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-1">
                        {client.industry}
                      </span>
                      <h1 className="text-2xl sm:text-3xl font-bold">{client.name}</h1>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1 text-destructive">
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="glass">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete {client.name} and all associated reports.
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleDeleteClient}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              'Delete'
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button variant="outline" size="sm" className="gap-1">
                      <PenLine className="h-4 w-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                  </div>
                </div>
                
                <Tabs
                  value={activeTab}
                  onValueChange={(value) => setActiveTab(value as 'overview' | 'reports' | 'new-report')}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-3 w-full max-w-md">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="new-report">New Report</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-6">
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
                              <Button variant="outline" size="sm" onClick={() => setActiveTab('reports')}>
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
                            <Button onClick={() => setActiveTab('new-report')}>
                              Generate Report
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </BlurredCard>
                  </TabsContent>
                  
                  <TabsContent value="reports" className="mt-6">
                    <BlurredCard>
                      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                          <CardTitle className="text-xl">All Reports</CardTitle>
                          <CardDescription>
                            {reports.length} reports for {client.name}
                          </CardDescription>
                        </div>
                        <Button onClick={() => setActiveTab('new-report')} className="mt-4 sm:mt-0">
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
                            <Button onClick={() => setActiveTab('new-report')}>
                              Generate Report
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </BlurredCard>
                  </TabsContent>
                  
                  <TabsContent value="new-report" className="mt-6">
                    <ReportGenerator clientId={id} />
                  </TabsContent>
                </Tabs>
              </AnimatedContainer>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ClientDetail;
