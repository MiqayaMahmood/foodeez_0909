'use client';
import { useCartStore } from '@/stores/cartStore';

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
};

export default function AddToCartButton({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <button
      onClick={() => addToCart({ ...product, quantity: 1 })}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Add to Cart
    </button>
  );
}
