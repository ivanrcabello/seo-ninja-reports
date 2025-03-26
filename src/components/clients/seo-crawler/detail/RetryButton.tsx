
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface RetryButtonProps {
  crawlId: string;
  status: 'processing' | 'completed' | 'failed' | 'queued';
  onSuccess?: () => void;
}

const RetryButton: React.FC<RetryButtonProps> = ({ crawlId, status, onSuccess }) => {
  const [isRetrying, setIsRetrying] = React.useState(false);
  
  // Only show the retry button for failed crawls
  if (status !== 'failed') {
    return null;
  }
  
  const handleRetry = async () => {
    try {
      setIsRetrying(true);
      console.log(`Attempting to retry crawl: ${crawlId}`);
      
      // Update the status to queued
      const { error } = await supabase
        .from('seo_crawler_crawls')
        .update({
          status: 'queued',
          updated_at: new Date().toISOString()
        })
        .eq('id', crawlId);
        
      if (error) {
        throw error;
      }
      
      toast.success('Análisis puesto en cola para reintentar', {
        description: 'El proceso se ha reiniciado correctamente.'
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Force reload the page after a short delay to show processing status
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error('Error reintentando análisis:', error);
      toast.error('No se pudo reintentar el análisis', {
        description: 'Ha ocurrido un error al procesar la solicitud.'
      });
    } finally {
      setIsRetrying(false);
    }
  };
  
  return (
    <Button 
      onClick={handleRetry} 
      disabled={isRetrying}
      variant="outline"
      size="sm"
      className="flex items-center gap-1"
    >
      {isRetrying ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      {isRetrying ? 'Reintentando...' : 'Reintentar análisis'}
    </Button>
  );
};

export default RetryButton;
