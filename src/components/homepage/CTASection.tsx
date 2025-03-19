
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { ArrowRight } from 'lucide-react';

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
                <h2 className="text-3xl font-bold mb-4">¿Listo para Transformar tu Estrategia SEO?</h2>
                <p className="text-muted-foreground mb-6">
                  Únete a miles de especialistas en marketing y profesionales SEO que ahorran tiempo y mejoran resultados con nuestros informes SEO automatizados.
                </p>
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
                        Comenzar
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Button>
                    </Link>
                  )}
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
