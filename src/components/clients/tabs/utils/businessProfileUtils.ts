
import { BusinessProfile } from '@/types/report.types';

// Define interfaces for business hours data
export interface BusinessHour {
  name?: string;
  value?: string;
  [key: string]: any;
}

export interface BusinessHours {
  Hours?: BusinessHour[];
  [key: string]: any;
}

/**
 * Formats and renders business hours from various possible formats
 * @param businessHours - The business hours data from API
 * @returns Formatted business hours array for rendering
 */
export const formatBusinessHours = (businessHours: any): { dayName: string, timeValue: string }[] => {
  if (!businessHours) {
    return [];
  }

  // Case 1: businessHours has Hours property and it's an array
  if (businessHours.Hours && Array.isArray(businessHours.Hours)) {
    return businessHours.Hours.map((hour: BusinessHour) => {
      if (typeof hour !== 'object' || hour === null) {
        return { dayName: 'Día', timeValue: 'No disponible' };
      }
      
      const hourName = hour && 'name' in hour ? String(hour.name) : 'Día';
      const hourValue = hour && 'value' in hour ? String(hour.value) : 'No disponible';
      
      return { dayName: hourName, timeValue: hourValue };
    });
  }
  
  // Case 2: businessHours is a string that looks like JSON
  if (typeof businessHours === 'string') {
    try {
      const parsedHours: BusinessHours = JSON.parse(businessHours);
      if (parsedHours.Hours && Array.isArray(parsedHours.Hours)) {
        return parsedHours.Hours.map((hour: BusinessHour) => {
          if (typeof hour !== 'object' || hour === null) {
            return { dayName: 'Día', timeValue: 'No disponible' };
          }
          
          const hourName = hour && 'name' in hour ? String(hour.name) : 'Día';
          const hourValue = hour && 'value' in hour ? String(hour.value) : 'No disponible';
          
          return { dayName: hourName, timeValue: hourValue };
        });
      }
    } catch (e) {
      console.error('Error parsing business hours:', e);
    }
  }
  
  // Case 3: Fallback for any other format - handle it as a simple object with key-value pairs
  const hours = typeof businessHours === 'object' ? businessHours : {};
  
  if (Object.keys(hours).length === 0) {
    return [];
  }
  
  return Object.entries(hours).map(([day, timeObj]) => {
    if (typeof timeObj === 'object' && timeObj !== null) {
      const hasName = timeObj && typeof timeObj === 'object' && 'name' in timeObj;
      const hasValue = timeObj && typeof timeObj === 'object' && 'value' in timeObj;
      
      const name = hasName && timeObj.name ? String(timeObj.name) : 'Día';
      const value = hasValue && timeObj.value ? String(timeObj.value) : 'No disponible';
      
      return { dayName: name, timeValue: value };
    }
    
    const dayDisplay = day || 'Día';
    let timeDisplay = 'No disponible';
    
    if (timeObj !== null && timeObj !== undefined) {
      timeDisplay = String(timeObj);
    }
    
    return { dayName: dayDisplay, timeValue: timeDisplay };
  }).filter(Boolean);
};
