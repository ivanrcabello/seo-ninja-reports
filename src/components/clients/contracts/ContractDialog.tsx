import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClientContract } from '@/types/client.types';
import { useClientContracts, CreateContractData, UpdateContractData } from '@/hooks/useClientContracts';
import RichTextEditor from './RichTextEditor';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Plantilla predeterminada para un nuevo contrato
const DEFAULT_CONTRACT_TEMPLATE = `
<h2 style="text-align: center;"><strong>CONTRATO DE SERVICIOS SEO</strong></h2>

<h3>INTERVIENEN</h3>
<p><strong>De una parte,</strong></p>
<p>Iván Rodríguez Cabello, con NIF 52886386W, en nombre y representación propios y en calidad de representante de Posicionamiento-seo-local.es. En adelante, el PROFESIONAL.</p>

<p><strong>Y de otra parte,</strong></p>
<p>[NOMBRE DEL CLIENTE], con NIF [NIF CLIENTE] en nombre y representación propios y en calidad de representante de [EMPRESA CLIENTE] ([WEBSITE]). En adelante, el CLIENTE.</p>

<h3>MANIFIESTAN</h3>
<p>I. Que el PROFESIONAL está especializado en la prestación de servicios SEO de auditoría, consultoría y optimización de webs para el posicionamiento en Google y gestion de campañas en Google ADS</p>
<p>II. Que el CLIENTE está interesado en contratar al PROFESIONAL para la realización de servicios SEO tal y como se describe en el presente documento.</p>
<p>III. Que ambas partes han acordado realizar el presente contrato de prestación de servicios de acuerdo con los pactos definidos a continuación.</p>

<h3>PACTAN</h3>

<h4>1. Objeto del presente contrato</h4>
<p>El PROFESIONAL prestará al CLIENTE los siguientes servicios:</p>
<p><strong>Webs a posicionar:</strong></p>
<p>1. [WEBSITE]</p>

<p><strong>FASE 1: Auditoría SEO Completa</strong></p>
<ol>
  <li>Análisis de la competencia en Google.</li>
  <li>Análisis del posicionamiento actual.</li>
  <li>Investigación y clasificación de palabras clave.</li>
  <li>Búsqueda de oportunidades de linkbuilding.</li>
  <li>Elaboración y entrega del informe con los resultados de estos análisis.</li>
  <li>Asesoramiento y consultoría posterior para la interpretación de los resultados y la toma de decisiones en función de los mismos.</li>
  <li>Auditoría técnica de la web: identificación de errores.</li>
  <li>Diseño de la estrategia de posicionamiento SEO.</li>
  <li>Diseño e implementación de la arquitectura web.</li>
</ol>

<p><strong>FASE 2: Servicios SEO Mensuales por web</strong></p>
<ul>
  <li>Optimización de un número ilimitado de páginas para SEO y posicionamiento local.</li>
  <li>Creación y gestión de contenido local (5 artículos al mes) por web.</li>
  <li>Estrategias de construcción de enlaces avanzadas y personalizadas.</li>
  <li>Análisis detallado de la competencia con acciones estratégicas.</li>
  <li>Reuniones mensuales para revisar la estrategia.</li>
  <li>Soporte dedicado 24/7.</li>
  <li>Resultados garantizados por escrito.</li>
  <li>Optimización de Google My Business.</li>
  <li>Análisis de palabras clave locales y optimización.</li>
  <li>Construcción de enlaces locales (linkbuilding).</li>
  <li>Soporte prioritario por teléfono y correo electrónico.</li>
</ul>

<h4>2. Obligaciones del CLIENTE</h4>
<p>Para la ejecución de los servicios contratados, el CLIENTE se compromete a:</p>
<ol>
  <li>Facilitar al PROFESIONAL la documentación o información necesaria para la adecuada prestación de los servicios, incluyendo:
    <ul>
      <li>Información relativa a la web que se va a auditar.</li>
      <li>Relación de competidores en los mercados en los que se desarrollarán los servicios SEO.</li>
      <li>Información sobre los productos y/o servicios que se ofrecen a través de la web y que se desean posicionar.</li>
      <li>Cualquier otra información relevante: estudios de mercado, perfil de cliente, manual de identidad visual corporativa, políticas de la empresa, dossier comercial, etc.</li>
      <li>Datos necesarios para facturar y declarar los servicios realizados.</li>
    </ul>
  </li>
  <li>Suministrar al PROFESIONAL acceso a las herramientas y plataformas necesarias para la revisión y optimización de la web, incluyendo el gestor de contenidos de la web, la cuenta asociada de Google Analytics y la cuenta asociada de Google Search Console, y cualquier otra cuenta o plataforma de analítica o gestión de recursos web que se requiera.</li>
  <li>Efectuar en plazo el pago de los honorarios acordados.</li>
</ol>

<h4>4. Duración del contrato</h4>
<ul>
  <li>Los servicios y funciones descritos en la FASE 1 se prestarán por un plazo de 15 días desde la firma del presente documento.</li>
  <li>Los servicios descritos en la FASE 2 se prestarán por un plazo de 3 meses desde la finalización de la FASE 1.</li>
  <li>Transcurridos estos 3 meses, el contrato se renovará automáticamente mensualmente, salvo que alguna de las partes comunique expresamente y por escrito la cancelación del mismo con una antelación de 15 días.</li>
</ul>

<h4>4. Confidencialidad de los datos</h4>
<p>El PROFESIONAL se compromete a tratar confidencialmente todos los datos, documentación e información suministrados por el CLIENTE durante la vigencia del presente contrato y a no comunicarlos a terceros, salvo a sus empleados y colaboradores en la medida necesaria para la correcta ejecución del contrato. Esta obligación de confidencialidad se mantendrá vigente durante la vigencia del contrato y por un periodo de 2 años después de su extinción.</p>

<h4>5. Protección de datos personales</h4>
<p>El PROFESIONAL informa al CLIENTE de que los datos personales contenidos en el presente contrato y los generados por la prestación de los servicios serán utilizados con la única finalidad de prestar el servicio contratado. La firma del presente contrato implica el consentimiento del CLIENTE para el tratamiento de sus datos.</p>

<h4>6. Honorarios pactados</h4>
<ul>
  <li>Servicios de auditoría (FASE 1): pago único de 0 euros más el IVA correspondiente.</li>
  <li>Servicios mensuales (FASE 2): cuota mensual de 199 euros IVA INC</li>
  <li>Hacen un total de 199€/Mensuales IVA INC</li>
  <li>Los 2 primeros meses el cliente tendrá activa una oferta del 50% de descuento en el precio total.</li>
</ul>

<h4>7. Forma de pago</h4>
<p>El pago se realizará mediante domiciliación bancaria o ingreso o transferencia en la cuenta número ES65 0182 6161 1102 0155 3147 de la entidad BBVA cuyo titular es Iván Rodríguez Cabello. El pago se realizará en un plazo máximo de 7 días desde la emisión de las facturas.</p>

<h4>8. Incumplimiento de los pagos</h4>
<p>La falta de pago dará derecho al PROFESIONAL a resolver el contrato y a reclamar judicialmente las cantidades debidas, aplicándose desde la fecha de incumplimiento el interés de demora establecido por la ley.</p>

<h4>9. Deficiencias en los servicios contratados</h4>
<p>Si el CLIENTE encuentra defectos en los servicios contratados, deberá comunicarlo por escrito. El PROFESIONAL tendrá un plazo de 15 días para resolver dichas deficiencias. Si no se solucionan en dicho plazo, el CLIENTE podrá resolver el contrato.</p>

<h4>10. Propiedad intelectual</h4>
<p>El PROFESIONAL posee todos los derechos de propiedad intelectual necesarios para la comercialización del servicio contratado. El CLIENTE debe respetar los programas de uso de terceros puestos a su disposición por el PROFESIONAL. El CLIENTE no adquiere ningún derecho o licencia sobre el servicio contratado, salvo los necesarios para el cumplimiento del presente contrato y solo durante su duración. Cualquier actuación que exceda del cumplimiento de este contrato requerirá autorización por escrito del PROFESIONAL.</p>

<h4>11. Garantías para el CLIENTE</h4>
<p>El PROFESIONAL garantiza que los servicios prestados se realizarán con la diligencia y competencia profesionales adecuadas. Si después de 3 meses de servicios SEO mensuales (FASE 2) no se ha observado una mejora en los resultados en las gráficas de SEO, el PROFESIONAL se compromete a proporcionar 2 meses adicionales de servicios SEO sin costo para el CLIENTE con el objetivo de mejorar dichos resultados. En caso de que tras 5 meses no se haya logrado una mejora en los resultados, el CLIENTE tendrá derecho a resolver el contrato.</p>

<h4>12. Rescisión del contrato</h4>
<p>El presente contrato se considerará resuelto por el incumplimiento de cualquiera de las obligaciones contenidas en el mismo, incluido el impago de los honorarios.</p>

<h4>13. Modificación del contrato</h4>
<p>Cualquier modificación del presente contrato deberá realizarse por escrito e incorporarse al mismo como anexo.</p>

<h4>14. Sometimiento al fuero</h4>
<p>Las partes, con renuncia a su propio fuero, se someten a los Juzgados y Tribunales de Madrid para la resolución de cualquier conflicto derivado del presente contrato.</p>

<h4>15. Régimen del contrato</h4>
<p>Este contrato tiene carácter mercantil y se regirá por sus propias cláusulas y, en lo no previsto, por las disposiciones españolas contenidas en el Código de Comercio, leyes especiales y usos mercantiles.</p>

<p style="margin-top: 40px;">En prueba de conformidad, firman el presente contrato, por duplicado ejemplar, en el lugar y fecha indicados en el encabezamiento.</p>

<table style="width: 100%; margin-top: 40px;">
  <tr>
    <td style="width: 50%; text-align: center;"><strong>CLIENTE</strong></td>
    <td style="width: 50%; text-align: center;"><strong>PROFESIONAL</strong></td>
  </tr>
  <tr>
    <td style="height: 100px;"></td>
    <td style="height: 100px;"></td>
  </tr>
  <tr>
    <td style="text-align: center;">Fdo.: ______________________</td>
    <td style="text-align: center;">Fdo.: Iván Rodríguez Cabello</td>
  </tr>
</table>`;

