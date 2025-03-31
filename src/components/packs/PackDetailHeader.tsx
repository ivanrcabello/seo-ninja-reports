
import React from 'react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PackDetailHeaderProps {
  title: string;
  description: string;
  subtitle?: string;
  price: string;
  period?: string;
  isPrimary?: boolean;
}

const PackDetailHeader: React.FC<PackDetailHeaderProps> = ({
  title,
  description,
  subtitle,
  price,
  period = '/mes',
  isPrimary = false
}) => {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className={`absolute inset-0 bg-gradient-to-b ${isPrimary ? 'from-primary/5 to-background' : 'from-blue-50 to-white dark:from-gray-900 dark:to-background'} opacity-50 -z-10`} />
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      
      <div className="container px-4 sm:px-6 mx-auto">
        <div className="max-w-4xl mx-auto">
          <Link to="/paquetes" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver a Paquetes</span>
          </Link>
          
          <AnimatedContainer animation="fade" className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
              Pack SEO
            </span>
          </AnimatedContainer>
          
          <AnimatedContainer animation="slide-up" delay={200} className="mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
              {title}
            </h1>
          </AnimatedContainer>
          
          <AnimatedContainer animation="slide-up" delay={400} className="mb-8">
            <p className="text-lg text-muted-foreground">
              {description}
            </p>
          </AnimatedContainer>
          
          <AnimatedContainer animation="slide-up" delay={600} className="mb-8">
            <div className="text-3xl sm:text-4xl font-bold">
              {price}<span className="text-muted-foreground text-xl">{period}</span>
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </section>
  );
};

export default PackDetailHeader;
