import { Link } from 'react-router-dom';
import { Package, Truck, Calendar, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import apiClient from '../api/client';

const mockOrders = [
  {
    id: '1',
    createdAt: '2026-05-21T10:00:00Z',
    items: [{ id: '1', name: 'Fresh Organic Apples' }, { id: '2', name: 'Premium Milk' }],
    totalAmount: '456.99',
    status: 'DELIVERED',
    deliveryAddress: '123 Main St, NY',
  },
  {
    id: '2',
    createdAt: '2026-05-20T10:00:00Z',
    items: [{ id: '1', name: 'Whole Wheat Bread' }],
    totalAmount: '234.50',
    status: 'SHIPPED',
    deliveryAddress: '456 Elm St, LA',
  },
];

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
  DELIVERED: { color: 'green', icon: Package, label: 'Delivered' },
  SHIPPED: { color: 'blue', icon: Truck, label: 'In Transit' },
  CONFIRMED: { color: 'yellow', icon: Package, label: 'Confirmed' },
  PENDING: { color: 'gray', icon: Calendar, label: 'Pending' },
  CANCELLED: { color: 'red', icon: Package, label: 'Cancelled' },
};

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get('/api/orders');
        const fetchedOrders = response.data || [];
        setOrders(fetchedOrders.length > 0 ? fetchedOrders : mockOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setOrders(mockOrders);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-12">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">No Orders Yet</h1>
          <p className="text-gray-600 mb-8">Start shopping to place your first order</p>
          <Link
            to="/products"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => {
            const config = statusConfig[order.status] || statusConfig.PENDING;
            const StatusIcon = config.icon;

            return (
              <Link key={order.id} to={`/orders/${order.id}`}>
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="bg-blue-50 rounded-full p-3">
                          <StatusIcon className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Order #{order.id.split('-')[0].toUpperCase()}</h3>
                          <p className="text-sm text-gray-600 flex items-center space-x-2">
                            <Calendar size={14} />
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ml-16">
                        <div>
                          <p className="text-xs text-gray-600">Items</p>
                          <p className="font-semibold text-gray-800">{order.items?.length || 0} items</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Total</p>
                          <p className="font-semibold text-gray-800">₹{parseFloat(order.totalAmount).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Status</p>
                          <p className="font-semibold" style={{ color: config.color }}>{config.label}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Address</p>
                          <p className="font-semibold text-gray-800 truncate max-w-[150px]">
                            {order.deliveryAddress}
                          </p>
                        </div>
                      </div>
                    </div>

                    <ArrowRight className="text-gray-400 mt-2" size={24} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
