import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, User, Truck, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const steps = [
    {
      id: 1,
      title: 'Browse Products',
      description: 'Explore our wide range of fresh groceries and products',
      icon: Package,
      action: () => navigate('/products'),
      color: 'blue',
    },
    {
      id: 2,
      title: 'Add to Cart',
      description: 'Select items and add them to your shopping cart',
      icon: ShoppingCart,
      action: () => navigate('/products'),
      color: 'green',
    },
    {
      id: 3,
      title: 'Checkout',
      description: 'Complete your purchase with easy checkout',
      icon: ArrowRight,
      action: () => navigate('/checkout'),
      color: 'purple',
      disabled: true,
    },
    {
      id: 4,
      title: 'Track Delivery',
      description: 'Track your order in real-time as it arrives',
      icon: Truck,
      action: () => navigate('/orders'),
      color: 'orange',
      disabled: true,
    },
  ];

  const handleStepClick = (step: any) => {
    if (!step.disabled) {
      setCompletedSteps([...completedSteps, step.id]);
      step.action();
    }
  };

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600 border-blue-200',
    green: 'bg-green-100 text-green-600 border-green-200',
    purple: 'bg-purple-100 text-purple-600 border-purple-200',
    orange: 'bg-orange-100 text-orange-600 border-orange-200',
  };

  const hoverClasses: Record<string, string> = {
    blue: 'hover:bg-blue-50 hover:border-blue-300',
    green: 'hover:bg-green-50 hover:border-green-300',
    purple: 'hover:bg-purple-50 hover:border-purple-300 cursor-not-allowed opacity-50',
    orange: 'hover:bg-orange-50 hover:border-orange-300 cursor-not-allowed opacity-50',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4 flex justify-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-3 rounded-full">
              <ShoppingCart className="text-white" size={40} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">
            Welcome to QuickCart!
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            Hello, <span className="font-semibold text-gray-800">{user.firstName}!</span>
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your account is all set up. Let's get you started with your first grocery order. Follow the simple steps below to find great products and have them delivered to your doorstep.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="mb-12">
          <div className="flex justify-between mb-8">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all ${
                    completedSteps.includes(step.id)
                      ? 'bg-green-500 text-white'
                      : step.disabled
                      ? 'bg-gray-300 text-gray-500'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {completedSteps.includes(step.id) ? '✓' : step.id}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded transition-all ${
                      completedSteps.includes(step.id)
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.includes(step.id);

            return (
              <div
                key={step.id}
                onClick={() => handleStepClick(step)}
                className={`border-2 rounded-2xl p-8 transition-all duration-300 transform ${
                  colorClasses[step.color]
                } ${
                  !step.disabled
                    ? `${hoverClasses[step.color]} cursor-pointer hover:scale-105 hover:shadow-lg`
                    : hoverClasses[step.color]
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`p-3 rounded-xl bg-white ${
                      step.color === 'blue' ? 'text-blue-600' :
                      step.color === 'green' ? 'text-green-600' :
                      step.color === 'purple' ? 'text-purple-600' :
                      'text-orange-600'
                    }`}>
                      <Icon size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        Step {step.id}: {step.title}
                      </h3>
                      <p className="text-gray-700 text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {isCompleted && (
                    <CheckCircle className="text-green-500 flex-shrink-0" size={32} />
                  )}
                </div>

                {!step.disabled && (
                  <div className="flex items-center justify-end mt-4 pt-4 border-t border-current opacity-50">
                    <span className="text-sm font-semibold flex items-center space-x-1">
                      <span>Start Now</span>
                      <ArrowRight size={16} />
                    </span>
                  </div>
                )}

                {step.disabled && (
                  <div className="text-sm text-gray-600 italic mt-4">
                    (Available after adding items to cart)
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Tips */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-100 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <span className="text-2xl">💡</span>
            <span>Quick Tips for New Users</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex space-x-4">
              <div className="text-2xl">🔍</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Search & Filter</h4>
                <p className="text-gray-600 text-sm">Use search and filters to find exactly what you need quickly.</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="text-2xl">⭐</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Check Ratings</h4>
                <p className="text-gray-600 text-sm">Read product ratings and reviews from other customers.</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="text-2xl">🚚</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Fast Delivery</h4>
                <p className="text-gray-600 text-sm">Get your groceries delivered within 30-45 minutes.</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="text-2xl">💰</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Best Prices</h4>
                <p className="text-gray-600 text-sm">Enjoy competitive prices with regular discounts and offers.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/products')}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <ShoppingCart size={20} />
            <span>Start Shopping Now</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300"
          >
            Back to Home
          </button>
        </div>

        {/* Account Info */}
        <div className="mt-12 bg-blue-50 rounded-2xl p-6 border-2 border-blue-100 text-center">
          <p className="text-gray-700">
            Account: <span className="font-semibold text-gray-800">{user.email}</span>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Role: <span className="font-semibold capitalize">{user.role.toLowerCase()}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
