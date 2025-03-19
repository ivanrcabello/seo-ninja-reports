
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Book, Lightbulb, Folder, LineChart, Users, FileText, Settings, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Documentacion = () => {
  return (
    <Layout>
      <div className="container max-w-6xl py-10 px-4 sm:px-6">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold">Documentación</h1>
          <p className="text-muted-foreground">
            Guía completa sobre cómo utilizar SoySeoLocal para gestionar tus clientes y crear informes SEO.
          </p>
        </div>

        <Separator className="my-6" />

        {/* Introducción */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Book className="h-6 w-6 text-primary" />
                Introducción a SoySeoLocal
              </CardTitle>
              <CardDescription>
                Descubre qué es SoySeoLocal y cómo puede ayudarte en tu negocio de SEO.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                SoySeoLocal es una plataforma diseñada para profesionales y agencias SEO que necesitan gestionar múltiples clientes
                y generar informes SEO personalizados de manera rápida y eficiente.
              </p>
              <p>
                Con nuestra plataforma podrás:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Gestionar todos tus clientes en un solo lugar</li>
                <li>Crear informes SEO detallados y personalizados</li>
                <li>Analizar el rendimiento de las páginas web con PageSpeed</li>
                <li>Compartir informes con tus clientes a través de enlaces públicos</li>
                <li>Almacenar credenciales de forma segura</li>
                <li>Registrar notas internas para cada cliente</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Secciones principales */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Gestión de Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Añade, edita y gestiona tus clientes. Guarda información importante como datos de contacto,
                credenciales de acceso y notas internas.
              </p>
              <Link to="/dashboard">
                <Button variant="outline" className="w-full group">
                  Ver Dashboard
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Informes SEO
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Genera informes SEO completos para tus clientes. Personaliza el contenido, incluye análisis 
                de PageSpeed y comparte los resultados.
              </p>
              <Link to="/reports">
                <Button variant="outline" className="w-full group">
                  Ver Informes
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* Guías detalladas */}
        <h2 className="text-2xl font-bold mb-6">Guías Detalladas</h2>
        <div className="grid grid-cols-1 gap-6 mb-12">
          {/* Gestión de clientes */}
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Clientes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Cómo añadir un nuevo cliente</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Ve al Dashboard desde el menú principal</li>
                <li>Haz clic en el botón "Añadir Cliente"</li>
                <li>Completa el formulario con los datos del cliente</li>
                <li>Guarda la información</li>
              </ol>

              <h3 className="text-lg font-medium mt-6">Gestión de credenciales</h3>
              <p>
                Para cada cliente puedes almacenar de forma segura:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Credenciales de WordPress</li>
                <li>Credenciales de Hosting</li>
              </ul>
              <p className="mt-2">
                Estas credenciales sólo son visibles para ti y están protegidas por políticas de seguridad.
              </p>

              <h3 className="text-lg font-medium mt-6">Notas internas</h3>
              <p>
                Puedes añadir notas internas para cada cliente para recordar información importante, 
                seguimiento de tareas, o cualquier otra información relevante.
              </p>
            </CardContent>
          </Card>

          {/* Generación de informes */}
          <Card>
            <CardHeader>
              <CardTitle>Generación de Informes SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Cómo crear un nuevo informe</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Ve a la página del cliente desde el Dashboard</li>
                <li>Haz clic en "Generar Informe"</li>
                <li>Selecciona el tipo de informe que deseas generar</li>
                <li>Completa la información requerida</li>
                <li>Espera a que el informe se genere automáticamente</li>
              </ol>

              <h3 className="text-lg font-medium mt-6">Compartir informes</h3>
              <p>
                Para compartir un informe con tu cliente:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Abre el informe que deseas compartir</li>
                <li>Haz clic en el botón "Compartir"</li>
                <li>Copia el enlace generado</li>
                <li>Envía el enlace a tu cliente</li>
              </ol>
              <p className="mt-2">
                Los informes compartidos son accesibles a través de un enlace público pero seguro, sin necesidad de que el cliente tenga una cuenta.
              </p>
            </CardContent>
          </Card>

          {/* Configuración */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Integraciones API</h3>
              <p>
                Para aprovechar al máximo las capacidades de SoySeoLocal, puedes configurar:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>API de Google (para PageSpeed y otras herramientas)</li>
                <li>API de OpenAI (para generación de contenidos)</li>
              </ul>

              <Link to="/settings">
                <Button variant="outline" className="mt-4 w-full group">
                  Ir a Configuración
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Llamada a la acción */}
        <section className="mt-12">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    ¿Necesitas más ayuda?
                  </h3>
                  <p className="text-muted-foreground">
                    Si tienes preguntas específicas o necesitas asistencia personalizada, no dudes en contactarnos.
                  </p>
                </div>
                <Link to="/">
                  <Button className="w-full md:w-auto group">
                    Contactar con Soporte
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
};

export default Documentacion;
