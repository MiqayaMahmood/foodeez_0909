import Banner from "@/components/core/Banner";
import Link from "next/link";
import React from "react";

const ShareExperience = () => {
  return (
    <section className="w-full text-center py-10">
      {/* Heading Section */}
      <div className="px-4 lg:px-0 mb-12 space-y-6">
        <h2 className="text-xl sm:text-2xl text-text-muted font-medium">
          Are you a Restaurant Owner, Takeaway Service, Caterer, Event
          Organizer, or Party Hall Manager?
        </h2>
        <h3 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-dark leading-tight">
          Foodeez is your gateway to the right audience!
        </h3>
      </div>


        <Banner
          desktopSrc="/images/banners/register.png"
          mobileSrc="/images/bannerForMobile/register.png"
          alt="Register your business"
        />
     

      {/* Description Text */}
      <div className=" px-4 lg:px-0 max-w-5xl mx-auto mt-12 mb-16">
        <p className="text-lg sm:text-xl lg:text-2xl text-text-muted leading-relaxed">
          Join Switzerland's fast-growing food and event discovery platform –
          <span className="font-semibold text-primary-dark">
            {" "}
            built to connect with your business's broad audience
          </span>
          .
        </p>
      </div>

      {/* CTA Button */}
      <div>
        <Link href="/business/register" passHref target="_blank">
          <button className="px-8 py-3 sm:px-10 sm:py-4 text-lg font-semibold rounded-full bg-primary text-white hover:bg-primary-dark shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Register Now
          </button>
        </Link>
      </div>
    </section>
  );
};

export default ShareExperience;
