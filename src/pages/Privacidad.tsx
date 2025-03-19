
import React from 'react';
import Layout from '@/components/layout/Layout';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Privacidad = () => {
  return (
    <Layout>
      <div className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background opacity-50 -z-10" />
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </div>
          
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <AnimatedContainer animation="fade" className="mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  Documentación legal
                </span>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={200} className="mb-6">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                  Política de 
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                    {" "}Privacidad
                  </span>
                </h1>
              </AnimatedContainer>
              
              <AnimatedContainer animation="slide-up" delay={400} className="mb-8">
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Cómo recopilamos, utilizamos y protegemos tu información personal.
                </p>
              </AnimatedContainer>
            </div>
          </div>
        </section>
        
        {/* Privacy Content */}
        <section className="py-16">
          <div className="container px-4 sm:px-6 mx-auto">
            <BlurredCard className="max-w-4xl mx-auto">
              <div className="p-6 md:p-8">
                <div className="mb-8 flex items-center justify-center">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">1. Introducción</h2>
                    <p className="text-muted-foreground mb-4">
                      Esta Política de Privacidad explica cómo SoySeoLocal.com ("nosotros", "nuestro", o "la Compañía") recopila, utiliza y protege la información que usted proporciona cuando utiliza nuestro sitio web y servicios.
                    </p>
                    <p className="text-muted-foreground">
                      Al utilizar nuestra plataforma, usted acepta la recopilación y uso de información de acuerdo con esta política. La información personal que recopilamos se utiliza únicamente para proporcionar y mejorar nuestros servicios. No utilizaremos ni compartiremos su información con nadie excepto como se describe en esta Política de Privacidad.
                    </p>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-4">2. Información que recopilamos</h2>
                    <p className="text-muted-foreground mb-4">
                      Podemos recopilar los siguientes tipos de información:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>
                        <strong>Información personal:</strong> Nombre, dirección de correo electrónico, número de teléfono, dirección postal y otros datos similares que usted nos proporciona voluntariamente.
                      </li>
                      <li>
                        <strong>Información de cuenta:</strong> Información relacionada con su cuenta, como contraseña, preferencias de configuración y datos de facturación.
                      </li>
                      <li>
                        <strong>Información de uso:</strong> Datos sobre cómo utiliza nuestro sitio web y servicios, incluyendo datos de análisis, patrones de uso y preferencias.
                      </li>
                      <li>
                        <strong>Información técnica:</strong> Dirección IP, tipo de navegador, proveedor de servicios de Internet, páginas de referencia/salida, sistema operativo, fecha/hora y datos de clickstream.
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-4">3. Cómo utilizamos su información</h2>
                    <p className="text-muted-foreground mb-4">
                      Utilizamos la información recopilada para:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Proporcionar, operar y mantener nuestros servicios</li>
                      <li>Mejorar, personalizar y expandir nuestros servicios</li>
                      <li>Entender y analizar cómo utiliza nuestros servicios</li>
                      <li>Desarrollar nuevos productos, servicios, características y funcionalidades</li>
                      <li>Comunicarnos con usted para proporcionar actualizaciones, asistencia y marketing</li>
                      <li>Prevenir fraudes y abusos</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-4">4. Cookies y tecnologías similares</h2>
                    <p className="text-muted-foreground mb-4">
                      Utilizamos cookies y tecnologías similares para realizar un seguimiento de la actividad en nuestro sitio web y almacenar cierta información. Las cookies son archivos con pequeñas cantidades de datos que pueden incluir un identificador único anónimo.
                    </p>
                    <p className="text-muted-foreground">
                      Puede instruir a su navegador para que rechace todas las cookies o para que le avise cuando se envía una cookie. Sin embargo, si no acepta cookies, es posible que no pueda utilizar algunas partes de nuestro servicio.
                    </p>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-4">5. Compartir y divulgar información</h2>
                    <p className="text-muted-foreground mb-4">
                      No vendemos, intercambiamos ni transferimos de otro modo a terceros su información personalmente identificable. Esto no incluye terceros de confianza que nos ayudan a operar nuestro sitio web, realizar negocios o prestarle servicios, siempre que dichas partes acuerden mantener esta información confidencial.
                    </p>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-4">6. Seguridad de los datos</h2>
                    <p className="text-muted-foreground">
                      La seguridad de sus datos es importante para nosotros, pero recuerde que ningún método de transmisión por Internet o método de almacenamiento electrónico es 100% seguro. Si bien nos esforzamos por utilizar medios comercialmente aceptables para proteger su información personal, no podemos garantizar su seguridad absoluta.
                    </p>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-4">7. Sus derechos</h2>
                    <p className="text-muted-foreground mb-4">
                      Usted tiene los siguientes derechos relacionados con sus datos personales:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Derecho a acceder a sus datos personales</li>
                      <li>Derecho a rectificar o actualizar sus datos personales</li>
                      <li>Derecho a eliminar sus datos personales</li>
                      <li>Derecho a restringir el procesamiento de sus datos personales</li>
                      <li>Derecho a oponerse al procesamiento de sus datos personales</li>
                      <li>Derecho a la portabilidad de datos</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-4">8. Cambios a esta política de privacidad</h2>
                    <p className="text-muted-foreground">
                      Podemos actualizar nuestra Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página y actualizando la fecha "Última actualización" a continuación. Se le aconseja revisar esta Política de Privacidad periódicamente para cualquier cambio.
                    </p>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-4">9. Contacto</h2>
                    <p className="text-muted-foreground mb-4">
                      Si tiene alguna pregunta sobre esta Política de Privacidad, por favor contáctenos:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Por email: privacy@soyseolocal.com</li>
                      <li>Por teléfono: +34 911 23 45 67</li>
                      <li>
                        <Link to="/contacto" className="text-primary hover:underline">
                          A través de nuestro formulario de contacto
                        </Link>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Última actualización: 15 de mayo de 2023
                    </p>
                  </div>
                </div>
              </div>
            </BlurredCard>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">¿Tienes preguntas sobre nuestra política de privacidad?</h2>
              <p className="text-muted-foreground mb-6">
                Estamos aquí para ayudarte. No dudes en ponerte en contacto con nuestro equipo de soporte.
              </p>
              <Link to="/contacto">
                <Button size="lg">
                  Contactar con nosotros
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Privacidad;
