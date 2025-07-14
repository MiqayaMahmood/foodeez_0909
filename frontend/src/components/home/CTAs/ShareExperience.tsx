import Banner from "@/components/core/Banner";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getFoodJourney } from "@/services/HomePageService";
import FoodJourneyCard from "../../core/food-journey/FoodJourneyCard";
import { visitor_food_journey_view } from "@prisma/client";

const ShareExperience = () => {
  const [journeys, setJourneys] = useState<visitor_food_journey_view[]>([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    async function fetchJourneys() {
      const data = await getFoodJourney();
      setHasMore(data.length > 6);
      setJourneys(data); // Fetch only the first 6 journeys
    }
    fetchJourneys();
  }, []);

  return (
    <section className="w-full">
      <h2 className="sub-heading my-10 text-center">
        Be a food Explorer - Earn <b>POINTS & BADGES</b>
      </h2>

      <Banner
        src="/images/banners/CTAs/shareExperiance.png"
        alt="Share Your Experience"
      />

      {/* Top Food Journey Stories */}
      <div className="px-4 lg:px-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-6">
        {journeys.slice(0, 6).map((j) => (
          <FoodJourneyCard key={j.VISITOR_FOOD_JOURNEY_ID} journey={j} />
        ))}
      </div>
      {/* CTA Button Below Banner */}
      <div className="px-4 lg:px-0 text-center">
        <div className="my-12 inline-flex items-center justify-center gap-4" >
          {hasMore && (
            <Link href="/food-journey" passHref target="_blank">
              <button className="btn-primary">
                See More Food Journey Stories
              </button>
            </Link>
          )}

          <Link href="/food-journey#shareFoodJourneyStory" passHref target="_blank">
            <button className="btn-secondary">
              Share Your Food Journey Experience
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShareExperience;
