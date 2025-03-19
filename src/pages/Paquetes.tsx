
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const Paquetes = () => {
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
                  Planes y Precios
                </span>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={200} className="mb-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
                  Paquetes SEO <br className="hidden sm:inline" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                    A Tu Medida
                  </span>
                </h1>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={400} className="mb-8">
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Encuentra el plan perfecto para tus necesidades de SEO local, con opciones para todos los presupuestos y objetivos.
                </p>
              </AnimatedContainer>
            </div>
          </div>
        </section>
        
        {/* Pricing */}
        <section className="py-16 sm:py-24">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Paquete Básico */}
              <AnimatedContainer animation="slide-up" delay={0}>
                <BlurredCard className="h-full">
                  <div className="p-6 flex flex-col h-full">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold">Básico</h3>
                      <p className="text-muted-foreground mt-2">Ideal para pequeños negocios locales</p>
                    </div>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold">199€</span>
                      <span className="text-muted-foreground">/mes</span>
                    </div>
                    
                    <ul className="space-y-3 mb-8 flex-1">
                      <PricingItem>Auditoría SEO básica</PricingItem>
                      <PricingItem>Optimización Google Business Profile</PricingItem>
                      <PricingItem>10 palabras clave locales</PricingItem>
                      <PricingItem>Informe mensual</PricingItem>
                      <PricingItem>Soporte por email</PricingItem>
                    </ul>
                    
                    <Button className="w-full">Contratar Ahora</Button>
                  </div>
                </BlurredCard>
              </AnimatedContainer>
              
              {/* Paquete Profesional */}
              <AnimatedContainer animation="slide-up" delay={200}>
                <BlurredCard className="h-full border-primary">
                  <div className="p-6 flex flex-col h-full">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold">Profesional</h3>
                      <p className="text-muted-foreground mt-2">Para empresas que buscan crecer localmente</p>
                    </div>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold">399€</span>
                      <span className="text-muted-foreground">/mes</span>
                    </div>
                    
                    <ul className="space-y-3 mb-8 flex-1">
                      <PricingItem>Auditoría SEO completa</PricingItem>
                      <PricingItem>Optimización GBP avanzada</PricingItem>
                      <PricingItem>25 palabras clave locales</PricingItem>
                      <PricingItem>Gestión de citas locales</PricingItem>
                      <PricingItem>Contenido SEO mensual (2 artículos)</PricingItem>
                      <PricingItem>Informe semanal</PricingItem>
                      <PricingItem>Soporte por email y teléfono</PricingItem>
                    </ul>
                    
                    <Button className="w-full">Contratar Ahora</Button>
                  </div>
                </BlurredCard>
              </AnimatedContainer>
              
              {/* Paquete Premium */}
              <AnimatedContainer animation="slide-up" delay={400}>
                <BlurredCard className="h-full">
                  <div className="p-6 flex flex-col h-full">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold">Premium</h3>
                      <p className="text-muted-foreground mt-2">Estrategia completa para dominar tu mercado local</p>
                    </div>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold">799€</span>
                      <span className="text-muted-foreground">/mes</span>
                    </div>
                    
                    <ul className="space-y-3 mb-8 flex-1">
                      <PricingItem>Auditoría SEO premium</PricingItem>
                      <PricingItem>Estrategia SEO local completa</PricingItem>
                      <PricingItem>50+ palabras clave locales</PricingItem>
                      <PricingItem>Optimización de citas y directorios</PricingItem>
                      <PricingItem>Contenido SEO semanal</PricingItem>
                      <PricingItem>Link building local</PricingItem>
                      <PricingItem>Análisis de competencia</PricingItem>
                      <PricingItem>Informes personalizados</PricingItem>
                      <PricingItem>Soporte prioritario 24/7</PricingItem>
                    </ul>
                    
                    <Button className="w-full">Contratar Ahora</Button>
                  </div>
                </BlurredCard>
              </AnimatedContainer>
            </div>
            
            <div className="mt-16 text-center">
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                ¿Necesitas una solución personalizada? Ofrecemos planes a medida para adaptarnos a tus necesidades específicas.
              </p>
              <Button variant="outline" size="lg">Contactar para plan personalizado</Button>
            </div>
          </div>
        </section>
        
        {/* FAQs */}
        <section className="py-16 sm:py-24">
          <div className="container px-4 sm:px-6 mx-auto">
            <AnimatedContainer animation="slide-up" className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Preguntas Frecuentes</h2>
              <p className="text-lg text-muted-foreground">
                Respuestas a las preguntas más comunes sobre nuestros servicios y paquetes.
              </p>
            </AnimatedContainer>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <FaqItem 
                question="¿Cuánto tiempo tardaré en ver resultados?" 
                answer="El SEO es una estrategia a medio-largo plazo. Normalmente, los primeros resultados comienzan a verse entre 3 y 6 meses, aunque esto puede variar según la competitividad de tu sector y el estado actual de tu web."
              />
              
              <FaqItem 
                question="¿Puedo cambiar de plan en cualquier momento?" 
                answer="Sí, puedes escalar o reducir tu plan en cualquier momento. Nos adaptamos a tus necesidades y al crecimiento de tu negocio."
              />
              
              <FaqItem 
                question="¿Qué incluye exactamente la optimización de Google Business Profile?" 
                answer="Incluye la optimización completa de tu ficha, gestión de reseñas, publicaciones regulares, configuración de servicios/productos, respuesta a preguntas, y monitorización de estadísticas."
              />
              
              <FaqItem 
                question="¿Trabajáis con cualquier tipo de negocio local?" 
                answer="Sí, tenemos experiencia en una amplia variedad de sectores. Nuestro enfoque se adapta a las particularidades de cada industria y zona geográfica."
              />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

interface PricingItemProps {
  children: React.ReactNode;
}

const PricingItem: React.FC<PricingItemProps> = ({ children }) => (
  <li className="flex items-start">
    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
    <span className="text-sm">{children}</span>
  </li>
);

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => (
  <AnimatedContainer animation="slide-up">
    <BlurredCard>
      <div className="p-6">
        <h4 className="text-lg font-medium mb-2">{question}</h4>
        <p className="text-muted-foreground">{answer}</p>
      </div>
    </BlurredCard>
  </AnimatedContainer>
);

export default Paquetes;
