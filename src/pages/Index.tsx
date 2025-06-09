
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { useCartStore } from '../store/cart-store';
import { PRODUCTS } from '../constants/products';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { items, addItem, removeItem, getTotalItems } = useCartStore();
  
  const handleAddToCart = (product: any) => {
    addItem(product);
  };

  const getItemQuantity = (productId: string) => {
    const item = items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="تفانين ستوديو" 
        showLogo={true}
      />
      
      {/* Cart Button */}
      <div className="fixed top-20 left-4 z-50">
        <button
          onClick={() => navigate('/cart')}
          className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors"
        >
          <ShoppingCart className="w-6 h-6" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-800 text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
              {getTotalItems()}
            </span>
          )}
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-red-50 to-white p-6 text-center">
        <h1 className="text-2xl font-bold text-red-800 mb-2">أهلاً بك في تفانين ستوديو</h1>
        <p className="text-gray-600">إنتاج إعلامي - استشارات - فعاليات - إعلان - تسويق</p>
      </div>

      {/* Products Grid */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">منتجاتنا</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product) => {
            const quantity = getItemQuantity(product.id);
            return (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-red-600 font-bold text-lg">{product.price} جنيه</span>
                    
                    {quantity === 0 ? (
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                      >
                        إضافة للسلة
                      </Button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => removeItem(product.id)}
                          className="bg-red-100 text-red-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-200"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold">{quantity}</span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-700"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Index;
