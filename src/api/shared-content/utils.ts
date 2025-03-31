
import { supabase } from '@/integrations/supabase/client';
import { ExistsResponse, ProtectionResponse, PasswordVerificationResponse, AccessLogOptions, AccessLogType } from '@/types/shared-content';

// Define valid table names for content types
const validTableNames = {
  report: 'public_reports',
  proposal: 'public_proposals',
  invoice: 'public_invoices',
  contract: 'public_contracts'
} as const;

type ContentType = keyof typeof validTableNames;
type TableName = typeof validTableNames[ContentType];

/**
 * Get the appropriate table name for a content type
 */
const getTableName = (contentType: string): TableName => {
  const type = contentType as ContentType;
  if (Object.keys(validTableNames).includes(type)) {
    return validTableNames[type];
  }
  throw new Error(`Invalid content type: ${contentType}`);
};

/**
 * Common function to check if content exists by ID
 */
export const checkContentExists = async (
  contentId: string,
  contentType: string = 'content'
): Promise<ExistsResponse> => {
  try {
    const tableName = getTableName(contentType);
    
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .eq('shared_url', contentId)
      .maybeSingle();
    
    if (error) throw error;
    
    return { exists: !!data, error: null };
  } catch (error: any) {
    console.error(`Error checking if ${contentType} exists:`, error);
    return { exists: false, error };
  }
};

/**
 * Common function to check if content is password protected
 */
export const checkContentPasswordProtection = async (
  contentId: string,
  contentType: string = 'content'
): Promise<ProtectionResponse> => {
  try {
    const tableName = getTableName(contentType);
    
    const { data, error } = await supabase
      .from(tableName)
      .select('password')
      .eq('shared_url', contentId)
      .maybeSingle();
    
    if (error) throw error;
    
    // Check if data exists and has a non-empty password
    const isProtected = !!(data && data.password && typeof data.password === 'string' && data.password.trim() !== '');
    return { isProtected, error: null };
  } catch (error: any) {
    console.error(`Error checking ${contentType} password protection:`, error);
    return { isProtected: false, error };
  }
};

/**
 * Common function to verify content password
 */
export const verifyContentPassword = async (
  contentId: string,
  contentType: string = 'content',
  password: string
): Promise<boolean> => {
  try {
    const tableName = getTableName(contentType);
    
    const { data, error } = await supabase
      .from(tableName)
      .select('password')
      .eq('shared_url', contentId)
      .single();
    
    if (error) {
      console.error(`Error fetching ${contentType} password:`, error);
      return false;
    }
    
    // If no password is set, or password matches
    if (!data || !data.password || typeof data.password !== 'string') {
      return true;
    }
    
    return data.password === password;
  } catch (error) {
    console.error(`Error verifying ${contentType} password:`, error);
    return false;
  }
};

/**
 * Common function to log content access
 */
export const logContentAccess = (
  contentType: string,
  contentId: string,
  options: AccessLogOptions,
  eventType: AccessLogType = 'view'
): void => {
  // For now, just log to console
  console.log(`${contentType} access log [${eventType}]:`, {
    contentId,
    contentType,
    eventType,
    isSuccessful: options.successful,
    isPasswordAttempt: options.passwordAttempt || false,
    errorMessage: options.error,
    source: options.source || 'direct_access',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    timestamp: new Date().toISOString()
  });
};
