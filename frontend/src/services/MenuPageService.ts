"use server";

import { prisma } from "@/lib/prisma";
import { business_food_menu_card_view, business_food_menu_card_detail_view } from "@prisma/client";

export async function getBusinessMenuOnly(BUSINESS_ID: number) {
  try {
    const menuCards = await prisma.business_food_menu_card_view.findMany({
      where: {
        BUSINESS_ID: BUSINESS_ID
      },
      orderBy: {
        MENU_NAME: "asc"
      }
    });
    
    // Convert Decimal objects to numbers (only for fields that exist in this view)
    const convertedMenuCards = menuCards.map(card => ({
      ...card,
      // Add any Decimal fields that exist in business_food_menu_card_view
      // Currently this view doesn't seem to have Decimal fields
    }));
    
    return convertedMenuCards as business_food_menu_card_view[];
  } catch (error) {
    console.error('Error fetching menu cards:', error);
    return [];
  }
}

export async function getBusinessMenuWithProducts(businessId: number) {
  try {
    const allMenuProducts = await prisma.business_food_menu_card_detail_view.findMany({
      where: { BUSINESS_ID: businessId },
      orderBy: [
        { BUSINESS_FOOD_MENU_CARD_ID: "asc" },
        { BUSINESS_PRODUCT_CATEGORY_ID: 'asc' }
      ]
    });
    
    // Convert Decimal objects to numbers
    const convertedProducts = allMenuProducts.map(product => ({
      ...product,
      COMPARE_AS_PRICE: product?.COMPARE_AS_PRICE?.toNumber(),
      PRODUCT_PRICE: product?.PRODUCT_PRICE?.toNumber(),
    }));
    
    return convertedProducts as unknown as business_food_menu_card_detail_view[];
  } catch (error) {
    console.error('Error fetching business menu with products:', error);
    return [];
  }
}