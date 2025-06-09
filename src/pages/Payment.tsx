
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import { useCheckoutStore } from '../store/checkout-store';
import { useCartStore } from '../store/cart-store';
import { PAYMENT_METHODS, DELIVERY_AREAS } from '../constants/locations';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { customerInfo, setPaymentMethod } = useCheckoutStore();
  const { items, getSubtotal } = useCartStore();
  
  const [selectedMethod, setSelectedMethod] = useState('');

  const subtotal = getSubtotal();
  const deliveryArea = DELIVERY_AREAS.find(area => area.name === customerInfo.area);
  const deliveryFee = deliveryArea ? deliveryArea.price : 0;
  
  const selectedPaymentMethod = PAYMENT_METHODS.find(method => method.id === selectedMethod);
  const paymentFee = selectedPaymentMethod ? Math.round(subtotal * selectedPaymentMethod.feePercentage / 100) : 0;
  
  const total = subtotal + deliveryFee + paymentFee;

  const handleSubmit = () => {
    if (selectedMethod) {
      setPaymentMethod(selectedMethod);
      navigate('/confirmation');
    }
  };

  if (!customerInfo.name) {
    navigate('/checkout');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="طريقة الدفع" 
        onBack={() => navigate('/checkout')}
      />
      
      <div className="p-6 max-w-md mx-auto">
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">ملخص الطلب</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>إجمالي المنتجات:</span>
              <span>{subtotal} جنيه</span>
            </div>
            <div className="flex justify-between">
              <span>التوصيل إلى ({customerInfo.area}):</span>
              <span>{deliveryFee} جنيه</span>
            </div>
            {paymentFee > 0 && (
              <div className="flex justify-between text-red-600">
                <span>رسوم الدفع ({selectedPaymentMethod?.feePercentage}%):</span>
                <span>{paymentFee} جنيه</span>
              </div>
            )}
            <hr className="my-3" />
            <div className="flex justify-between font-bold text-lg">
              <span>الإجمالي:</span>
              <span className="text-red-600">{total} جنيه</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">اختر طريقة الدفع</h3>
          
          <div className="space-y-3 mb-6">
            {PAYMENT_METHODS.map((method) => (
              <div key={method.id} className="border rounded-lg p-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="ml-3 text-red-600 focus:ring-red-500"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <div className="font-medium">{method.name}</div>
                      {method.feePercentage > 0 && (
                        <div className="text-sm text-red-600">
                          رسوم إضافية: {method.feePercentage}%
                        </div>
                      )}
                      {method.number && selectedMethod === method.id && (
                        <div className="text-sm text-gray-600 mt-1">
                          الرقم: {method.number}
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!selectedMethod}
            className={`w-full py-3 rounded-lg font-medium ${
              selectedMethod 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            تأكيد الطلب
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
