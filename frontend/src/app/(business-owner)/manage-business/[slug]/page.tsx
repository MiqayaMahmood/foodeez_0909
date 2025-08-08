"use client";

import { useParams } from "next/navigation";
import { parseSlug } from "@/lib/utils/genSlug";
import BusinessImage from "./components/BusinessImage";
import React, { useState, useEffect } from "react";
import MapCard from "./components/MapSectionBusinesProfile";
import GooglePhotoGallery from "./components/PhotoGallary";
import GoogleReviews from "./components/GoogleReviews";
// import { ActionButtons } from "./components/action-buttons";
import OpeningHours from "./components/OpeningHoursSection";
import BusinessInfoSection from "./components/BusinessInfoSection";
import BusinessProfilePageLoadingSkeleton from "./components/BusinessProfilePageLoadingSkeleton";
import { getBusinessById } from "@/services/BusinessProfilePageService";
import Separator from "@/components/ui/separator";
import { business_detail_view_all } from "@prisma/client";
import { GooglePlaceDetails } from "@/services/GoogleMapsService";

const ManageBusinessDetailPage = () => {
  const [business, setBusiness] = useState<business_detail_view_all | null>(null);
  const [loading, setLoading] = useState(true);
  const [googleBusinessData, setGoogleBusinessData] = useState<GooglePlaceDetails>();

  const slug = useParams();
  const parsedId = parseSlug(slug?.slug as unknown as string);

  useEffect(() => {
    async function fetchBusiness() {
      const data = await getBusinessById(Number(parsedId.id));

      setBusiness(data as business_detail_view_all);
      setLoading(false);
    }

    fetchBusiness();
  }, [parsedId.id]);

  useEffect(() => {
    let isMounted = true;

    if (!business?.BUSINESS_ID) return;

    // Use the new caching API route
    fetch(`/api/business-google-data/${business.BUSINESS_ID}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch Google data');
        }
        return res.json();
      })
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
  }, [business?.BUSINESS_ID]);

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

  return (
    <>
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
            <GoogleReviews reviews={googleBusinessData?.reviews || []} />
          </div>

          <Separator />


          <MapCard placeId={business.PLACE_ID || ''} />

        </div>
      </div>
    </>
  );
};

export default ManageBusinessDetailPage;
