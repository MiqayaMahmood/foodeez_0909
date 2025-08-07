import { useState, useEffect } from "react";
import { GoogleMap } from "@react-google-maps/api";
import { Card } from "@/components/ui/card";
import { googleMapsService } from "@/lib/services/GoogleMapsService";

interface MapCardProps {
  placeId: string;
}

export default function MapCard({ placeId }: MapCardProps) {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    throw new Error(
      "Google Maps API key is not defined in environment variables."
    );
  }
  if (!placeId) {
    throw new Error("Place ID is required to display the map.");
  }

  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const coordinates = await googleMapsService.getCoordinates(placeId);
        
        if (coordinates) {
          setCenter(coordinates);
        } else {
          setError("Could not fetch location details");
        }
      } catch (err) {
        console.error("Error fetching place details:", err);
        setError("Failed to load map location");
      } finally {
        setIsLoading(false);
      }
    };

    if (placeId) {
      fetchPlaceDetails();
    }
  }, [placeId]);

  if (isLoading) {
    return (
      <Card className="p-8 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-gray-500">Loading map...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-red-600">Map Error</h3>
          <p className="text-gray-500 mt-2">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="">
      {center ? (
        <GoogleMap
          mapContainerStyle={{ height: "400px", width: "100%" }}
          center={center}
          zoom={15}
          options={{
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
          }}
        />
      ) : (
        <div className="p-8 flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-xl font-semibold">Google Map</h3>
            <p className="text-gray-500 mt-2">Map would be displayed here</p>
          </div>
        </div>
      )}
    </Card>
  );
}
