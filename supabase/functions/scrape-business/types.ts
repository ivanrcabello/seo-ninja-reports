
// Define the interface for business data
export interface BusinessProfileData {
  businessName?: string;
  businessAddress?: string;
  businessCategory?: string;
  businessRating?: number;
  businessReviewsCount?: number;
  businessPhone?: string;
  businessWebsite?: string;
  businessHours?: Record<string, string>;
  businessUrl: string;
}
