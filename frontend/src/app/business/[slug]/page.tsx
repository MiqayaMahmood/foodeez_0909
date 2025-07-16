"use client";

import { useParams } from "next/navigation";
import { generateSlug, parseSlug } from "@/lib/utils/genSlug";
import BusinessImage from "./components/BusinessImage";
import React, { useState, useEffect } from "react";
import MapCard from "./components/MapSectionBusinesProfile";
import GooglePhotoGallery from "./components/PhotoGallary";
import {
  fetchGooglePlaceDetails,
  GooglePlaceDetails,
} from "./components/fetchGooglePlaceDetails";
import { extractPlaceIdFromUrl } from "@/lib/utils/google";
import GoogleReviews from "./components/GoogleReviews";
import OpeningHours from "./components/OpeningHoursSection";
import BusinessInfoSection from "./components/BusinessInfoSection";
import BusinessProfilePageLoadingSkeleton from "./components/BusinessProfilePageLoadingSkeleton";
import ResturantProfilePageHeader from "./components/ResturantProfilePageHeader";
import FoodeezReviews from "./components/FoodeezReviews";
import {
  getBusinessById,
} from "@/services/BusinessProfilePageService";
import { business_detail_view_all } from "@prisma/client";
import Separator from "@/components/ui/separator";

const BusinessDetailPage = () => {
  const slug = useParams();
  const parsedId = parseSlug(slug?.slug as unknown as string);

  const [business, setBusiness] = useState<business_detail_view_all | null>(null);
  const [placeId, setPlaceId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [googleBusinessData, setGoogleBusinessData] = useState<GooglePlaceDetails>();

  const genSlug = generateSlug(
    business?.BUSINESS_NAME || "business",
    business?.BUSINESS_ID || 0
  );

  useEffect(() => {
    async function fetchBusiness() {
      const data = await getBusinessById(Number(parsedId.id));

      setBusiness(data as business_detail_view_all);

      // ✅ Extract place ID from Google profile
      const placeId = extractPlaceIdFromUrl(String(data?.GOOGLE_PROFILE || ""));
      setPlaceId(placeId);

      setLoading(false); // ✅ Only set loading to false after data is fetched
    }

    fetchBusiness();
  }, [parsedId.id]);

  useEffect(() => {
    let isMounted = true;

    if (!placeId) return;

    fetchGooglePlaceDetails(placeId)
      .then((data) => {
        if (isMounted) {
          setGoogleBusinessData(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching Google place details:", error);
      });

    return () => {
      isMounted = false;
    };
  }, [placeId]);
  if (loading) {
    return <BusinessProfilePageLoadingSkeleton />;
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-500">
        Business not found
      </div>
    );
  }

  // // Meta data
  // const title = business.BUSINESS_NAME
  //   ? `${business.BUSINESS_NAME} | Foodeez`
  //   : "Business | Foodeez";
  // const description =
  //   business.DESCRIPTION || "Discover this business on Foodeez.";
  // const image = business.IMAGE_URL || "/default-business.jpg";
  // const url = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      <div className="">
        <ResturantProfilePageHeader
          BUSINESS_NAME={business.BUSINESS_NAME || ""}
          CITY_NAME={business.CITY_NAME || ""}
          HALAL={business.HALAL}
          VEGAN={business.VEGAN}
          VEGETARIAN={business.VEGETARIAN}
        />

        {/* Main Content */}
        <div className="">
          {/* Restaurant Profile Picture */}
          <BusinessImage
            imageUrl={business.IMAGE_URL || ""}
            businessName={business.BUSINESS_NAME || ""}
            className="mb-6"
          />

          {/* Info Section */}
          <BusinessInfoSection business={business} genSlug={genSlug} />

          <Separator />

          <GooglePhotoGallery
            photos={googleBusinessData?.photos || []}
            businessName={googleBusinessData?.name || business.BUSINESS_NAME || ''}
          />

          {/* Opening Hours */}
          <OpeningHours
            openingHours={googleBusinessData?.openingHours || []}
            isOpenNow={googleBusinessData?.isOpenNow || false}
          />

          {/* Action Buttons */}
          {/* <ActionButtons
            onFavorite={() => {
              console.log("Favorite status:");
            }}
            onShare={() => {
              console.log("Share button clicked");
            }}
            onReview={() => {
              console.log("Review button clicked");
            }}
          /> */}

          <Separator />


          {/* Reviews */}

          <div className="">
            <FoodeezReviews genSlug={genSlug} business={business} />
          </div>
          <div className="">
            <GoogleReviews
              reviews={googleBusinessData?.reviews || []}
              GOOGLE_PROFILE={business.GOOGLE_PROFILE || ""}
            />
          </div>

          <Separator />

          {/* Google Map */}
          <MapCard placeId={placeId} />
        </div>
      </div>
    </>
  );
};

export default BusinessDetailPage;
