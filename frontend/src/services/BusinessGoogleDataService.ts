import { BusinessGoogleData, BusinessGoogleDataResponse, CacheCheckResponse } from '@/types/google-business';

/**
 * Service for fetching business Google data with caching support
 * Replaces the old GoogleDataService with improved types and error handling
 */
export class BusinessGoogleDataService {
  private static readonly BASE_URL = '/api/business-google-data';

  /**
   * Fetch Google data for a business with caching
   * First checks DB, then fetches from Google API if needed
   */
  static async getGoogleData(businessId: number): Promise<BusinessGoogleData> {
    try {
      const response = await fetch(`${this.BASE_URL}/${businessId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: BusinessGoogleDataResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch Google data');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching Google data:', error);
      throw error;
    }
  }

  /**
   * Force refresh Google data (ignore cache)
   */
  static async refreshGoogleData(businessId: number): Promise<BusinessGoogleData> {
    try {
      const response = await fetch(`${this.BASE_URL}/${businessId}?refresh=true`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: BusinessGoogleDataResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to refresh Google data');
      }
      
      return data;
    } catch (error) {
      console.error('Error refreshing Google data:', error);
      throw error;
    }
  }

  /**
   * Check if business has cached Google data
   * This is now integrated into the main API route, but kept for compatibility
   */
  static async hasCachedData(businessId: number): Promise<boolean> {
    try {
      const data = await this.getGoogleData(businessId);
      return data.cached;
    } catch (error) {
      console.error('Error checking cached data:', error);
      return false;
    }
  }

  /**
   * Get cache status information
   */
  static async getCacheStatus(businessId: number): Promise<CacheCheckResponse> {
    try {
      const data = await this.getGoogleData(businessId);
      return {
        hasCachedData: data.cached,
        reviewsCount: data.reviews.length,
        openingHoursCount: data.openingHours.length,
        photosCount: data.photos.length,
        lastUpdated: data.lastUpdated?.toISOString() || null
      };
    } catch (error) {
      console.error('Error getting cache status:', error);
      return {
        hasCachedData: false,
        reviewsCount: 0,
        openingHoursCount: 0,
        photosCount: 0,
        lastUpdated: null
      };
    }
  }
}
