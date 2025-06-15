import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Download, MessageCircle } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import FeedbackModal from '../components/feedback/FeedbackModal';
import { useCartStore } from '../store/cart-store';
import { useCheckoutStore } from '../store/checkout-store';
import { generateInvoiceHTML, generateInvoiceText, sendInvoiceToWhatsApp, downloadInvoiceHTML } from '../utils/invoice';

const AREAS = [
  { name: 'البوابة الأولى', price: 20 },
  { name: 'البوابة الثانية', price: 20 },
  { name: 'البوابة الثالثة', price: 20 },
  { name: 'البوابة الرابعة', price: 25 },
  { name: 'مساكن الضباط', price: 30 }
];

const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { customerInfo, paymentMethod, reset } = useCheckoutStore();
  const [orderSent, setOrderSent] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [orderId] = useState(`INV-${Date.now()}`);

  const getDeliveryFee = () => {
    const area = AREAS.find(a => a.name === customerInfo.area);
    return area ? area.price : 0;
  };

  const getPaymentFee = () => {
    if (paymentMethod === 'vodafone-cash') {
      return Math.ceil((getSubtotal() + getDeliveryFee()) * 0.01);
    }
    return 0;
  };

  const getTotalAmount = () => {
    return getSubtotal() + getDeliveryFee() + getPaymentFee();
  };

  const getPaymentMethodName = () => {
    switch (paymentMethod) {
      case 'cash-on-delivery': return 'الدفع عند الاستلام';
      case 'vodafone-cash': return 'فودافون كاش';
      case 'ansar-pay': return 'انستا باي';
      default: return 'غير محدد';
    }
  };

  const generateOrderData = () => {
    return {
      id: orderId,
      createdAt: new Date(),
      items,
      customerInfo,
      paymentMethod: paymentMethod === 'cash-on-delivery' ? 'cod' : paymentMethod === 'vodafone-cash' ? 'vodafone_cash' : 'instapay',
      subtotal: getSubtotal(),
      deliveryFee: getDeliveryFee(),
      paymentFee: getPaymentFee(),
      total: getTotalAmount()
    };
  };

  const downloadInvoice = () => {
    const orderData = generateOrderData();
    downloadInvoiceHTML(orderData);
  };

  const sendToWhatsApp = () => {
    const orderData = generateOrderData();
    const invoiceURL = `${window.location.origin}/invoice/${orderId}`;
    
    const message = `طلب جديد من تفانين ستوديو 📋

👤 العميل: ${customerInfo.name}
📱 الهاتف: ${customerInfo.phone}
📍 العنوان: ${customerInfo.street}، رقم ${customerInfo.buildingNumber}${customerInfo.floor ? `، الدور ${customerInfo.floor}` : ''}، ${customerInfo.area}

📦 المنتجات:
${items.map(item => `• ${item.product.name} x${item.quantity} = ${item.product.price * item.quantity} جنيه`).join('\n')}

💰 المجموع الفرعي: ${getSubtotal()} جنيه
🚚 رسوم التوصيل: ${getDeliveryFee()} جنيه
${getPaymentFee() > 0 ? `💳 رسوم الدفع: ${getPaymentFee()} جنيه\n` : ''}💵 المجموع الكلي: ${getTotalAmount()} جنيه

💳 طريقة الدفع: ${getPaymentMethodName()}

🔗 رابط الفاتورة المنسقة: ${invoiceURL}`;

    const whatsappURL = `https://wa.me/201026274235?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
    setOrderSent(true);
    
    // Show feedback modal after order is sent
    setTimeout(() => {
      setShowFeedback(true);
    }, 2000);
  };

  const handleNewOrder = () => {
    clearCart();
    reset();
    navigate('/');
  };

  const getDeliveryFee = () => {
    const area = AREAS.find(a => a.name === customerInfo.area);
    return area ? area.price : 0;
  };

  const getPaymentFee = () => {
    if (paymentMethod === 'vodafone-cash') {
      return Math.ceil((getSubtotal() + getDeliveryFee()) * 0.01);
    }
    return 0;
  };

  const getTotalAmount = () => {
    return getSubtotal() + getDeliveryFee() + getPaymentFee();
  };

  const getPaymentMethodName = () => {
    switch (paymentMethod) {
      case 'cash-on-delivery': return 'الدفع عند الاستلام';
      case 'vodafone-cash': return 'فودافون كاش';
      case 'ansar-pay': return 'انستا باي';
      default: return 'غير محدد';
    }
  };

  const generateOrderData = () => {
    return {
      id: orderId,
      createdAt: new Date(),
      items,
      customerInfo,
      paymentMethod: paymentMethod === 'cash-on-delivery' ? 'cod' : paymentMethod === 'vodafone-cash' ? 'vodafone_cash' : 'instapay',
      subtotal: getSubtotal(),
      deliveryFee: getDeliveryFee(),
      paymentFee: getPaymentFee(),
      total: getTotalAmount()
    };
  };

  const downloadInvoice = () => {
    const orderData = generateOrderData();
    downloadInvoiceHTML(orderData);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="تأكيد الطلب" 
        onBack={() => navigate('/payment')}
      />
      
      <div className="p-4 space-y-4">
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-green-800 mb-2">تم تأكيد طلبك بنجاح!</h2>
          <p className="text-green-600">سيتم التواصل معك قريباً لتأكيد موعد التوصيل</p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-bold text-lg mb-4">تفاصيل الطلب</h3>
          
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-700">معلومات العميل</h4>
              <p className="text-gray-600">{customerInfo.name}</p>
              <p className="text-gray-600">{customerInfo.phone}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">عنوان التوصيل</h4>
              <p className="text-gray-600">
                {customerInfo.street}، رقم {customerInfo.buildingNumber}
                {customerInfo.floor && `، الدور ${customerInfo.floor}`}، {customerInfo.area}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">طريقة الدفع</h4>
              <p className="text-gray-600">{getPaymentMethodName()}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-bold text-lg mb-4">المنتجات المطلوبة</h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-gray-600 text-sm">الكمية: {item.quantity}</p>
                </div>
                <p className="font-bold">{item.product.price * item.quantity} جنيه</p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>المجموع الفرعي</span>
              <span>{getSubtotal()} جنيه</span>
            </div>
            <div className="flex justify-between">
              <span>رسوم التوصيل</span>
              <span>{getDeliveryFee()} جنيه</span>
            </div>
            {getPaymentFee() > 0 && (
              <div className="flex justify-between text-orange-600">
                <span>رسوم الدفع الإلكتروني</span>
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

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={downloadInvoice}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            تحميل الفاتورة
          </Button>
          
          <Button
            onClick={sendToWhatsApp}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            إرسال الطلب للمكتبة
          </Button>
          
          {orderSent && (
            <button
              onClick={handleNewOrder}
              className="w-full border border-gray-300 text-gray-600 py-3 rounded-lg bg-white hover:bg-gray-50"
            >
              طلب جديد
            </button>
          )}
        </div>
      </div>

      <FeedbackModal 
        isOpen={showFeedback} 
        onClose={() => setShowFeedback(false)} 
      />
    </div>
  );
};

export default Confirmation;
