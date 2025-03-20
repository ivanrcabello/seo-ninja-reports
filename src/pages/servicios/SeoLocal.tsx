
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const SeoLocal: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6 mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">SEO Local</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Mejora la visibilidad de tu negocio en búsquedas locales y atrae a más clientes de tu zona
            </p>
            <Link to="/contacto">
              <Button size="lg" className="font-medium">Solicitar presupuesto</Button>
            </Link>
          </div>
          
          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">¿Por qué es importante el SEO Local?</h2>
              <p className="text-lg mb-4">
                El SEO Local es esencial para cualquier negocio con presencia física que atiende a clientes en áreas geográficas específicas. Cuando los usuarios buscan servicios o productos en su zona, quieres que tu negocio aparezca entre los primeros resultados.
              </p>
              <p className="text-lg mb-4">
                Nuestro servicio de SEO Local optimiza tu presencia en Google Maps, Google Business Profile y búsquedas locales para asegurar que los clientes te encuentren cuando más lo necesitan.
              </p>
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Beneficios del SEO Local:</h3>
                <ul className="space-y-2">
                  {[
                    "Aumento de visibilidad en las búsquedas locales",
                    "Mayor tráfico a tu sitio web y visitas a tu negocio físico",
                    "Mejora en la autoridad local de tu marca",
                    "Optimización de Google Business Profile",
                    "Creación de citas NAP consistentes",
                    "Estrategias de generación de reseñas positivas"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6">Nuestro proceso de SEO Local</h3>
              <ol className="space-y-6">
                <li className="flex">
                  <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                  <div>
                    <h4 className="font-semibold mb-1">Auditoría de presencia local</h4>
                    <p className="text-muted-foreground">Evaluamos tu presencia actual en búsquedas locales, Google Maps y directorios.</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                  <div>
                    <h4 className="font-semibold mb-1">Optimización de Google Business Profile</h4>
                    <p className="text-muted-foreground">Configuramos o mejoramos tu perfil de empresa para destacar en Google.</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                  <div>
                    <h4 className="font-semibold mb-1">Creación de citas NAP consistentes</h4>
                    <p className="text-muted-foreground">Aseguramos que tu Nombre, Dirección y Teléfono sean consistentes en toda la web.</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">4</span>
                  <div>
                    <h4 className="font-semibold mb-1">Optimización de contenido local</h4>
                    <p className="text-muted-foreground">Desarrollamos contenido relevante para tu audiencia local.</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">5</span>
                  <div>
                    <h4 className="font-semibold mb-1">Seguimiento y reportes</h4>
                    <p className="text-muted-foreground">Monitorizamos los resultados y ajustamos la estrategia continuamente.</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-8 text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">¿Listo para destacar en tu área local?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Nuestros especialistas en SEO Local te ayudarán a desarrollar una estrategia personalizada para tu negocio.
            </p>
            <Link to="/contacto">
              <Button size="lg" className="font-medium">Contáctanos hoy</Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SeoLocal;
