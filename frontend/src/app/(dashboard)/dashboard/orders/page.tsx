'use client';

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Package, XCircle } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError("");
      console.log('Fetching orders...');
      
      const response = await fetch('/api/orders/history', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch orders');
      }

      const data = await response.json();
      console.log('Orders data received:', data);
      
      if (!data.orders) {
        console.warn('No orders array in response:', data);
        setOrders([]);
        return;
      }
      
      setOrders(data.orders);
    } catch (err: any) {
      console.error('Error in fetchOrders:', err);
      const errorMessage = err.message || 'Failed to load your orders. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchOrders();
    }
  }, [session]);

  return (
    <div className="mx-auto px-4 lg:px-0 py-8 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="sub-heading">My Orders</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchOrders}
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
          <Package className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 sub-heading">No orders yet</h3>
          <p className="mt-1 text-gray-500">You haven't placed any orders yet.</p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order.BUSINESS_ORDER_ID}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="px-6 py-5 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="sub-heading">
                    Order #{order.ORDER_REFERENCE || `ORD-${order.BUSINESS_ORDER_ID}`}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Placed on {new Date(order.CREATION_DATETIME).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="sub-heading">
                    CHF {order.ORDER_FINAL_AMOUNT || order.ORDER_AMOUNT || '0.00'}
                  </p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.ORDER_STATUS === 4 
                      ? 'bg-green-100 text-green-800' 
                      : order.ORDER_STATUS === 3
                      ? 'bg-blue-100 text-blue-800'
                      : order.ORDER_STATUS === 2
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {order.ORDER_STATUS === 4 ? 'Completed' : 
                     order.ORDER_STATUS === 3 ? 'Shipped' :
                     order.ORDER_STATUS === 2 ? 'Processing' : 'Pending'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="sub-heading mb-4">Order Items</h4>
                <div className="space-y-4">
                  {order.details?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-start py-4 border-b border-gray-100 last:border-0 gap-4">
                      <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                        {item.product?.PRODUCT_IMAGE ? (
                          <img
                            src={item.product.PRODUCT_IMAGE}
                            alt={item.product.PRODUCT_NAME}
                            className="h-full w-full object-cover object-center"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-400">
                            <Package className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product?.PRODUCT_NAME || 'Product'}
                        </p>
                        {item.product?.PRODUCT_DESCRIPTION && (
                          <p className="text-xs text-gray-500 truncate">
                            {item.product.PRODUCT_DESCRIPTION}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {item.ORDER_QUANTITY || 1}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                        CHF {item.product?.PRODUCT_PRICE || '0.00'}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {order.details?.length} item{order.details?.length !== 1 ? 's' : ''}
                  </div>
                  <Link
                    href={`/order/${order.BUSINESS_ORDER_ID}`}
                    className="text-sm font-medium text-primary hover:text-primary-dark flex items-center"
                  >
                    View Order Details
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}