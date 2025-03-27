
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define the CrawlResult type
interface CrawlResult {
  id: string;
  domain: string;
  url: string;
  status: string;
  pages_crawled: number;
  total_pages: number;
  total_issues: number;
  createdAt?: string;
  updatedAt?: string;
}

export function useCrawler() {
  const [crawls, setCrawls] = useState<CrawlResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in a real implementation, this would be fetched from an API
  useEffect(() => {
    const mockCrawls: CrawlResult[] = [
      {
        id: '1',
        domain: 'example.com',
        url: 'https://example.com',
        status: 'completed',
        pages_crawled: 10,
        total_pages: 15,
        total_issues: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setCrawls(mockCrawls);
      setIsLoading(false);
    }, 500);
  }, []);

  // Get a specific crawl by ID
  const getCrawl = (id: string): CrawlResult | undefined => {
    return crawls.find(crawl => crawl.id === id);
  };

  // Get all crawls for a client
  const getClientCrawls = (clientId: string): CrawlResult[] => {
    // In a real implementation, this would filter crawls by client ID
    return crawls;
  };

  return {
    crawls,
    isLoading,
    getCrawl,
    getClientCrawls
  };
}
