import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, MessageCircle, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import { generateInvoiceHTML, downloadInvoiceHTML, sendInvoiceToWhatsApp } from '../utils/invoice';
import { Order } from '../types';

const Invoice: React.FC = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [invoiceHTML, setInvoiceHTML] = useState<string>('');

  useEffect(() => {
    if (orderId) {
      // محاولة الحصول على الطلب من المتجر المحلي
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        const foundOrder = orders.find((o: Order) => o.id === orderId);
        
        if (foundOrder) {
          setOrder(foundOrder);
          const html = generateInvoiceHTML(foundOrder);
          setInvoiceHTML(html);
          return;
        }
      }
    }

    // إذا لم يوجد الطلب، استخدم البيانات التجريبية
    const mockOrder: Order = {
      id: orderId || `TFN-${Date.now()}`,
      createdAt: new Date(),
      items: [
        {
          product: {
            id: '1',
            name: 'كروت شخصية',
            description: 'كروت شخصية عالية الجودة',
            price: 50,
            image: '/placeholder.svg',
            category: 'cards'
          },
          quantity: 1
        },
        {
          product: {
            id: '2',
            name: 'قلم رصاص فابر كاستل HB كلاسيك',
            description: 'قلم رصاص عالي الجودة من فابر كاستل',
            price: 12,
            image: '/placeholder.svg',
            category: 'pens'
          },
          quantity: 1
        },
        {
          product: {
            id: '3',
            name: 'قلم برافو أسود بزنس',
            description: 'قلم برافو أسود عالي الجودة',
            price: 9,
            image: '/placeholder.svg',
            category: 'pens'
          },
          quantity: 1
        }
      ],
      customerInfo: {
        name: 's',
        phone: '01026274235',
        street: '2',
        buildingNumber: '3',
        floor: '4',
        area: 'البوابة الأولى'
      },
      paymentMethod: 'vodafone_cash',
      subtotal: 71,
      deliveryFee: 20,
      paymentFee: 1,
      total: 92
    };

    setOrder(mockOrder);
    const html = generateInvoiceHTML(mockOrder);
    setInvoiceHTML(html);
  }, [orderId]);

  const handleDownload = () => {
    if (order) {
      downloadInvoiceHTML(order);
    }
  };

  const handleSendWhatsApp = () => {
    if (order) {
      sendInvoiceToWhatsApp(order);
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">جاري تحميل الفاتورة...</h1>
          <p className="text-gray-600">يرجى الانتظار</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 mb-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoBack}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">فاتورة رقم {order.id}</h1>
              <p className="text-sm text-gray-600">مكتبة تفانين</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              تحميل
            </Button>
            <Button
              onClick={handleSendWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              واتساب
            </Button>
          </div>
        </div>
      </div>

      {/* Invoice Preview */}
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <div 
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            dangerouslySetInnerHTML={{ __html: invoiceHTML }}
          />
          
          {/* Additional Actions */}
          <div className="mt-6 bg-white rounded-lg shadow-md p-4">
            <h3 className="font-bold text-lg mb-4">إجراءات إضافية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-800 mb-2">📞 للاستفسارات</h4>
                <p className="text-blue-700 text-sm">
                  رقم المكتبة: <strong>01066334002</strong><br />
                  ساعات العمل: 9 ص - 9 م
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-2">✅ حالة الطلب</h4>
                <p className="text-green-700 text-sm">
                  تم تأكيد الطلب بنجاح<br />
                  سيتم التواصل معك قريباً
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;