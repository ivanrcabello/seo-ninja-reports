
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Report } from '@/types/report.types';

interface ReportsTabProps {
  reports: Report[];
}

const ReportsTab: React.FC<ReportsTabProps> = ({ reports }) => {
  return (
    <AnimatedContainer animation="fade" delay={400} className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Informes</CardTitle>
          <CardDescription>
            Resumen de todos los informes SEO generados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col p-6 bg-primary/5 rounded-lg">
                <span className="text-sm text-muted-foreground mb-2">Total de informes</span>
                <span className="text-3xl font-bold">{reports.length}</span>
              </div>
              <div className="flex flex-col p-6 bg-primary/5 rounded-lg">
                <span className="text-sm text-muted-foreground mb-2">Informes este mes</span>
                <span className="text-3xl font-bold">
                  {reports.filter(r => {
                    const date = new Date(r.date);
                    const now = new Date();
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                  }).length}
                </span>
              </div>
              <div className="flex flex-col p-6 bg-primary/5 rounded-lg">
                <span className="text-sm text-muted-foreground mb-2">Última actualización</span>
                <span className="text-xl font-bold">
                  {reports.length > 0 
                    ? format(new Date(reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date), 'dd/MM/yyyy')
                    : 'N/A'}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Informes por estado</h3>
              <div className="space-y-4">
                {(['completed', 'processing', 'failed'] as const).map(status => {
                  const count = reports.filter(r => r.status === status).length;
                  const percentage = reports.length > 0 ? (count / reports.length) * 100 : 0;
                  
                  return (
                    <div key={status} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{
                          status === 'completed' ? 'Completado' : 
                          status === 'processing' ? 'En proceso' : 
                          'Fallido'
                        }</span>
                        <span className="text-sm text-muted-foreground">{count} ({Math.round(percentage)}%)</span>
                      </div>
                      <Progress 
                        value={percentage} 
                        indicatorClassName={
                          status === 'completed' ? 'bg-green-500' :
                          status === 'processing' ? 'bg-blue-500' :
                          'bg-red-500'
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link to="/all-reports">Ver todos los informes</Link>
          </Button>
        </CardFooter>
      </Card>
    </AnimatedContainer>
  );
}

export default ReportsTab;
