
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  details?: any;
  component?: string;
}

/**
 * Servicio para registrar logs del portal del cliente
 * Guarda logs en localStorage y opcionalmente en la base de datos
 */
export const clientPortalLogger = {
  /**
   * Registra un mensaje informativo
   */
  info: (message: string, details?: any, component?: string) => {
    const logEntry: LogEntry = { 
      level: 'info', 
      message, 
      details, 
      component 
    };
    _saveLog(logEntry);
    return logEntry;
  },

  /**
   * Registra un mensaje de advertencia
   */
  warn: (message: string, details?: any, component?: string) => {
    const logEntry: LogEntry = { 
      level: 'warn', 
      message, 
      details, 
      component 
    };
    _saveLog(logEntry);
    console.warn(`[${component || 'ClientPortal'}]`, message, details || '');
    return logEntry;
  },

  /**
   * Registra un mensaje de error
   */
  error: (message: string, details?: any, component?: string) => {
    const logEntry: LogEntry = { 
      level: 'error', 
      message, 
      details, 
      component 
    };
    _saveLog(logEntry);
    console.error(`[${component || 'ClientPortal'}]`, message, details || '');
    return logEntry;
  },

  /**
   * Obtiene todos los logs almacenados
   */
  getLogs: (): LogEntry[] => {
    try {
      const logsString = localStorage.getItem('clientPortalLogs');
      return logsString ? JSON.parse(logsString) : [];
    } catch (error) {
      console.error('Error al recuperar logs:', error);
      return [];
    }
  },

  /**
   * Limpia todos los logs almacenados
   */
  clearLogs: () => {
    localStorage.removeItem('clientPortalLogs');
  }
};

/**
 * Guarda un log en localStorage y opcionalmente en la base de datos
 */
function _saveLog(logEntry: LogEntry) {
  try {
    // Añadir timestamp
    const logWithTimestamp = {
      ...logEntry,
      timestamp: new Date().toISOString()
    };
    
    // Guardar en localStorage (mantenemos solo los últimos 100 logs)
    const existingLogs = clientPortalLogger.getLogs();
    const updatedLogs = [logWithTimestamp, ...existingLogs].slice(0, 100);
    localStorage.setItem('clientPortalLogs', JSON.stringify(updatedLogs));
    
    // Si hay un token de sesión, guardar también en la base de datos
    const session = localStorage.getItem('clientPortalSession');
    if (session) {
      const { account_id } = JSON.parse(session);
      if (account_id && logEntry.level === 'error') {
        // Solo guardamos errores en la base de datos para no llenarla
        _saveLogToDatabase(account_id, logWithTimestamp);
      }
    }
  } catch (error) {
    console.error('Error al guardar log:', error);
  }
}

/**
 * Guarda un log en la base de datos
 */
async function _saveLogToDatabase(accountId: string, logEntry: LogEntry & { timestamp: string }) {
  try {
    await supabase.from('client_portal_activity_logs').insert({
      client_portal_account_id: accountId,
      action: 'log_' + logEntry.level,
      details: {
        message: logEntry.message,
        component: logEntry.component,
        details: logEntry.details,
        timestamp: logEntry.timestamp
      }
    });
  } catch (error) {
    // No mostramos toast para no molestar al usuario con errores de logging
    console.error('Error al guardar log en base de datos:', error);
  }
}
