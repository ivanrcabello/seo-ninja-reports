
import React, { useEffect, useState } from 'react';
import { CrawlLink, CrawlPage } from '@/services/seo-crawler/types';
import { Loader2 } from 'lucide-react';
import LinksTabContent from './LinksTabContent';
import { getPageLinks } from '@/services/seo-crawler/api/pageQueries';
import { toast } from 'sonner';

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
  
  // If we don't have links in props, try to fetch them directly
  useEffect(() => {
    const fetchLinks = async () => {
      if (selectedPage?.id) {
        setLocalLoading(true);
        setFetchAttempted(true);
        try {
          console.log("[LinksTab] Fetching links directly for page:", selectedPage.id);
          const fetchedLinks = await getPageLinks(selectedPage.id);
          console.log("[LinksTab] Fetched links directly:", fetchedLinks.length);
          
          if (fetchedLinks.length === 0) {
            console.log("[LinksTab] No links found for this page. This might be expected for some pages.");
          }
          
          // Process the links to ensure they have all required properties
          const formattedLinks: CrawlLink[] = fetchedLinks.map(link => ({
            id: link.id || '',
            crawl_id: link.crawl_id || '',
            page_id: link.page_id || '',
            url: link.url || '',
            text: link.anchor_text || link.link_text || '',
            anchor_text: link.anchor_text || link.link_text || '',
            is_internal: typeof link.is_internal === 'boolean' ? link.is_internal : false,
            is_followed: typeof link.follow === 'boolean' ? link.follow : true,
            follow: typeof link.follow === 'boolean' ? link.follow : true,
            is_broken: typeof link.is_broken === 'boolean' ? link.is_broken : false,
            status_code: link.status_code || 200,
            created_at: link.created_at || new Date().toISOString(),
            rel_attributes: link.rel_attributes || [],
            link_location: link.link_location || '',
            link_type: link.link_type || '',
            nofollow: link.nofollow || false,
            link_text: link.link_text || link.anchor_text || '',
            page_url: selectedPage.url || '' // Use the page URL from selectedPage
          }));
          
          console.log("[LinksTab] Formatted links:", formattedLinks.length);
          setLocalLinks(formattedLinks);
        } catch (error) {
          console.error("[LinksTab] Error fetching links:", error);
          toast.error('Error al cargar los enlaces');
          setLocalLinks([]); // Set empty array on error
        } finally {
          setLocalLoading(false);
        }
      }
    };
    
    // Only fetch directly if we don't have links from parent component
    if ((!pageLinks || pageLinks.length === 0) && selectedPage?.id) {
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
    }
  }, [selectedPage?.id, pageLinks]);
  
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
    />
  );
};

export default LinksTab;
