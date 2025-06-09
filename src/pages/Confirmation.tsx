
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Download, MessageSquare } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import { useCartStore } from '../store/cart-store';
import { useCheckoutStore } from '../store/checkout-store';
import { generateInvoiceText, sendInvoiceToWhatsApp, downloadInvoiceHTML } from '../utils/invoice';
import { DELIVERY_AREAS, PAYMENT_METHODS } from '../constants/locations';
import { Order } from '../types';

const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { customerInfo, paymentMethod, reset } = useCheckoutStore();
  
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!customerInfo.name || !paymentMethod) {
      navigate('/');
      return;
    }

    const subtotal = getSubtotal();
    const deliveryArea = DELIVERY_AREAS.find(area => area.name === customerInfo.area);
    const deliveryFee = deliveryArea ? deliveryArea.price : 0;
    
    const selectedPaymentMethod = PAYMENT_METHODS.find(method => method.id === paymentMethod);
    const paymentFee = selectedPaymentMethod ? Math.round(subtotal * selectedPaymentMethod.feePercentage / 100) : 0;
    
    const newOrder: Order = {
      id: `INV-${Date.now()}`,
      items,
      customerInfo,
      paymentMethod,
      deliveryFee,
      paymentFee,
      subtotal,
      total: subtotal + deliveryFee + paymentFee,
      createdAt: new Date()
    };

    setOrder(newOrder);
  }, [customerInfo, paymentMethod, items]);

  const handleSendWhatsApp = () => {
    if (order) {
      sendInvoiceToWhatsApp(order);
    }
  };

  const handleDownloadInvoice = () => {
    if (order) {
      downloadInvoiceHTML(order);
    }
  };

  const handleNewOrder = () => {
    clearCart();
    reset();
    navigate('/');
  };

  if (!order) {
    return null;
  }

  const paymentMethodName = PAYMENT_METHODS.find(method => method.id === paymentMethod)?.name || '';

  return (
    <div className="min-h-screen bg-background">
      <Header title="تأكيد الطلب" />
      
      <div className="p-6 max-w-md mx-auto">
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-green-800 mb-2">تم تأكيد طلبك بنجاح!</h2>
          <p className="text-green-600">رقم الطلب: {order.id}</p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">تفاصيل الطلب</h3>
          
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span>العميل:</span>
              <span>{customerInfo.name}</span>
            </div>
            <div className="flex justify-between">
              <span>الهاتف:</span>
              <span>{customerInfo.phone}</span>
            </div>
            <div className="flex justify-between">
              <span>العنوان:</span>
              <span>{customerInfo.street} - عقار {customerInfo.buildingNumber} - الدور {customerInfo.floor}</span>
            </div>
            <div className="flex justify-between">
              <span>المنطقة:</span>
              <span>{customerInfo.area}</span>
            </div>
            <div className="flex justify-between">
              <span>طريقة الدفع:</span>
              <span>{paymentMethodName}</span>
            </div>
          </div>

          <hr className="my-4" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>إجمالي المنتجات:</span>
              <span>{order.subtotal} جنيه</span>
            </div>
            <div className="flex justify-between">
              <span>رسوم التوصيل:</span>
              <span>{order.deliveryFee} جنيه</span>
            </div>
            {order.paymentFee > 0 && (
              <div className="flex justify-between text-red-600">
                <span>رسوم الدفع:</span>
                <span>{order.paymentFee} جنيه</span>
              </div>
            )}
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>الإجمالي:</span>
              <span className="text-red-600">{order.total} جنيه</span>
            </div>
          </div>
        </div>

        {/* Invoice Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">إرسال الفاتورة</h3>
          
          <div className="space-y-3">
            <Button
              onClick={handleSendWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              إرسال إلى المكتبة عبر واتساب
            </Button>
            
            <Button
              onClick={handleDownloadInvoice}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              تحميل الفاتورة (HTML)
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 mt-4 text-center">
            سيتم إرسال الفاتورة بشكل منسق ومفصل للمكتبة
          </p>
        </div>

        <Button
          onClick={handleNewOrder}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"
        >
          طلب جديد
        </Button>
      </div>
    </div>
  );
};

export default Confirmation;
