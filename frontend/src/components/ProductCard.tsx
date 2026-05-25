import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  rating?: number;
  category?: string;
}

export default function ProductCard({
  id,
  name,
  price,
  description,
  image,
  rating = 4.5,
  category,
}: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: id,
      name,
      price,
      quantity: 1,
      imageUrl: image,
    });
    toast.success('Added to cart!');
  };

  return (
    <Link to={`/products/${id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
              <span className="text-blue-300 text-lg">Product Image</span>
            </div>
          )}
          {category && (
            <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
              {category}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 group-hover:text-blue-600 transition">
            {name}
          </h3>

          {description && (
            <p className="text-gray-600 text-sm line-clamp-2 mt-1">
              {description}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center space-x-1 mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({rating})</span>
          </div>

          {/* Price and Button */}
          <div className="mt-auto pt-4 flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">₹{Number(price).toFixed(2)}</span>
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              title="Add to cart"
            >
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
