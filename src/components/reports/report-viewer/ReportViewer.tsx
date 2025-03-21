
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Report, BusinessProfile } from '@/types/report.types';
import ReportHeader from './ReportHeader';
import ReportTabs from './ReportTabs';
import BlurredCard from '@/components/ui/BlurredCard';
import { SkeletonReport } from './SkeletonReport';
import useReports from '@/hooks/useReports';
import { toast } from 'sonner';
import NotFoundPage from '@/pages/NotFoundPage';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchPageSpeedData } from '@/services/api/pagespeed';
import { fetchBusinessProfile } from '@/services/api/businessProfile/fetchBusinessProfile';

const ReportViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getReport, updateReport } = useReports();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // If no ID is provided, redirect to reports page
  if (!id) {
    navigate('/reports');
    return null;
  }

  const report = getReport(id);

  // Query to fetch PageSpeed data for this report if it has been processed
  const { 
    data: pageSpeedData, 
    isLoading: isLoadingPageSpeed 
  } = useQuery({
    queryKey: ['pageSpeed', id],
    queryFn: () => fetchPageSpeedData(id),
    enabled: !!id && report?.status === 'completed' && report?.url !== undefined,
  });

  // Query to fetch Business Profile data for this report
  const {
    data: businessProfile,
    isLoading: isLoadingBusinessProfile
  } = useQuery({
    queryKey: ['businessProfile', id],
    queryFn: () => fetchBusinessProfile(id),
    enabled: !!id && report?.status === 'completed' && report?.hasBusinessProfile === true,
  });

  if (!report) {
    return <NotFoundPage />;
  }

  const handleEdit = (section: string) => {
    setIsEditing(true);
    setEditingSection(section);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingSection(null);
  };

  const handleSaveEdit = async (section: string, content: string) => {
    if (!report.content) return;
    
    try {
      // Create updated content
      const updatedContent = {
        ...report.content,
        [section]: content
      };
      
      // Update report with new content
      await updateReport(id, {
        content: updatedContent
      });
      
      setIsEditing(false);
      setEditingSection(null);
      
      toast.success('Contenido actualizado', {
        description: 'Los cambios se han guardado correctamente',
      });
    } catch (error) {
      console.error('Error updating report content:', error);
      toast.error('Error al guardar', {
        description: 'No se pudieron guardar los cambios',
      });
    }
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (report.status === 'processing') {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Generando informe...</h2>
            <p className="text-muted-foreground">
              Esto puede tardar unos minutos dependiendo del tamaño del sitio web.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isLoadingData = isLoadingPageSpeed || isLoadingBusinessProfile;

  return (
    <div className="w-full mx-auto">
      <BlurredCard className="p-0 overflow-hidden">
        {report.status === 'completed' ? (
          <>
            <ReportHeader 
              title={report.title}
              date={report.date}
              url={report.url}
              isEditing={isEditing}
              editingSection={editingSection}
              reportId={report.id}
              setIsEditing={(value) => setIsEditing(value)}
              onEdit={handleEdit}
              onCancelEdit={handleCancelEdit}
              onSaveEdit={handleSaveEdit}
            />
            
            <ReportTabs 
              report={report}
              pageSpeedData={pageSpeedData}
              businessProfile={businessProfile}
              isLoadingPageSpeed={isLoadingPageSpeed}
              isLoadingBusinessProfile={isLoadingBusinessProfile}
              isEditing={isEditing}
              onEdit={(sectionKey, content) => handleSaveEdit(sectionKey, content)}
            />
          </>
        ) : report.status === 'failed' ? (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-500">Error en la generación del informe</h2>
            <p className="mb-4">{report.summary || 'No se pudo completar la generación del informe.'}</p>
            <p className="text-muted-foreground text-sm">
              Por favor, comprueba la URL y vuelve a intentarlo, o contacta con soporte si el problema persiste.
            </p>
          </div>
        ) : (
          <SkeletonReport />
        )}
      </BlurredCard>
    </div>
  );
};

export default ReportViewer;
