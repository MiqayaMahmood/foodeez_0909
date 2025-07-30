"use client"

import { AnimatePresence , motion} from "framer-motion";
import BusinessCard from "../../core/BusinessCard";
import { BusinessDetail } from "@/types/business.types";

export default function BusinessGrid({ businesses, isPending, error }: { businesses: BusinessDetail[]; isPending: boolean; error: string | null }) {
    return (
      <AnimatePresence mode="wait">
        {!isPending && !error && businesses.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-12"
          >
            {businesses.map((business, index) => (
              <motion.div
                key={business.BUSINESS_ID || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className=""
              >
                <BusinessCard business={business} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }