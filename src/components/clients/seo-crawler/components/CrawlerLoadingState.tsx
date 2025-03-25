
import React from 'react';
import { Loader2 } from 'lucide-react';

const CrawlerLoadingState: React.FC = () => {
  return (
    <div className="py-12 flex justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
};

export default CrawlerLoadingState;
