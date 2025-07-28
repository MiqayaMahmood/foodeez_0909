import Image from "next/image";
import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

const bannerData = {
  banners: [
    {
      id: 1,
      src: "/images/banners/banner1.jpeg",
      alt: "Foodeez Banner 1",
      width: 1440,
      height: 560,
    },
    {
      id: 2,
      src: "/images/banners/banner2.jpeg",
      alt: "Foodeez Banner 2",
      width: 1440,
      height: 560,
    },
    {
      id: 3,
      src: "/images/banners/banner3.jpeg",
      alt: "Foodeez Banner 3",
      width: 1440,
      height: 560,
    },
  ],
};

const HeroSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {bannerData.banners.map((banner) => (
            <div
              key={banner.id}
              className="embla__slide flex-[0_0_100%] min-w-0"
            >
              <div className="relative w-full h-[560px]">
                <Image
                  src={banner.src}
                  alt={banner.alt}
                  fill
                  className="object-contain lg:object-cover"
                  priority
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary p-2 rounded-full shadow-lg"
        onClick={scrollPrev}
      >
        <ChevronLeft />
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary  p-2 rounded-full shadow-lg"
        onClick={scrollNext}
      >
        <ChevronRight />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {bannerData.banners.map((_, index) => (
          <button
            key={index}
            className="w-2 h-2 rounded-full bg-white/80 hover:bg-white transition-colors"
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
