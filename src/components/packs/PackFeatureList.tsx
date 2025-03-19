
import React from 'react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { Check } from 'lucide-react';

interface PackFeatureListProps {
  features: string[];
  delay?: number;
}

const PackFeatureList: React.FC<PackFeatureListProps> = ({ features, delay = 0 }) => {
  return (
    <AnimatedContainer animation="slide-up" delay={delay}>
      <BlurredCard>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Características Incluidas</h3>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </BlurredCard>
    </AnimatedContainer>
  );
};

export default PackFeatureList;
