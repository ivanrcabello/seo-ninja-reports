
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Medal } from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';

interface HeroSectionProps {
  isLoggedIn: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isLoggedIn }) => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.03] -z-10"></div>
      
      <div className="container px-4 mx-auto max-w-6xl">
        <AnimatedContainer animation="fade" className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
            <Medal className="w-4 h-4 mr-2" />
            <span>Especialistas en posicionamiento SEO</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">
            Posiciona tu negocio local en los primeros resultados
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Ayudamos a empresas y autónomos a conseguir más clientes a través de Google.
            Somos expertos en SEO local y posicionamiento web.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {isLoggedIn ? (
              <>
                <Button asChild size="lg" className="gap-2">
                  <Link to="/dashboard">Ir al panel <ArrowRight className="w-4 h-4" /></Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" variant="default" className="gap-2">
                  <Link to="/portal">Área de clientes <ArrowRight className="w-4 h-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2">
                  <Link to="/auth">Acceso administración</Link>
                </Button>
              </>
            )}
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
};

export default HeroSection;
