
import React from 'react';
import { ShoppingCart, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cart-store';

interface HeaderProps {
  title?: string;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onBack }) => {
  const navigate = useNavigate();
  const { items } = useCartStore();
  
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
            
            {/* Cart Icon */}
            <div className="flex items-center">
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
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Default header with logo and search
  return (
    <header className="bg-white shadow-lg border-b sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-xl font-bold text-xl transform group-hover:scale-105 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                مكتبة تفانين
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative group">
              <input
                type="text"
                placeholder="البحث عن المنتجات..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-full focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 hover:border-red-300 group-hover:shadow-md"
                style={{ direction: 'rtl' }}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Cart */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/cart')}
              className="relative p-3 text-gray-600 hover:text-red-600 transition-all duration-300 group rounded-full hover:bg-gradient-to-r hover:from-red-50 hover:to-yellow-50"
            >
              <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-bounce">
                  {totalItems}
                </span>
              )}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-110"></div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
