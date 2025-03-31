
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, ChevronRight } from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';

interface CTASectionProps {
  isLoggedIn: boolean;
}

const CTASection: React.FC<CTASectionProps> = ({ isLoggedIn }) => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AnimatedContainer animation="slide-up" className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Posicione su negocio con nuestra plataforma SEO avanzada
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8">
              También ofrecemos nuestra plataforma de SEO automatizada para agencias y empresas que desean gestionar su propio SEO con herramientas profesionales.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Informes SEO automatizados</h3>
                  <p className="text-muted-foreground">Genere informes profesionales con su marca para sus clientes.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Análisis de la competencia</h3>
                  <p className="text-muted-foreground">Compare su rendimiento con competidores directos.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Gestión de múltiples clientes</h3>
                  <p className="text-muted-foreground">Administre todos sus clientes desde un único panel.</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {isLoggedIn ? (
                <Button asChild size="lg" className="gap-2">
                  <Link to="/dashboard">Ir al panel <ArrowRight className="w-4 h-4" /></Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" variant="default" className="gap-2">
                    <Link to="/precios">Ver planes SaaS <ArrowRight className="w-4 h-4" /></Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/caracteristicas">Explorar plataforma</Link>
                  </Button>
                </>
              )}
            </div>
          </AnimatedContainer>
          
          <AnimatedContainer animation="slide-up" delay={300} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8 rounded-2xl border border-border">
            <h3 className="text-2xl font-bold mb-6">Preguntas frecuentes</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium flex items-center mb-2">
                  <ChevronRight className="h-5 w-5 text-primary mr-2" />
                  ¿Qué diferencia hay entre contratar sus servicios SEO y usar la plataforma?
                </h4>
                <p className="text-muted-foreground pl-7">
                  Con nuestros servicios SEO nosotros hacemos todo el trabajo, mientras que la plataforma es una herramienta para que usted mismo gestione el SEO de sus clientes.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium flex items-center mb-2">
                  <ChevronRight className="h-5 w-5 text-primary mr-2" />
                  ¿Cuánto tiempo se tarda en ver resultados con SEO local?
                </h4>
                <p className="text-muted-foreground pl-7">
                  Normalmente, nuestros clientes comienzan a ver mejoras en 2-3 meses, con resultados significativos entre 4-6 meses según la competencia del sector.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium flex items-center mb-2">
                  <ChevronRight className="h-5 w-5 text-primary mr-2" />
                  ¿Ofrecen algún tipo de garantía de resultados?
                </h4>
                <p className="text-muted-foreground pl-7">
                  Garantizamos mejoras medibles en el posicionamiento. Si no ve resultados en 6 meses, le ofrecemos un mes adicional sin coste.
                </p>
              </div>
              
              <div className="text-center mt-8">
                <Link to="/contacto" className="text-primary hover:underline flex items-center justify-center">
                  Ver más preguntas frecuentes <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
