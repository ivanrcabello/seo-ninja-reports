
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
    
    // Use Supabase RPC or SQL function call instead of direct table access to avoid type issues
    // This is more reliable when checking for existence of a column
    const { data, error } = await supabase
      .rpc('check_content_password_protected', { 
        content_id: contentId,
        content_type: contentType
      });
    
    if (error) throw error;
    
    // Check if data exists and has a value
    return { isProtected: !!data, error: null };
  } catch (error: any) {
    console.error(`Error checking ${contentType} password protection:`, error);
    
    // Fallback approach: Try direct query but handle case where password column doesn't exist
    try {
      const tableName = getTableName(contentType);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('password')
        .eq('shared_url', contentId)
        .maybeSingle();
      
      if (error) {
        // If error is because password column doesn't exist, it's not protected
        if (error.message.includes("column 'password' does not exist")) {
          return { isProtected: false, error: null };
        }
        throw error;
      }
      
      // Check if data exists and has a non-empty password
      const isProtected = !!(data && 'password' in data && data.password && typeof data.password === 'string' && data.password.trim() !== '');
      return { isProtected, error: null };
      
    } catch (fallbackError: any) {
      console.error(`Fallback error checking ${contentType} password protection:`, fallbackError);
      return { isProtected: false, error: fallbackError };
    }
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
    // Use Supabase RPC function that safely checks the password across tables
    const { data, error } = await supabase
      .rpc('verify_content_password', {
        content_id: contentId,
        content_type: contentType,
        password_param: password
      });
    
    if (error) {
      console.error(`Error with RPC verification for ${contentType} password:`, error);
      
      // Fallback method if RPC fails - do a direct table query
      const tableName = getTableName(contentType);
      
      try {
        const { data: directData, error: directError } = await supabase
          .from(tableName)
          .select('password')
          .eq('shared_url', contentId)
          .single();
        
        if (directError) {
          if (directError.message.includes("column 'password' does not exist")) {
            return true; // If no password column exists, treat as not password protected
          }
          console.error(`Error fetching ${contentType} password:`, directError);
          return false;
        }
        
        // If no password is set, or password matches
        if (!directData || !('password' in directData) || !directData.password || typeof directData.password !== 'string') {
          return true;
        }
        
        return directData.password === password;
      } catch (directQueryError) {
        console.error(`Direct query error verifying ${contentType} password:`, directQueryError);
        return false;
      }
    }
    
    return !!data;
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
