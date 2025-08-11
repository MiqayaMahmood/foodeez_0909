"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { extractBusinessId } from "@/lib/utils/genSlug";
import {
  getBusinessMenuOnly,
  getBusinessMenuWithProducts,
} from "@/services/MenuPageService";
import {
  business_food_menu_card_view,
  business_food_menu_card_detail_view,
} from "@prisma/client";
import MenuHeroSection from "@/components/menu/MenuHeroSection";
import MenuCategorySection from "@/components/menu/MenuCategorySection";
import MenuSwitchSkeleton from "@/components/menu/MenuSwitchSkeleton";
import MenuLoadingSkeleton from "@/components/menu/MenuLoadingSkeleton";


export default function MenuPage() {
  const params = useParams();
  const slug = params.slug as string;
  const businessId = extractBusinessId(slug);

  const [business, setBusiness] = useState<business_food_menu_card_view | null>(
    null
  );
  const [menuData, setMenuData] = useState<
    business_food_menu_card_detail_view[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
  const [switchingMenu, setSwitchingMenu] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [menuCards, products] = await Promise.all([
        getBusinessMenuOnly(businessId),
        getBusinessMenuWithProducts(businessId),
      ]);
      setBusiness(menuCards.length > 0 ? menuCards[0] : null);
      setMenuData(products);
      if (products.length > 0)
        setSelectedMenuId(products[0].BUSINESS_FOOD_MENU_CARD_ID);
      setLoading(false);
    }
    if (businessId) fetchData();
  }, [businessId]);

  // Group by menu card
  const menuCardsMap = useMemo(() => {
    const map = new Map<number, business_food_menu_card_detail_view[]>();
    menuData.forEach((item) => {
      if (!map.has(item.BUSINESS_FOOD_MENU_CARD_ID)) {
        map.set(item.BUSINESS_FOOD_MENU_CARD_ID, []);
      }
      map.get(item.BUSINESS_FOOD_MENU_CARD_ID)!.push(item);
    });
    return map;
  }, [menuData]);

  // List of menu cards (for buttons, etc.)
  const menuCardList = useMemo(() => {
    return Array.from(menuCardsMap.values()).map((items) => items[0]);
  }, [menuCardsMap]);

  // Get selected menu's products
  const selectedMenuProducts = useMemo(() => {
    return selectedMenuId ? menuCardsMap.get(selectedMenuId) || [] : [];
  }, [selectedMenuId, menuCardsMap]);

  // Group selected menu's products by category
  const menuByCategory: Record<string, business_food_menu_card_detail_view[]> =
    useMemo(() => {
      return (selectedMenuProducts ?? []).reduce(
        (acc, item) => {
          const cat = item.CATEGORY || "Other";
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(item);
          return acc;
        },
        {} as Record<string, business_food_menu_card_detail_view[]>
      );
    }, [selectedMenuProducts]);

  if (loading) return <MenuLoadingSkeleton />;
  if (!business)
    return (
      <div className="text-center py-12 text-lg text-text-muted">
        <h2 className="text-2xl font-bold mb-2">No Menu Available</h2>
        <p>
          This restaurant has not published a menu yet. Please check back later!
        </p>
      </div>
    );

  return (
    <>
      <div className="px-4 lg:px-0">
        <MenuHeroSection
          business={business}
          Menu={menuCardList}
          setSelectedMenuId={(id) => {
            setSwitchingMenu(true);
            setTimeout(() => {
              setSelectedMenuId(id);
              setSwitchingMenu(false);
            }, 100); // 400ms for visible effect
          }}
          selectedMenuId={selectedMenuId}
        />
        {menuCardList.length === 0 ? (
          <div className="text-center py-20 text-white/90 bg-primary/10">
            <div className="text-5xl mb-4">🍽️</div>
            <h2 className="sub-heading text-center mb-2">
              No Menus Yet
            </h2>
            <p className="sub-heading-description text-text-main">
              This restaurant hasn't added any menus yet. Please check back soon
              for delicious updates!
            </p>
          </div>
        ) : switchingMenu ? (
          <MenuSwitchSkeleton />
        ) : (
          Object.entries(menuByCategory).map(
            ([category, products], idx, arr) => (
              <div key={category}>
                <MenuCategorySection category={category} products={products} />
                {idx < arr.length - 1 && (
                  <hr
                    className="my-12 border-t-2 border-background-muted"
                    aria-hidden="true"
                  />
                )}
              </div>
            )
          )
        )}
      </div>
    </>
  );
}
