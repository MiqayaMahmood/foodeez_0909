"use server"

import prisma from "@/lib/prisma";

const businessOwnerCache = new Map<number, boolean>();

export const checkBusinessOwnerExist = async (userID: number) => {
  try {
    // ✅ Check cache first
    if (businessOwnerCache.has(userID)) {
      return businessOwnerCache.get(userID) as boolean;
    }

    // ❌ Not cached → query DB
    const businessOwner = await prisma.business_owner.findFirst({
      where: { VISITORS_ACCOUNT_ID: Number(userID) },
    });

    const exists = !!businessOwner;

    // ✅ Save to cache
    businessOwnerCache.set(userID, exists);
    return exists;
  } catch (error) {
    console.error("Error fetching business owner:", error);
    return false;
  } 
};
