import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReportHeader from './report-viewer/ReportHeader';
import ReportTabs from './report-viewer/ReportTabs';
import BlurredCard from '@/components/ui/BlurredCard';
import { SkeletonReport } from './report-viewer/SkeletonReport';
import useReports from '@/hooks/useReports';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchPageSpeedData } from '@/services/api/pagespeed/fetchPageSpeedData';
import { fetchBusinessProfile } from '@/services/api/businessProfile/fetchBusinessProfile';
import { saveBusinessProfile } from '@/services/api/businessProfile/saveBusinessProfile';
import { BusinessProfile, Report } from '@/types/report.types';
import ReportEditDialog from '../ReportEditDialog';

interface ReportViewerProps {
  reportId?: string;
  report?: Report;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ reportId, report: providedReport }) => {
  const { id } = useParams();
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

  // Use the provided report or fetch it based on ID
  const effectiveId = reportId || id;
  const report = providedReport || (effectiveId ? getReport(effectiveId) : undefined);
  
  console.log("ReportViewer component received:", { 
    providedReport: !!providedReport, 
    reportId, 
    urlId: id, 
    effectiveId,
    hasReport: !!report,
    reportContent: report?.content ? 'exists' : 'missing'
  });
  
  // If no ID is provided and no report is provided, show error
  if (!effectiveId && !providedReport) {
    console.error("No report ID or report object provided");
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold text-red-500">Error: Falta información del informe</h2>
        <p className="mt-2 text-muted-foreground">No se pudo cargar el informe debido a información insuficiente.</p>
      </div>
    );
  }

  // Load PageSpeed data
  useEffect(() => {
    if (report?.id && report?.status === 'completed' && report?.url) {
      const loadPageSpeedData = async () => {
        try {
          setIsLoadingPageSpeed(true);
          const data = await fetchPageSpeedData(report.id);
          setPageSpeedData(data);
        } catch (error) {
          console.error('Error loading PageSpeed data:', error);
        } finally {
          setIsLoadingPageSpeed(false);
        }
      };
      
      loadPageSpeedData();
    }
  }, [report?.id, report?.status, report?.url]);

  // Load Business Profile data
  useEffect(() => {
    if (report?.id && report?.status === 'completed' && report?.hasBusinessProfile === true) {
      const loadBusinessProfile = async () => {
        try {
          setIsLoadingBusinessProfile(true);
          const data = await fetchBusinessProfile(report.id);
          setBusinessProfile(data);
        } catch (error) {
          console.error('Error loading Business Profile:', error);
        } finally {
          setIsLoadingBusinessProfile(false);
        }
      };
      
      loadBusinessProfile();
    }
  }, [report?.id, report?.status, report?.hasBusinessProfile]);
  
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
    if (!report?.content || !activeSection || !report.id) return;
    
    try {
      // Create updated content
      const updatedContent = {
        ...report.content,
        [activeSection]: editContent
      };
      
      // Update report with new content
      await updateReport(report.id, { content: updatedContent });
      
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
    if (!report?.id) return;
    
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
      const success = await saveBusinessProfile(report.id, profileToSave);
      
      if (success) {
        // Update local report state to reflect the presence of a business profile
        if (!report?.hasBusinessProfile) {
          await updateReport(report.id, { hasBusinessProfile: true });
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
  
  // If we're still loading reports and don't have a provided report, show skeleton
  if (reportsLoading && !providedReport) {
    return <SkeletonReport />;
  }

  // If report not found
  if (!report) {
    console.error("Report not found:", effectiveId);
    return (
      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-card p-8 rounded-lg border border-border shadow">
          <h2 className="text-2xl font-bold mb-4 text-center">Informe no encontrado</h2>
          <p className="text-muted-foreground text-center mb-6">No se pudo encontrar el informe solicitado.</p>
          <div className="flex justify-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Show processing state
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

  // Check if report content exists
  if (!report.content && report.status === 'completed') {
    console.error("Report has status completed but no content:", report);
    return (
      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-card p-8 rounded-lg border border-border shadow">
          <h2 className="text-2xl font-bold mb-4 text-center text-amber-500">Informe sin contenido</h2>
          <p className="text-muted-foreground text-center mb-6">
            El informe existe pero no tiene contenido. Por favor, contacta con soporte.
          </p>
          <pre className="bg-muted p-4 text-xs overflow-auto max-h-40 rounded">
            {JSON.stringify(report, null, 2)}
          </pre>
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
                reportId={report.id}
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
