'use client';

import React from "react";
import { LoadScript } from "@react-google-maps/api";

// Static libraries array to prevent reloading
const LIBRARIES: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];

interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

export default function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("Google Maps API key is not defined in environment variables.");
    return (
      <div className="text-red-600 p-4 bg-red-100 rounded-md">
        Google Maps API key is missing. Please set <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>.
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={LIBRARIES}>
      {children}
    </LoadScript>
  );
}
