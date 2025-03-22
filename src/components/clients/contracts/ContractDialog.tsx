
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
<p><strong>ENTRE LAS PARTES:</strong></p>
<p>De una parte, <strong>[NOMBRE DE LA EMPRESA]</strong>, con domicilio en [DIRECCIÓN] y NIF [NÚMERO], representada por [NOMBRE DEL REPRESENTANTE], en adelante denominada "EL PROVEEDOR".</p>
<p>Y de otra parte, <strong>[NOMBRE DEL CLIENTE]</strong>, con domicilio en [DIRECCIÓN DEL CLIENTE] y NIF [NÚMERO DEL CLIENTE], representado por [NOMBRE DEL REPRESENTANTE DEL CLIENTE], en adelante denominado "EL CLIENTE".</p>
<p>Ambas partes, reconociéndose mutuamente la capacidad legal necesaria para contratar y obligarse por medio del presente documento.</p>
<p><strong>EXPONEN:</strong></p>
<ol>
<li>Que EL PROVEEDOR es una empresa especializada en la prestación de servicios de optimización para motores de búsqueda (SEO).</li>
<li>Que EL CLIENTE está interesado en la contratación de los servicios de SEO para su sitio web.</li>
<li>Que ambas partes han convenido la celebración del presente contrato de prestación de servicios, que se regirá por las siguientes:</li>
</ol>
<p><strong>CLÁUSULAS:</strong></p>
<p><strong>PRIMERA. - OBJETO DEL CONTRATO</strong></p>
<p>EL PROVEEDOR se compromete a prestar al CLIENTE los siguientes servicios de SEO:</p>
<ul>
<li>Análisis inicial y auditoría de la web.</li>
<li>Investigación de palabras clave.</li>
<li>Optimización on-page.</li>
<li>Estrategia de contenidos.</li>
<li>Construcción de enlaces (link building).</li>
<li>Seguimiento y reportes mensuales de resultados.</li>
</ul>
<p><strong>SEGUNDA. - DURACIÓN DEL CONTRATO</strong></p>
<p>El presente contrato tendrá una duración de [NÚMERO] meses, comenzando el día [FECHA DE INICIO] y finalizando el día [FECHA DE FINALIZACIÓN].</p>
<p>El contrato se renovará automáticamente por períodos iguales, salvo que cualquiera de las partes comunique a la otra su voluntad de no renovarlo con al menos 30 días de antelación a la fecha de finalización.</p>
<p><strong>TERCERA. - PRECIO Y FORMA DE PAGO</strong></p>
<p>El precio por los servicios contratados será de [IMPORTE] euros mensuales, más el IVA correspondiente.</p>
<p>El pago se realizará mediante transferencia bancaria a la cuenta que indique EL PROVEEDOR, dentro de los primeros 5 días de cada mes.</p>
<p><strong>CUARTA. - OBLIGACIONES DEL PROVEEDOR</strong></p>
<p>EL PROVEEDOR se obliga a:</p>
<ul>
<li>Prestar los servicios de SEO descritos en la cláusula primera con la máxima diligencia y profesionalidad.</li>
<li>Mantener informado al CLIENTE sobre las acciones realizadas y los resultados obtenidos.</li>
<li>Entregar un informe mensual detallando las actividades realizadas y los resultados obtenidos.</li>
<li>Respetar la confidencialidad de la información proporcionada por EL CLIENTE.</li>
</ul>
<p><strong>QUINTA. - OBLIGACIONES DEL CLIENTE</strong></p>
<p>EL CLIENTE se obliga a:</p>
<ul>
<li>Proporcionar al PROVEEDOR toda la información y materiales necesarios para la correcta prestación de los servicios.</li>
<li>Facilitar el acceso a las herramientas necesarias (Google Analytics, Search Console, CMS, etc.).</li>
<li>Abonar el precio acordado en la forma y plazos establecidos.</li>
<li>Colaborar activamente en la implementación de las recomendaciones realizadas por EL PROVEEDOR.</li>
</ul>
<p><strong>SEXTA. - RESULTADOS</strong></p>
<p>El CLIENTE reconoce y acepta que los resultados de los servicios SEO dependen de múltiples factores, muchos de ellos externos al control del PROVEEDOR, como los algoritmos de los buscadores, la competencia del sector, etc. Por ello, EL PROVEEDOR no garantiza posiciones específicas en los resultados de búsqueda, aunque se compromete a realizar sus mejores esfuerzos para mejorar el posicionamiento de la web.</p>
<p><strong>SÉPTIMA. - CONFIDENCIALIDAD</strong></p>
<p>Ambas partes se comprometen a mantener la más estricta confidencialidad respecto a toda la información a la que tengan acceso como consecuencia del presente contrato, no pudiendo revelarla a terceros sin el consentimiento expreso de la otra parte.</p>
<p><strong>OCTAVA. - PROTECCIÓN DE DATOS</strong></p>
<p>Las partes se comprometen a cumplir con la normativa vigente en materia de protección de datos personales, en particular con el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales.</p>
<p><strong>NOVENA. - CAUSAS DE RESOLUCIÓN DEL CONTRATO</strong></p>
<p>Serán causas de resolución del presente contrato:</p>
<ul>
<li>El incumplimiento por cualquiera de las partes de las obligaciones asumidas en el presente contrato.</li>
<li>El mutuo acuerdo entre las partes.</li>
<li>La declaración de concurso o la insolvencia de cualquiera de las partes.</li>
</ul>
<p><strong>DÉCIMA. - LEY APLICABLE Y JURISDICCIÓN</strong></p>
<p>El presente contrato se regirá por la legislación española. Para la resolución de cualquier controversia que pudiera surgir en relación con la interpretación o ejecución del presente contrato, las partes se someten a la jurisdicción de los Juzgados y Tribunales de [CIUDAD], con renuncia expresa a cualquier otro fuero que pudiera corresponderles.</p>
<p>Y en prueba de conformidad, ambas partes firman el presente contrato por duplicado y a un solo efecto, en el lugar y fecha indicados en el encabezamiento.</p>
<p>&nbsp;</p>
<table style="width: 100%;">
<tbody>
<tr>
<td style="width: 50%; text-align: center;"><strong>EL PROVEEDOR</strong></td>
<td style="width: 50%; text-align: center;"><strong>EL CLIENTE</strong></td>
</tr>
<tr>
<td style="height: 50px;">&nbsp;</td>
<td style="height: 50px;">&nbsp;</td>
</tr>
<tr>
<td style="text-align: center;">Fdo.: [NOMBRE DEL REPRESENTANTE]</td>
<td style="text-align: center;">Fdo.: [NOMBRE DEL REPRESENTANTE DEL CLIENTE]</td>
</tr>
</tbody>
</table>
`;

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
  
  // Inicializar el formulario cuando se abre para editar un contrato existente
  useEffect(() => {
    if (open) {
      if (editingContract) {
        setTitle(editingContract.title);
        setContent(editingContract.content);
      } else {
        // Inicializar con valores por defecto para un nuevo contrato
        setTitle(`Contrato de Servicios SEO - ${clientName || 'Cliente'}`);
        // Usar la plantilla por defecto y reemplazar los marcadores de posición
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
