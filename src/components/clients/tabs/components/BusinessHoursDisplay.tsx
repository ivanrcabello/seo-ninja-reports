
import React from 'react';
import { Clock } from 'lucide-react';
import { formatBusinessHours } from '../utils/businessProfileUtils';

interface BusinessHoursDisplayProps {
  businessHours: any;
}

const BusinessHoursDisplay: React.FC<BusinessHoursDisplayProps> = ({ businessHours }) => {
  const formattedHours = formatBusinessHours(businessHours);
  
  if (formattedHours.length === 0) {
    return (
      <div className="flex items-start gap-2">
        <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
        <p className="text-muted-foreground">No hay información de horarios disponible</p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
      <div className="flex-1">
        <div className="grid grid-cols-1 gap-1">
          {formattedHours.map((hour, index) => (
            <div key={index} className="flex justify-between">
              <span className="font-medium capitalize">{hour.dayName}:</span>
              <span>{hour.timeValue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessHoursDisplay;
