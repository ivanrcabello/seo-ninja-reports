
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Medal, Target, TrendingUp, Shield, Users, Laptop } from 'lucide-react';
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
                <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  <a href="https://wa.me/34654633796" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    WhatsApp <ArrowRight className="w-4 h-4" />
                  </a>
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
            <h3 className="text-lg font-medium mb-2">Garantía de resultados</h3>
            <p className="text-muted-foreground">Nos comprometemos con resultados tangibles y medibles para su negocio o le devolvemos su inversión.</p>
          </AnimatedContainer>
          
          <AnimatedContainer animation="fade" delay={300} className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Users className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">Expertos en posicionamiento SEO</h3>
            <p className="text-muted-foreground">Especialistas en posicionamiento de empresas y negocios de servicios con resultados comprobados.</p>
          </AnimatedContainer>
          
          <AnimatedContainer animation="fade" delay={400} className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Laptop className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">Área de cliente propia</h3>
            <p className="text-muted-foreground">Acceda a informes, seguimiento de su campaña y resultados en tiempo real en su área personalizada.</p>
          </AnimatedContainer>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
