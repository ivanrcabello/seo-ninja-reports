
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ShareReportHookProps {
  open: boolean;
  reportId: string;
  reportTitle: string;
}

export const useShareReport = ({ open, reportId, reportTitle }: ShareReportHookProps) => {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const generateRandomPassword = useCallback(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  }, []);
  
  const generateShareUrl = useCallback(async () => {
    if (!reportId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select('password')
        .eq('id', reportId)
        .single();
      
      if (reportError) {
        throw new Error(`Error al obtener el informe: ${reportError.message}`);
      }
      
      if (reportData.password) {
        setPasswordProtected(true);
        setPassword(reportData.password);
      } else {
        setPasswordProtected(false);
        setPassword('');
      }
      
      const { data: existingContent } = await supabase
        .from('shared_content')
        .select('id, shared_url')
        .eq('original_id', reportId)
        .eq('content_type', 'report')
        .single();
      
      let sharedUrl: string;
      
      if (!existingContent) {
        const { data: fullReportData, error: fullReportError } = await supabase
          .from('reports')
          .select('*, clients(name, website)')
          .eq('id', reportId)
          .single();
        
        if (fullReportError) {
          throw new Error(`Error al obtener el informe: ${fullReportError.message}`);
        }

        const newSharedUrl = crypto.randomUUID();
        
        const { data: insertData, error: insertError } = await supabase
          .from('shared_content')
          .insert([{
            original_id: fullReportData.id,
            content_type: 'report',
            title: fullReportData.title,
            status: fullReportData.status,
            content: fullReportData.content,
            password: fullReportData.password,
            client_name: fullReportData.clients?.name,
            client_website: fullReportData.clients?.website,
            description: fullReportData.summary,
            shared_url: newSharedUrl
          }]);
        
        if (insertError) {
          throw new Error(`Error al compartir el informe: ${insertError.message}`);
        }
        
        sharedUrl = newSharedUrl;
      } else {
        sharedUrl = existingContent.shared_url;
      }
      
      // Construct the full URL with the correct path
      const publicUrl = `${window.location.origin}/shared/reports/${sharedUrl}`;
      setShareUrl(publicUrl);
      
      toast.success('Enlace generado correctamente');
    } catch (error: any) {
      console.error('Error al generar enlace:', error);
      setError(error.message || 'Error al generar enlace para compartir');
      toast.error('Error al generar enlace para compartir');
    } finally {
      setIsLoading(false);
    }
  }, [reportId]);
  
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Enlace copiado al portapapeles');
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast.error('No se pudo copiar el enlace');
      console.error('Error copiando al portapapeles:', error);
    }
  }, [shareUrl]);
  
  const handleEmailShare = useCallback(() => {
    const subject = encodeURIComponent(`Informe SEO: ${reportTitle}`);
    const body = encodeURIComponent(`Hola,\n\nQuiero compartir contigo este informe SEO${passwordProtected ? ' (protegido con contraseña)' : ''}.\n\nPuedes verlo en: ${shareUrl}\n\n${passwordProtected ? `Contraseña: ${password}\n\n` : ''}Saludos.`);
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
  }, [reportTitle, passwordProtected, shareUrl, password]);
  
  const handleUpdatePassword = useCallback(async () => {
    if (!reportId) return;
    
    setIsLoading(true);
    try {
      const passwordValue = passwordProtected ? password : null;
      
      const { error: reportError } = await supabase
        .from('reports')
        .update({ password: passwordValue })
        .eq('id', reportId);
        
      if (reportError) throw new Error('Error al actualizar la contraseña en el informe');
      
      const { error: sharedContentError } = await supabase
        .from('shared_content')
        .update({ password: passwordValue })
        .eq('original_id', reportId)
        .eq('content_type', 'report');
      
      if (sharedContentError) throw new Error('Error al actualizar la contraseña en el contenido compartido');
      
      toast.success(passwordProtected 
        ? 'Informe protegido con contraseña' 
        : 'Protección de contraseña desactivada');
      
    } catch (err: any) {
      console.error('Error updating password:', err);
      toast.error(err.message || 'Error al actualizar la contraseña');
    } finally {
      setIsLoading(false);
    }
  }, [reportId, passwordProtected, password]);
  
  useEffect(() => {
    if (!open) return;
    generateShareUrl();
  }, [open, generateShareUrl]);
  
  return {
    copied,
    isLoading,
    shareUrl,
    passwordProtected,
    setPasswordProtected,
    password,
    setPassword,
    error,
    handleCopyLink,
    handleEmailShare,
    handleUpdatePassword,
    generateRandomPassword
  };
};
