"use client";

import { useParams } from "next/navigation";
import { parseSlug } from "@/lib/utils/genSlug";
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
// import { ActionButtons } from "./components/action-buttons";
import OpeningHours from "./components/OpeningHoursSection";
import BusinessInfoSection from "./components/BusinessInfoSection";
import BusinessProfilePageLoadingSkeleton from "./components/BusinessProfilePageLoadingSkeleton";
import { BusinessDetail } from "@/types/business.types";
import { getBusinessById } from "@/services/BusinessProfilePageService";
import Separator from "@/components/ui/separator";
import GoogleMapsProvider from "@/components/providers/GoogleMapsProvider";

const ManageBusinessDetailPage = () => {
  const [business, setBusiness] = useState<BusinessDetail | null>(null);
  const [placeId, setPlaceId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [googleBusinessData, setGoogleBusinessData] =
    useState<GooglePlaceDetails>();

  const slug = useParams();
  const parsedId = parseSlug(slug?.slug as unknown as string);

  const id = parsedId.id;

  useEffect(() => {
    async function fetchBusiness() {
      const data = await getBusinessById(Number(id));

      const mapped = data
        ? Object.fromEntries(
            Object.entries(data).map(([k, v]) => [
              k,
              v === null ? undefined : v,
            ])
          )
        : null;

      if (mapped && mapped.BUSINESS_ID) {
        setBusiness(mapped as unknown as BusinessDetail);

        // ✅ Extract place ID from Google profile
        const placeId = extractPlaceIdFromUrl(
          String(mapped.GOOGLE_PROFILE || "")
        );
        setPlaceId(placeId);
      } else {
        setBusiness(null);
      }

      setLoading(false);
    }

    fetchBusiness();
  }, [id]);

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
  }, [placeId]); // 👈 runs once placeId is set

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

  // Meta data
  const title = business.BUSINESS_NAME
    ? `${business.BUSINESS_NAME} | Foodeez`
    : "Business | Foodeez";
  const description =
    business.DESCRIPTION || "Discover this business on Foodeez.";
  const image = business.IMAGE_URL || "/default-business.jpg";
  const url = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:type" content="business.business" />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <link rel="canonical" href={url} />
      </head>

      <div className="py-4">
        {/* Header with Restaurant Name and City */}

        <div className="">
          <h1 className="sub-heading">
            {business.BUSINESS_NAME}
            {business.CITY_NAME && (
              <>
                {" "}
                • <span className="text-secondary">{business.CITY_NAME}</span>
              </>
            )}
          </h1>
        </div>

        {/* Main Content */}
        <div className="">
          {/* Restaurant Profile Picture */}

          <BusinessImage
            imageUrl={business.IMAGE_URL || ""}
            businessName={business.BUSINESS_NAME || ""}
            className="mb-6"
          />

          {/* Info Section */}
          <BusinessInfoSection business={business} />

          <GooglePhotoGallery
            photos={googleBusinessData?.photos || []}
            businessName={googleBusinessData?.name || business.BUSINESS_NAME}
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
            <GoogleReviews reviews={googleBusinessData?.reviews || []} />
          </div>

          <Separator />

          {/* Google Map */}
          <GoogleMapsProvider>
            <MapCard placeId={placeId} />
          </GoogleMapsProvider>
        </div>
      </div>
    </>
  );
};

export default ManageBusinessDetailPage;
