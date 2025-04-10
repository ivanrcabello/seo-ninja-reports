
import { usePersistentState } from '@/hooks/usePersistentState';
import useReportsHook from '@/hooks/useReports.ts'; // Make sure we're importing from the .ts file

// Export a hook that combines context access and additional functionality if needed
const useReports = () => {
  // Use the main reports hook
  const reportsHook = useReportsHook();
  
  // Load the OpenAI API key from localStorage to have it available at all times
  const [openAIKey] = usePersistentState('openai_api_key', '');
  
  // Add the OpenAI key to the context
  return {
    ...reportsHook,
    openAIKey
  };
};

export default useReports;
