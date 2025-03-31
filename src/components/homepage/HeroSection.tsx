
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Medal, Target, TrendingUp } from 'lucide-react';
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
            <span>Especialistas en SEO para negocios locales</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">
            Aumente sus clientes con SEO local profesional
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Ayudamos a pequeñas empresas y profesionales de servicios a conseguir más clientes a través de Google con nuestros paquetes de posicionamiento local.
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
                  <Link to="/paquetes">Ver paquetes SEO <ArrowRight className="w-4 h-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2">
                  <Link to="/portal">Área de clientes</Link>
                </Button>
              </>
            )}
          </div>
        </AnimatedContainer>
      </div>
      
      <div className="container px-4 mx-auto max-w-6xl mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatedContainer animation="fade" delay={200} className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Target className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">Estrategia personalizada</h3>
            <p className="text-muted-foreground">Analizamos su negocio y competencia para crear un plan SEO completamente adaptado a sus necesidades.</p>
          </AnimatedContainer>
          
          <AnimatedContainer animation="fade" delay={300} className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">Resultados medibles</h3>
            <p className="text-muted-foreground">Informes mensuales detallados para que pueda ver cómo mejora su presencia online y aumentan sus visitas.</p>
          </AnimatedContainer>
          
          <AnimatedContainer animation="fade" delay={400} className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Medal className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">Especialistas en local</h3>
            <p className="text-muted-foreground">Nos especializamos en posicionamiento para negocios de servicios locales como fontaneros, abogados o fisioterapeutas.</p>
          </AnimatedContainer>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
