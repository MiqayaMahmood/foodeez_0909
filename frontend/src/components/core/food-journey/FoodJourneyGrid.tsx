import React from "react";
import FoodJourneyCard from "./FoodJourneyCard";

interface FoodJourneyGridProps {
  stories: any[];
  currentUserId?: string;
  onDelete?: (id: number) => Promise<void>;
  onEdit?: (story: any) => void;
}

const FoodJourneyGrid: React.FC<FoodJourneyGridProps> = ({ stories, currentUserId, onDelete, onEdit }) => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {stories.map((j) => (
          <FoodJourneyCard key={j.VISITOR_FOOD_JOURNEY_ID} journey={j} currentUserId={currentUserId} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
};

export default FoodJourneyGrid;
