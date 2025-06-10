
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import { useCheckoutStore } from '../store/checkout-store';
import { useCartStore } from '../store/cart-store';

const AREAS = [
  { name: 'البوابة الأولى', price: 20 },
  { name: 'البوابة الثانية', price: 20 },
  { name: 'البوابة الثالثة', price: 20 },
  { name: 'البوابة الرابعة', price: 25 },
  { name: 'مساكن الضباط', price: 30 }
];

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { customerInfo, paymentMethod, setPaymentMethod } = useCheckoutStore();
  const { getSubtotal } = useCartStore();
  
  const [selectedMethod, setSelectedMethod] = useState(paymentMethod || '');
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [transactionNumber, setTransactionNumber] = useState('');

  const getDeliveryFee = () => {
    const area = AREAS.find(a => a.name === customerInfo.area);
    return area ? area.price : 0;
  };

  const getPaymentFee = () => {
    if (selectedMethod === 'vodafone-cash') {
      return Math.ceil((getSubtotal() + getDeliveryFee()) * 0.01); // 1% fee
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
      alert('يرجى اختيار طريقة الدفع');
      return;
    }

    // إذا كانت طريقة الدفع إلكترونية، عرض تأكيد الدفع
    if (selectedMethod === 'vodafone-cash' || selectedMethod === 'ansar-pay') {
      setShowPaymentConfirmation(true);
      return;
    }

    // إذا كان الدفع نقدي، الانتقال مباشرة للتأكيد
    navigate('/confirmation');
  };

  const handlePaymentConfirmation = () => {
    if (!transactionNumber.trim()) {
      alert('يرجى إدخال رقم العملية');
      return;
    }
    navigate('/confirmation');
  };

  // إذا كان في مرحلة تأكيد الدفع الإلكتروني
  if (showPaymentConfirmation) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          title="تأكيد الدفع" 
          onBack={() => setShowPaymentConfirmation(false)}
        />
        
        <div className="p-4 space-y-4">
          {/* Payment Confirmation */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-green-800 text-lg mb-2">تم إرسال تفاصيل الدفع</h3>
                <div className="text-green-700 space-y-2">
                  <p><strong>المبلغ المطلوب:</strong> {getTotalAmount()} جنيه</p>
                  <p><strong>رقم المحفظة:</strong> 01066334002</p>
                  <p><strong>طريقة الدفع:</strong> {selectedMethod === 'vodafone-cash' ? 'فودافون كاش' : 'إنستاباي'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Number Input */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-bold text-lg mb-4">تأكيد الدفع</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم العملية / Transaction ID
                </label>
                <input
                  type="text"
                  value={transactionNumber}
                  onChange={(e) => setTransactionNumber(e.target.value)}
                  placeholder="أدخل رقم العملية هنا"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                />
                <p className="text-sm text-gray-600 mt-1">
                  يرجى إدخال رقم العملية الذي ظهر لك بعد إتمام التحويل
                </p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-blue-800 mb-2">تعليمات مهمة</h4>
                <div className="text-blue-700 text-sm space-y-2">
                  <p>• تأكد من إتمام التحويل قبل الضغط على "تأكيد الطلب"</p>
                  <p>• احتفظ برقم العملية لمراجعتها مع المكتبة</p>
                  <p>• سيتم التحقق من الدفع قبل تجهيز الطلب</p>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handlePaymentConfirmation}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-bold"
          >
            تأكيد الطلب والدفع
          </Button>
        </div>
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
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-bold text-lg mb-4">ملخص الطلب</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>المجموع الفرعي</span>
              <span>{getSubtotal()} جنيه</span>
            </div>
            <div className="flex justify-between">
              <span>رسوم التوصيل ({customerInfo.area})</span>
              <span>{getDeliveryFee()} جنيه</span>
            </div>
            {getPaymentFee() > 0 && (
              <div className="flex justify-between text-orange-600">
                <span>رسوم الدفع الإلكتروني (1%)</span>
                <span>{getPaymentFee()} جنيه</span>
              </div>
            )}
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>المجموع الكلي</span>
              <span>{getTotalAmount()} جنيه</span>
            </div>
          </div>
        </div>

        {/* Payment Instructions for Electronic Methods */}
        {(selectedMethod === 'vodafone-cash' || selectedMethod === 'ansar-pay') && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-blue-800 mb-2">تعليمات الدفع الإلكتروني</h4>
                <div className="text-blue-700 text-sm space-y-2">
                  <p><strong>1.</strong> قم بتحويل المبلغ المطلوب: <span className="font-bold">{getTotalAmount()} جنيه</span></p>
                  <p><strong>2.</strong> رقم المحفظة: <span className="font-bold">01066334002</span></p>
                  <p><strong>3.</strong> بعد التحويل، اضغط "متابعة" لإدخال رقم العملية</p>
                  <p><strong>4.</strong> تأكد من الاحتفاظ برقم العملية لمراجعتها مع المكتبة</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-bold text-lg mb-4">اختر طريقة الدفع</h3>
          
          <div className="space-y-3">
            {/* Cash on Delivery */}
            <div 
              onClick={() => handlePaymentMethodSelect('cash-on-delivery')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedMethod === 'cash-on-delivery' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-green-600" />
                <div className="flex-1">
                  <h4 className="font-bold">الدفع عند الاستلام</h4>
                  <p className="text-gray-600 text-sm">ادفع نقداً عند وصول الطلب</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedMethod === 'cash-on-delivery' 
                    ? 'border-red-500 bg-red-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedMethod === 'cash-on-delivery' && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Vodafone Cash */}
            <div 
              onClick={() => handlePaymentMethodSelect('vodafone-cash')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedMethod === 'vodafone-cash' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Wallet className="w-6 h-6 text-red-600" />
                <div className="flex-1">
                  <h4 className="font-bold">فودافون كاش</h4>
                  <p className="text-gray-600 text-sm">01066334002</p>
                  <p className="text-orange-600 text-xs">رسوم إضافية 1%</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedMethod === 'vodafone-cash' 
                    ? 'border-red-500 bg-red-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedMethod === 'vodafone-cash' && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Ansar Pay */}
            <div 
              onClick={() => handlePaymentMethodSelect('ansar-pay')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedMethod === 'ansar-pay' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <div className="flex-1">
                  <h4 className="font-bold">انستا باي</h4>
                  <p className="text-gray-600 text-sm">01066334002</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedMethod === 'ansar-pay' 
                    ? 'border-red-500 bg-red-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedMethod === 'ansar-pay' && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

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
