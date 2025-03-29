
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface Report {
  id: string;
  title: string;
  created_at: string;
}

interface ClientPortalReportsProps {
  clientId: string;
}

const ClientPortalReports: React.FC<ClientPortalReportsProps> = ({ clientId }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .eq('client_id', clientId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setReports(data || []);
      } catch (err: any) {
        console.error('Error fetching reports:', err);
        toast.error('Error al cargar los informes');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [clientId]);

  const viewReport = (id: string) => {
    // Open report in new tab
    window.open(`/reports/${id}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tus Informes</h2>
      <p className="text-muted-foreground">
        Aquí encontrarás todos los informes compartidos contigo.
      </p>
      
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map(report => (
                <div key={report.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div>
                    <h3 className="font-medium">{report.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      <Calendar className="inline h-3 w-3 mr-1" />
                      {format(new Date(report.created_at), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => viewReport(report.id)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Ver informe
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No hay informes disponibles en este momento.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientPortalReports;
