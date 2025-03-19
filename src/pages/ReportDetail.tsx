
import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ReportViewer from '@/components/reports/ReportViewer';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import useAuth from '@/hooks/useAuth';
import useClients from '@/hooks/useClients';
import useReports from '@/hooks/useReports';
import { Loader2, ChevronLeft, Trash2, Download, Share, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialIsEditing = searchParams.get('mode') === 'edit';
  const [isEditing, setIsEditing] = useState(initialIsEditing);
  
  const { user, loading: authLoading } = useAuth();
  const { getClient } = useClients();
  const { getReport, isLoading: reportsLoading, deleteReport } = useReports();
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  // Update URL when editing state changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (isEditing) {
      params.set('mode', 'edit');
    } else {
      params.delete('mode');
    }
    
    const newUrl = `${location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    navigate(newUrl, { replace: true });
  }, [isEditing, location.pathname, navigate]);
  
  useEffect(() => {
    if (id && !reportsLoading) {
      const report = getReport(id);
      if (!report) {
        console.log(`Report with ID ${id} not found in reports context`);
      }
    }
  }, [id, reportsLoading, getReport]);

  // Redirect if not logged in
  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  if (!id) {
    return <Navigate to="/dashboard" replace />;
  }

  const report = getReport(id);
  const isLoading = authLoading || reportsLoading;

  const client = report ? getClient(report.clientId) : null;

  const handleDeleteReport = async () => {
    if (!report) return;
    
    setIsDeleting(true);
    try {
      await deleteReport(report.id);
      toast({
        title: 'Informe eliminado',
        description: 'El informe ha sido eliminado exitosamente',
      });
      window.location.href = client ? `/clients/${client.id}` : '/dashboard';
    } catch (error: any) {
      console.error('Error deleting report:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al eliminar informe',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/90">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6 mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : !report ? (
            <AnimatedContainer animation="fade" className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Informe No Encontrado</h2>
              <p className="text-muted-foreground mb-6">
                El informe que buscas no existe o ha sido eliminado.
              </p>
              <Button asChild>
                <Link to="/dashboard">Volver al Dashboard</Link>
              </Button>
            </AnimatedContainer>
          ) : (
            <>
              <AnimatedContainer animation="slide-down" className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      asChild
                      className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {client ? (
                        <Link to={`/clients/${client.id}`}>
                          <ChevronLeft className="h-5 w-5" />
                        </Link>
                      ) : (
                        <Link to="/reports">
                          <ChevronLeft className="h-5 w-5" />
                        </Link>
                      )}
                    </Button>
                    <div className="flex flex-col gap-1">
                      <Link to="/reports" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Todos los informes
                      </Link>
                      {client && (
                        <Link to={`/clients/${client.id}`}>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                            {client.name}
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Eliminar</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="glass">
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esto eliminará permanentemente este informe.
                            Esta acción no puede deshacerse.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleDeleteReport}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Eliminando...
                              </>
                            ) : (
                              'Eliminar'
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </AnimatedContainer>
              
              <AnimatedContainer animation="fade" delay={100}>
                <ReportViewer report={report} isEditing={isEditing} setIsEditing={setIsEditing} />
              </AnimatedContainer>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReportDetail;
