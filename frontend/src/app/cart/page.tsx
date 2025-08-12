"use client";

import { useCartStore } from "@/stores/cartStore";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { getStripe } from '@/lib/stripe';

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCartStore();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      const { sessionId } = await response.json();
      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const stripe = await getStripe();
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Stripe redirect error:', error);
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading Cart...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-lg text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/business" className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            {items.map((item) => (
              <div key={item.id} className="flex items-center p-4 border-b last:border-b-0">
                <Image src={item.image || '/placeholder.png'} alt={item.name} width={80} height={80} className="rounded-md object-cover" />
                <div className="ml-4 flex-grow">
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p className="text-primary font-bold">CHF {item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-md">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-100 rounded-l-md"><Minus size={16} /></button>
                    <span className="px-4 py-1 font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-100 rounded-r-md"><Plus size={16} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"><Trash2 size={20} /></button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={clearCart} className="text-sm text-gray-500 hover:text-red-600 mt-4">Clear Cart</button>
        </div>
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold border-b pb-4 mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal ({totalItems} items)</span>
              <span>CHF {totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-4">
              <span>Total</span>
              <span>CHF {totalPrice.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-primary text-white mt-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
