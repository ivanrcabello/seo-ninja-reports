
import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import HeroSection from '@/components/homepage/HeroSection';
import FeaturesSection from '@/components/homepage/FeaturesSection';
import CTASection from '@/components/homepage/CTASection';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  // Preload dashboard route for logged in users
  useEffect(() => {
    if (user) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = '/dashboard';
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <HeroSection isLoggedIn={isLoggedIn} />
        <FeaturesSection />
        
        {/* Blog section */}
        <section className="py-24">
          <div className="container px-4 mx-auto">
            <AnimatedContainer animation="fade" className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Últimos artículos del blog</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Recursos, consejos y guías para mejorar su estrategia SEO
              </p>
            </AnimatedContainer>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <AnimatedContainer animation="fade" delay={100} className="bg-white dark:bg-slate-900 rounded-lg shadow overflow-hidden flex flex-col">
                <div className="h-48 bg-slate-100 dark:bg-slate-800"></div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-sm text-muted-foreground mb-2">12 Junio, 2023</div>
                  <h3 className="text-xl font-bold mb-2">Cómo optimizar su Google Business Profile</h3>
                  <p className="text-muted-foreground mb-4 flex-1">Aprenda a sacar el máximo provecho de su ficha de Google para atraer más clientes locales.</p>
                  <Link to="/blog/optimizar-google-business" className="text-primary hover:underline flex items-center">
                    Leer más <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </AnimatedContainer>
              
              <AnimatedContainer animation="fade" delay={200} className="bg-white dark:bg-slate-900 rounded-lg shadow overflow-hidden flex flex-col">
                <div className="h-48 bg-slate-100 dark:bg-slate-800"></div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-sm text-muted-foreground mb-2">5 Junio, 2023</div>
                  <h3 className="text-xl font-bold mb-2">Las 10 mejores estrategias SEO local en 2023</h3>
                  <p className="text-muted-foreground mb-4 flex-1">Descubra las técnicas más efectivas para posicionar su negocio en búsquedas locales.</p>
                  <Link to="/blog/estrategias-seo-local" className="text-primary hover:underline flex items-center">
                    Leer más <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </AnimatedContainer>
              
              <AnimatedContainer animation="fade" delay={300} className="bg-white dark:bg-slate-900 rounded-lg shadow overflow-hidden flex flex-col">
                <div className="h-48 bg-slate-100 dark:bg-slate-800"></div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-sm text-muted-foreground mb-2">28 Mayo, 2023</div>
                  <h3 className="text-xl font-bold mb-2">Guía para conseguir más reseñas positivas</h3>
                  <p className="text-muted-foreground mb-4 flex-1">Estrategias prácticas para animar a sus clientes a dejar opiniones positivas en Google.</p>
                  <Link to="/blog/conseguir-resenas" className="text-primary hover:underline flex items-center">
                    Leer más <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </AnimatedContainer>
            </div>
            
            <div className="text-center">
              <Button asChild variant="outline">
                <Link to="/blog">Ver todos los artículos</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <CTASection isLoggedIn={isLoggedIn} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
