"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import Link from 'next/link';
import { CheckCircle, AlertTriangle, Loader, Clock, Mail, MapPin, Package, CreditCard, Home } from 'lucide-react';

interface OrderDetails {
  orderId: number;
  orderNumber: string;
  customerName: string;
  email: string;
  shippingAddress: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  estimatedDelivery: string;
}

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCartStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [order, setOrder] = useState<OrderDetails | null>(null);

  const verifyOrder = async () => {
    if (!sessionId) {
      setError('No session ID found. Please check your order status in your profile.');
      setStatus('error');
      return;
    }

    try {
      setStatus('loading');
      
      // Clear the cart first to ensure items are removed even if the page is refreshed
      clearCart();
      
      const response = await fetch(`/api/order/verify?session_id=${sessionId}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to verify order');
      }
      
      const data = await response.json();

      console.log('Order verification response:', data);
      
      // Format the order details from the API response
      const orderDetails: OrderDetails = {
        orderId: data.orderId,
        orderNumber: data.orderNumber || `ORD-${data.orderId}`,
        customerName: data.customerName || 'Customer',
        email: data.customerEmail || '',
        shippingAddress: {
          street: data.shipping?.address?.line1 || data.deliveryAddress?.split(',')[0]?.trim() || '',
          city: data.shipping?.address?.city || data.deliveryAddress?.split(',')[1]?.trim() || '',
          zip: data.shipping?.address?.postal_code || data.deliveryAddress?.match(/\d{4}/)?.[0] || '',
          country: data.shipping?.address?.country || 'Switzerland',
        },
        items: data.items?.map((item: any) => ({
          name: item.price?.product?.name || item.name || 'Product',
          quantity: item.quantity || 1,
          price: (item.price?.unit_amount || item.price || 0) / 100,
        })) || [],
        subtotal: (data.amount_subtotal || data.subtotal || 0) / 100,
        shipping: 0, // Free shipping
        total: (data.amount_total || data.total || 0) / 100,
        paymentMethod: data.payment_method_types?.[0] || 'card',
        estimatedDelivery: getEstimatedDeliveryDate(),
      };

      setOrder(orderDetails);
      setStatus('success');
      setError(null);
    } catch (err) {
      console.error('Order verification error:', err);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to process your order. Please contact support.');
    }
  };

  useEffect(() => {
    verifyOrder();
  }, [sessionId, retryCount]);

  function getEstimatedDeliveryDate() {
    const date = new Date();
    date.setDate(date.getDate() + 3); // 3 days from now
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing Your Order</h2>
        <p className="text-gray-600 max-w-md">
          We're verifying your payment and preparing your order. This may take a moment...
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8 my-8">
        <div className="text-center py-10">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Verification Failed</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {error || 'There was an issue processing your order. Please try again or contact support if the problem persists.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/cart"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Return to Cart
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success' && order) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-3">
            Thank you for your order!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your order <span className="font-semibold text-primary">#{order.orderNumber}</span> has been confirmed and is being processed.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-12">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flow-root">
              <ul role="list" className="divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <li key={index} className="py-4 flex">
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="ml-auto">
                      <p className="text-sm font-medium text-gray-900">CHF {item.price.toFixed(2)}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>CHF {order.subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <p>Shipping</p>
                  <p>{order.shipping === 0 ? 'Free' : `CHF ${order.shipping.toFixed(2)}`}</p>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 mt-4 pt-4 border-t border-gray-200">
                  <p>Total</p>
                  <p>CHF {order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Shipping Information */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                Shipping Information
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <address className="not-italic">
                <div className="text-base text-gray-900 font-medium">{order.customerName}</div>
                <div className="mt-1 text-gray-500">{order.shippingAddress.street}</div>
                <div className="text-gray-500">
                  {order.shippingAddress.city}, {order.shippingAddress.zip}
                </div>
                <div className="text-gray-500">{order.shippingAddress.country}</div>
              </address>
            </div>
          </div>

          {/* Delivery Estimate */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Clock className="h-5 w-5 text-gray-500 mr-2" />
                Delivery Estimate
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="text-base text-gray-900 font-medium">
                Estimated delivery by {order.estimatedDelivery}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                We'll send you shipping confirmation when your item(s) are on the way!
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Package className="h-5 w-5 text-gray-500 mr-2" />
                Order Status
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Payment Confirmed</p>
                  <p className="text-sm text-gray-500">Your payment has been processed successfully.</p>
                </div>
              </div>
              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-500">
                  A confirmation email has been sent to <span className="font-medium text-gray-900">{order.email}</span>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            View Order History
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Home className="-ml-1 mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Fallback in case of unexpected state
  return (
    <div className="text-center py-12">
      <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">Something went wrong</h3>
      <p className="mt-1 text-gray-500">We couldn't process your request. Please try again later.</p>
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Back to Home
        </Link>
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          View Order History
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <Suspense 
        fallback={
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing Your Order</h2>
            <p className="text-gray-600 max-w-md">
              We're verifying your payment and preparing your order. This may take a moment...
            </p>
          </div>
        }
      >
        <SuccessPageContent />
      </Suspense>
    </main>
  );
}
