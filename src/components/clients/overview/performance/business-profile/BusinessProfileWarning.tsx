
import React from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';

interface BusinessProfileWarningProps {
  isSimulated: boolean;
  missingFields?: string[];
}

const BusinessProfileWarning: React.FC<BusinessProfileWarningProps> = ({ 
  isSimulated, 
  missingFields = [] 
}) => {
  if (!isSimulated && missingFields.length === 0) return null;
  
  return (
    <div className={`py-2 px-3 rounded-md ${isSimulated ? 'bg-amber-50 border border-amber-200' : 'bg-blue-50 border border-blue-200'}`}>
      {isSimulated ? (
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            Se muestran datos simulados. Usa el botón de actualizar para obtener datos reales.
          </p>
        </div>
      ) : missingFields.length > 0 ? (
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-blue-700">
              Algunos datos no pudieron ser extraídos:
            </p>
            <ul className="text-xs text-blue-700 mt-1 list-disc list-inside">
              {missingFields.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BusinessProfileWarning;
