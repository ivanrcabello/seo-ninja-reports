
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
  
  // Only show the retry button for failed crawls or completed crawls that have an error_message
  const [canRetry, setCanRetry] = React.useState(status === 'failed');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  
  // Check if we should show the retry button for completed crawls with error_message
  React.useEffect(() => {
    const checkErrorMessage = async () => {
      if (status === 'completed') {
        try {
          const { data, error } = await supabase
            .from('seo_crawler_crawls')
            .select('error_message')
            .eq('id', crawlId)
            .single();
            
          if (!error && data && data.error_message) {
            setErrorMessage(data.error_message);
            setCanRetry(true);
          }
        } catch (err) {
          console.error('Error checking for error message:', err);
        }
      } else if (status === 'failed') {
        setCanRetry(true);
      } else {
        setCanRetry(false);
      }
    };
    
    checkErrorMessage();
  }, [crawlId, status]);
  
  if (!canRetry) {
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
          updated_at: new Date().toISOString(),
          error_message: null, // Clear previous error message
          started_at: null,     // Clear previous start time
          completed_at: null    // Clear previous completion time
        })
        .eq('id', crawlId);
        
      if (error) {
        throw error;
      }
      
      // Get the original crawl data
      const { data: crawlData } = await supabase
        .from('seo_crawler_crawls')
        .select('url, settings')
        .eq('id', crawlId)
        .single();
      
      if (!crawlData) {
        throw new Error('Could not find original crawl data');
      }
      
      // Get the credentials from localStorage
      const brightDataUsername = localStorage.getItem('bright_data_username') || 
        'brd-customer-hl_2a8d2c33-zone-web_unlocker';
      const brightDataPassword = localStorage.getItem('bright_data_password') || 
        'obz0lal9qh4g';
      const brightDataApiKey = localStorage.getItem('bright_data_api_key') || '';
      
      // Log credentials (without exposing sensitive data)
      console.log('Using Bright Data credentials:', {
        username: brightDataUsername ? 'provided' : 'not provided',
        password: brightDataPassword ? 'provided' : 'not provided',
        apiKey: brightDataApiKey ? 'provided' : 'not provided'
      });
      
      // Call the edge function to restart the crawl
      const { error: functionError } = await supabase.functions.invoke('seo-crawler', {
        body: { 
          crawlId: crawlId,
          url: crawlData.url, 
          settings: crawlData.settings,
          brightDataUsername,
          brightDataPassword,
          brightDataApiKey
        }
      });
      
      if (functionError) {
        console.error('Edge function error during retry:', functionError);
        // Show error but don't fully fail - the crawl will continue in background
        toast.warning('Error invoking crawler function, but request was queued', {
          description: 'The crawl will continue processing in the background.'
        });
      } else {
        toast.success('Análisis puesto en cola para reintentar', {
          description: 'El proceso se ha reiniciado correctamente.'
        });
      }
      
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
    <div className="flex flex-col space-y-2">
      {errorMessage && status === 'completed' && (
        <div className="text-sm text-amber-600 mb-2">
          <p>Completado con advertencias: {errorMessage}</p>
        </div>
      )}
      
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
    </div>
  );
};

export default RetryButton;
