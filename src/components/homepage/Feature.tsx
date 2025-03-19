
import React from 'react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const Feature: React.FC<FeatureProps> = ({
  icon,
  title,
  description,
  delay = 0
}) => {
  return (
    <AnimatedContainer animation="slide-up" delay={delay}>
      <BlurredCard className="h-full">
        <div className="flex flex-col h-full">
          <div className="p-3 bg-primary/10 rounded-lg w-fit mb-5">
            {icon}
          </div>
          <h3 className="text-xl font-medium mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </BlurredCard>
    </AnimatedContainer>
  );
};

export default Feature;
