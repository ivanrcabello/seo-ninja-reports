
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

interface HeroSectionProps {
  isLoggedIn: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isLoggedIn }) => {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background opacity-50 -z-10" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      
      <div className="container px-4 sm:px-6 mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <AnimatedContainer animation="fade" className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
              Mejora tu Estrategia SEO
            </span>
          </AnimatedContainer>
          
          <AnimatedContainer animation="slide-up" delay={200} className="mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
              Informes SEO Automáticos <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                En Minutos
              </span>
            </h1>
          </AnimatedContainer>
          
          <AnimatedContainer animation="slide-up" delay={400} className="mb-8">
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sube tus datos, documentos y capturas de pantalla. 
              Nuestra IA analiza todo y genera informes SEO completos y 
              accionables que impulsan resultados.
            </p>
          </AnimatedContainer>
          
          <AnimatedContainer animation="scale" delay={600}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isLoggedIn ? (
                <Link to="/dashboard">
                  <Button size="lg" className="group font-medium">
                    Ir al Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" className="group font-medium">
                    Comenzar
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="lg">
                Saber Más
              </Button>
            </div>
          </AnimatedContainer>
        </div>
        
        {/* Preview Image */}
        <AnimatedContainer animation="fade" delay={800} className="mt-16 max-w-5xl mx-auto">
          <BlurredCard className="relative overflow-hidden h-[350px] sm:h-[450px]">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-left">
              <h3 className="text-2xl font-bold mb-2">Panel de Control SEO Completo</h3>
              <p className="text-muted-foreground mb-4">
                Sigue tu rendimiento SEO con visualizaciones intuitivas e insights accionables.
              </p>
              <Button variant="outline" size="sm" className="group">
                Ver Demo
                <ArrowUpRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Button>
            </div>
          </BlurredCard>
        </AnimatedContainer>
      </div>
    </section>
  );
};

export default HeroSection;
