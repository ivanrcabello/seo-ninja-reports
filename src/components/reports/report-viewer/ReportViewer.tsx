
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReportHeader from './ReportHeader';
import ReportTabs from './ReportTabs';
import BlurredCard from '@/components/ui/BlurredCard';
import { SkeletonReport } from './SkeletonReport';
import useReports from '@/hooks/useReports';
import { toast } from 'sonner';
import NotFoundPage from '@/pages/NotFoundPage';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchPageSpeedData } from '@/services/api/pagespeed/fetchPageSpeedData';
import { fetchBusinessProfile } from '@/services/api/businessProfile/fetchBusinessProfile';
import { saveBusinessProfile } from '@/services/api/businessProfile/saveBusinessProfile';
import { BusinessProfile } from '@/types/report.types';

const ReportViewer = () => {
  const { id } = useParams();
  const { getReport, updateReport } = useReports();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSavingBusinessProfile, setIsSavingBusinessProfile] = useState(false);
  
  // If no ID is provided, redirect to reports page
  if (!id) {
    navigate('/reports');
    return null;
  }
  
  const report = getReport(id);
  
  // Query to fetch PageSpeed data for this report if it has been processed
  const { data: pageSpeedData, isLoading: isLoadingPageSpeed } = useQuery({
    queryKey: ['pageSpeed', id],
    queryFn: () => fetchPageSpeedData(id),
    enabled: !!id && report?.status === 'completed' && report?.url !== undefined
  });
  
  // Query to fetch Business Profile data for this report
  const { data: businessProfile, isLoading: isLoadingBusinessProfile } = useQuery({
    queryKey: ['businessProfile', id],
    queryFn: () => fetchBusinessProfile(id),
    enabled: !!id && report?.status === 'completed' && report?.hasBusinessProfile === true
  });

  if (!report) {
    return <NotFoundPage />;
  }
  
  const handleSaveEdit = async (section: string, content: string) => {
    if (!report.content) return;
    
    try {
      // Create updated content
      const updatedContent = {
        ...report.content,
        [section]: content
      };
      
      // Update report with new content
      await updateReport(id, { content: updatedContent });
      
      setIsEditing(false);
      
      toast.success('Contenido actualizado', {
        description: 'Los cambios se han guardado correctamente'
      });
    } catch (error) {
      console.error('Error updating report content:', error);
      toast.error('Error al guardar', {
        description: 'No se pudieron guardar los cambios'
      });
    }
  };
  
  const handleSaveBusinessProfile = async (profileData: Partial<BusinessProfile>) => {
    if (!id) return;
    
    try {
      setIsSavingBusinessProfile(true);
      
      // Ensure required fields are present to meet type requirements
      const profileToSave = {
        businessUrl: profileData.businessUrl || '',
        businessName: profileData.businessName || '',
        businessAddress: profileData.businessAddress || '',
        businessPhone: profileData.businessPhone || '',
        businessCategory: profileData.businessCategory || '',
        businessRating: profileData.businessRating !== undefined ? profileData.businessRating : null,
        businessReviewsCount: profileData.businessReviewsCount || 0,
        businessWebsite: profileData.businessWebsite || '',
        businessHours: profileData.businessHours || {}
      };
      
      // Save business profile
      const savedProfile = await saveBusinessProfile(id, profileToSave);
      
      if (savedProfile) {
        // Update local report state to reflect the presence of a business profile
        if (!report.hasBusinessProfile) {
          await updateReport(id, { hasBusinessProfile: true });
        }
        
        toast.success('Perfil de negocio guardado correctamente');
      } else {
        throw new Error('No se pudo guardar el perfil de negocio');
      }
    } catch (error) {
      console.error('Error al guardar perfil de negocio:', error);
      toast.error('Error al guardar perfil de negocio');
    } finally {
      setIsSavingBusinessProfile(false);
    }
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
              url={report.url || ''}
              isEditing={isEditing}
              reportId={id}
              setIsEditing={setIsEditing}
            />
            
            <ReportTabs 
              report={report}
              isEditing={isEditing}
              onSaveEdit={handleSaveEdit}
              pageSpeedData={pageSpeedData}
              businessProfile={businessProfile}
              isLoadingPageSpeed={isLoadingPageSpeed}
              isLoadingBusinessProfile={isLoadingBusinessProfile}
              isSavingBusinessProfile={isSavingBusinessProfile}
              onSaveBusinessProfile={handleSaveBusinessProfile}
            />
          </>
        ) : report.status === 'failed' ? (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-500">
              Error en la generación del informe
            </h2>
            <p className="mb-4">
              {report.summary || 'No se pudo completar la generación del informe.'}
            </p>
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
