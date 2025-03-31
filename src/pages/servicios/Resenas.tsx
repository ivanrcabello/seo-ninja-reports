
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { CheckCircle, ArrowRight, MessageSquare, Star, ThumbsUp } from 'lucide-react';
import BlurredCard from '@/components/ui/BlurredCard';

const Resenas = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background opacity-50 -z-10" />
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </div>
          
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <AnimatedContainer animation="fade" className="mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  Servicios SEO
                </span>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={200} className="mb-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
                  Gestión de <br className="hidden sm:inline" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                    Reseñas Online
                  </span>
                </h1>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={400} className="mb-8">
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Aumente su reputación online con estrategias efectivas para conseguir más opiniones positivas y gestionar profesionalmente las reseñas negativas.
                </p>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={600} className="flex justify-center gap-4">
                <Button size="lg" asChild>
                  <Link to="/paquetes">Ver paquetes</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contacto">Solicitar consulta gratuita</Link>
                </Button>
              </AnimatedContainer>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900/20">
          <div className="container px-4 sm:px-6 mx-auto">
            <AnimatedContainer animation="slide-up" className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">El poder de las reseñas positivas</h2>
              <p className="text-lg text-muted-foreground">
                Las opiniones de sus clientes son un factor clave para atraer nuevos clientes y mejorar su posicionamiento en Google
              </p>
            </AnimatedContainer>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatedContainer animation="slide-up">
                <BlurredCard className="h-full">
                  <div className="p-6 flex flex-col h-full">
                    <div className="p-3 bg-primary/10 rounded-lg w-fit mb-5">
                      <Star className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Mejora del SEO local</h3>
                    <p className="text-muted-foreground">
                      Las reseñas positivas son un factor de clasificación importante en Google para búsquedas locales.
                    </p>
                  </div>
                </BlurredCard>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={200}>
                <BlurredCard className="h-full">
                  <div className="p-6 flex flex-col h-full">
                    <div className="p-3 bg-primary/10 rounded-lg w-fit mb-5">
                      <ThumbsUp className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Aumento de confianza</h3>
                    <p className="text-muted-foreground">
                      El 93% de los consumidores afirman que las reseñas influyen en sus decisiones de compra.
                    </p>
                  </div>
                </BlurredCard>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={400}>
                <BlurredCard className="h-full">
                  <div className="p-6 flex flex-col h-full">
                    <div className="p-3 bg-primary/10 rounded-lg w-fit mb-5">
                      <MessageSquare className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Feedback valioso</h3>
                    <p className="text-muted-foreground">
                      Las reseñas proporcionan información útil para mejorar sus servicios y operaciones.
                    </p>
                  </div>
                </BlurredCard>
              </AnimatedContainer>
            </div>
          </div>
        </section>
        
        {/* Service Details */}
        <section className="py-16 sm:py-24">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <AnimatedContainer animation="slide-up" className="max-w-xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Nuestro servicio de gestión de reseñas
                </h2>
                
                <p className="text-xl text-muted-foreground mb-8">
                  Implementamos estrategias efectivas para aumentar la cantidad y calidad de sus reseñas online, mejorando su reputación y visibilidad.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Sistema de solicitud de reseñas</h3>
                      <p className="text-muted-foreground">Implementación de procesos automáticos para solicitar opiniones a sus clientes.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Gestión de respuestas</h3>
                      <p className="text-muted-foreground">Respuestas profesionales a todas las reseñas, tanto positivas como negativas.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Monitorización de plataformas</h3>
                      <p className="text-muted-foreground">Seguimiento de reseñas en múltiples plataformas (Google, Facebook, Yelp, etc.).</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Análisis y reportes</h3>
                      <p className="text-muted-foreground">Informes mensuales sobre la evolución de su reputación online.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" variant="default" className="gap-2">
                    <Link to="/paquetes">Ver planes disponibles <ArrowRight className="w-4 h-4" /></Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/contacto">Consultar sin compromiso</Link>
                  </Button>
                </div>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={300} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8 rounded-2xl border border-border">
                <h3 className="text-2xl font-bold mb-6">¿Cómo funciona nuestro proceso?</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">1</div>
                    <div>
                      <h4 className="font-medium">Análisis inicial</h4>
                      <p className="text-muted-foreground text-sm">Evaluamos su situación actual de reseñas y reputación online.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">2</div>
                    <div>
                      <h4 className="font-medium">Implementación de estrategia</h4>
                      <p className="text-muted-foreground text-sm">Creamos un sistema personalizado para la solicitud y gestión de reseñas.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">3</div>
                    <div>
                      <h4 className="font-medium">Monitorización continua</h4>
                      <p className="text-muted-foreground text-sm">Seguimiento constante de nuevas reseñas y respuesta oportuna.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">4</div>
                    <div>
                      <h4 className="font-medium">Optimización y mejora</h4>
                      <p className="text-muted-foreground text-sm">Ajuste de la estrategia en función de los resultados para maximizar el impacto.</p>
                    </div>
                  </div>
                </div>
              </AnimatedContainer>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900/20">
          <div className="container px-4 sm:px-6 mx-auto text-center">
            <AnimatedContainer animation="fade" className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para mejorar su reputación online?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Contáctenos hoy mismo para una evaluación gratuita de su situación actual
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link to="/contacto">Solicitar evaluación gratuita</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/paquetes">Ver todos los paquetes</Link>
                </Button>
              </div>
            </AnimatedContainer>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Resenas;
