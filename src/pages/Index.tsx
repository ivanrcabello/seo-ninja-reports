
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { ArrowRight, FileText, BarChart, Zap, Search, Layers, ArrowUpRight } from 'lucide-react';
import useAuth from '@/hooks/useAuth';

const Index = () => {
  const { user } = useAuth();

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
                  {user ? (
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
        
        {/* Features Section */}
        <section className="py-16 sm:py-24">
          <div className="container px-4 sm:px-6 mx-auto">
            <AnimatedContainer animation="slide-up" className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Informes SEO Todo-en-uno</h2>
              <p className="text-lg text-muted-foreground">
                Genera informes completos que analizan todos los aspectos del rendimiento SEO de tu sitio web.
              </p>
            </AnimatedContainer>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Feature
                icon={<Search className="h-10 w-10 text-primary" />}
                title="Análisis Técnico"
                description="Evalúa la velocidad del sitio, compatibilidad móvil, rastreabilidad y otros factores técnicos que afectan tu SEO."
                delay={0}
              />
              <Feature
                icon={<FileText className="h-10 w-10 text-primary" />}
                title="Evaluación de Contenido"
                description="Obtén información detallada sobre la calidad del contenido, uso de palabras clave, legibilidad y oportunidades de mejora."
                delay={100}
              />
              <Feature
                icon={<Layers className="h-10 w-10 text-primary" />}
                title="Análisis de Backlinks"
                description="Revisa la calidad, diversidad y autoridad de tu perfil de backlinks en comparación con la competencia."
                delay={200}
              />
              <Feature
                icon={<BarChart className="h-10 w-10 text-primary" />}
                title="Métricas de Rendimiento"
                description="Haz seguimiento de tus rankings, tráfico y métricas de conversión con visualizaciones intuitivas y elegantes."
                delay={300}
              />
              <Feature
                icon={<Zap className="h-10 w-10 text-primary" />}
                title="Recomendaciones de Acción"
                description="Recibe pasos priorizados y accionables para mejorar tu rendimiento SEO y superar a la competencia."
                delay={400}
              />
              <Feature
                icon={<ArrowUpRight className="h-10 w-10 text-primary" />}
                title="Información de Competidores"
                description="Compara tu rendimiento con competidores e identifica oportunidades estratégicas."
                delay={500}
              />
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
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
                      {user ? (
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
      </main>
      
      <Footer />
    </div>
  );
};

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const Feature: React.FC<FeatureProps> = ({
  icon,
  title,
  description,
  delay = 0
}) => {
  return (
    <AnimatedContainer animation="slide-up" delay={delay}>
      <BlurredCard className="h-full">
        <div className="flex flex-col h-full">
          <div className="p-3 bg-primary/10 rounded-lg w-fit mb-5">
            {icon}
          </div>
          <h3 className="text-xl font-medium mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </BlurredCard>
    </AnimatedContainer>
  );
};

export default Index;
