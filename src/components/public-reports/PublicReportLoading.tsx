
import React from 'react';
import BlurredCard from '@/components/ui/BlurredCard';

const PublicReportLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <BlurredCard className="w-full max-w-4xl p-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-primary/10 rounded-full w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-primary/10 rounded-full w-1/2 mx-auto mb-8"></div>
          <div className="h-32 bg-primary/5 rounded-lg w-full mx-auto"></div>
        </div>
      </BlurredCard>
    </div>
  );
};

export default PublicReportLoading;
