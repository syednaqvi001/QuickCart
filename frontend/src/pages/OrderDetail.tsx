import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Truck, Package, DollarSign } from 'lucide-react';
import apiClient from '../api/client';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await apiClient.get(`/api/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <button onClick={() => navigate('/orders')} className="text-blue-600 font-semibold">Back to Orders</button>
        </div>
      </div>
    );
  }

  // Map backend details to frontend UI needs
  const orderDetails = {
    id: order.id,
    orderDate: new Date(order.createdAt).toLocaleDateString(),
    status: order.status.toLowerCase(),
    items: order.items.map((item: any) => ({
      id: item.id,
      name: item.productName || 'Fresh Groceries',
      quantity: item.quantity,
      price: Number(item.unitPrice),
      image: item.productImage
    })),
    subtotal: Number(order.totalAmount),
    deliveryFee: 49,
    total: Number(order.totalAmount) + 49,
    deliveryAddress: order.deliveryAddress,
    deliveryAgent: {
      name: 'Raj Kumar',
      phone: '+91 9876543210',
      vehicle: 'Electric Scooter - KA 01 EQ 1234',
    },
    estimatedDelivery: '30-45 minutes',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 font-semibold"
        >
          <ArrowLeft size={20} />
          <span>Back to Orders</span>
        </button>

        <h1 className="text-4xl font-bold mb-8">Order Details</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="md:col-span-2 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                <Package size={24} className="text-blue-600" />
                <span>Order #{orderDetails.id.slice(0, 8)}</span>
              </h2>
              <p className="text-gray-600 mb-4">Ordered on {orderDetails.orderDate}</p>

              <div className="space-y-3">
                {orderDetails.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between py-2 border-b">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.name} <span className="text-sm text-gray-500 font-normal ml-2">(Qty: {item.quantity} × ₹{item.price})</span>
                      </p>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                <Truck size={24} className="text-blue-600" />
                <span>Delivery Information</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Delivery Address</p>
                  <p className="font-semibold text-gray-800 flex items-start space-x-2">
                    <MapPin size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                    <span>{orderDetails.deliveryAddress}</span>
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                  <p className="font-semibold text-gray-800">{orderDetails.estimatedDelivery}</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Delivery Partner</p>
                  <p className="font-semibold text-gray-800">{orderDetails.deliveryAgent.name}</p>
                  <p className="text-sm text-gray-600">{orderDetails.deliveryAgent.vehicle}</p>
                  <p className="text-sm text-gray-600">{orderDetails.deliveryAgent.phone}</p>
                </div>

                <Link
                  to={`/delivery/${orderDetails.id}`}
                  className="w-full inline-block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Track Delivery
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
                <DollarSign size={24} className="text-blue-600" />
                <span>Summary</span>
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({orderDetails.items.length} items)</span>
                  <span>₹{orderDetails.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>₹{orderDetails.deliveryFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">₹{orderDetails.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 uppercase font-bold">
                  Status: {orderDetails.status}
                </p>
                <p className="text-xs text-green-700 mt-2">
                  Your order details are synchronized with our backend
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
