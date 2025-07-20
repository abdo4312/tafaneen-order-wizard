
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      <div className="min-h-screen bg-background">
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
    <div className="min-h-screen bg-background">
      <Header 
        title="طريقة الدفع" 
        onBack={() => navigate('/checkout')}
      />
      
      <div className="p-4 space-y-4">
        <PaymentSummary
          subtotal={getSubtotal()}
          deliveryFee={getDeliveryFee()}
          paymentFee={getPaymentFee()}
          total={getTotalAmount()}
          customerArea={customerInfo.area}
        />

        <PaymentInstructions
          selectedMethod={selectedMethod}
          totalAmount={getTotalAmount()}
        />

        <PaymentMethodSelector
          selectedMethod={selectedMethod}
          onMethodSelect={handlePaymentMethodSelect}
        />

        <Button
          onClick={handleContinue}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-lg font-bold"
        >
          {(selectedMethod === 'vodafone-cash' || selectedMethod === 'ansar-pay') 
            ? 'متابعة للدفع' 
            : 'تأكيد الطلب'
          }
        </Button>
      </div>
    </div>
  );
};

export default Payment;
