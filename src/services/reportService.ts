
import { supabase } from '@/integrations/supabase/client';
import { Report, BusinessProfile } from '@/types/report.types';
import { toast } from 'sonner';
import { generateSeoReport, retryFailedReport, checkAndFixStuckReports } from './api/reportGenerationService';

/**
 * Fetches all reports for the current user
 */
export {
  fetchReports,
  createNewReport,
  updateExistingReport,
  deleteReportById
} from './api/reportCrudService';

/**
 * Generates an SEO report with OpenAI
 */
export {
  generateSeoReport,
  retryFailedReport,
  checkAndFixStuckReports
};

/**
 * Re-export the fetchPageSpeedData function from the pagespeed module
 */
export { fetchPageSpeedData } from './api/pagespeed/fetchPageSpeedData';

/**
 * Saves a business profile for a report
 */
export { saveBusinessProfile } from './api/businessProfile/saveBusinessProfile';
