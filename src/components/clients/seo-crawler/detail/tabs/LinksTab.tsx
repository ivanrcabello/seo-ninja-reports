
import React, { useEffect, useState } from 'react';
import { CrawlLink, CrawlPage } from '@/services/seo-crawler/types';
import { Loader2 } from 'lucide-react';
import LinksTabContent from './LinksTabContent';
import { getPageLinks } from '@/services/seo-crawler/api/pageQueries';
import { toast } from 'sonner';
import { extractLinks, categorizeLinks } from '@/services/seo-crawler/api/linkExtractor';

interface LinksTabProps {
  pageLinks: CrawlLink[];
  selectedPage: CrawlPage | null;
  pages: CrawlPage[];
  onPageSelect: (page: CrawlPage) => void;
  isLoading?: boolean;
}

const LinksTab: React.FC<LinksTabProps> = ({ 
  pageLinks, 
  selectedPage,
  pages,
  onPageSelect,
  isLoading = false 
}) => {
  console.log("[LinksTab] Rendering with links:", pageLinks?.length || 0);
  
  // Additional state to handle the links fetching directly if needed
  const [localLinks, setLocalLinks] = useState<CrawlLink[]>([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // If we don't have links in props, try to fetch them directly
  useEffect(() => {
    const fetchLinks = async () => {
      if (!selectedPage?.id) return;
      
      setLocalLoading(true);
      setFetchAttempted(true);
      setFetchError(null);
      
      try {
        console.log("[LinksTab] Fetching links directly for page:", selectedPage.id);
        let fetchedLinks = await getPageLinks(selectedPage.id);
        console.log("[LinksTab] Fetched links directly:", fetchedLinks.length);
        
        // If we don't have links from the database, let's try to extract them from the page HTML content
        if (fetchedLinks.length === 0 && selectedPage.html_content) {
          console.log("[LinksTab] No links in database, attempting to extract from HTML content");
          try {
            const extractedRawLinks = extractLinks(selectedPage.html_content, selectedPage.url || '');
            const { internalLinks, externalLinks } = categorizeLinks(extractedRawLinks, selectedPage.url || '');
            fetchedLinks = [...internalLinks, ...externalLinks].map((link, index) => ({
              ...link,
              id: `extracted-${index}`,
              crawl_id: selectedPage.crawl_id || '',
              page_id: selectedPage.id || '',
              text: link.anchor_text || link.link_text || '',
              created_at: new Date().toISOString(),
            }));
            console.log("[LinksTab] Extracted links from HTML:", fetchedLinks.length);
          } catch (extractError) {
            console.error("[LinksTab] Error extracting links from HTML:", extractError);
          }
        }
        
        if (fetchedLinks.length === 0) {
          console.log("[LinksTab] No links found for this page. This might be expected for some pages.");
        }
        
        // Ensure all links have required properties
        const formattedLinks: CrawlLink[] = fetchedLinks.map(link => ({
          ...link,
          text: link.text || link.anchor_text || link.link_text || '',
          anchor_text: link.anchor_text || link.text || link.link_text || '',
          is_internal: typeof link.is_internal === 'boolean' ? link.is_internal : false,
          is_followed: typeof link.is_followed === 'boolean' ? link.is_followed : true,
          follow: typeof link.follow === 'boolean' ? link.follow : true,
          link_text: link.link_text || link.text || link.anchor_text || '',
          created_at: link.created_at || new Date().toISOString(),
        }));
        
        console.log("[LinksTab] Formatted links:", formattedLinks.length);
        setLocalLinks(formattedLinks);
      } catch (error) {
        console.error("[LinksTab] Error fetching links:", error);
        toast.error('Error al cargar los enlaces');
        setFetchError('Error al obtener los enlaces de esta página');
        setLocalLinks([]); // Set empty array on error
      } finally {
        setLocalLoading(false);
      }
    };
    
    // Reset state when page changes
    if (selectedPage?.id) {
      setLocalLinks([]);
      setFetchError(null);
      setFetchAttempted(false);
      
      // Only fetch directly if we don't have links from parent component
      if ((!pageLinks || pageLinks.length === 0) || retryCount > 0) {
        fetchLinks();
      } else if (pageLinks && pageLinks.length > 0) {
        // Use provided links but ensure they're properly formatted
        const formattedLinks = pageLinks.map(link => ({
          ...link,
          text: link.text || link.anchor_text || link.link_text || '',
          anchor_text: link.anchor_text || link.text || link.link_text || '',
          is_internal: typeof link.is_internal === 'boolean' ? link.is_internal : false,
          is_followed: typeof link.is_followed === 'boolean' ? link.is_followed : true,
          follow: typeof link.follow === 'boolean' ? link.follow : true,
          link_text: link.link_text || link.text || link.anchor_text || '',
          created_at: link.created_at || new Date().toISOString(),
        }));
        setLocalLinks(formattedLinks);
        setFetchAttempted(true);
        setFetchError(null);
      }
    }
  }, [selectedPage?.id, pageLinks, retryCount]);
  
  // Function to handle retrying the fetch
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };
  
  // Use either provided links or locally fetched ones
  const effectiveLinks = (pageLinks && pageLinks.length > 0) ? pageLinks : localLinks;
  const effectiveLoading = isLoading || localLoading;
  
  if (effectiveLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <LinksTabContent 
      pageLinks={effectiveLinks} 
      selectedPage={selectedPage}
      pages={pages}
      onPageSelect={onPageSelect}
      fetchAttempted={fetchAttempted}
      fetchError={fetchError}
      onRetryFetch={handleRetry}
    />
  );
};

export default LinksTab;
