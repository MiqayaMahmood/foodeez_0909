"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReviewCard from "./ReviewCard";
import { useSession } from "next-auth/react";
import { foodeez_review_view } from "@prisma/client";

interface ReviewsGridProps {
  reviews: foodeez_review_view[];
  isLoading?: boolean;
  onEdit?: (review: foodeez_review_view) => void;
  onDelete?: (id: string) => void;
  showUserReviews?: boolean;
}

const ReviewsGrid: React.FC<ReviewsGridProps> = ({
  reviews,
  isLoading = false,
  onEdit,
  onDelete,
  showUserReviews = false,
}) => {
  const { data: session } = useSession();

  const isOwner = (review: foodeez_review_view) => {
    return session?.user?.email === review.REVIEWER_EMAIL;
  };

  if (isLoading) {
    return (
      <div className="flex gap-6 overflow-x-auto pb-4" id="no-scrollbar">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="h-[340px] w-80 bg-gray-200 rounded-2xl animate-pulse flex-shrink-0"
          />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {showUserReviews ? "No Reviews Yet" : "No Reviews Available"}
          </h3>
          <p className="text-gray-600">
            {showUserReviews
              ? "You haven't submitted any reviews yet. Share your experience with Foodeez!"
              : "Be the first to share your experience with Foodeez!"}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative">
      {/* Horizontal Scrollable Container */}
      <div
        className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide"
        id="no-scrollbar"
      >
        <AnimatePresence>
          {reviews.map((review, index) => (
            <motion.div
              key={review.FOODEEZ_REVIEW_ID.toString()}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              className="w-80 flex-shrink-0"
            >
              <ReviewCard
                review={review}
                isOwner={isOwner(review)}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReviewsGrid;
