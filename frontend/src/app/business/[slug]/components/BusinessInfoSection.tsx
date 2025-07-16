import { SocialLinks } from "@/components/core/SocialLinks";
import { MapPin, Phone, Globe } from "lucide-react";
import Link from "next/link";
import FoodTypeBadges from "@/components/core/FoodTypeBadges";
import { business_detail_view_all } from "@prisma/client";

const BusinessInfoSection: React.FC<{ business: business_detail_view_all, genSlug: string }> = ({
  business,
  genSlug,
}) => {

  return (
    <div className="py-8 px-4 lg:px-0 space-y-8 lg:space-y-4">
      {/* Description Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="sub-heading">Description</h2>

        <FoodTypeBadges
          HALAL={business.HALAL || 0}
          VEGAN={business.VEGAN || 0}
          VEGETARIAN={business.VEGETARIAN || 0}
        />
      </div>

      <p className="sub-heading-description mt-3 text-start text-text-main max-w-none">
        {business.DESCRIPTION}
      </p>

      {/* Address & Contact */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <MapPin className="text-primary mt-1 h-5 w-5" />
          <div className="space-y-1">
            <p className="font-medium text-gray-900">
              {business.ADDRESS_STREET}
            </p>
            <p className="text-gray-600">
              {/* {business.ADDRESS_TOWN && `${business.ADDRESS_TOWN}, `} */}
              {business.CITY_NAME && `${business.CITY_NAME}, `}
              {business.ADDRESS_ZIP && `${business.ADDRESS_ZIP}, `}
              {business.ADDRESS_COUNTRY}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Phone className="text-primary mt-1 h-5 w-5" />
          <div className="space-y-1">
            <p className="font-medium text-gray-900">{business.PHONE_NUMBER}</p>
            {business.WEB_ADDRESS && (
              <a
                href={business.WEB_ADDRESS}
                className="text-primary flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                {new URL(business.WEB_ADDRESS).hostname}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Social & Reserve */}
      <div className="flex flex-col md:flex-row gap-10 justify-between border-t pt-8">
        <div className="flex items-center gap-2">
          {business.EMAIL_ADDRESS ? (
            <Link href={`/business/${genSlug}/reservation`} target="_blank">
              <button className="btn-primary">Reserve Table</button>
            </Link>
          ) : (
            <button
              className="btn-primary opacity-50 cursor-not-allowed"
              disabled
            >
              Reserve Table
            </button>
          )}
          {business.HAVING_ACTIVE_MENU_CARD ? (
            <Link href={`/business/${genSlug}/menu`} target="_blank">
              <button className="btn-primary">See Menu</button>
            </Link>
          ) : (
            <button
              className="btn-primary opacity-50 cursor-not-allowed"
              disabled
            >
              See Menu
            </button>
          )}
        </div>

        <SocialLinks
          facebook={business.FACEBOOK_LINK}
          instagram={business.INSTA_LINK}
          whatsapp={business.WHATSAPP_NUMBER}
          size="xl"
          className="gap-2 [&>a]:text-primary"
        />
      </div>
    </div>
  );
};

export default BusinessInfoSection;
