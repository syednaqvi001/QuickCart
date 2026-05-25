import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Package, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const totalItems = getTotalItems();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-2 rounded-lg">
              <ShoppingCart className="text-white" size={24} />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              QuickCart
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/products"
              className="flex items-center space-x-1 hover:text-blue-600 transition"
            >
              <Package size={20} />
              <span>Products</span>
            </Link>

            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="flex items-center space-x-1 hover:text-blue-600 transition"
              >
                <span>Admin</span>
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <Link
                  to="/cart"
                  className="relative hover:text-blue-600 transition"
                >
                  <ShoppingCart size={24} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {totalItems}
                    </span>
                  )}
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-2 hover:text-blue-600 transition">
                    <User size={20} />
                    <span>{user?.firstName}</span>
                  </button>

                  <div className="hidden group-hover:block absolute right-0 mt-0 w-48 bg-white rounded-lg shadow-xl py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-blue-50 text-gray-800"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 hover:bg-blue-50 text-gray-800"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-gray-800 flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="hover:text-blue-600 transition flex items-center space-x-1"
                >
                  <LogIn size={20} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/products"
              className="block px-4 py-2 hover:bg-blue-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/cart"
                  className="block px-4 py-2 hover:bg-blue-50 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Cart {totalItems > 0 && `(${totalItems})`}
                </Link>
                <Link
                  to="/orders"
                  className="block px-4 py-2 hover:bg-blue-50 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  My Orders
                </Link>
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-blue-50 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 hover:bg-blue-50 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 rounded-lg text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 hover:bg-blue-50 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
