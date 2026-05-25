import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Minus, Plus, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

const products: Record<string, any> = {
  'f001b2c3-d4e5-4f6a-8b7c-9d0e1f2a3b4c': {
    id: 'f001b2c3-d4e5-4f6a-8b7c-9d0e1f2a3b4c',
    name: 'Fresh Organic Apples',
    price: 150,
    description: 'Crisp and juicy organic apples',
    category: 'Fruits',
    rating: 4.8,
    longDescription: 'Our fresh organic apples are hand-picked from premium orchards. They are pesticide-free and packed with natural nutrients. Perfect for a healthy diet.',
    inStock: true,
    quantity: 50,
  },
  'f001b2c3-d4e5-4f6a-8b7c-9d0e1f2a3b4d': {
    id: 'f001b2c3-d4e5-4f6a-8b7c-9d0e1f2a3b4d',
    name: 'Premium Milk',
    price: 65,
    description: 'Pure and fresh daily milk',
    category: 'Dairy',
    rating: 4.7,
    longDescription: 'Fresh milk delivered daily from local farms. Pasteurized and rich in calcium and protein.',
    inStock: true,
    quantity: 100,
  },
  'f001b2c3-d4e5-4f6a-8b7c-9d0e1f2a3b4e': {
    id: 'f001b2c3-d4e5-4f6a-8b7c-9d0e1f2a3b4e',
    name: 'Whole Wheat Bread',
    price: 45,
    description: 'Healthy whole wheat bread',
    category: 'Bakery',
    rating: 4.6,
    longDescription: 'Freshly baked whole wheat bread made with organic flour. No artificial preservatives.',
    inStock: true,
    quantity: 30,
  },
  'f001b2c3-d4e5-4f6a-8b7c-9d0e1f2a3b4f': {
    id: 'f001b2c3-d4e5-4f6a-8b7c-9d0e1f2a3b4f',
    name: 'Olive Oil Extra Virgin',
    price: 450,
    description: 'Premium olive oil for cooking',
    category: 'Oils',
    rating: 4.9,
    longDescription: 'Extra virgin olive oil cold-pressed from premium olives. Perfect for cooking and salads.',
    inStock: true,
    quantity: 20,
  },
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const product = id ? products[id] : null;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <button
            onClick={() => navigate('/products')}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: '🥗',
    });
    toast.success(`Added ${quantity} item(s) to cart!`);
    setQuantity(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 font-semibold"
        >
          <ArrowLeft size={20} />
          <span>Back to Products</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-9xl mb-4">🥗</div>
                  <p className="text-blue-600">{product.category}</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({product.rating})</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">₹{Number(product.price).toFixed(2)}</span>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <span className={`inline-block px-4 py-2 rounded-full font-semibold ${
                  product.inStock
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? `In Stock (${product.quantity} available)` : 'Out of Stock'}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-lg mb-8">{product.longDescription}</p>

              {/* Quantity Selector */}
              {product.inStock && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold">Quantity:</span>
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-gray-100 transition"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="px-6 font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                        className="p-2 hover:bg-gray-100 transition"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart size={20} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              )}

              {/* Info Boxes */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Category</p>
                  <p className="font-semibold text-gray-800">{product.category}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Delivery</p>
                  <p className="font-semibold text-gray-800">30 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
