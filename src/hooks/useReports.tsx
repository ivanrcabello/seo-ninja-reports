
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';

export interface Report {
  id: string;
  clientId: string;
  title: string;
  date: string;
  status: 'processing' | 'completed' | 'failed';
  url?: string;
  summary?: string;
  content?: {
    executiveSummary: string;
    technicalAnalysis: string;
    contentAnalysis: string;
    backlinksAnalysis: string;
    recommendations: string;
  };
}

interface ReportsContextType {
  reports: Report[];
  isLoading: boolean;
  getReport: (id: string) => Report | undefined;
  getClientReports: (clientId: string) => Report[];
  createReport: (data: Omit<Report, 'id' | 'date' | 'status'>) => Promise<Report>;
  updateReport: (id: string, data: Partial<Report>) => Promise<Report>;
  deleteReport: (id: string) => Promise<void>;
  generateReport: (clientId: string, url: string, files: File[]) => Promise<Report>;
}

// Create context
const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

// Mock data
const MOCK_REPORTS: Report[] = [
  {
    id: '1',
    clientId: '1',
    title: 'Initial SEO Audit',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    status: 'completed',
    url: 'https://acme.example.com',
    summary: 'Overall good performance but needs improvement in mobile optimization.',
    content: {
      executiveSummary: 'The website has good content and structure but needs improvements in mobile experience and page speed.',
      technicalAnalysis: 'Mobile score: 68/100\nDesktop score: 89/100\nSite loads in 3.2s on average.',
      contentAnalysis: 'Content is well-structured with clear headings. Some pages lack proper keyword optimization.',
      backlinksAnalysis: '156 backlinks from 42 domains. Strong profile but could use more diversity.',
      recommendations: '1. Optimize images for mobile\n2. Implement lazy loading\n3. Add schema markup\n4. Fix 3 broken links'
    }
  },
  {
    id: '2',
    clientId: '1',
    title: 'Keyword Analysis',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    status: 'completed',
    url: 'https://acme.example.com/products',
    summary: 'Identified 25 high-value keywords that could improve organic traffic by 30%.',
    content: {
      executiveSummary: 'Analysis shows significant opportunities for targeting industry-specific long-tail keywords.',
      technicalAnalysis: 'Current keyword density is appropriate but could be enhanced on product pages.',
      contentAnalysis: 'Blog content is ranking well but product descriptions need optimization.',
      backlinksAnalysis: 'Anchor text diversity is good but could use more keyword-specific backlinks.',
      recommendations: '1. Update meta descriptions with focus keywords\n2. Expand product descriptions\n3. Create content for 5 identified long-tail keywords'
    }
  },
  {
    id: '3',
    clientId: '2',
    title: 'Competitive Analysis',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    status: 'completed',
    url: 'https://globex.example.com',
    summary: 'Detailed analysis of 3 main competitors shows opportunities in video content and schema markup.',
    content: {
      executiveSummary: 'Competitors are outperforming in video content and local SEO. Significant opportunities identified.',
      technicalAnalysis: 'Competitors have faster page load times by 15% on average.',
      contentAnalysis: 'Competitors publish 2x more content but with inconsistent quality.',
      backlinksAnalysis: 'Main competitor has 30% more backlinks but lower domain authority.',
      recommendations: '1. Implement schema markup\n2. Create video content series\n3. Optimize for local search\n4. Increase publishing frequency with focus on quality'
    }
  }
];

