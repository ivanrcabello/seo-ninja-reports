
import React, { useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ClientList from '@/components/dashboard/ClientList';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import useAuth from '@/hooks/useAuth';
import useClients from '@/hooks/useClients';
import useReports from '@/hooks/useReports';
import { Loader2 } from 'lucide-react';
import usePersistentState from '@/hooks/usePersistentState';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { clients, isLoading: clientsLoading } = useClients();
  const { reports, isLoading: reportsLoading } = useReports();
  const [lastVisitedSection, setLastVisitedSection] = usePersistentState<string>('dashboard-section', '');

  // Redirect if not logged in
  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  const isLoading = authLoading || clientsLoading || reportsLoading;
  
  // Get reports created in the last 7 days
  const recentReportsCount = reports.filter(
    r => new Date(r.date) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
  ).length;

  // Store page visibility state
  useEffect(() => {
    const handleVisibilityChange = () => {
      // When page becomes visible again, we ensure we're at the last viewed section
      if (document.visibilityState === 'visible' && lastVisitedSection) {
        const element = document.getElementById(lastVisitedSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [lastVisitedSection]);

  // Track section visibility
  const trackSectionVisibility = (sectionId: string) => {
    setLastVisitedSection(sectionId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6 mx-auto">
          <AnimatedContainer animation="slide-up" className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Panel de Control</h1>
            <p className="text-muted-foreground">
              Gestiona tus clientes e informes SEO
            </p>
          </AnimatedContainer>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <>
              <AnimatedContainer animation="fade" delay={200} className="mb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <DashboardCard
                    title="Total Clientes"
                    value={clients.length}
                    description="Clientes activos en tu cuenta"
                    linkText="Ver todos los clientes"
                    linkUrl="#clients"
                    onClick={() => trackSectionVisibility('clients')}
                  />
                  <DashboardCard
                    title="Total Informes"
                    value={reports.length}
                    description="Informes SEO generados"
                    linkText="Ver todos los informes"
                    linkUrl="/reports"
                  />
                  <DashboardCard
                    title="Actividad Reciente"
                    value={recentReportsCount}
                    description="Informes creados en los últimos 7 días"
                    linkText="Ver actividad reciente"
                    linkUrl="/activity"
                  />
                </div>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={400} className="mb-8">
                <div className="flex items-center justify-between" id="clients">
                  <h2 className="text-2xl font-bold">Tus Clientes</h2>
                </div>
              </AnimatedContainer>
              
              <AnimatedContainer animation="fade" delay={600}>
                <ClientList />
              </AnimatedContainer>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  value: number;
  description: string;
  linkText: string;
  linkUrl: string;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, description, linkText, linkUrl, onClick }) => {
  return (
    <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold mb-2">{value}</p>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Button variant="link" className="p-0 h-auto text-primary" asChild onClick={onClick}>
        <Link to={linkUrl}>{linkText}</Link>
      </Button>
    </div>
  );
};

export default Dashboard;
