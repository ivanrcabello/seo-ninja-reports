
import React from 'react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { Button } from '@/components/ui/button';

interface PackCTAProps {
  title: string;
  description: string;
  buttonText?: string;
  delay?: number;
}

const PackCTA: React.FC<PackCTAProps> = ({ 
  title, 
  description, 
  buttonText = "Contratar Ahora", 
  delay = 0 
}) => {
  return (
    <AnimatedContainer animation="slide-up" delay={delay}>
      <BlurredCard>
        <div className="p-6 sm:p-8">
          <h3 className="text-2xl font-bold mb-4">{title}</h3>
          <p className="text-muted-foreground mb-6">{description}</p>
          <Button size="lg">{buttonText}</Button>
        </div>
      </BlurredCard>
    </AnimatedContainer>
  );
};

export default PackCTA;
