
import React from 'react';

interface ContentTabProps {
  content: any;
}

export const ContentTab: React.FC<ContentTabProps> = ({ content }) => {
  if (!content) {
    return <p className="text-muted-foreground">No hay contenido disponible para este informe.</p>;
  }

  if (typeof content === 'string') {
    return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />;
  }

  // If content is an array of sections
  if (Array.isArray(content)) {
    return (
      <div className="space-y-8">
        {content.map((section, index) => (
          <div key={index} className="space-y-4">
            {section.title && <h2 className="text-xl font-bold">{section.title}</h2>}
            {section.content && (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: section.content }} />
            )}
          </div>
        ))}
      </div>
    );
  }

  // If content is an object with sections
  if (typeof content === 'object') {
    return (
      <div className="space-y-8">
        {Object.entries(content).map(([key, value]: [string, any]) => (
          <div key={key} className="space-y-4">
            {value.title && <h2 className="text-xl font-bold">{value.title}</h2>}
            {value.content && (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: value.content }} />
            )}
          </div>
        ))}
      </div>
    );
  }

  return <p className="text-muted-foreground">Formato de contenido no reconocido.</p>;
};
