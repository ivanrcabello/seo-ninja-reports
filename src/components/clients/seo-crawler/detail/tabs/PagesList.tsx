
import React from 'react';
import { CrawlPage } from '@/services/seo-crawler';
import { Badge } from '@/components/ui/badge';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AnimatedContainer from '@/components/ui/AnimatedContainer';

interface PagesListProps {
  pages: CrawlPage[];
  selectedPage: CrawlPage | null;
  onPageSelect: (page: CrawlPage) => void;
}

const PagesList: React.FC<PagesListProps> = ({
  pages,
  selectedPage,
  onPageSelect
}) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Páginas analizadas</CardTitle>
        <CardDescription>
          Total: {pages.length} páginas
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto">
          {pages.map((page, index) => (
            <AnimatedContainer
              key={page.id}
              animation="fade"
              delay={index * 50}
            >
              <div 
                className={`p-3 border-b cursor-pointer flex items-start hover:bg-muted/50 ${
                  selectedPage?.id === page.id ? 'bg-muted' : ''
                }`}
                onClick={() => onPageSelect(page)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-1">
                    <Badge 
                      variant="outline" 
                      className={
                        page.status_code >= 200 && page.status_code < 300
                          ? 'bg-green-100 text-green-800'
                          : page.status_code >= 300 && page.status_code < 400
                          ? 'bg-yellow-100 text-yellow-800'
                          : page.status_code >= 400
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {page.status_code}
                    </Badge>
                    
                    {!page.is_indexable && (
                      <Badge variant="outline" className="ml-2 bg-red-100 text-red-800">
                        No indexable
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm font-medium truncate">
                    {page.url.replace(/^https?:\/\//, '')}
                  </p>
                  
                  {page.title && (
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {page.title}
                    </p>
                  )}
                </div>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </CardContent>
    </>
  );
};

export default PagesList;
