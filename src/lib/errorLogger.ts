
/**
 * Función simple para registrar errores en la consola de manera consistente
 */
export const logError = (context: string, error: any) => {
  console.error(`[ERROR] ${context}:`, error);
  
  if (error.response) {
    console.error(`Response data:`, error.response.data);
    console.error(`Status:`, error.response.status);
  }
  
  // También podríamos enviar este error a un servicio de monitoreo como Sentry
};
