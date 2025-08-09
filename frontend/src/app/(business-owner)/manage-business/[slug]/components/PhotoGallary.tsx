import { motion } from "framer-motion";
import Image from "next/image";
import { GooglePhoto } from "@/types/google-business";
import { Camera } from "lucide-react";

interface GooglePhotoGalleryProps {
  photos: GooglePhoto[];
  businessName?: string;
}

export default function GooglePhotoGallery({
  photos,
  businessName,
}: GooglePhotoGalleryProps) {
  if (!photos || photos.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
        <p className="text-lg">😕 No photos available</p>
        <p className="text-sm mt-2 text-gray-400">
          We're working on adding images for {businessName || "this place"}.
        </p>
      </div>
    );
  }

  return (
    <div className="py-8 ">
      <div className="flex items-center sub-heading !mb-10">
        <h2 className="flex items-center">
          Photo Gallery{" "}
          {businessName && (
            <>
              of&nbsp;<span className="text-secondary">{businessName}</span>
            </>
          )}
        </h2>
        <Camera className="ml-2" size={48} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <motion.div
            key={index}
            className="overflow-hidden rounded-xl shadow-md bg-white"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={photo.photoUrl}
              alt={`${businessName || "Business"} photo ${index + 1}`}
              width={photo.width}
              height={photo.height}
              className="object-cover w-full h-40 md:h-48 rounded-xl"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
