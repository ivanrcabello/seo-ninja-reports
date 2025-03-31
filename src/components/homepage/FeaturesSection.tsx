
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, MapPin, ArrowRight, BarChart3, Smartphone, Star } from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import Feature from './Feature';

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/20">
      <div className="container px-4 mx-auto">
        <AnimatedContainer animation="fade" className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros servicios SEO para su negocio</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ofrecemos soluciones completas de posicionamiento para que su negocio local destaque en búsquedas de Google
          </p>
        </AnimatedContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Feature 
            icon={<Search className="h-6 w-6" />}
            title="SEO Técnico"
            description="Optimizamos su sitio web para un rendimiento óptimo en buscadores, corrigiendo problemas técnicos y mejorando la velocidad."
            link="/servicios/seo-tecnico"
          />
          
          <Feature 
            icon={<MapPin className="h-6 w-6" />}
            title="SEO Local"
            description="Mejoramos su presencia local en Google Maps y búsquedas geográficas para atraer clientes de su zona."
            link="/servicios/seo-local"
          />
          
          <Feature 
            icon={<BarChart3 className="h-6 w-6" />}
            title="Análisis de competencia"
            description="Estudiamos a sus competidores para identificar oportunidades y desarrollar estrategias para superarlos."
            link="/servicios/seo-competencia"
          />
          
          <Feature 
            icon={<Smartphone className="h-6 w-6" />}
            title="Google Business Profile"
            description="Optimizamos su ficha de Google para conseguir más llamadas, visitas y contactos de clientes potenciales."
            link="/servicios/google-business"
          />
          
          <Feature 
            icon={<Star className="h-6 w-6" />}
            title="Gestión de reseñas"
            description="Implementamos estrategias para conseguir más opiniones positivas de clientes y mejorar su reputación online."
            link="/servicios/resenas"
          />
          
          <AnimatedContainer animation="fade" delay={300} className="flex flex-col justify-center items-center bg-gradient-to-br from-primary/5 to-primary/20 rounded-lg p-8 text-center">
            <h3 className="text-xl font-bold mb-2">¿Necesita más información?</h3>
            <p className="text-muted-foreground mb-6">
              Consulte todos nuestros servicios y paquetes de SEO local
            </p>
            <Button asChild>
              <Link to="/servicios" className="flex items-center">
                Ver todos los servicios <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </AnimatedContainer>
        </div>
        
        <div className="mt-20">
          <AnimatedContainer animation="fade" className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Paquetes SEO para cada necesidad</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Elija el plan que mejor se adapte a su negocio y objetivos
            </p>
          </AnimatedContainer>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <AnimatedContainer animation="slide-up" delay={0} className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8 flex flex-col border border-border">
              <h3 className="text-xl font-bold mb-2">Pack Starter</h3>
              <p className="text-muted-foreground mb-4">Ideal para pequeños negocios locales</p>
              <div className="text-3xl font-bold mb-4">199€<span className="text-lg font-normal text-muted-foreground">/mes</span></div>
              <ul className="mb-8 flex-1 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Optimización SEO básica</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Configuración Google Business</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>5 palabras clave locales</span>
                </li>
              </ul>
              <Button asChild className="w-full">
                <Link to="/paquetes/starter">Ver detalles</Link>
              </Button>
            </AnimatedContainer>
            
            <AnimatedContainer animation="slide-up" delay={200} className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8 flex flex-col border border-primary">
              <div className="bg-primary text-white text-center py-1 px-3 rounded-full text-sm font-medium self-start mb-2">Recomendado</div>
              <h3 className="text-xl font-bold mb-2">Pack Ascenso</h3>
              <p className="text-muted-foreground mb-4">Para empresas en crecimiento</p>
              <div className="text-3xl font-bold mb-4">399€<span className="text-lg font-normal text-muted-foreground">/mes</span></div>
              <ul className="mb-8 flex-1 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Optimización SEO completa</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Optimización GBP avanzada</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>15 palabras clave locales</span>
                </li>
              </ul>
              <Button asChild className="w-full">
                <Link to="/paquetes/ascenso">Ver detalles</Link>
              </Button>
            </AnimatedContainer>
            
            <AnimatedContainer animation="slide-up" delay={400} className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8 flex flex-col border border-border">
              <h3 className="text-xl font-bold mb-2">Pack Master</h3>
              <p className="text-muted-foreground mb-4">Para dominar su mercado local</p>
              <div className="text-3xl font-bold mb-4">799€<span className="text-lg font-normal text-muted-foreground">/mes</span></div>
              <ul className="mb-8 flex-1 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>SEO Premium completo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Estrategia de contenidos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>30+ palabras clave locales</span>
                </li>
              </ul>
              <Button asChild className="w-full">
                <Link to="/paquetes/master">Ver detalles</Link>
              </Button>
            </AnimatedContainer>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/paquetes">Ver todos los paquetes</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
