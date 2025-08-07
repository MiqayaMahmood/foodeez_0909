"use client";

import {
  useState,
  useEffect,
  useCallback,
  useTransition,
  Suspense,
} from "react";
import { searchBusinesses } from "@/services/DiscoverPageService";
import { useRouter, useSearchParams } from "next/navigation";
import SearchLoading from "./components/SearchLoading";
import NoResults from "./components/NoResults";
import BusinessList from "./components/BusinessList";
import Pagination from "./components/Pagination";
import { BusinessDetail } from "@/types/business.types";
// import Filters from "./components/Filters";
// import { Filter } from "lucide-react";
import { motion } from "framer-motion";
import SearchBar from "./components/SearchBar";
import GoogleMapsProvider from "@/components/providers/GoogleMapsProvider";


function SearchYourBusiness() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [businesses, setBusinesses] = useState<BusinessDetail[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  // const [showFilters, setShowFilters] = useState(false);

  // Get search params
  const currentQuery = searchParams.get("q") || "";
  const currentLocation = searchParams.get("location") || "";
  const currentCategory = searchParams.get("category") || "All";
  const currentFoodType = searchParams.get("foodType") || "All";
  const currentRating = searchParams.get("rating")
    ? Number(searchParams.get("rating"))
    : 0;
  const currentPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;
  const currentSort =
    (searchParams.get("sort") as "rating" | "popularity" | "newest") ||
    "popularity";

  // Handle search
  const fetchBusinesses = useCallback(async () => {
    setIsLoading(true);

    try {
      const results = await searchBusinesses({
        searchTerm: currentQuery,
        category: currentCategory,
        foodType: currentFoodType,
        rating: currentRating,
        page: currentPage,
        sortBy: currentSort,
        name: currentQuery,
        zipCode: currentLocation,
      });

      setBusinesses(results.businesses as BusinessDetail[]);
      setTotalResults(results.total);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentQuery,
    currentLocation,
    currentCategory,
    currentFoodType,
    currentRating,
    currentPage,
    currentSort,
  ]);

  // Effect to fetch businesses on search param changes
  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  // Update URL with search params
  const updateSearchParams = (
    params: Record<string, string | number | null>
  ) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    startTransition(() => {
      router.push(`/search-your-business?${newParams.toString()}`);
    });
  };

  // Handle search query change
  const handleSearch = (query: string, location: string) => {
    updateSearchParams({ 
      q: query || null, 
      location: location || null,
      page: 1 
    });
  };

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    const params: Record<string, string | number | null> = { page: 1 };

    switch (filterType) {
      case "category":
        params.category = value === "All" ? null : value;
        break;
      case "foodType":
        params.foodType = value === "All" ? null : value;
        break;
      case "rating":
        params.rating = value === "0" ? null : value;
        break;
      case "sort":
        params.sort = value;
        break;
    }

    updateSearchParams(params);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    updateSearchParams({ page });
  };

  return (
    <div className="min-h-screen bg-background relative py-16">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="main-heading">Find Your Restaurant</h1>
      </motion.div>

      {/* Hero with Search */}
      <GoogleMapsProvider>
        <SearchBar
          query={currentQuery}
          onSearch={handleSearch}
          isLoading={isPending}
        />
      </GoogleMapsProvider>

      <div className="py-8">
        {/* Results Info and Sorting */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-text-main">
              {isLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                <>
                  {totalResults > 0 ? (
                    <span>
                      Found <span className="text-primary">{totalResults}</span>{" "}
                      results
                      {currentQuery && (
                        <>
                          {" "}
                          for "
                          <span className="text-primary">{currentQuery}</span>"
                        </>
                      )}
                    </span>
                  ) : (
                    <span>No results found</span>
                  )}
                </>
              )}
            </h2>
          </div>

          {/* Sort Dropdown */}
          <div className="mt-4 md:mt-0">
            <select
              value={currentSort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-text-main focus:outline-none focus:ring-2 focus:ring-primary/40"
              disabled={isPending}
            >
              <option value="popularity">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg mb-4"
          >
            <Filter />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button> 

          
          <div
            className={`fixed lg:static inset-0 z-50 lg:z-auto transform transition-transform duration-300 ease-in-out ${
              showFilters
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            } lg:w-64 flex-shrink-0  lg:bg-transparent`}
          >
           
            <div
              className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
              onClick={() => setShowFilters(false)}
              style={{ display: showFilters ? "block" : "none" }}
            />

        
            <div className="relative h-full lg:h-auto w-64 p-4 lg:p-0">
              <Filters
                selectedRating={currentRating}
                onChange={handleFilterChange}
                isLoading={isPending}
              />
            </div>
          </div>  */}

          {/* Results */}
          <div className="flex-1">
            {isLoading ? (
              <SearchLoading />
            ) : businesses.length === 0 ? (
              <NoResults query={currentQuery} />
            ) : (
              <>
                <BusinessList businesses={businesses} />

                {/* Pagination */}
                {totalResults > 12 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalResults / 12)}
                    onPageChange={handlePageChange}
                    isLoading={isPending}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap the component with Suspense
export default function SearchYourBusinessPageWithSuspance() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchYourBusiness />
    </Suspense>
  );
}
