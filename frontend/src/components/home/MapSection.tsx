"use client";

import { useEffect, useState, useRef } from "react";
import { GoogleMap } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const defaultZoom = 14;

export default function MapSection() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<any>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setHasPermission(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setHasPermission(true);
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setHasPermission(false);
      }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  // Add AdvancedMarkerElement when map and userLocation are ready
  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    if (userLocation && window.google?.maps?.marker?.AdvancedMarkerElement) {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
        map,
        position: userLocation,
        title: "You are here!",
      });
    }
  };

  useEffect(() => {
    if (mapRef.current && userLocation && window.google?.maps?.marker?.AdvancedMarkerElement) {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: userLocation,
        title: "You are here!",
      });
    }
  }, [userLocation]);

  return (
    <div className="relative w-full h-[600px]  overflow-hidden shadow-md">
      {hasPermission === null && (
        <MapSkeleton />
      )}

      {hasPermission === true && userLocation && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation}
          zoom={defaultZoom}
          options={{
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
          }}
          onLoad={handleMapLoad}
        />
      )}

      {hasPermission === false && (
        <div className="flex flex-col items-center justify-center h-full bg-gray-100 text-gray-600 text-center px-6">
          <h2 className="text-xl font-semibold mb-2">Location Access Denied</h2>
          <p className="mb-4">
            It looks like you've blocked location access. To try again, please
            enable it from your browser settings and reload the page.
          </p>
          <span className="text-6xl my-4">📍</span>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-primary text-white px-4 py-2 rounded hover:bg-primary-700 transition"
          >
            Reload Page
          </button>
        </div>
      )}
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="w-full h-full bg-gray-200 rounded-xl animate-pulse">
      <div className="absolute top-4 left-4 h-10 w-48 bg-gray-300 rounded-md animate-pulse" />
      <div className="absolute bottom-20 right-4 h-10 w-10 bg-gray-300 rounded-full animate-pulse" />
      <div className="absolute bottom-8 right-4 h-10 w-10 bg-gray-300 rounded-full animate-pulse" />
    </div>
  );
} 

