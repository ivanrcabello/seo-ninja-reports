

import { Report } from '@/types/report.types';
// Export the CRUD operations
export { 
  fetchReports, 
  createNewReport, 
  updateExistingReport, 
  deleteReportById 
} from './api/reportCrudService';

// Export the report generation functionality
export { generateSeoReport } from './api/reportGenerationService';

// Export PageSpeed service
export { 
  fetchPageSpeedData,
  getPageSpeedData,
  savePageSpeedData,
  formatPageSpeedData
} from './api/pageSpeedService';

// Export file handling functionality
export { 
  uploadReportFiles,
  getFilePublicUrl,
  deleteReportFiles
} from './api/reportFileService';

// Export OpenAI processing functionality
export {
  processOpenAIReport,
  markReportAsFailed
} from './api/openaiProcessingService';

