
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const PublicReportLoading = () => {
  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-8">
      <div className="bg-background/80 border border-primary/10 rounded-lg shadow-lg p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicReportLoading;
