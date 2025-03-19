
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { Button } from '@/components/ui/button';
import PricingItem from './PricingItem';

interface PackCardProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  link: string;
  isPrimary?: boolean;
  delay?: number;
}

const PackCard: React.FC<PackCardProps> = ({ 
  title, 
  description, 
  price, 
  features, 
  link, 
  isPrimary = false, 
  delay = 0 
}) => {
  return (
    <AnimatedContainer animation="slide-up" delay={delay}>
      <BlurredCard className={`h-full ${isPrimary ? 'border-primary' : ''}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="mb-4">
            <h3 className="text-2xl font-bold">{title}</h3>
            <p className="text-muted-foreground mt-2">{description}</p>
          </div>
          
          <div className="mb-6">
            <span className="text-4xl font-bold">{price}</span>
            <span className="text-muted-foreground">/mes</span>
          </div>
          
          <ul className="space-y-3 mb-8 flex-1">
            {features.map((feature, index) => (
              <PricingItem key={index}>{feature}</PricingItem>
            ))}
          </ul>
          
          <Link to={link}>
            <Button className="w-full flex items-center justify-center">
              Ver detalles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </BlurredCard>
    </AnimatedContainer>
  );
};

export default PackCard;
