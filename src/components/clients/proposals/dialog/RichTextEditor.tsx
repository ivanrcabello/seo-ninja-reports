
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Describe brevemente esta propuesta... (Admite HTML)"
}) => {
  return (
    <div className="border rounded-md">
      <div className="p-1 bg-muted/50 border-b flex items-center gap-1">
        <button
          type="button"
          className="p-1 hover:bg-muted rounded"
          onClick={() => onChange(value + '<b>Texto en negrita</b>')}
        >
          <b>N</b>
        </button>
        <button
          type="button"
          className="p-1 hover:bg-muted rounded"
          onClick={() => onChange(value + '<i>Texto en cursiva</i>')}
        >
          <i>C</i>
        </button>
        <button
          type="button"
          className="p-1 hover:bg-muted rounded"
          onClick={() => onChange(value + '<u>Texto subrayado</u>')}
        >
          <u>S</u>
        </button>
        <button
          type="button"
          className="p-1 hover:bg-muted rounded"
          onClick={() => onChange(value + '<h3>Título</h3>')}
        >
          T
        </button>
        <button
          type="button"
          className="p-1 hover:bg-muted rounded"
          onClick={() => onChange(value + '<ul><li>Elemento de lista</li></ul>')}
        >
          • Lista
        </button>
      </div>
      <Textarea 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder}
        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        rows={6}
      />
    </div>
  );
};

export default RichTextEditor;
