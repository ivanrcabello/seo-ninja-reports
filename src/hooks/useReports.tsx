
import { useReportsContext } from '@/context/ReportsContext';
import { usePersistentState } from '@/hooks/usePersistentState';

// Export a hook that combines context access and additional functionality if needed
const useReports = () => {
  const reportsContext = useReportsContext();
  
  // Cargar la clave API de OpenAI desde localStorage para tenerla disponible en todo momento
  const [openAIKey] = usePersistentState('openai_api_key', '');
  
  // Add the OpenAI key to the context
  return {
    ...reportsContext,
    openAIKey
  };
};

export default useReports;
