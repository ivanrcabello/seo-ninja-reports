
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
          
          // The links should already be in the correct format from getPageLinks
          setLocalLinks(fetchedLinks);
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
