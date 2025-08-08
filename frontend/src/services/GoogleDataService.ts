
export interface CachedGoogleData {
  reviews: any[];
  openingHours: any[];
  isOpenNow: boolean;
  photos: any[];
  name: string;
  rating: number;
  totalReviews: number;
  geometry: any;
}

export class GoogleDataService {
  /**
   * Fetch Google data for a business with caching
   * First checks DB, then fetches from Google API if needed
   */
  static async getGoogleData(businessId: number): Promise<CachedGoogleData> {
    try {
      const response = await fetch(`/api/google-data/${businessId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Google data: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching Google data:', error);
      throw error;
    }
  }

  /**
   * Force refresh Google data (ignore cache)
   */
  static async refreshGoogleData(businessId: number): Promise<CachedGoogleData> {
    try {
      const response = await fetch(`/api/google-data/${businessId}?refresh=true`);
      
      if (!response.ok) {
        throw new Error(`Failed to refresh Google data: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error refreshing Google data:', error);
      throw error;
    }
  }

  /**
   * Check if business has cached Google data
   */
  static async hasCachedData(businessId: number): Promise<boolean> {
    try {
      const response = await fetch(`/api/google-data/${businessId}/check`);
      
      if (!response.ok) {
        return false;
      }
      
      const data = await response.json();
      return data.hasCachedData;
    } catch (error) {
      console.error('Error checking cached data:', error);
      return false;
    }
  }
}
