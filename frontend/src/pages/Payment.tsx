import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Banknote, CheckCircle, Sparkles, Shield, Clock } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import PaymentSummary from '../components/payment/PaymentSummary';
import PaymentMethodSelector from '../components/payment/PaymentMethodSelector';
import PaymentInstructions from '../components/payment/PaymentInstructions';
import PaymentConfirmation from '../components/payment/PaymentConfirmation';
import { useCheckoutStore } from '../store/checkout-store';
import { useCartStore } from '../store/cart-store';
import { useToast } from '../hooks/use-toast';

const AREAS = [
  { name: 'البوابة الأولى', price: 20 },
  { name: 'البوابة الثانية', price: 20 },
  { name: 'البوابة الثالثة', price: 20 },
  { name: 'البوابة الرابعة', price: 25 },
  { name: 'مساكن الضباط', price: 30 }
];

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { customerInfo, paymentMethod, setPaymentMethod } = useCheckoutStore();
  const { getSubtotal } = useCartStore();
  
  const [selectedMethod, setSelectedMethod] = useState(paymentMethod || '');
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);

  const getDeliveryFee = () => {
    const area = AREAS.find(a => a.name === customerInfo.area);
    return area ? area.price : 0;
  };

  const getPaymentFee = () => {
    if (selectedMethod === 'vodafone-cash') {
      return Math.ceil((getSubtotal() + getDeliveryFee()) * 0.01);
    }
    return 0;
  };

  const getTotalAmount = () => {
    return getSubtotal() + getDeliveryFee() + getPaymentFee();
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedMethod(method);
    setPaymentMethod(method);
    setShowPaymentConfirmation(false);
  };

  const handleContinue = () => {
    if (!selectedMethod) {
      toast({
        title: "يرجى اختيار طريقة الدفع",
        variant: "destructive",
      });
      return;
    }

    if (selectedMethod === 'vodafone-cash' || selectedMethod === 'ansar-pay') {
      setShowPaymentConfirmation(true);
      return;
    }

    navigate('/confirmation');
  };

  const handlePaymentConfirmation = () => {
    navigate('/confirmation');
  };

  if (showPaymentConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-yellow-50">
        <Header 
          title="تأكيد الدفع" 
          onBack={() => setShowPaymentConfirmation(false)}
        />
        
        <PaymentConfirmation
          selectedMethod={selectedMethod}
          totalAmount={getTotalAmount()}
          onBack={() => setShowPaymentConfirmation(false)}
          onConfirm={handlePaymentConfirmation}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-yellow-50">
      <Header 
        title="طريقة الدفع" 
        onBack={() => navigate('/checkout')}
      />
      
      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">اختر طريقة الدفع</h2>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            جميع طرق الدفع آمنة ومضمونة
          </p>
        </div>

        {/* Payment Summary with Animation */}
        <div className="transform hover:scale-105 transition-all duration-300">
          <PaymentSummary
            subtotal={getSubtotal()}
            deliveryFee={getDeliveryFee()}
            paymentFee={getPaymentFee()}
            total={getTotalAmount()}
            customerArea={customerInfo.area}
          />
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-lg text-gray-800">طرق الدفع المتاحة</h3>
          </div>

          <div className="space-y-4">
            {/* Cash on Delivery */}
            <div 
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedMethod === 'cash-on-delivery'
                  ? 'border-red-500 bg-red-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-red-300 hover:shadow-md'
              }`}
              onClick={() => handlePaymentMethodSelect('cash-on-delivery')}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <Banknote className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">الدفع عند الاستلام</h4>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    ادفع عند وصول الطلب
                  </p>
                </div>
                {selectedMethod === 'cash-on-delivery' && (
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Vodafone Cash */}
            <div 
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedMethod === 'vodafone-cash'
                  ? 'border-red-500 bg-red-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-red-300 hover:shadow-md'
              }`}
              onClick={() => handlePaymentMethodSelect('vodafone-cash')}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">فودافون كاش</h4>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-yellow-500" />
                    دفع فوري وآمن
                  </p>
                  <p className="text-xs text-orange-600 mt-1">رسوم إضافية: 1% من المبلغ</p>
                </div>
                {selectedMethod === 'vodafone-cash' && (
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Ansar Pay */}
            <div 
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedMethod === 'ansar-pay'
                  ? 'border-red-500 bg-red-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-red-300 hover:shadow-md'
              }`}
              onClick={() => handlePaymentMethodSelect('ansar-pay')}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">انستا باي</h4>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-500" />
                    دفع آمن ومضمون
                  </p>
                </div>
                {selectedMethod === 'ansar-pay' && (
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="transform hover:scale-105 transition-all duration-300">
          <PaymentInstructions
            selectedMethod={selectedMethod}
            totalAmount={getTotalAmount()}
          />
        </div>

        {/* Continue Button */}
        <div className="relative group">
          <Button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {(selectedMethod === 'vodafone-cash' || selectedMethod === 'ansar-pay') 
                ? 'متابعة للدفع' 
                : 'تأكيد الطلب'
              }
            </div>
          </Button>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Payment;