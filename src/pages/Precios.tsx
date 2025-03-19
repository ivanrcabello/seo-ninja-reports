
import React from 'react';
import Layout from '@/components/layout/Layout';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';

const Precios = () => {
  const features = [
    "Informes SEO locales ilimitados",
    "Análisis de Google Business Profile",
    "Evaluación de factores locales",
    "Recomendaciones personalizadas",
    "Análisis de la competencia local",
    "Seguimiento de palabras clave",
    "Informes con marca blanca",
    "Exportación en PDF",
    "Compartir informes con URL",
    "Soporte por correo electrónico"
  ];

  return (
    <Layout>
      <div className="pt-20">
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
                  Tarifa única
                </span>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={200} className="mb-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
                  Precios <br className="hidden sm:inline" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                    sencillos y transparentes
                  </span>
                </h1>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={400} className="mb-8">
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Sin sorpresas ni costes ocultos. Un precio único con todas las funcionalidades incluidas.
                </p>
              </AnimatedContainer>
            </div>
          </div>
        </section>
        
        {/* Pricing */}
        <section className="py-16 sm:py-24">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="max-w-3xl mx-auto">
              <AnimatedContainer animation="slide-up">
                <BlurredCard className="overflow-hidden border-2 border-primary">
                  <div className="bg-primary px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">Plan Profesional</h3>
                      <div className="bg-white text-primary rounded-full px-3 py-1 text-sm font-medium">
                        Popular
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8">
                    <div className="mb-6">
                      <div className="flex items-end gap-2">
                        <span className="text-5xl font-bold">59€</span>
                        <span className="text-xl text-muted-foreground">/mes</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Facturación mensual. IVA no incluido.
                      </p>
                    </div>
                    
                    <div className="border-t border-border pt-6 mb-6">
                      <h4 className="font-medium mb-4">Incluye:</h4>
                      <ul className="space-y-3">
                        {features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="rounded-full p-1 bg-primary/10 mt-0.5">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Link to="/auth">
                      <Button size="lg" className="w-full">
                        Comenzar ahora
                      </Button>
                    </Link>
                    
                    <p className="text-xs text-center text-muted-foreground mt-4">
                      Sin compromiso de permanencia. Cancela cuando quieras.
                    </p>
                  </div>
                </BlurredCard>
              </AnimatedContainer>
              
              <div className="mt-16 text-center">
                <BlurredCard className="p-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    <h3 className="text-xl font-bold">¿Necesitas una solución personalizada?</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Si tienes necesidades específicas o requieres funcionalidades adicionales, contáctanos para un plan a medida.
                  </p>
                  <Link to="/contacto">
                    <Button variant="outline" size="lg">
                      Contactar
                    </Button>
                  </Link>
                </BlurredCard>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ */}
        <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900/30">
          <div className="container px-4 sm:px-6 mx-auto">
            <AnimatedContainer animation="slide-up" className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Preguntas frecuentes</h2>
              <p className="text-lg text-muted-foreground">
                Resolvemos tus dudas sobre nuestros precios y planes.
              </p>
            </AnimatedContainer>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <FaqItem
                question="¿Qué significa 'informes ilimitados'?"
                answer="Puedes generar tantos informes SEO como necesites cada mes, sin restricciones ni costes adicionales."
              />
              <FaqItem
                question="¿Puedo cancelar mi suscripción en cualquier momento?"
                answer="Sí, no hay compromiso de permanencia. Puedes cancelar tu suscripción cuando lo desees, sin penalizaciones."
              />
              <FaqItem
                question="¿Qué métodos de pago aceptáis?"
                answer="Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express) y transferencia bancaria para pagos anuales."
              />
              <FaqItem
                question="¿Ofrecéis descuentos para pagos anuales?"
                answer="Sí, próximamente ofreceremos un descuento del 15% para los pagos anuales."
              />
              <FaqItem
                question="¿Necesito proporcionar una tarjeta de crédito para probar?"
                answer="No, puedes registrarte y explorar la plataforma sin proporcionar información de pago."
              />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  return (
    <AnimatedContainer animation="slide-up">
      <BlurredCard className="overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-2">{question}</h3>
          <p className="text-muted-foreground">{answer}</p>
        </div>
      </BlurredCard>
    </AnimatedContainer>
  );
};

export default Precios;
