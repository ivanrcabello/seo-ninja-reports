import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatReportContent } from '@/utils/reportUtils';

interface ReportEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeSection: string | null;
  editContent: string;
  setEditContent: (content: string) => void;
  onSave: () => void;
  getSectionTitle: (section: string) => string;
}

const ReportEditDialog: React.FC<ReportEditDialogProps> = ({
  open,
  onOpenChange,
  activeSection,
  editContent,
  setEditContent,
  onSave,
  getSectionTitle
}) => {
  const storageKey = activeSection ? `report-edit-content-${activeSection}` : null;
  const [activeTab, setActiveTab] = useState<'markdown' | 'html' | 'preview'>('markdown');
  
  useEffect(() => {
    if (open && activeSection && storageKey) {
      const savedContent = sessionStorage.getItem(storageKey);
      if (savedContent) {
        setEditContent(savedContent);
      }
    }
  }, [open, activeSection, storageKey, setEditContent]);

  useEffect(() => {
    if (activeSection && storageKey && editContent) {
      sessionStorage.setItem(storageKey, editContent);
    }
  }, [activeSection, storageKey, editContent]);

  useEffect(() => {
    if (!activeSection || !storageKey) return;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && editContent) {
        sessionStorage.setItem(storageKey, editContent);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeSection, storageKey, editContent]);

  useEffect(() => {
    if (!open && activeSection && storageKey) {
      if (storageKey) {
        sessionStorage.removeItem(storageKey);
      }
    }
  }, [open, activeSection, storageKey]);

  const handleSave = () => {
    onSave();
    if (storageKey) {
      sessionStorage.removeItem(storageKey);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const convertToHtml = () => {
    if (activeTab === 'markdown') {
      let html = editContent;
      
      html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');
      html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
      html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
      
      html = html.replace(/^- (.*)$/gm, '<li>$1</li>');
      
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      const paragraphs = html.split('\n\n');
      html = paragraphs.map(p => {
        if (p.trim() === '') return '';
        if (p.startsWith('<h') || p.startsWith('<li') || p.includes('</li>')) return p;
        
        if (p.includes('<li>')) {
          return `<ul>${p}</ul>`;
        }
        
        return `<p>${p}</p>`;
      }).join('\n\n');
      
      setEditContent(html);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl glass">
        <DialogHeader>
          <DialogTitle>Editar {activeSection ? getSectionTitle(activeSection) : ''}</DialogTitle>
          <DialogDescription>
            Modifica el contenido de esta sección del informe. Puedes usar HTML para dar formato al texto.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="markdown" value={activeTab} onValueChange={(value) => {
          setActiveTab(value as 'markdown' | 'html' | 'preview');
          if (value === 'html') {
            convertToHtml();
          }
        }}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="markdown">Texto</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="preview">Vista previa</TabsTrigger>
          </TabsList>
          
          <TabsContent value="markdown" className="space-y-4">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              placeholder="Escribe tu contenido aquí usando formato de texto simple. 

# Título
## Subtítulo

- Lista de elementos
- Otro elemento

Párrafo con **texto en negrita**."
            />
            <div className="text-xs text-muted-foreground">
              <p>Puedes usar:</p>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li><code className="bg-muted px-1 rounded"># Título</code> para títulos</li>
                <li><code className="bg-muted px-1 rounded">## Subtítulo</code> para subtítulos</li>
                <li><code className="bg-muted px-1 rounded">- Elemento</code> para listas</li>
                <li><code className="bg-muted px-1 rounded">**texto**</code> para negrita</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="html">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              placeholder="<h1>Título</h1>
<h2>Subtítulo</h2>

<ul>
  <li>Lista de elementos</li>
  <li>Otro elemento</li>
</ul>

<p>Párrafo con <strong>texto en negrita</strong>.</p>"
            />
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="border rounded-md p-4 min-h-[300px] overflow-auto">
              <div 
                dangerouslySetInnerHTML={{ __html: formatReportContent(editContent) }}
                className="prose prose-sm max-w-none prose-headings:text-primary prose-strong:text-primary/90 prose-strong:font-semibold prose-li:my-1"
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportEditDialog;
