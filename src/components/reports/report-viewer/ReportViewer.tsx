
import React, { useState, useEffect } from 'react';
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
import ReportEditDialog from '../ReportEditDialog';

const ReportViewer = () => {
  const { id, clientId } = useParams();
  const { getReport, updateReport, isLoading: reportsLoading } = useReports();
  const navigate = useNavigate();
  
  // Get the isEditing state from the URL search params
  const searchParams = new URLSearchParams(window.location.search);
  const editMode = searchParams.get('mode') === 'edit';
  
  const [isEditing, setIsEditing] = useState(editMode);
  const [isSavingBusinessProfile, setIsSavingBusinessProfile] = useState(false);
  const [pageSpeedData, setPageSpeedData] = useState(null);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [isLoadingPageSpeed, setIsLoadingPageSpeed] = useState(false);
  const [isLoadingBusinessProfile, setIsLoadingBusinessProfile] = useState(false);
  
  // States for the edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  
  // If no ID is provided, redirect to reports page
  if (!id) {
    navigate('/dashboard');
    return null;
  }
  
  const report = getReport(id);

  // Load PageSpeed data
  useEffect(() => {
    if (id && report?.status === 'completed' && report?.url) {
      const loadPageSpeedData = async () => {
        try {
          setIsLoadingPageSpeed(true);
          const data = await fetchPageSpeedData(id);
          setPageSpeedData(data);
        } catch (error) {
          console.error('Error loading PageSpeed data:', error);
        } finally {
          setIsLoadingPageSpeed(false);
        }
      };
      
      loadPageSpeedData();
    }
  }, [id, report]);
  
  // Load Business Profile data
  useEffect(() => {
    if (id && report?.status === 'completed' && report?.hasBusinessProfile === true) {
      const loadBusinessProfile = async () => {
        try {
          setIsLoadingBusinessProfile(true);
          const data = await fetchBusinessProfile(id);
          setBusinessProfile(data);
        } catch (error) {
          console.error('Error loading Business Profile:', error);
        } finally {
          setIsLoadingBusinessProfile(false);
        }
      };
      
      loadBusinessProfile();
    }
  }, [id, report]);
  
  console.log('Report data:', report);
  console.log('PageSpeed data:', pageSpeedData);
  console.log('Business profile:', businessProfile);
  
  if (reportsLoading) {
    return <SkeletonReport />;
  }

  if (!report) {
    return <NotFoundPage />;
  }
  
  // Function to get section title from section key
  const getSectionTitle = (section: string): string => {
    const titles: Record<string, string> = {
      executiveSummary: "Resumen Ejecutivo",
      technicalAnalysis: "Análisis Técnico SEO",
      contentAnalysis: "Análisis de Contenido",
      backlinksAnalysis: "Análisis de Backlinks",
      recommendations: "Recomendaciones",
      localSeo: "SEO Local",
      serviceProposal: "Propuesta de Servicios",
      keywords: "Palabras Clave"
    };
    return titles[section] || section;
  };
  
  // Update this function to return a Promise to match the expected type
  const handleEditSection = (section: string, content: string): Promise<void> => {
    return new Promise((resolve) => {
      setActiveSection(section);
      setEditContent(content);
      setIsEditDialogOpen(true);
      resolve();
    });
  };
  
  const handleSaveEdit = async () => {
    if (!report.content || !activeSection) return;
    
    try {
      // Create updated content
      const updatedContent = {
        ...report.content,
        [activeSection]: editContent
      };
      
      // Update report with new content
      await updateReport(id, { content: updatedContent });
      
      setIsEditDialogOpen(false);
      
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
      const success = await saveBusinessProfile(id, profileToSave);
      
      if (success) {
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

  return (
    <>
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
                onSaveEdit={handleEditSection}
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
      
      {/* Edit Dialog */}
      <ReportEditDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        activeSection={activeSection}
        editContent={editContent}
        setEditContent={setEditContent}
        onSave={handleSaveEdit}
        getSectionTitle={getSectionTitle}
      />
    </>
  );
};

export default ReportViewer;
