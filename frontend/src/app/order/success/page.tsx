"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import Link from 'next/link';
import { CheckCircle, AlertTriangle, Loader } from 'lucide-react';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCartStore();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      // We will create this API route next
      fetch(`/api/order/verify?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setStatus('success');
            clearCart(); // Clear the cart on successful order
          } else {
            setStatus('error');
            setError(data.error || 'An unknown error occurred.');
          }
        })
        .catch(err => {
          setStatus('error');
          setError('Failed to verify your order.');
          console.error(err);
        });
    }
  }, [sessionId, clearCart]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <Loader className="animate-spin h-12 w-12 text-primary mb-4" />
        <h1 className="text-2xl font-bold">Verifying your payment...</h1>
        <p className="text-gray-600">Please do not close this page.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-600">Order Verification Failed</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link href="/cart" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark">
          Return to Cart
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold">Thank you for your order!</h1>
      <p className="text-lg text-gray-700 mt-2 mb-6">Your payment was successful and your order is being processed.</p>
      <p className="text-gray-600">You will receive a confirmation email shortly.</p>
      <div className="mt-8">
        <Link href="/" className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <SuccessPageContent />
      </Suspense>
    </div>
  );
}
