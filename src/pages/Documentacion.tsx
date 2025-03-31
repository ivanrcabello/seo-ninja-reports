
import React from 'react';
import Layout from '@/components/layout/Layout';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code, FileText, Users, Database, Server, Shield, Settings } from 'lucide-react';

const Documentacion = () => {
  return (
    <Layout>
      <div className="pt-20">
        <section className="py-12 md:py-20 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-background">
          <div className="container px-4 mx-auto">
            <AnimatedContainer animation="fade" className="mb-10 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">Documentación</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Todo lo que necesitas saber sobre nuestra plataforma y servicios SEO
              </p>
            </AnimatedContainer>

            <Tabs defaultValue="plataforma" className="max-w-4xl mx-auto">
              <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-8">
                <TabsTrigger value="plataforma">Plataforma</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
                <TabsTrigger value="integraciones">Integraciones</TabsTrigger>
                <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
                <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
              </TabsList>
              
              <TabsContent value="plataforma" className="space-y-6">
                <AnimatedContainer animation="slide-up">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="mr-2 h-5 w-5" />
                        Introducción a la plataforma
                      </CardTitle>
                      <CardDescription>
                        Conozca las características principales de SoySeoLocal
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Características principales</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                            <span>Dashboard SEO con métricas personalizadas para cada cliente</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                            <span>Informes automatizados de posicionamiento y visibilidad</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                            <span>Análisis de perfiles de Google Business y reseñas</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                            <span>Seguimiento de palabras clave locales y competencia</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                            <span>Herramientas de análisis técnico SEO y crawler</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Conceptos básicos</h3>
                        <p className="text-muted-foreground">
                          SoySeoLocal es una plataforma SaaS diseñada específicamente para mejorar la visibilidad online de negocios locales. 
                          Con nuestra tecnología basada en IA, automatizamos el proceso de auditoría SEO, seguimiento de rankings y generación 
                          de recomendaciones para posicionar mejor a los negocios en búsquedas locales.
                        </p>
                        <Link to="/caracteristicas" className="inline-flex items-center text-primary hover:underline">
                          Ver todas las características <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedContainer>
                
                <AnimatedContainer animation="slide-up" delay={100}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Server className="mr-2 h-5 w-5" />
                        Arquitectura del sistema
                      </CardTitle>
                      <CardDescription>
                        Información técnica sobre cómo funciona nuestra plataforma
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        SoySeoLocal utiliza una arquitectura moderna basada en microservicios, con un frontend en React para 
                        una experiencia de usuario fluida y un backend escalable con APIs RESTful. La plataforma está diseñada 
                        para ser rápida, segura y escalable, permitiendo gestionar desde pequeños negocios locales hasta 
                        agencias con múltiples clientes.
                      </p>
                      <div className="mt-4 p-4 bg-muted rounded-md">
                        <h4 className="font-medium mb-2">Stack tecnológico:</h4>
                        <ul className="space-y-1">
                          <li className="flex items-center gap-2">
                            <Code className="h-4 w-4 text-primary" /> Frontend: React, TypeScript, TailwindCSS
                          </li>
                          <li className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-primary" /> Base de datos: PostgreSQL, Redis
                          </li>
                          <li className="flex items-center gap-2">
                            <Server className="h-4 w-4 text-primary" /> Backend: Node.js, FastAPI, Docker
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedContainer>
              </TabsContent>
              
              <TabsContent value="api" className="space-y-6">
                <AnimatedContainer animation="slide-up">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Code className="mr-2 h-5 w-5" />
                        Documentación de API
                      </CardTitle>
                      <CardDescription>
                        Recursos para desarrolladores e integraciones
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Nuestra API RESTful permite integrar los datos de SEO local en sus propias aplicaciones. 
                        Con endpoints para consultar rankings, análisis de perfil de Google Business, informes y más.
                      </p>
                      <div className="p-4 bg-muted rounded-md">
                        <h4 className="font-medium mb-2">Ejemplos de endpoints:</h4>
                        <ul className="space-y-2">
                          <li className="font-mono text-sm p-2 bg-black/5 dark:bg-white/5 rounded">GET /api/v1/clients/{'{client_id}'}/rankings</li>
                          <li className="font-mono text-sm p-2 bg-black/5 dark:bg-white/5 rounded">GET /api/v1/clients/{'{client_id}'}/business-profile</li>
                          <li className="font-mono text-sm p-2 bg-black/5 dark:bg-white/5 rounded">POST /api/v1/reports/generate</li>
                        </ul>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Para acceder a la documentación completa de la API y obtener sus credenciales,
                        póngase en contacto con nuestro equipo de soporte.
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedContainer>
              </TabsContent>
              
              <TabsContent value="integraciones" className="space-y-6">
                <AnimatedContainer animation="slide-up">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings className="mr-2 h-5 w-5" />
                        Integraciones disponibles
                      </CardTitle>
                      <CardDescription>
                        Conecte SoySeoLocal con sus herramientas favoritas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-medium mb-2">Google Analytics</h3>
                          <p className="text-sm text-muted-foreground">
                            Conecte sus datos de tráfico para correlacionarlos con resultados SEO
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-medium mb-2">Google Search Console</h3>
                          <p className="text-sm text-muted-foreground">
                            Importe datos de rendimiento en búsquedas directamente
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-medium mb-2">Google Business Profile</h3>
                          <p className="text-sm text-muted-foreground">
                            Gestione y analice su perfil de negocio local
                          </p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-medium mb-2">Zapier</h3>
                          <p className="text-sm text-muted-foreground">
                            Automatice flujos de trabajo con cientos de aplicaciones
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedContainer>
              </TabsContent>
              
              <TabsContent value="seguridad" className="space-y-6">
                <AnimatedContainer animation="slide-up">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="mr-2 h-5 w-5" />
                        Seguridad y privacidad
                      </CardTitle>
                      <CardDescription>
                        Información sobre cómo protegemos sus datos
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        La seguridad de sus datos es nuestra prioridad. SoySeoLocal implementa 
                        las mejores prácticas en seguridad informática para proteger la información 
                        de su negocio y sus clientes.
                      </p>
                      <div className="space-y-2">
                        <h4 className="font-medium">Medidas de seguridad:</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                            <span>Encriptación SSL/TLS en todas las conexiones</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                            <span>Autenticación de dos factores (2FA)</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                            <span>Auditorías de seguridad regulares</span>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                            <span>Almacenamiento de datos en servidores EU con cumplimiento GDPR</span>
                          </li>
                        </ul>
                      </div>
                      <Link to="/privacidad" className="inline-flex items-center text-primary hover:underline">
                        Ver política de privacidad <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </CardContent>
                  </Card>
                </AnimatedContainer>
              </TabsContent>
              
              <TabsContent value="usuarios" className="space-y-6">
                <AnimatedContainer animation="slide-up">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="mr-2 h-5 w-5" />
                        Guía para usuarios
                      </CardTitle>
                      <CardDescription>
                        Aprenda a utilizar todas las funciones de la plataforma
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">Para administradores</h3>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <FileText className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                              <span>Gestión de clientes y proyectos SEO</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <FileText className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                              <span>Generación de informes y propuestas</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <FileText className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                              <span>Configuración de la plataforma y usuarios</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">Para clientes</h3>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <FileText className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                              <span>Portal de cliente y visualización de informes</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <FileText className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                              <span>Acceso a recomendaciones SEO</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <FileText className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                              <span>Gestión de facturas y propuestas</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedContainer>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Documentacion;
