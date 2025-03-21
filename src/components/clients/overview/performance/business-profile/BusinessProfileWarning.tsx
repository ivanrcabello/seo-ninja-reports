
import React from 'react';

interface BusinessProfileWarningProps {
  isSimulated: boolean;
}

const BusinessProfileWarning: React.FC<BusinessProfileWarningProps> = ({ isSimulated }) => {
  if (!isSimulated) return null;
  
  return (
    <div className="py-2 px-3 bg-amber-50 border border-amber-200 rounded-md">
      <p className="text-xs text-amber-700">
        Se muestran datos simulados. Usa el botón de actualizar para obtener datos reales.
      </p>
    </div>
  );
};

export default BusinessProfileWarning;
