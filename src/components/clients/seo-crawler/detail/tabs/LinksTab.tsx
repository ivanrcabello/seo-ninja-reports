
import React, { useEffect, useState } from 'react';
import { CrawlLink, CrawlPage } from '@/services/seo-crawler/types';
import { Loader2 } from 'lucide-react';
import LinksTabContent from './LinksTabContent';
import { getCrawlLinks, getPageLinks } from '@/services/seo-crawler/api/pageQueries';

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
  console.log("[LinksTab] Rendering with links:", pageLinks.length);
  
  // Additional state to handle the links fetching directly if needed
  const [localLinks, setLocalLinks] = useState<CrawlLink[]>([]);
  const [localLoading, setLocalLoading] = useState(false);
  
  // If we don't have links in props, try to fetch them directly
  useEffect(() => {
    const fetchLinks = async () => {
      if (pageLinks.length === 0 && selectedPage) {
        setLocalLoading(true);
        try {
          console.log("[LinksTab] Fetching links directly for page:", selectedPage.id);
          const fetchedLinks = await getPageLinks(selectedPage.id);
          console.log("[LinksTab] Fetched links directly:", fetchedLinks.length);
          
          // Convert the fetched links to the CrawlLink format with all required properties
          const formattedLinks: CrawlLink[] = fetchedLinks.map(link => ({
            id: link.id,
            crawl_id: link.crawl_id,
            page_id: link.page_id,
            url: link.url,
            text: link.link_text || link.anchor_text || '',
            anchor_text: link.anchor_text || link.link_text || '',
            is_internal: link.is_internal,
            is_followed: link.follow !== undefined ? link.follow : true,
            follow: link.follow !== undefined ? link.follow : true,
            is_broken: link.is_broken || false,
            status_code: link.status_code || 200,
            created_at: new Date().toISOString(),
            rel_attributes: link.rel_attributes || [],
            link_text: link.link_text || link.anchor_text || '',
            link_location: link.link_location || '',
            link_type: link.link_type || '',
            nofollow: link.nofollow || false,
            page_url: '' // Add empty string as default
          }));
          
          setLocalLinks(formattedLinks);
        } catch (error) {
          console.error("[LinksTab] Error fetching links:", error);
        } finally {
          setLocalLoading(false);
        }
      } else {
        setLocalLinks([]);
      }
    };
    
    fetchLinks();
  }, [selectedPage, pageLinks.length]);
  
  // Use either provided links or locally fetched ones
  const effectiveLinks = pageLinks.length > 0 ? pageLinks : localLinks;
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
    />
  );
};

export default LinksTab;
