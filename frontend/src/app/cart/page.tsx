"use client";

import { useCartStore } from "@/stores/cartStore";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCartStore();
  const [isClient, setIsClient] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleBackToCart = () => {
    setShowCheckout(false);
  };

  const handleCheckoutClick = () => {
    setShowCheckout(true);
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isClient) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading Cart...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="sub-heading mb-4">Your Cart is Empty</h1>
        <p className="sub-heading-description mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/" className="btn-primary">
          Start Exploring
        </Link>
      </div>
    );
  }

  // Render the checkout form if showCheckout is true
  if (showCheckout) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleBackToCart}
          className="flex items-center text-primary hover:text-primary-dark mb-6 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Cart
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="sub-heading mb-6">Checkout</h1>
            <CheckoutForm />
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="sub-heading border-b border-primary pb-4 mb-4">Order Summary</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex items-center">
                      <span className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                        {item.quantity}
                      </span>
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm">CHF {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 mt-6 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>CHF {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span>CHF {totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render the cart view
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="sub-heading">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            {items.map((item) => (
              <div key={item.id} className="flex items-center p-4 border-b last:border-b-0">
                <Image 
                  src={item.image || '/placeholder.png'} 
                  alt={item.name} 
                  width={80} 
                  height={80} 
                  className="rounded-md object-cover w-20 h-20"
                />
                <div className="ml-4 flex-grow">
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p className="text-primary font-bold">CHF {item.price.toFixed(2)}</p>
                </div>
                <div className="flex flex-col lg:flex-row items-end lg:items-center gap-4">
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                    aria-label="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                  <div className="flex items-center bg-primary/10 border rounded-md">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} 
                      className="p-2 hover:bg-gray-100 rounded-l-md"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-1 font-semibold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                      className="p-2 hover:bg-gray-100 rounded-r-md"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            <Link 
              href="/" 
              className="text-primary hover:text-primary-dark flex items-center"
            >
              <ArrowLeft size={16} className="mr-1" /> Continue Shopping
            </Link>
            <button 
              onClick={clearCart} 
              className="text-sm text-text-muted hover:text-primary"
            >
              Clear Cart
            </button>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="sub-heading border-b border-primary pb-4 mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span>CHF {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-4 mt-4">
                <span>Total</span>
                <span>CHF {totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckoutClick}
              disabled={loading}
              className="w-full bg-primary text-white mt-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            
            {status === 'unauthenticated' && (
              <div className="mt-4 text-sm text-center text-gray-600">
                <p>Have an account?{' '}
                  <Link href="/auth/signin?callbackUrl=/cart" className="text-primary hover:underline">
                    Sign in
                  </Link>{' '}
                  for a faster checkout.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
