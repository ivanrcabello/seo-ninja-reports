import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { format, subDays } from 'date-fns';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { useAuth } from '@/context/AuthContext';
import useReports from '@/hooks/useReports';
import useClients from '@/hooks/useClients';
import { useClientProposals } from '@/hooks/useClientProposals';
import { useClientContracts } from '@/hooks/useClientContracts';
import { useClientInvoices } from '@/hooks/useClientInvoices';
import { Client } from '@/types/client.types';
import { Report } from '@/types/report.types';
import { FileText, Calendar, User, Loader2, FileSpreadsheet, Receipt, FileCheck } from 'lucide-react';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import BackButton from '@/components/navigation/BackButton';

const Activity = () => {
  const { user, loading: authLoading } = useAuth();
  const { reports, isLoading: reportsLoading } = useReports();
  const { clients, isLoading: clientsLoading } = useClients();
  const { proposals, isLoading: proposalsLoading } = useClientProposals();
  const { contracts, isLoading: contractsLoading } = useClientContracts();
  const { invoices, isLoading: invoicesLoading } = useClientInvoices();

  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  const isLoading = authLoading || reportsLoading || clientsLoading || 
                   proposalsLoading || contractsLoading || invoicesLoading;

  const sevenDaysAgo = subDays(new Date(), 7);
  
  const recentReports = reports
    .filter(report => new Date(report.date) >= sevenDaysAgo)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const recentClients = clients
    .filter(client => {
      try {
        return new Date(client.created_at) >= sevenDaysAgo;
      } catch (error) {
        console.error("Invalid date in client:", client.id, client.created_at);
        return false;
      }
    })
    .sort((a, b) => {
      try {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } catch (error) {
        console.error("Error sorting clients by date:", error);
        return 0;
      }
    });
  
  const recentProposals = proposals
    .filter(proposal => {
      try {
        return new Date(proposal.created_at) >= sevenDaysAgo;
      } catch (error) {
        console.error("Invalid date in proposal:", proposal.id, proposal.created_at);
        return false;
      }
    })
    .sort((a, b) => {
      try {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } catch (error) {
        console.error("Error sorting proposals by date:", error);
        return 0;
      }
    });

  const recentContracts = contracts
    .filter(contract => {
      try {
        return new Date(contract.created_at) >= sevenDaysAgo;
      } catch (error) {
        console.error("Invalid date in contract:", contract.id, contract.created_at);
        return false;
      }
    })
    .sort((a, b) => {
      try {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } catch (error) {
        console.error("Error sorting contracts by date:", error);
        return 0;
      }
    });

  const recentInvoices = invoices
    .filter(invoice => {
      try {
        return new Date(invoice.created_at) >= sevenDaysAgo;
      } catch (error) {
        console.error("Invalid date in invoice:", invoice.id, invoice.created_at);
        return false;
      }
    })
    .sort((a, b) => {
      try {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } catch (error) {
        console.error("Error sorting invoices by date:", error);
        return 0;
      }
    });
  
  const activities = [
    ...recentReports.map(report => ({
      type: 'report',
      date: new Date(report.date),
      data: report
    })),
    ...recentClients.map(client => {
      try {
        return {
          type: 'client',
          date: new Date(client.created_at),
          data: client
        };
      } catch (error) {
        console.error("Error creating activity for client:", client.id, error);
        return null;
      }
    }).filter(Boolean),
    ...recentProposals.map(proposal => {
      try {
        return {
          type: 'proposal',
          date: new Date(proposal.created_at),
          data: proposal
        };
      } catch (error) {
        console.error("Error creating activity for proposal:", proposal.id, error);
        return null;
      }
    }).filter(Boolean),
    ...recentContracts.map(contract => {
      try {
        return {
          type: 'contract',
          date: new Date(contract.created_at),
          data: contract
        };
      } catch (error) {
        console.error("Error creating activity for contract:", contract.id, error);
        return null;
      }
    }).filter(Boolean),
    ...recentInvoices.map(invoice => {
      try {
        return {
          type: 'invoice',
          date: new Date(invoice.created_at),
          data: invoice
        };
      } catch (error) {
        console.error("Error creating activity for invoice:", invoice.id, error);
        return null;
      }
    }).filter(Boolean)
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const getClientName = (clientId: string): string => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente desconocido';
  };

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Panel de Control', href: '/dashboard' },
    { label: 'Actividad' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6 mx-auto">
          <Breadcrumbs items={breadcrumbItems} className="mb-4" />
          
          <AnimatedContainer animation="slide-up" className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Actividad Reciente</h1>
              <p className="text-muted-foreground">
                Resumen de la actividad de los últimos 7 días
              </p>
            </div>
            
            <BackButton variant="default" />
          </AnimatedContainer>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <AnimatedContainer animation="fade" delay={200}>
              <Card>
                <CardHeader>
                  <CardTitle>Actividad de la última semana</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  {activities.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No hay actividad reciente</h3>
                      <p className="text-muted-foreground">
                        No se ha registrado actividad en los últimos 7 días.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {activities.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className={`p-2 rounded-full ${
                            activity.type === 'report' ? 'bg-primary/10' : 
                            activity.type === 'client' ? 'bg-green-500/10' :
                            activity.type === 'proposal' ? 'bg-blue-500/10' :
                            activity.type === 'contract' ? 'bg-purple-500/10' :
                            'bg-amber-500/10'
                          }`}>
                            {activity.type === 'report' ? (
                              <FileText className="h-5 w-5 text-primary" />
                            ) : activity.type === 'client' ? (
                              <User className="h-5 w-5 text-green-500" />
                            ) : activity.type === 'proposal' ? (
                              <FileSpreadsheet className="h-5 w-5 text-blue-500" />
                            ) : activity.type === 'contract' ? (
                              <FileCheck className="h-5 w-5 text-purple-500" />
                            ) : (
                              <Receipt className="h-5 w-5 text-amber-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {format(activity.date, 'dd MMM yyyy, HH:mm')}
                              </span>
                            </div>
                            {activity.type === 'report' ? (
                              <Link to={`/reports/${(activity.data as Report).id}`} className="block mt-1 font-medium hover:text-primary transition-colors">
                                Nuevo informe: {(activity.data as Report).title}
                              </Link>
                            ) : activity.type === 'client' ? (
                              <Link to={`/clients/${(activity.data as Client).id}`} className="block mt-1 font-medium hover:text-primary transition-colors">
                                Nuevo cliente: {(activity.data as Client).name}
                              </Link>
                            ) : activity.type === 'proposal' ? (
                              <Link to={`/clients/${(activity.data as any).client_id}`} className="block mt-1 font-medium hover:text-primary transition-colors">
                                Nueva propuesta: {(activity.data as any).title || 'Sin título'}
                              </Link>
                            ) : activity.type === 'contract' ? (
                              <Link to={`/clients/${(activity.data as any).client_id}`} className="block mt-1 font-medium hover:text-primary transition-colors">
                                Nuevo contrato: {(activity.data as any).title || 'Sin título'}
                              </Link>
                            ) : (
                              <Link to={`/clients/${(activity.data as any).client_id}`} className="block mt-1 font-medium hover:text-primary transition-colors">
                                Nueva factura: {(activity.data as any).title || `Factura #${(activity.data as any).id.slice(0, 8)}`}
                              </Link>
                            )}
                            {(activity.type === 'report' || activity.type === 'proposal' || 
                              activity.type === 'contract' || activity.type === 'invoice') && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Cliente: {getClientName(
                                  activity.type === 'report' 
                                    ? (activity.data as Report).clientId 
                                    : (activity.data as any).client_id
                                )}
                              </p>
                            )}
                            
                            {(activity.type === 'invoice' || activity.type === 'contract') && (
                              <p className="text-xs mt-1">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                  (activity.data as any).status === 'paid' || (activity.data as any).status === 'signed' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                    : (activity.data as any).status === 'pending' || (activity.data as any).status === 'sent'
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                }`}>
                                  {activity.type === 'invoice' ? (
                                    (activity.data as any).status === 'paid' ? 'Pagada' :
                                    (activity.data as any).status === 'pending' ? 'Pendiente' :
                                    (activity.data as any).status === 'cancelled' ? 'Cancelada' : 'Borrador'
                                  ) : (
                                    (activity.data as any).status === 'signed' ? 'Firmado' :
                                    (activity.data as any).status === 'sent' ? 'Enviado' :
                                    (activity.data as any).status === 'expired' ? 'Expirado' :
                                    (activity.data as any).status === 'cancelled' ? 'Cancelado' : 'Borrador'
                                  )}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedContainer>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Activity;
