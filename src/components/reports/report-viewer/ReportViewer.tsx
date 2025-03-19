
import React, { useEffect, useState } from 'react';
import { Report } from '@/types/report.types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ReportHeader from './ReportHeader';
import ReportTabs from './ReportTabs';
import { getPageSpeedData } from '@/services/api/pagespeed/getPageSpeedData';
import { useToast } from '@/hooks/use-toast';

interface ReportViewerProps {
  report: Report | undefined;
  isEditing?: boolean;
  setIsEditing?: (value: boolean) => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ 
  report, 
  isEditing = false, 
  setIsEditing = () => {} 
}) => {
  const [pageSpeedData, setPageSpeedData] = useState<any>(null);
  const [isLoadingPageSpeed, setIsLoadingPageSpeed] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchPageSpeedData = async () => {
      if (!report || !report.id) return;
      
      try {
        setIsLoadingPageSpeed(true);
        const data = await getPageSpeedData(report.id);
        
        if (data) {
          console.log('PageSpeed data loaded:', data);
          setPageSpeedData(data);
        } else {
          console.log('No PageSpeed data found for report:', report.id);
        }
      } catch (error) {
        console.error('Error fetching PageSpeed data:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos de PageSpeed",
          variant: "destructive"
        });
      } finally {
        setIsLoadingPageSpeed(false);
      }
    };
    
    fetchPageSpeedData();
  }, [report, toast]);

  if (!report) {
    return (
      <div className="p-8 text-center rounded-lg border bg-card/50 backdrop-blur-sm shadow-sm">
        <h2 className="text-xl font-medium text-muted-foreground">Informe no encontrado</h2>
        <p className="mt-2 text-sm text-muted-foreground">El informe que buscas no existe o no está disponible.</p>
      </div>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden backdrop-blur-sm border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-background to-background/80">
        <ReportHeader report={report} />
      </CardHeader>
      <CardContent className="overflow-auto flex-1 p-0 pt-4">
        <ReportTabs 
          report={report} 
          pageSpeedData={pageSpeedData} 
          isLoadingPageSpeed={isLoadingPageSpeed} 
          isEditing={isEditing}
          onEdit={(sectionKey) => {
            if (setIsEditing) setIsEditing(true);
            // Could also store the active section for editing if needed
          }}
        />
      </CardContent>
    </Card>
  );
};

export default ReportViewer;
