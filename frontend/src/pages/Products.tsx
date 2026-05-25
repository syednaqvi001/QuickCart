import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
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
    id: 'f001b2c3-d4e5-4f6a-8b7c-9d0e1f2a3b50',
    name: 'Fresh Tomatoes',
    price: 80,
    description: 'Farm fresh red tomatoes',
    category: 'Vegetables',
    rating: 4.5,
  },
  {
    id: 'f001b2c3-d4e5-4f6a-8b7c-9d0e1f2a3b51',
    name: 'Brown Rice',
    price: 120,
    description: 'Nutritious brown rice 1kg',
    category: 'Grains',
    rating: 4.7,
  },
];

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          apiClient.get('/api/products'),
          apiClient.get('/api/categories'),
        ]);

        let fetchedProducts = [];
        if (productsRes.data && Array.isArray(productsRes.data)) {
          fetchedProducts = productsRes.data;
        } else if (productsRes.data?.data && Array.isArray(productsRes.data.data)) {
          fetchedProducts = productsRes.data.data;
        }
        
        setProducts(fetchedProducts.length > 0 ? fetchedProducts : mockProducts);

        if (categoriesRes.data && Array.isArray(categoriesRes.data)) {
          const names = categoriesRes.data.map((c: any) => c.name);
          setCategories(['All', ...names]);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category?.name === selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Our Products</h1>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Category Filter */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Filter size={20} className="text-gray-600" />
                <span className="font-semibold text-gray-700">Categories</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-32 bg-white rounded-xl">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-xl text-gray-600 font-medium">Loading our products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Products Found</h2>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-8 text-center text-gray-600">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
