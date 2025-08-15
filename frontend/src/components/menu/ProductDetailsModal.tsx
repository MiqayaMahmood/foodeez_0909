"use client";

import Image from "next/image";
import { MenuProduct } from "@/types/product";
import ModalPortal from "../core/ModalPortal";
import Button from "../core/Button";
import { X } from "lucide-react";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: MenuProduct;
  onAddToCart?: () => void;
  isInCart?: boolean;
}

export default function ProductDetailsModal({
  isOpen,
  onClose,
  product,
  onAddToCart,
  isInCart = false
}: ProductDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div 
          className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 z-10 bg-white/80 rounded-full p-1.5 hover:bg-white transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            
            <div className="grid md:grid-cols-2 gap-8 p-6">
              {/* Product Image */}
              <div className="relative h-80 md:h-[400px] bg-gray-50 rounded-lg overflow-hidden">
                {product.PIC ? (
                  <Image
                    src={product.PIC}
                    alt={product.PRODUCT_NAME}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    No Image Available
                  </div>
                )}
              </div>
              
              {/* Product Details */}
              <div className="py-2">
                <h2 className="text-2xl font-bold mb-2">{product.PRODUCT_NAME}</h2>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-primary">
                    CHF {Number(product.PRODUCT_PRICE).toFixed(2)}
                  </span>
                  {product.COMPARE_AS_PRICE && Number(product.COMPARE_AS_PRICE) > 0 ? (
                    <span className="text-lg line-through text-gray-400">
                      CHF {Number(product.COMPARE_AS_PRICE).toFixed(2)}
                    </span>
                  ) : null}
                </div>
                
                {product.PRODUCT_DESCRIPTION && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600 whitespace-pre-line">
                      {product.PRODUCT_DESCRIPTION}
                    </p>
                  </div>
                )}
                
                {/* Add to Cart Button */}
                {onAddToCart && (
                  <div className="mt-8">
                    <Button
                      onClick={onAddToCart}
                      className={`w-full py-3 text-lg ${isInCart ? 'bg-secondary hover:bg-secondary/90' : 'bg-primary hover:bg-primary/90'}`}
                      disabled={isInCart}
                    >
                      {isInCart ? 'Added to Cart' : 'Add to Cart'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
