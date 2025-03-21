
// Database table schemas for edge functions

export interface BusinessProfileRecord {
  business_url: string;
  business_name?: string;
  business_address?: string;
  business_category?: string;
  business_rating?: number;
  business_reviews_count?: number;
  business_phone?: string;
  business_website?: string;
  business_hours?: Record<string, string>;
  last_scraped_at: string;
}
