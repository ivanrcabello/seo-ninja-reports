
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Phone, ArrowRight } from 'lucide-react';

interface CTASectionProps {
  isLoggedIn?: boolean;
}

const CTASection: React.FC<CTASectionProps> = ({ isLoggedIn }) => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-background/80 -z-10"></div>
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      
      <AnimatedContainer animation="fade" className="container px-4 mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Lleva tu negocio al siguiente nivel con SEO local profesional
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Comience hoy mismo y vea resultados tangibles en la visibilidad online de su negocio
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600">
            <a href="https://wa.me/34654633796" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              <span>Hablar por WhatsApp</span>
            </a>
          </Button>
          
          {isLoggedIn ? (
            <Button asChild size="lg" variant="outline">
              <Link to="/dashboard">
                Ir al dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild size="lg" variant="outline">
              <Link to="/paquetes">
                Ver paquetes SEO <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </AnimatedContainer>
    </section>
  );
};

export default CTASection;
