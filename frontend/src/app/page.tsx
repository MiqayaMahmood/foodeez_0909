"use client";

import BusinessCTA from "@/components/home/CTAs/BusinessCTA";
// import CtaSection from "@/components/home/CTAs/CtaSection";
import FaqSection from "@/components/home/FaqSection";
import HeroSection from "@/components/home/HeroSection";
import FeaturedBusiness from "@/components/home/FeaturedBusiness";
// import QuickSearch from "@/components/home/QuickSearch";
// import ScrollingBusinessBar from "@/components/home/ScrollingBusinessBar";
import MapSection from "@/components/home/MapSection";
import GoogleMapsProvider from "@/components/providers/GoogleMapsProvider";
import AdsBar1 from "@/components/home/AdsBar1";
import AdsBar2 from "@/components/home/AdsBar2";
// import BenefitsSection from "@/components/home/BenefitsSection";
// import AboutSection from "@/components/home/AboutSection";
import TestimonialsSection from "@/components/home/FoodeezTestimonials/TestimonialsSection";
import Separator from "@/components/ui/separator";
import CommunitySection from "@/components/home/CommunitySection";
import UpcomingEvents from "@/components/home/EventSection/UpcomingEvents";
import FoodJourney from "@/components/home/CTAs/FoodJourney";

export default function Home() {
  return (
    <div className="">
      {/* Hero Section with Search */}
      <AdsBar1 />

      <HeroSection />

      <AdsBar2 />
      <Separator />
      {/* Scrolling Business Bar */}

      {/* <ScrollingBusinessBar /> */}

      {/* Featured Business Grid */}
      <FeaturedBusiness />

      <Separator />

      {/* Business CTA */}
      <BusinessCTA />

      <Separator />

      {/* Cities Section */}
      {/* <CitySection/> */}

      {/* About Section - We Are Foodeez */}
      {/* <AboutSection /> */}

      {/* Food Journey CTA */}
      <FoodJourney />

      <Separator />

      {/* Testimonials from Google Reviews */}
      <TestimonialsSection />
      <Separator />

      {/* <QuickSearch /> */}

      {/* Benefits Section */}
      {/* <BenefitsSection />/ */}


      {/* Main CTA Section */}
      <UpcomingEvents />

      <Separator />
      {/* Community Section */}
      <CommunitySection />
      <Separator />
      {/* FAQ Section */}
      <FaqSection />

      {/* Map  Section */}
      <GoogleMapsProvider>
        <MapSection />
      </GoogleMapsProvider>

    </div>
  );
}

/*


Proper Started 5 April

From 5 - 28 April No record

28 April 3 hours

29 April 1.5 hour

30 April 3.5 hour

1 May 3 hours

2 May 1 hour

3 May 2.5 hour

4 May 2 hour

5 May No work

6 May 4 hours

9 - 25 May No Work

26 May 5.5 Hours 

27 May 6.5 + hours

28 May 3.5 hours

29 May No Work

30 May 3.5 hours

31 May 3+ hours

1 June 1.5 + hour

2 june 4 +  Hours

3 june 2.5 + hours

4 june 1.5 hours

5 june 2 hours

6 june 1 hour 

7 , 8 ,9 Eid ul adha 

10 june 2 hours 40 mins

11 june 2 hours 30 mins

12 june 3 hours 50 mins

13 june 2 hours 30 mins

14 june till 12 july record in google sheets

Form now all record will be saved in google sheets

*/
