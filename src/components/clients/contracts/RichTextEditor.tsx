
import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, className }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  
  const handleBlur = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    setIsEditorFocused(false);
  };
  
  const handleFocus = () => {
    setIsEditorFocused(true);
  };
  
  const executeCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      editorRef.current.focus();
    }
  };
  
  // Opciones de formato comunes
  const formatOptions = [
    { command: 'bold', icon: 'format_bold', title: 'Negrita' },
    { command: 'italic', icon: 'format_italic', title: 'Cursiva' },
    { command: 'underline', icon: 'format_underlined', title: 'Subrayado' },
    { command: 'strikethrough', icon: 'strikethrough_s', title: 'Tachado' },
  ];
  
  // Opciones de alineación
  const alignOptions = [
    { command: 'justifyLeft', icon: 'format_align_left', title: 'Alinear a la izquierda' },
    { command: 'justifyCenter', icon: 'format_align_center', title: 'Centrar' },
    { command: 'justifyRight', icon: 'format_align_right', title: 'Alinear a la derecha' },
    { command: 'justifyFull', icon: 'format_align_justify', title: 'Justificar' },
  ];
  
  // Opciones de listas
  const listOptions = [
    { command: 'insertUnorderedList', icon: 'format_list_bulleted', title: 'Lista no ordenada' },
    { command: 'insertOrderedList', icon: 'format_list_numbered', title: 'Lista ordenada' },
  ];
  
  // Opciones de indentación
  const indentOptions = [
    { command: 'outdent', icon: 'format_indent_decrease', title: 'Reducir sangría' },
    { command: 'indent', icon: 'format_indent_increase', title: 'Aumentar sangría' },
  ];
  
  return (
    <div className={cn("flex flex-col border rounded-md overflow-hidden", 
      isEditorFocused ? "ring-2 ring-ring ring-offset-background" : "",
      className)}>
      <div className="p-2 bg-muted/50 border-b flex flex-wrap gap-1">
        {/* Encabezados */}
        <select 
          className="bg-background text-sm rounded px-2 py-1 border"
          onChange={(e) => executeCommand('formatBlock', e.target.value)}
          title="Formato de encabezado"
        >
          <option value="p">Párrafo</option>
          <option value="h1">Título 1</option>
          <option value="h2">Título 2</option>
          <option value="h3">Título 3</option>
          <option value="h4">Título 4</option>
          <option value="h5">Título 5</option>
          <option value="h6">Título 6</option>
        </select>
        
        <div className="h-6 w-px bg-border mx-1"></div>
        
        {/* Opciones de formato */}
        <div className="flex gap-1">
          {formatOptions.map((option) => (
            <button
              key={option.command}
              type="button"
              className="p-1 rounded hover:bg-muted"
              onClick={() => executeCommand(option.command)}
              title={option.title}
            >
              <span className="material-icons text-lg">{option.icon}</span>
            </button>
          ))}
        </div>
        
        <div className="h-6 w-px bg-border mx-1"></div>
        
        {/* Opciones de alineación */}
        <div className="flex gap-1">
          {alignOptions.map((option) => (
            <button
              key={option.command}
              type="button"
              className="p-1 rounded hover:bg-muted"
              onClick={() => executeCommand(option.command)}
              title={option.title}
            >
              <span className="material-icons text-lg">{option.icon}</span>
            </button>
          ))}
        </div>
        
        <div className="h-6 w-px bg-border mx-1"></div>
        
        {/* Opciones de listas */}
        <div className="flex gap-1">
          {listOptions.map((option) => (
            <button
              key={option.command}
              type="button"
              className="p-1 rounded hover:bg-muted"
              onClick={() => executeCommand(option.command)}
              title={option.title}
            >
              <span className="material-icons text-lg">{option.icon}</span>
            </button>
          ))}
        </div>
        
        <div className="h-6 w-px bg-border mx-1"></div>
        
        {/* Opciones de indentación */}
        <div className="flex gap-1">
          {indentOptions.map((option) => (
            <button
              key={option.command}
              type="button"
              className="p-1 rounded hover:bg-muted"
              onClick={() => executeCommand(option.command)}
              title={option.title}
            >
              <span className="material-icons text-lg">{option.icon}</span>
            </button>
          ))}
        </div>
        
        <div className="h-6 w-px bg-border mx-1"></div>
        
        {/* Tabla */}
        <button
          type="button"
          className="p-1 rounded hover:bg-muted"
          onClick={() => executeCommand('insertHTML', '<table border="1" style="width: 100%;"><tbody><tr><td>Celda 1</td><td>Celda 2</td></tr><tr><td>Celda 3</td><td>Celda 4</td></tr></tbody></table>')}
          title="Insertar tabla"
        >
          <span className="material-icons text-lg">table_chart</span>
        </button>
        
        {/* Línea horizontal */}
        <button
          type="button"
          className="p-1 rounded hover:bg-muted"
          onClick={() => executeCommand('insertHorizontalRule')}
          title="Insertar línea horizontal"
        >
          <span className="material-icons text-lg">horizontal_rule</span>
        </button>
      </div>
      
      <div
        ref={editorRef}
        className="p-4 min-h-[200px] outline-none bg-background flex-grow overflow-y-auto"
        contentEditable
        dangerouslySetInnerHTML={{ __html: value }}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
    </div>
  );
};

export default RichTextEditor;
