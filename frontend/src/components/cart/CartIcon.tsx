"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/stores/cartStore";

export default function CartIcon() {
  const { totalItems } = useCartStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Render a placeholder on the server to avoid hydration mismatch
    return (
      <div className="relative p-2">
        <ShoppingCart className="h-6 w-6 text-gray-500" />
      </div>
    );
  }

  return (
    <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
      <ShoppingCart className="h-6 w-6 text-gray-700" />
      {totalItems > 0 && (
        <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
