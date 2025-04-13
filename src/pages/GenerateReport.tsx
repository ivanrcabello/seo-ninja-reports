
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ReportGeneratorWrapper from '@/components/reports/ReportGeneratorWrapper';

const GenerateReport = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    if (clientId) {
      navigate(`/clients/${clientId}`);
    } else {
      navigate('/clients');
    }
  };

  if (!clientId) {
    toast.error('Se requiere un ID de cliente para generar un informe');
    navigate('/clients');
    return null;
  }

  return (
    <Layout>
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="space-y-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver
            </Button>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Generar Informe SEO</CardTitle>
              </CardHeader>
              <CardContent>
                <ReportGeneratorWrapper clientId={clientId} onBack={handleBack} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default GenerateReport;
