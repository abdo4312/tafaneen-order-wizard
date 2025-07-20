
import React from 'react';
import { useLocation } from 'wouter';
import { Trash2, Plus, Minus } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import { useCartStore } from '../store/cart-store';

const Cart: React.FC = () => {
  const [, setLocation] = useLocation();
  const { items, removeItem, updateQuantity, getSubtotal, getTotalItems, clearCart } = useCartStore();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      updateQuantity(productId, 0);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    setLocation('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          title="سلة التسوق" 
          onBack={() => setLocation('/')}
        />
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">سلة التسوق فارغة</h2>
          <p className="text-gray-600 mb-6">لم تقم بإضافة أي منتجات بعد</p>
          <Button 
            onClick={() => setLocation('/')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            تصفح المنتجات
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="سلة التسوق" 
        onBack={() => setLocation('/')}
      />
      
      <div className="p-4">
        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.product.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-4">
                <img 
                  src={item.product.image} 
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{item.product.name}</h3>
                  <p className="text-gray-600 text-sm">{item.product.description}</p>
                  <p className="text-red-600 font-bold">{item.product.price} جنيه</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                    className="bg-red-100 text-red-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-200"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={() => updateQuantity(item.product.id, 0)}
                  className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="font-bold text-lg mb-4">ملخص الطلب</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>عدد المنتجات</span>
              <span>{getTotalItems()} قطعة</span>
            </div>
            <div className="flex justify-between">
              <span>المجموع الفرعي</span>
              <span>{getSubtotal()} جنيه</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>المجموع الكلي</span>
              <span>{getSubtotal()} جنيه</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleCheckout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-lg font-bold"
          >
            متابعة إلى الدفع
          </Button>
          
          <button
            onClick={clearCart}
            className="w-full border border-gray-300 text-gray-600 py-3 rounded-lg bg-white hover:bg-gray-50"
          >
            إفراغ السلة
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
