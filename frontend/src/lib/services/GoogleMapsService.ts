// Google Maps Service with modern API usage
export interface GooglePlaceDetails {
  name: string;
  rating: number;
  totalReviews: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  formatted_address?: string;
  place_id: string;
}

class GoogleMapsService {
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    if (!this.apiKey) {
      console.error('Google Maps API key is not set');
    }
  }

  // Get place details using the new Place API (not deprecated PlacesService)
  async getPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
    if (!this.apiKey) {
      console.error('Google Maps API key is not available');
      return null;
    }

    try {
      // Use the new Place API instead of deprecated PlacesService
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?` +
        `place_id=${placeId}&` +
        `fields=name,rating,user_ratings_total,geometry,formatted_address&` +
        `key=${this.apiKey}`
      );

      const data = await response.json();

      if (data.status !== 'OK') {
        console.error('Google Places API error:', data.error_message);
        return null;
      }

      const placeDetails: GooglePlaceDetails = {
        name: data.result.name,
        rating: data.result.rating || 0,
        totalReviews: data.result.user_ratings_total || 0,
        geometry: data.result.geometry,
        formatted_address: data.result.formatted_address,
        place_id: placeId,
      };

      return placeDetails;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  }

  // Get coordinates from place ID
  async getCoordinates(placeId: string): Promise<{ lat: number; lng: number } | null> {
    const details = await this.getPlaceDetails(placeId);
    return details?.geometry?.location || null;
  }
}

// Export singleton instance
export const googleMapsService = new GoogleMapsService();
