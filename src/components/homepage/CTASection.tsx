
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface CTASectionProps {
  isLoggedIn: boolean;
}

const CTASection: React.FC<CTASectionProps> = ({ isLoggedIn }) => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container px-4 sm:px-6 mx-auto">
        <BlurredCard className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 p-4 sm:p-6 md:p-8">
            <div className="flex-1">
              <AnimatedContainer animation="slide-up">
                <h2 className="text-3xl font-bold mb-4">Dos formas de potenciar tu SEO local</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Servicios SEO gestionados:</span> Deja que nuestro equipo de expertos y nuestra IA optimicen tu presencia local.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Acceso a la plataforma:</span> Utiliza nuestra tecnología de IA para gestionar el SEO de tus clientes.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  {isLoggedIn ? (
                    <Link to="/dashboard">
                      <Button size="lg" className="group">
                        Ir al Dashboard
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/auth">
                      <Button size="lg" className="group">
                        Probar la plataforma
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Button>
                    </Link>
                  )}
                  <Link to="/contacto">
                    <Button variant="outline" size="lg" className="group">
                      Solicitar demostración
                    </Button>
                  </Link>
                </div>
              </AnimatedContainer>
            </div>
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="w-full max-w-md md:max-w-xs lg:max-w-sm aspect-video bg-muted rounded-lg">
                {/* Placeholder for video/image */}
              </div>
            </div>
          </div>
        </BlurredCard>
      </div>
    </section>
  );
};

export default CTASection;
