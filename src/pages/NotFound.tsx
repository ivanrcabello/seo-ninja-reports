
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { FileQuestion } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      
      <BlurredCard className="text-center max-w-md">
        <AnimatedContainer animation="slide-down">
          <div className="flex flex-col items-center justify-center py-8">
            <FileQuestion className="h-20 w-20 text-primary/50 mb-6" />
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-xl text-muted-foreground mb-8">Oops! Page not found</p>
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </AnimatedContainer>
      </BlurredCard>
    </div>
  );
};

export default NotFound;
