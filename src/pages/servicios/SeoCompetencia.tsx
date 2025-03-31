
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { CheckCircle, ArrowRight, BarChart3, Zap, Target } from 'lucide-react';
import BlurredCard from '@/components/ui/BlurredCard';

const SeoCompetencia = () => {
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
                  Análisis de <br className="hidden sm:inline" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                    Competencia SEO
                  </span>
                </h1>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={400} className="mb-8">
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Descubra las estrategias de sus competidores y desarrolle tácticas para superarlos en los resultados de búsqueda locales.
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
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">¿Por qué analizar a su competencia?</h2>
              <p className="text-lg text-muted-foreground">
                Conocer las estrategias de sus competidores le proporciona información valiosa para optimizar su propia estrategia SEO
              </p>
            </AnimatedContainer>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatedContainer animation="slide-up">
                <BlurredCard className="h-full">
                  <div className="p-6 flex flex-col h-full">
                    <div className="p-3 bg-primary/10 rounded-lg w-fit mb-5">
                      <BarChart3 className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Benchmark Competitivo</h3>
                    <p className="text-muted-foreground">
                      Identifique exactamente dónde se encuentra su negocio en comparación con sus competidores directos.
                    </p>
                  </div>
                </BlurredCard>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={200}>
                <BlurredCard className="h-full">
                  <div className="p-6 flex flex-col h-full">
                    <div className="p-3 bg-primary/10 rounded-lg w-fit mb-5">
                      <Target className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Oportunidades Ocultas</h3>
                    <p className="text-muted-foreground">
                      Descubra nichos y palabras clave que sus competidores están desaprovechando y que puede capitalizar.
                    </p>
                  </div>
                </BlurredCard>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={400}>
                <BlurredCard className="h-full">
                  <div className="p-6 flex flex-col h-full">
                    <div className="p-3 bg-primary/10 rounded-lg w-fit mb-5">
                      <Zap className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Estrategias Ganadoras</h3>
                    <p className="text-muted-foreground">
                      Identifique qué tácticas están funcionando en su sector y adáptelas para mejorar su rendimiento.
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
                  Nuestro servicio de análisis de competencia
                </h2>
                
                <p className="text-xl text-muted-foreground mb-8">
                  Utilizamos herramientas profesionales para analizar en profundidad las estrategias SEO de sus competidores directos y convertir esa información en ventajas competitivas.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Análisis de palabras clave</h3>
                      <p className="text-muted-foreground">Identificación de las keywords por las que rankean sus principales competidores.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Estudio de backlinks</h3>
                      <p className="text-muted-foreground">Análisis del perfil de enlaces de su competencia para identificar oportunidades.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Análisis de contenido</h3>
                      <p className="text-muted-foreground">Evaluación de las estrategias de contenido que están funcionando en su sector.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Plan de acción competitivo</h3>
                      <p className="text-muted-foreground">Desarrollo de estrategias específicas para superar a sus competidores.</p>
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
                <h3 className="text-2xl font-bold mb-6">¿Qué incluye nuestro análisis?</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">1</div>
                    <div>
                      <h4 className="font-medium">Identificación de competidores relevantes</h4>
                      <p className="text-muted-foreground text-sm">Seleccionamos los competidores que realmente importan en su mercado local.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">2</div>
                    <div>
                      <h4 className="font-medium">Análisis técnico comparativo</h4>
                      <p className="text-muted-foreground text-sm">Evaluamos los aspectos técnicos de las webs de sus competidores.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">3</div>
                    <div>
                      <h4 className="font-medium">Benchmarking de presencia local</h4>
                      <p className="text-muted-foreground text-sm">Comparamos su presencia en Google Business, directorios y mapas.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">4</div>
                    <div>
                      <h4 className="font-medium">Informe de recomendaciones</h4>
                      <p className="text-muted-foreground text-sm">Creamos un plan de acción priorizado para superar a sus competidores.</p>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Quiere saber cómo superarlos?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Contáctenos hoy para un análisis gratuito de su competencia local
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link to="/contacto">Solicitar análisis gratuito</Link>
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

export default SeoCompetencia;
