
import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import HeroSection from '@/components/homepage/HeroSection';
import FeaturesSection from '@/components/homepage/FeaturesSection';
import CTASection from '@/components/homepage/CTASection';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { ArrowRight, UserCircle, Phone, Brain, Award, CheckCircle } from 'lucide-react';
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
        
        {/* Our Proprietary Method Section */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900/30">
          <div className="container px-4 mx-auto">
            <AnimatedContainer animation="fade" className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Nuestro método: <span className="text-primary">SeoBoost AI</span></h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Tras años de investigación y desarrollo, hemos creado un método propio que combina la inteligencia artificial con nuestra experiencia en SEO local para obtener resultados superiores.
              </p>
            </AnimatedContainer>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <AnimatedContainer animation="slide-up" delay={100} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Análisis con IA</h3>
                <p className="text-muted-foreground">
                  Nuestra plataforma utiliza algoritmos avanzados de IA para analizar su negocio, competencia y mercado local.
                </p>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={200} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Estrategia personalizada</h3>
                <p className="text-muted-foreground">
                  Creamos un plan SEO único basado en datos reales y adaptado específicamente a su negocio y sector.
                </p>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={300} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Optimización continua</h3>
                <p className="text-muted-foreground">
                  Mejoramos constantemente su estrategia gracias a nuestro sistema de aprendizaje automático que se adapta a los cambios del mercado.
                </p>
              </AnimatedContainer>
            </div>
          </div>
        </section>
        
        <FeaturesSection />
        
        {/* Client Portal Section */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900">
          <div className="container px-4 mx-auto">
            <AnimatedContainer animation="fade" className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Área de Clientes</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                Acceda a sus informes, facturas y seguimiento de campañas SEO en un solo lugar
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/portal" className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    Acceder al área de clientes
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-emerald-500 hover:bg-emerald-600 text-white border-0">
                  <a href="https://wa.me/34654633796" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contactar por WhatsApp
                  </a>
                </Button>
              </div>
            </AnimatedContainer>
          </div>
        </section>
        
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
