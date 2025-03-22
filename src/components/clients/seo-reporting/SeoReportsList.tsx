
import React from 'react';
import { SeoReport } from '@/types/seo-reporting.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Download, Globe, TrendingUp, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import DeleteSeoReportButton from './DeleteSeoReportButton';

interface SeoReportsListProps {
  reports: SeoReport[];
  selectedReport: SeoReport | null;
  onSelectReport: (report: SeoReport) => void;
  onCreateReport?: () => void;
  onDeleteReport?: (reportId: string) => Promise<void>;
}

const SeoReportsList: React.FC<SeoReportsListProps> = ({ 
  reports, 
  selectedReport,
  onSelectReport, 
  onCreateReport,
  onDeleteReport
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <CardTitle className="text-xl">Informes SEO</CardTitle>
          <CardDescription>
            {reports.length} informes SEO disponibles
          </CardDescription>
        </div>
        {onCreateReport && (
          <Button onClick={onCreateReport} className="mt-4 sm:mt-0">
            Nuevo Informe
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {reports.length > 0 ? (
          <div className="space-y-4">
            {reports.map((report, index) => (
              <div
                key={report.id}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-md border ${selectedReport?.id === report.id ? 'bg-muted' : 'hover:bg-muted/50'} transition-colors`}
              >
                <div 
                  className="flex-1 mb-3 sm:mb-0 cursor-pointer"
                  onClick={() => onSelectReport(report)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">{report.domain}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>{report.traffic || 0} visitas</span>
                    </div>
                    <span>•</span>
                    <div>{report.keywords || 0} keywords</div>
                    <span>•</span>
                    <div>{report.backlinks || 0} backlinks</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(report.createdAt), 'dd MMM yyyy')}
                  </div>
                  {onDeleteReport && (
                    <DeleteSeoReportButton onDelete={() => onDeleteReport(report.id)} />
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onSelectReport(report)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Sin informes SEO</h3>
            <p className="text-muted-foreground mb-6">
              Crea tu primer informe SEO para este cliente
            </p>
            {onCreateReport && (
              <Button onClick={onCreateReport}>
                Nuevo Informe
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeoReportsList;
