import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Download, MessageCircle, Sparkles, Gift, Clock, Star, Heart } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import FeedbackModal from '../components/feedback/FeedbackModal';
import { useCartStore } from '../store/cart-store';
import { useCheckoutStore } from '../store/checkout-store';
import { generateInvoiceHTML, generateInvoiceText, sendInvoiceToWhatsApp, downloadInvoiceHTML, validateAndSaveOrder } from '../utils/invoice';

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
  const [orderId] = useState(`TFN-${Date.now()}`);
  const [isAnimating, setIsAnimating] = useState(true);

  // Animation effect on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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

  // دالة التحقق من صحة البيانات قبل إنشاء الطلب
  const validateInvoiceData = (invoiceData: any): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // التحقق من بيانات العميل
    if (!invoiceData.customerInfo?.name || invoiceData.customerInfo.name.includes('يرجى التواصل')) {
      errors.push('اسم العميل مطلوب ولا يمكن أن يكون فارغاً');
    }
    
    if (!invoiceData.customerInfo?.phone || invoiceData.customerInfo.phone === '01026274235') {
      errors.push('رقم هاتف العميل مطلوب ولا يمكن أن يكون رقم المكتبة');
    }
    
    if (!invoiceData.customerInfo?.street || invoiceData.customerInfo.street.includes('غير متوفر')) {
      errors.push('عنوان العميل مطلوب');
    }
    
    if (!invoiceData.customerInfo?.area || invoiceData.customerInfo.area === 'غير محدد') {
      errors.push('منطقة العميل مطلوبة');
    }
    
    // التحقق من المنتجات
    if (!invoiceData.items || invoiceData.items.length === 0) {
      errors.push('يجب إضافة منتج واحد على الأقل');
    } else {
      invoiceData.items.forEach((item: any, index: number) => {
        if (!item.product?.name || item.product.name.includes('غير محدد')) {
          errors.push(`اسم المنتج ${index + 1} مطلوب`);
        }
        if (!item.product?.price || item.product.price <= 0) {
          errors.push(`سعر المنتج ${index + 1} يجب أن يكون أكبر من صفر`);
        }
        if (!item.quantity || item.quantity <= 0) {
          errors.push(`كمية المنتج ${index + 1} يجب أن تكون أكبر من صفر`);
        }
      });
    }
    
    if (!invoiceData.total || invoiceData.total <= 0) {
      errors.push('المجموع الإجمالي يجب أن يكون أكبر من صفر');
    }
    
    return { isValid: errors.length === 0, errors };
  };

  const generateOrderData = () => {
    const orderData = {
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

    // التحقق من صحة البيانات قبل الإرجاع
    const validation = validateInvoiceData(orderData);
    if (!validation.isValid) {
      console.error('أخطاء في بيانات الفاتورة:', validation.errors);
      alert('تحذير: توجد أخطاء في بيانات الفاتورة:\n' + validation.errors.join('\n'));
    }

    return orderData;
  };

  const downloadInvoice = () => {
    const orderData = generateOrderData();
    validateAndSaveOrder(orderData);
    downloadInvoiceHTML(orderData);
  };

  const sendToWhatsApp = () => {
    const orderData = generateOrderData();
    
    console.log('Order Data being sent:', orderData);
    
    const saveSuccess = validateAndSaveOrder(orderData);
    if (!saveSuccess) {
      console.error('فشل في حفظ بيانات الطلب');
      alert('حدث خطأ في حفظ بيانات الطلب. يرجى المحاولة مرة أخرى.');
      return;
    }
    
    try {
      localStorage.setItem(`invoice_${orderData.id}`, JSON.stringify(orderData));
      sessionStorage.setItem('currentInvoice', JSON.stringify(orderData));
      localStorage.setItem('lastInvoiceData', JSON.stringify(orderData));
      console.log('تم حفظ البيانات بنجاح في جميع المواقع');
    } catch (error) {
      console.error('خطأ في الحفظ الإضافي:', error);
    }
    
    const message = generateInvoiceText(orderData);
    const messageWithLibraryNumber = `${message}

📞 رقم المكتبة: 01026274235`;

    const whatsappURL = `https://wa.me/201026274235?text=${encodeURIComponent(messageWithLibraryNumber)}`;
    window.open(whatsappURL, '_blank');
    setOrderSent(true);
    
    setTimeout(() => {
      setShowFeedback(true);
    }, 2000);
  };

  const handleNewOrder = () => {
    // إقرار السلة تلقائياً وإفراغ البيانات
    const { autoConfirmOrder } = useCheckoutStore.getState();
    
    // تنفيذ الإقرار التلقائي
    autoConfirmOrder();
    
    // إفراغ السلة
    clearCart();
    
    // الانتقال للصفحة الرئيسية
    navigate('/');
    
    // إظهار رسالة تأكيد
    console.log('تم إقرار الطلب تلقائياً وإفراغ جميع البيانات');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <Header 
        title="تأكيد الطلب" 
        onBack={() => navigate('/payment')}
      />
      
      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        {/* Success Animation */}
        <div className={`text-center mb-8 ${isAnimating ? 'animate-bounce' : ''}`}>
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">تم تأكيد طلبك بنجاح!</h2>
          <p className="text-green-600 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            سيتم التواصل معك قريباً لتأكيد موعد التوصيل
          </p>
          <div className="mt-4 bg-green-100 rounded-full px-4 py-2 inline-block">
            <p className="text-sm text-green-700 font-medium">رقم الطلب: {orderId}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-lg text-gray-800">تفاصيل الطلب</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                معلومات العميل
              </h4>
              <p className="text-gray-600 flex items-center gap-2">
                <span>👤</span>
                {customerInfo.name}
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <span>📞</span>
                {customerInfo.phone}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                عنوان التوصيل
              </h4>
              <p className="text-gray-600 flex items-center gap-2">
                <span>📍</span>
                {customerInfo.street}، رقم العقار {customerInfo.buildingNumber}
                {customerInfo.floor && `، الدور ${customerInfo.floor}`}، {customerInfo.area}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                طريقة الدفع
              </h4>
              <p className="text-gray-600 flex items-center gap-2">
                <span>💳</span>
                {getPaymentMethodName()}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-lg text-gray-800">المنتجات المطلوبة</h3>
          </div>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium text-gray-800">{item.product.name}</p>
                  <p className="text-gray-600 text-sm flex items-center gap-1">
                    <span>الكمية: {item.quantity}</span>
                    <span>×</span>
                    <span>{item.product.price} جنيه</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <p className="font-bold text-red-600">{item.product.price * item.quantity} جنيه</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">المجموع الفرعي</span>
              <span className="font-medium">{getSubtotal()} جنيه</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">رسوم التوصيل ({customerInfo.area})</span>
              <span className="font-medium">{getDeliveryFee()} جنيه</span>
            </div>
            {getPaymentFee() > 0 && (
              <div className="flex justify-between items-center text-orange-600">
                <span>رسوم الدفع الإلكتروني (1%)</span>
                <span className="font-medium">{getPaymentFee()} جنيه</span>
              </div>
            )}
            <div className="h-px bg-gray-200 my-3"></div>
            <div className="flex justify-between items-center font-bold text-lg">
              <span>المجموع الكلي</span>
              <span className="text-red-600 text-xl">{getTotalAmount()} جنيه</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Button
            onClick={downloadInvoice}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl flex items-center justify-center gap-2 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <Download className="w-5 h-5" />
            تحميل الفاتورة PDF
          </Button>
          
          <Button
            onClick={sendToWhatsApp}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl flex items-center justify-center gap-2 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
            إرسال الطلب للمكتبة
          </Button>
          
          {orderSent && (
            <Button
              onClick={handleNewOrder}
              className="w-full border-2 border-red-300 text-red-600 hover:bg-red-50 py-4 rounded-xl bg-white transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              طلب جديد
            </Button>
          )}
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
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