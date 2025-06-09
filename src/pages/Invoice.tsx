
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, MessageCircle } from 'lucide-react';
import Button from '../components/Button';
import { generateInvoiceHTML, downloadInvoiceHTML, sendInvoiceToWhatsApp } from '../utils/invoice';
import { Order } from '../types';

const Invoice: React.FC = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [invoiceHTML, setInvoiceHTML] = useState<string>('');

  useEffect(() => {
    // في التطبيق الحقيقي، ستحصل على بيانات الطلب من قاعدة البيانات
    // هنا سنستخدم بيانات تجريبية
    const mockOrder: Order = {
      id: orderId || `INV-${Date.now()}`,
      createdAt: new Date(),
      items: [
        {
          product: {
            id: '1',
            name: 'طباعة بنر',
            description: 'بنر إعلاني عالي الجودة',
            price: 50,
            image: '/placeholder.svg'
          },
          quantity: 2,
          color: 'أزرق',
          size: '2x1 متر'
        }
      ],
      customerInfo: {
        name: 'أحمد محمد',
        phone: '01234567890',
        street: 'شارع الهرم',
        buildingNumber: '123',
        floor: '2',
        area: 'البوابة الأولى'
      },
      paymentMethod: 'cod',
      subtotal: 100,
      deliveryFee: 20,
      paymentFee: 0,
      total: 120
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

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">جاري تحميل الفاتورة...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">فاتورة رقم {order.id}</h1>
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
        <div 
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          dangerouslySetInnerHTML={{ __html: invoiceHTML }}
        />
      </div>
    </div>
  );
};

export default Invoice;