interface ContractDialogProps {
  clientId: string;
  clientName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingContract?: ClientContract | null;
}

const ContractDialog: React.FC<ContractDialogProps> = ({
  clientId,
  clientName,
  open,
  onOpenChange,
  editingContract
}) => {
  const { createContract, updateContract } = useClientContracts(clientId);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (open) {
      if (editingContract) {
        setTitle(editingContract.title);
        setContent(editingContract.content);
      } else {
        setTitle(`Contrato de Servicios SEO - ${clientName || 'Cliente'}`);
        let template = DEFAULT_CONTRACT_TEMPLATE;
        if (clientName) {
          template = template.replace(/\[NOMBRE DEL CLIENTE\]/g, clientName);
        }
        setContent(template);
      }
    }
  }, [open, editingContract, clientName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Por favor, introduce un título para el contrato');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (editingContract) {
        const updateData: UpdateContractData = {
          title,
          content
        };
        await updateContract(editingContract.id, updateData);
      } else {
        const createData: CreateContractData = {
          title,
          content
        };
        await createContract(createData);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving contract:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isSubmitting && onOpenChange(isOpen)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingContract ? 'Editar Contrato' : 'Crear Nuevo Contrato'}</DialogTitle>
          <DialogDescription>
            {editingContract 
              ? 'Modifica los detalles del contrato existente.'
              : 'Crea un nuevo contrato para este cliente usando la plantilla predeterminada o personalízalo completamente.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Título del Contrato
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Contrato de Servicios SEO"
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Contenido del Contrato
            </Label>
            <RichTextEditor 
              value={content} 
              onChange={setContent} 
              className="min-h-[50vh]"
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingContract ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                editingContract ? 'Actualizar Contrato' : 'Crear Contrato'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContractDialog;