export const ReportsProvider = ({ children }: { children: ReactNode }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load reports on mount (mock)
  useEffect(() => {
    const loadReports = async () => {
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Check local storage first
        const storedReports = localStorage.getItem('seo-ninja-reports');
        if (storedReports) {
          setReports(JSON.parse(storedReports));
        } else {
          // Use mock data as fallback
          setReports(MOCK_REPORTS);
          localStorage.setItem('seo-ninja-reports', JSON.stringify(MOCK_REPORTS));
        }
      } catch (error) {
        console.error('Error loading reports:', error);
        toast.error('Failed to load reports');
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, []);

  const getReport = (id: string) => {
    return reports.find(report => report.id === id);
  };

  const getClientReports = (clientId: string) => {
    return reports.filter(report => report.clientId === clientId);
  };

  const createReport = async (data: Omit<Report, 'id' | 'date' | 'status'>) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newReport: Report = {
        ...data,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        status: 'completed'
      };
      
      const updatedReports = [...reports, newReport];
      setReports(updatedReports);
      localStorage.setItem('seo-ninja-reports', JSON.stringify(updatedReports));
      
      toast.success('Report created successfully');
      return newReport;
    } catch (error) {
      console.error('Error creating report:', error);
      toast.error('Failed to create report');
      throw error;
    }
  };

  const updateReport = async (id: string, data: Partial<Report>) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const reportIndex = reports.findIndex(report => report.id === id);
      
      if (reportIndex === -1) {
        throw new Error('Report not found');
      }
      
      const updatedReport = {
        ...reports[reportIndex],
        ...data
      };
      
      const updatedReports = [...reports];
      updatedReports[reportIndex] = updatedReport;
      
      setReports(updatedReports);
      localStorage.setItem('seo-ninja-reports', JSON.stringify(updatedReports));
      
      toast.success('Report updated successfully');
      return updatedReport;
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Failed to update report');
      throw error;
    }
  };

  const deleteReport = async (id: string) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedReports = reports.filter(report => report.id !== id);
      setReports(updatedReports);
      localStorage.setItem('seo-ninja-reports', JSON.stringify(updatedReports));
      
      toast.success('Report deleted successfully');
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
      throw error;
    }
  };

  // Mock report generation with file upload
  const generateReport = async (clientId: string, url: string, files: File[]): Promise<Report> => {
    try {
      // Create a new report in processing state
      const newReport: Report = {
        id: crypto.randomUUID(),
        clientId,
        title: `SEO Analysis - ${new URL(url).hostname}`,
        date: new Date().toISOString(),
        status: 'processing',
        url
      };
      
      const updatedReports = [...reports, newReport];
      setReports(updatedReports);
      localStorage.setItem('seo-ninja-reports', JSON.stringify(updatedReports));
      
      toast.success('Report generation started');
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Update with generated content
      const completedReport: Report = {
        ...newReport,
        status: 'completed',
        summary: 'Analysis shows good technical foundation but opportunities for content improvement.',
        content: {
          executiveSummary: 'The website demonstrates solid technical fundamentals with good load speed and mobile responsiveness. Content quality is high but quantity could be improved, especially for targeting long-tail keywords. Backlink profile shows room for growth.',
          technicalAnalysis: 'Mobile score: 85/100\nDesktop score: 92/100\nSite loads in 2.4s on average.\nNo major crawl errors detected.\n4 minor mixed content warnings on blog pages.',
          contentAnalysis: 'Well-structured content with clear headings and good readability. Keyword density is appropriate but could be enhanced in certain sections. Blog frequency is below industry average at 2 posts/month vs recommended 6-8.',
          backlinksAnalysis: '137 backlinks from 48 referring domains. Domain authority is 38/100, which is good but below top competitors (avg 45). Link profile is clean with no toxic links detected.',
          recommendations: '1. Increase content publishing frequency to 6-8 posts/month\n2. Fix mixed content warnings on blog\n3. Target 5 identified long-tail keywords\n4. Implement schema markup for better rich snippets\n5. Develop outreach campaign to improve backlink profile'
        }
      };
      
      const finalReports = reports.map(report => 
        report.id === newReport.id ? completedReport : report
      );
      
      setReports(finalReports);
      localStorage.setItem('seo-ninja-reports', JSON.stringify(finalReports));
      
      toast.success('Report generated successfully');
      return completedReport;
    } catch (error) {
      console.error('Error generating report:', error);
      
      // Update to failed state
      const failedReports = reports.map(report => 
        report.id === report.id ? {...report, status: 'failed' as const} : report
      );
      
      setReports(failedReports);
      localStorage.setItem('seo-ninja-reports', JSON.stringify(failedReports));
      
      toast.error('Failed to generate report');
      throw error;
    }
  };

  const value = {
    reports,
    isLoading,
    getReport,
    getClientReports,
    createReport,
    updateReport,
    deleteReport,
    generateReport
  };

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
};

const useReports = () => {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};

export default useReports;
