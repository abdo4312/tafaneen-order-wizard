
import React from 'react';
import { ShoppingCart, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cart-store';
import { useAuthStore } from '../store/auth-store';
import UserMenu from './auth/UserMenu';
import UserAccountMenu from './auth/UserAccountMenu';

interface HeaderProps {
  title?: string;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onBack }) => {
  const navigate = useNavigate();
  const { items } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // If title is provided, show the simple header with back button
  if (title) {
    return (
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              )}
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            </div>
            
            {/* User Account - Now shows UserAccountMenu for authenticated users */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <UserAccountMenu />
              ) : (
                <UserMenu />
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Default header with logo and search
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-xl">
              مكتبة تفانين
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="البحث عن المنتجات..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                style={{ direction: 'rtl' }}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Account */}
            {isAuthenticated ? (
              <UserAccountMenu />
            ) : (
              <UserMenu />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
