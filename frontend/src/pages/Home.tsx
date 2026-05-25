import { Link } from 'react-router-dom';
import { ShoppingCart, Truck, Clock, Shield } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useState, useEffect } from 'react';
import apiClient from '../api/client';

const mockProducts = [
  {
    id: 'f001b2c3-d4e5-4f6a-8b7c-9d0e1f2a3b4c',
    name: 'Fresh Organic Apples',
    price: 150,
    description: 'Crisp and juicy organic apples',
    category: 'Fruits',
    rating: 4.8,
  },
  {
    id: 'f001b2c3-d4e5-4f6a-8b7c-9d0e1f2a3b4d',
    name: 'Premium Milk',
    price: 65,
    description: 'Pure and fresh daily milk',
    category: 'Dairy',
    rating: 4.7,
  },
  {
    id: 'f001b2c3-d4e5-4f6a-8b7c-9d0e1f2a3b4e',
    name: 'Whole Wheat Bread',
    price: 45,
    description: 'Healthy whole wheat bread',
    category: 'Bakery',
    rating: 4.6,
  },
  {
    id: 'f001b2c3-d4e5-4f6a-8b7c-9d0e1f2a3b4f',
    name: 'Olive Oil Extra Virgin',
    price: 450,
    description: 'Premium olive oil for cooking',
    category: 'Oils',
    rating: 4.9,
  },
  {
    id: '5',
    name: 'Fresh Tomatoes',
    price: 80,
    description: 'Farm fresh red tomatoes',
    category: 'Vegetables',
    rating: 4.5,
  },
  {
    id: '6',
    name: 'Brown Rice',
    price: 120,
    description: 'Nutritious brown rice 1kg',
    category: 'Grains',
    rating: 4.7,
  },
];

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/api/products');
        // If API returns data, use it; otherwise fallback to empty list
        if (response.data && Array.isArray(response.data)) {
          setProducts(response.data.slice(0, 6)); // Show first 6 products
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          setProducts(response.data.data.slice(0, 6));
        }
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-400 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-4">Fresh Groceries at Your Doorstep</h1>
              <p className="text-xl mb-8 opacity-90">
                Order fresh, high-quality groceries online and get them delivered within 30 minutes!
              </p>
              <Link
                to="/products"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="bg-white bg-opacity-10 rounded-xl p-8 backdrop-blur-sm">
                <div className="text-6xl">🛒</div>
                <p className="text-lg mt-4">Join thousands of happy customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose QuickCart?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <Clock size={40} />,
                title: 'Fast Delivery',
                description: 'Get your groceries in 30 minutes',
              },
              {
                icon: <Shield size={40} />,
                title: 'Quality Assured',
                description: 'Fresh products guaranteed',
              },
              {
                icon: <ShoppingCart size={40} />,
                title: 'Easy Ordering',
                description: 'Simple checkout process',
              },
              {
                icon: <Truck size={40} />,
                title: 'Live Tracking',
                description: 'Track your delivery in real-time',
              },
            ].map((feature, idx) => (
              <div key={idx} className="text-center p-6 bg-blue-50 rounded-xl hover:shadow-lg transition">
                <div className="text-blue-600 mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold">Featured Products</h2>
            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-2"
            >
              <span>View All</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Loading featured products...</p>
              </div>
            ) : (products.length > 0 ? products : mockProducts).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Shop?</h2>
          <p className="text-xl mb-8 opacity-90">
            Browse our complete selection of fresh groceries
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </section>
    </div>
  );
}
