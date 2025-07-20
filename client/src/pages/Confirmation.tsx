import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { CheckCircle, Download, MessageCircle } from 'lucide-react';
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
  const [, setLocation] = useLocation();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { customerInfo, paymentMethod, reset } = useCheckoutStore();
  const [orderSent, setOrderSent] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [orderId] = useState(`TFN-${Date.now()}`);

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
      // يمكن إظهار رسالة تحذير للمستخدم هنا
      alert('تحذير: توجد أخطاء في بيانات الفاتورة:\n' + validation.errors.join('\n'));
    }

    return orderData;
  };

  const downloadInvoice = () => {
    const orderData = generateOrderData();
    
    // حفظ البيانات قبل التحميل
    validateAndSaveOrder(orderData);
    
    downloadInvoiceHTML(orderData);
  };

  const sendToWhatsApp = () => {
    const orderData = generateOrderData();
    
    // إضافة logging للتحقق من البيانات
    console.log('Order Data being sent:', orderData);
    console.log('Customer Info:', orderData.customerInfo);
    console.log('Items:', orderData.items);
    console.log('Total:', orderData.total);
    
    // التحقق من صحة البيانات وحفظها - الآن بطرق متعددة
    const saveSuccess = validateAndSaveOrder(orderData);
    if (!saveSuccess) {
      console.error('فشل في حفظ بيانات الطلب');
      alert('حدث خطأ في حفظ بيانات الطلب. يرجى المحاولة مرة أخرى.');
      return;
    }
    
    // حفظ إضافي متقدم للبيانات
    try {
      // حفظ مخصص بمعرف الفاتورة
      localStorage.setItem(`invoice_${orderData.id}`, JSON.stringify(orderData));
      
      // حفظ في sessionStorage للجلسة الحالية
      sessionStorage.setItem('currentInvoice', JSON.stringify(orderData));
      
      // حفظ آخر فاتورة
      localStorage.setItem('lastInvoiceData', JSON.stringify(orderData));
      
      console.log('تم حفظ البيانات بنجاح في جميع المواقع');
    } catch (error) {
      console.error('خطأ في الحفظ الإضافي:', error);
    }
    
    // التحقق من حفظ البيانات
    console.log('Saved orders:', JSON.parse(localStorage.getItem('orders') || '[]'));
    
    // استخدام نفس دالة إنشاء الرسالة المستخدمة في الفاتورة
    const message = generateInvoiceText(orderData);
    console.log('WhatsApp message:', message);

    // إضافة رقم المكتبة للرسالة (بدون رابط الفاتورة)
    const messageWithLibraryNumber = `${message}

📞 رقم المكتبة: 01026274235`;

    // إرسال الطلب إلى رقم المكتبة الجديد (بدون رابط الفاتورة)
    const whatsappURL = `https://wa.me/201026274235?text=${encodeURIComponent(messageWithLibraryNumber)}`;
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
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="تأكيد الطلب" 
        onBack={() => setLocation('/payment')}
      />
      
      <div className="p-4 space-y-4">
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-green-800 mb-2">تم تأكيد طلبك بنجاح!</h2>
          <p className="text-green-600">سيتم التواصل معك قريباً لتأكيد موعد التوصيل</p>
          <p className="text-sm text-green-600 mt-2">رقم الطلب: {orderId}</p>
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
                {customerInfo.street}، رقم العقار {customerInfo.buildingNumber}
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
                  <p className="text-gray-600 text-sm">الكمية: {item.quantity} × {item.product.price} جنيه</p>
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

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={downloadInvoice}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            يرجى تنزيل الفاتورة وإرسالها إلى المكتبة
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