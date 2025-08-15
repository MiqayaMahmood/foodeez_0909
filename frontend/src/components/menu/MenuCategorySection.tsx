"use client";
import { MenuProduct } from "@/types/product";
import MenuProductCardGrid from "./MenuProductCardGrid";

export default function MenuCategorySection({ category, products, businessZipCode }: { category: string; products: MenuProduct[]; businessZipCode?: string }) {
  return (
    <section className="mb-12">
      <h2 className="sub-heading text-center my-10">{category}</h2>
      <MenuProductCardGrid products={products} businessZipCode={businessZipCode} />
    </section>
  );
} 