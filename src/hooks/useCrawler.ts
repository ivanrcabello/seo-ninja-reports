
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { CrawlResult } from '@/services/seo-crawler/types';

export function useCrawler() {
  const [crawls, setCrawls] = useState<CrawlResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in a real implementation, this would be fetched from an API
  useEffect(() => {
    const mockCrawls: CrawlResult[] = [
      {
        id: '1',
        client_id: '123',
        domain: 'example.com',
        url: 'https://example.com',
        status: 'completed',
        started_at: new Date().toISOString(),
        pages_crawled: 10,
        total_pages: 15,
        total_issues: 5,
        total_links: 100,
        total_internal_links: 80,
        total_external_links: 20,
        total_broken_links: 2,
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
