
import React from 'react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export interface PackCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  delay?: number;
}

const PackCTA: React.FC<PackCTAProps> = ({ 
  title = "¿Listo para mejorar tu posicionamiento?", 
  description = "Contrata ahora uno de nuestros packs SEO y empieza a ver resultados en tu negocio.", 
  buttonText = "Contactar ahora", 
  buttonLink = "/contacto",
  delay = 0 
}) => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container px-4 sm:px-6 mx-auto">
        <AnimatedContainer animation="slide-up" delay={delay}>
          <BlurredCard>
            <div className="p-6 sm:p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">{title}</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">{description}</p>
              <Button asChild size="lg">
                <Link to={buttonLink}>{buttonText}</Link>
              </Button>
            </div>
          </BlurredCard>
        </AnimatedContainer>
      </div>
    </section>
  );
};

export default PackCTA;
