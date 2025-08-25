// components/OpeningHours.tsx
import Separator from "@/components/ui/separator";
import { OpeningHourDay } from "@/types/google-business";
import { format } from "date-fns";
import { Clock } from "lucide-react";

type OpeningHoursProps = {
  openingHours: OpeningHourDay[];
  isOpenNow: boolean;
};

const OpeningHours: React.FC<OpeningHoursProps> = ({
  openingHours,
  isOpenNow,
}) => {

  if (!openingHours || openingHours.length === 0) return null;

  const currentDay = format(new Date(), "EEEE"); // Get current day as full name

  return (
    <>
    <Separator />
    <div className="py-8 px-4 lg:px-0">
      <div className="">
        {/* Title Section */}
        <div className="flex items-center justify-between mb-4">
          {/* Left section: Heading + Icon */}
          <div className="flex items-center sub-heading">
            <h2 className="">Opening Hours</h2>
            <Clock className="ml-2" size={48} />
          </div>

          {/* Right section: Open/Closed badge */}
          <span
            className={`px-4 py-1 rounded-full text-base font-medium text-text-main ${
              isOpenNow ? "bg-highlight" : "bg-highlight-light "
            }`}
          >
            {isOpenNow ? "Now Open" : "Now Closed"}
          </span>
        </div>

        {/* Opening Hours List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {openingHours?.map((item, index) => (
            <div
              key={index}
              className={`flex justify-between items-center p-3 rounded-lg border ${
                item.day === currentDay
                  ? "bg-secondary/5 border-primary"
                  : "border-gray-200"
              }`}
            >
              <span
                className={`font-medium ${
                  item.day === currentDay ? "text-primary" : "text-gray-700"
                }`}
              >
                {item.day}
              </span>
              <div className="flex flex-wrap gap-1 items-end">
                {item.hours.split(",").map((period, i) => (
                  <span
                    key={i}
                    className=" text-gray-700 px-2 py-0.5 rounded text-base"
                  >
                    {period.trim()}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default OpeningHours;
