"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Script from "next/script";

interface SearchBarProps {
  query : string;
  zipcode : string;
  onSearch: (query: string, zipcode: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading , query , zipcode }: SearchBarProps) {
  // 1. Initialize state from props
  const [searchValue, setSearchValue] = useState(query);
  const [location, setLocation] = useState(zipcode);
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false); // Renamed for clarity
  const [isLocationInputFocused, setIsLocationInputFocused] = useState(false); // New state for location input focus
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const locationInputRef = useRef<HTMLInputElement>(null); // Renamed ref for clarity
  const autocompleteListenerRef = useRef<google.maps.MapsEventListener | null>(null);

  // 2. Initialize Google Places Autocomplete with cleanup
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.google &&
      window.google.maps &&
      locationInputRef.current
    ) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        locationInputRef.current,
        {
          types: ["(regions)"],
          componentRestrictions: { country: "ch" }, // Restrict to Switzerland
          fields: ["address_components", "formatted_address"],
        }
      );

      // Add listener for place selection
      const listener = autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.address_components) {
          // Find postal code from address components
          const postalCodeComponent = place.address_components.find(
            (component) => component.types.includes("postal_code")
          );
          if (postalCodeComponent) {
            setLocation(postalCodeComponent.long_name);
          } else {
            // 3. If no postal code, clear the field
            setLocation("");
          }
        }
      });
      autocompleteListenerRef.current = listener;
    }
    // Cleanup function
    return () => {
      if (autocompleteListenerRef.current) {
        autocompleteListenerRef.current.remove();
        autocompleteListenerRef.current = null;
      }
      autocompleteRef.current = null;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue.trim(), location.trim());
  };

  const handleClear = () => {
    setSearchValue("");
    // We might want to keep the location if it's a specific search clear
    // setLocation("");
    // If you want to clear both on search clear:
    // onSearch("", "");
    // Otherwise, only clear the search query:
    onSearch("", location.trim());

    const input = document.getElementById("search-input");
    if (input) {
      (input as HTMLInputElement).focus();
    }
  };

  const handleClearLocation = () => {
    setLocation("");
    onSearch(searchValue.trim(), ""); // Clear location but keep search value
    const input = document.getElementById("location-input");
    if (input) {
      (input as HTMLInputElement).focus();
    }
  };

  // 4. Sync state with props
  useEffect(() => {
    setSearchValue(query);
  }, [query]);
  
  useEffect(() => {
    setLocation(zipcode);
  }, [zipcode]);

  return (
    <>
      <div className="pb-12">
        {" "}
        {/* Adjusted padding for overall section */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          // Centralized, elevated search block styling
          className="w-full  bg-secondary-light rounded-3xl shadow-xl p-2 md:p-3 border border-gray-100" // Added max-width, shadow, border, and padding
        >
          <div className="flex flex-col md:flex-row items-center gap-4 transition-all duration-300">
            {/* Restaurant Search Input */}
            <motion.div
              className={`relative w-full md:w-1/2 transition-all duration-300 ${
                isSearchInputFocused ? "shadow-md" : "" // Subtle shadow on focus
              }`}
            >
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search by Restaurant Name"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setIsSearchInputFocused(true)}
                  onBlur={() => setIsSearchInputFocused(false)}
                  className="w-full py-3.5 pl-12 pr-4 rounded-full border border-gray-300 bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary text-base placeholder:text-gray-500 transition shadow-sm"
                />
                {searchValue && (
                  <motion.button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary transition-colors duration-200"
                    aria-label="Clear search"
                  >
                    <X size={20} /> {/* Slightly larger icon */}
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* Location Input with Autocomplete */}
            <motion.div
              className={`relative w-full md:w-1/2 transition-all duration-300 ${
                isLocationInputFocused ? "shadow-md" : "" // Subtle shadow on focus
              }`}
            >
              <div className="relative">
                <MapPin
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  id="location-input" // Added ID for potential focus control
                  ref={locationInputRef} // Renamed ref
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => setIsLocationInputFocused(true)}
                  onBlur={() => setIsLocationInputFocused(false)}
                  placeholder="Search by Region or Postal Code or Zip Code"
                  className="w-full py-3.5 pl-12 pr-4 rounded-full border border-gray-300 bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary text-base placeholder:text-gray-500 transition shadow-sm"
                  aria-label="Location"
                />
                {location && ( // Show clear button for location too
                  <motion.button
                    type="button"
                    onClick={handleClearLocation}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary transition-colors duration-200"
                    aria-label="Clear location"
                  >
                    <X size={20} /> {/* Slightly larger icon */}
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* Search Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }} // Added hover animation
              className="w-full md:w-auto py-3.5 px-8 bg-primary text-white font-semibold rounded-full shadow-md hover:bg-primary transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-white border-r-transparent" />
              ) : (
                <>
                  <Search size={20} /> {/* Slightly larger icon */}
                  <span>Search</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </>
  );
}
