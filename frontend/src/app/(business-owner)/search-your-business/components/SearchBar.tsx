"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface SearchBarProps {
  query: string;
  onSearch: (query: string, location: string) => void;
  isLoading: boolean;
}

export default function SearchBar({
  query,
  onSearch,
  isLoading,
}: SearchBarProps) {
  const [searchValue, setSearchValue] = useState(query);
  const [location, setLocation] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (typeof window !== "undefined" && inputRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ["(regions)"],
        componentRestrictions: { country: "ch" }, // Restrict to Switzerland
        fields: ["address_components", "formatted_address"],
      });

      // Add listener for place selection
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.address_components) {
          // Find postal code from address components
          const postalCodeComponent = place.address_components.find(
            (component) => component.types.includes("postal_code")
          );
          if (postalCodeComponent) {
            setLocation(postalCodeComponent.long_name);
          }
        }
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue.trim(), location.trim());
  };

  const handleClear = () => {
    setSearchValue("");
    setLocation("");
    onSearch("", "");

    const input = document.getElementById("search-input");
    if (input) {
      (input as HTMLInputElement).focus();
    }
  };

  return (
    <>
      <div className="py-16">
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto px-4 w-full"
        >
          <div
            className={`flex flex-col md:flex-row items-center gap-4 p-4 rounded-full bg-primary/20 shadow-xl transition-all duration-300 ${
              isFocused ? "ring-4 ring-orange-200" : ""
            }`}
          >
            {/* Restaurant Search Input */}
            <div className="relative w-full md:w-1/2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search Your Restaurant"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full py-3.5 pl-12 pr-4 rounded-full border border-gray-300 bg-white focus:border-orange-500 focus:outline-none text-base placeholder:text-gray-400 transition shadow-sm"
                />
                {searchValue && (
                  <motion.button
                    type="button"
                    onClick={handleClear}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-600"
                    aria-label="Clear search"
                  >
                    <X size={18} />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Location Input with Autocomplete */}
            <div className="relative w-full md:w-1/2">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your location"
                  className="w-full py-3.5 pl-12 pr-4 rounded-full border border-gray-300 bg-white focus:border-orange-500 focus:outline-none text-base placeholder:text-gray-400 transition shadow-sm"
                  aria-label="Location"
                />
              </div>
            </div>

            {/* Search Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.97 }}
              className="w-full md:w-auto py-3.5 px-8 bg-orange-500 text-white font-semibold rounded-full shadow-md hover:bg-orange-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-white border-r-transparent" />
              ) : (
                <>
                  <Search size={18} />
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
