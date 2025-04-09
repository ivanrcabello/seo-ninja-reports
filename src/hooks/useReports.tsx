
import { useReportsContext } from '@/context/ReportsContext';
import { usePersistentState } from '@/hooks/usePersistentState';

// Export a hook that combines context access and additional functionality if needed
const useReports = () => {
  const reportsContext = useReportsContext();
  
  // Cargar la clave API de OpenAI desde localStorage para tenerla disponible en todo momento
  const [openAIKey] = usePersistentState('openai_api_key', '');
  
  if (!reportsContext) {
    console.error('useReports must be used within a ReportsProvider');
    // Return a safe fallback to prevent app crashes
    return {
      reports: [],
      getReport: () => null,
      isLoading: false,
      error: 'ReportsContext not available',
      createReport: async () => null,
      updateReport: async () => false,
      deleteReport: async () => false,
      refreshReports: async () => false,
      openAIKey
    };
  }
  
  // Add the OpenAI key to the context
  return {
    ...reportsContext,
    openAIKey
  };
};

export default useReports;
