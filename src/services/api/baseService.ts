
import { toast } from 'sonner';

/**
 * Basic error handling for API requests
 */
export const handleServiceError = (error: any, errorMessage: string) => {
  console.error(errorMessage, error);
  toast.error(error.message || errorMessage);
  throw error;
};
