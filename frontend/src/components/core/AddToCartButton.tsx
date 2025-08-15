'use client';
import { useCartStore } from '@/stores/cartStore';

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
};

export default function AddToCartButton({ product }: { product: Product }) {
  const { items, addToCart } = useCartStore();
  const isInCart = items.some((item) => item.id === product.id);

  return (
    <button
      onClick={() => addToCart(product)}
      className={`px-4 py-2 rounded-full ${
        isInCart 
          ? 'bg-secondary hover:bg-secondary-dark' 
          : 'bg-primary hover:bg-primary-dark'
      } text-white transition-colors`}
      disabled={isInCart}
    >
      {isInCart ? 'Added to Cart' : 'Add to Cart'}
    </button>
  );
}
