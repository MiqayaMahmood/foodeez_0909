'use client';

import Image from 'next/image';

interface BannerComponentProps {
  src: string;
  alt: string;
}

const Banner: React.FC<BannerComponentProps> = ({ src, alt }) => {
  return (
    <div className="px-0 w-full">
      <Image
        src={src}
        alt={alt}
        width={1440}
        height={560}
        className="w-full h-[560px] object-contain md:object-cover"
        priority
      />
    </div>
  );
};

export default Banner;
