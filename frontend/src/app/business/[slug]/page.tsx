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
import { BusinessDetail } from "@/types/business.types";
import ResturantProfilePageHeader from "./components/ResturantProfilePageHeader";
import FoodeezReviews from "./components/FoodeezReviews";
import {
  getBusinessById,
  getBusinessReviewsForUser,
} from "@/services/BusinessProfilePageService";
import { visitor_business_review_view } from "@prisma/client";
import Separator from "@/components/ui/separator";
import { useSession } from "next-auth/react";

const BusinessDetailPage = () => {
  const { data: session } = useSession();

  const [business, setBusiness] = useState<BusinessDetail | null>(null);
  const [placeId, setPlaceId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [googleBusinessData, setGoogleBusinessData] =
    useState<GooglePlaceDetails>();
  const [reviews, setReviews] = useState<visitor_business_review_view[]>([]);

  const slug = useParams();
  const parsedId = parseSlug(slug?.slug as unknown as string);

  const id = parsedId.id;

  const genSlug = generateSlug(
    business?.BUSINESS_NAME || "business",
    business?.BUSINESS_ID || 0
  );

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

        let userId: number | undefined = undefined;
        if (session?.user?.id) {
          userId = Number(session.user.id);
        }
        const businessReviews = await getBusinessReviewsForUser(
          Number(mapped.BUSINESS_ID),
          userId
        );
        setReviews(businessReviews);
      } else {
        setBusiness(null);
        setReviews([]);
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
            <FoodeezReviews reviews={reviews} genSlug={genSlug} business={business} />
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
