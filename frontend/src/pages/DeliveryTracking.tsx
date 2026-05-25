import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, ArrowLeft, Truck, CheckCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import apiClient from '../api/client';

export default function DeliveryTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const response = await apiClient.get(`/api/deliveries/${orderId}`);
        setDelivery(response.data);
      } catch (error) {
        console.error('Failed to fetch delivery:', error);
        // If not found, use a mock for demonstration
        setDelivery({
          orderId,
          status: 'ASSIGNED',
          agent: { name: 'Raj Kumar', phone: '+91 9876543210', rating: 4.8 },
          vehicle: { type: 'Electric Scooter', number: 'KA-01-EQ-1234' },
          location: { address: '2.5 km away' },
          timeline: [
            { time: 'Recently', status: 'Order Confirmed', completed: true },
            { time: 'Expected Soon', status: 'On the way', completed: false },
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDelivery();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 font-semibold"
        >
          <ArrowLeft size={20} />
          <span>Back to Orders</span>
        </button>

        <h1 className="text-4xl font-bold mb-8">Delivery Tracking</h1>

        {!delivery ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Truck size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">No tracking information available for this order.</p>
          </div>
        ) : (
          <>
            {/* Main Map Area */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="h-96 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
            <div className="text-center">
              <Truck size={80} className="text-blue-400 mx-auto mb-4" />
              <p className="text-blue-600 font-semibold">Map View Coming Soon</p>
              <p className="text-blue-500 text-sm">Your order is 2.5 km away</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Tracking Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Delivery Agent */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Delivery Partner</h2>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-lg text-gray-800">{delivery.agent.name}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < Math.floor(delivery.agent.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-600">{delivery.agent.rating}</span>
                  </div>
                  <p className="text-gray-600 mt-2">
                    {delivery.vehicle.type} - {delivery.vehicle.number}
                  </p>
                </div>
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  <Phone size={20} />
                  <span>Call</span>
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Order Timeline</h2>
              <div className="space-y-4">
                {delivery.timeline.map((event: any, idx: number) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          event.completed
                            ? 'bg-green-100'
                            : 'bg-gray-100'
                        }`}
                      >
                        {event.completed ? (
                          <CheckCircle className="text-green-600" size={24} />
                        ) : (
                          <Clock className="text-gray-600" size={24} />
                        )}
                      </div>
                      {idx < delivery.timeline.length - 1 && (
                        <div
                          className={`w-1 h-12 ${
                            event.completed ? 'bg-green-300' : 'bg-gray-300'
                          }`}
                        />
                      )}
                    </div>
                    <div className="pt-2">
                      <p className="font-semibold text-gray-800">{event.status}</p>
                      <p className="text-sm text-gray-600">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Info */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-4">Current Status</h2>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-lg font-bold text-blue-600">On the Way</p>
                <p className="text-sm text-blue-700 mt-2">
                  Your order is en route. Expected delivery in 20-30 minutes.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold text-gray-800 flex items-start space-x-2">
                    <MapPin size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>{delivery.location.address}</span>
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    <strong>Contact:</strong> {delivery.agent.phone}
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    Please keep your phone handy. The delivery partner will call before arrival.
                  </p>
                </div>
              </div>
            </div>
        </div>
      </div>
    </>
  )}
</div>
</div>
  );
}
