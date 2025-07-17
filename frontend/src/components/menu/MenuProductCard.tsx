"use client";

import Image from "next/image";

interface MenuProductCardProps {
  product: any;
}

export default function MenuProductCard({ product }: MenuProductCardProps) {
  // const isSoldOut = product.STATUS === 0;
  return (
    <div className="bg-background rounded-2xl shadow-md border border-gray-200 flex flex-col h-full">
      <div className="aspect-w-4 aspect-h-3 bg-background-card rounded-t-2xl overflow-hidden">
        {product.PIC ? (
          <Image
            src={product.PIC}
            alt={product.PRODUCT_NAME}
            loading="lazy"
            width={400}
            height={300}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-text-muted">
            No Image
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">

        <h3
          className="font-semibold text-lg lg:text-xl text-primary mb-1 truncate"
          title={product.PRODUCT_NAME}
        >
          {product.PRODUCT_NAME}
        </h3>


        <p className="text-sm lg:text-base text-text-muted mb-2 line-clamp-2">
          {product.PRODUCT_DESCRIPTION}
        </p>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xl font-bold text-secondary">
            CHF {product.PRODUCT_PRICE}
          </span>
          {product.COMPARE_AS_PRICE && product.COMPARE_AS_PRICE > 0 && (
            <span className="text-sm line-through text-text-muted">
              CHF {product.COMPARE_AS_PRICE?.toFixed(2)}
            </span>
          )}
        </div>

        {/* <div className="mt-auto self-end">
          {isSoldOut ? (
            <span className="inline-block bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
              Sold Out
            </span>
          ) : (
            <button className="btn-primary-outline">Add to Cart</button>
          )}
        </div> */}
      </div>
    </div>
  );
}
