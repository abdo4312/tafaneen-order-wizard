import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, MessageCircle, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import InvoiceValidation from '../components/InvoiceValidation';
import { generateInvoiceHTML, downloadInvoiceHTML, sendInvoiceToWhatsApp } from '../utils/invoice';
import { Order } from '../types';

interface LoadingState {
  isLoading: boolean;
  error: string | null;
  retryCount: number;
}

const Invoice: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [invoiceHTML, setInvoiceHTML] = useState<string>('');
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errors: string[] }>({ isValid: true, errors: [] });
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null,
    retryCount: 0
  });

  // دالة استخراج معرف الفاتورة من URL
  const getInvoiceIdFromUrl = (): string | null => {
    // طريقة 1: من مسار URL
    if (orderId) {
      console.log('Invoice ID from URL params:', orderId);
      return orderId;
    }

    // طريقة 2: من معاملات URL
    const urlParams = new URLSearchParams(window.location.search);
    const invoiceIdParam = urlParams.get('id') || urlParams.get('invoice');
    if (invoiceIdParam) {
      console.log('Invoice ID from URL search params:', invoiceIdParam);
      return invoiceIdParam;
    }

    // طريقة 3: من hash
    const hashId = window.location.hash.replace('#', '');
    if (hashId) {
      console.log('Invoice ID from hash:', hashId);
      return hashId;
    }

    console.warn('No invoice ID found in URL');
    return null;
  };

  // دالة التحقق من صحة البيانات (مخففة)
  const validateOrderData = (orderData: Order): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    console.log('Validating order data:', orderData);

    // التحقق الأساسي فقط - ليس صارماً
    if (!orderData.id) {
      errors.push('معرف الطلب مفقود');
    }

    if (!orderData.items || orderData.items.length === 0) {
      errors.push('لا توجد منتجات في الطلب');
    }

    // نقبل أي فاتورة لها ID ومنتجات - حتى لو كان بها بيانات افتراضية
    console.log('Validation result:', { isValid: errors.length === 0, errors });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // دالة تحميل البيانات من localStorage محسنة
  const loadFromLocalStorage = (invoiceId: string): Order | null => {
    try {
      console.log('محاولة تحميل البيانات من localStorage للفاتورة:', invoiceId);
      
      // محاولة 1: البحث بالمعرف المخصص (الطريقة الجديدة)
      const customKey = `invoice_${invoiceId}`;
      const customOrder = localStorage.getItem(customKey);
      if (customOrder) {
        const parsedOrder = JSON.parse(customOrder);
        console.log('تم العثور على الطلب بالمعرف المخصص:', parsedOrder);
        return parsedOrder;
      }

      // محاولة 2: البحث في sessionStorage
      const sessionOrder = sessionStorage.getItem('currentInvoice');
      if (sessionOrder) {
        const parsedOrder = JSON.parse(sessionOrder);
        if (parsedOrder.id === invoiceId) {
          console.log('تم العثور على الطلب في sessionStorage:', parsedOrder);
          return parsedOrder;
        }
      }

      // محاولة 3: البحث في آخر فاتورة محفوظة
      const lastInvoice = localStorage.getItem('lastInvoiceData');
      if (lastInvoice) {
        const parsedOrder = JSON.parse(lastInvoice);
        if (parsedOrder.id === invoiceId) {
          console.log('تم العثور على الطلب في آخر فاتورة محفوظة:', parsedOrder);
          return parsedOrder;
        }
      }
      
      // محاولة 4: البحث بالمعرف المباشر في قائمة الطلبات
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        console.log('الطلبات المحفوظة:', orders.length);
        
        const foundOrder = orders.find((o: Order) => o.id === invoiceId);
        if (foundOrder) {
          console.log('تم العثور على الطلب في localStorage:', foundOrder);
          return foundOrder;
        }
      }

      console.warn('لم يتم العثور على الطلب في localStorage بالمعرف:', invoiceId);
      return null;
    } catch (error) {
      console.error('خطأ في تحميل البيانات من localStorage:', error);
      return null;
    }
  };

  // دالة إنشاء طلب احتياطي - تم تحسينها لتجنب البيانات الخاطئة
  const createFallbackOrder = (invoiceId: string): Order => {
    console.error('⚠️ لم يتم العثور على بيانات الفاتورة:', invoiceId);
    
    // بدلاً من إنشاء بيانات خاطئة، نعيد null ونطلب من المستخدم المحاولة مرة أخرى
    throw new Error('لم يتم العثور على بيانات الفاتورة. يرجى التأكد من صحة الرابط أو المحاولة مرة أخرى.');
  };

  // دالة تحميل البيانات مع آلية fallback محسنة
  const loadInvoiceData = async (invoiceId: string) => {
    console.log('بدء تحميل بيانات الفاتورة:', invoiceId);
    
    setLoadingState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // المحاولة الأولى: localStorage
      const localOrder = loadFromLocalStorage(invoiceId);
      if (localOrder) {
        const validation = validateOrderData(localOrder);
        if (validation.isValid) {
          console.log('تم تحميل بيانات صحيحة من localStorage');
          setOrder(localOrder);
          const html = generateInvoiceHTML(localOrder);
          setInvoiceHTML(html);
          setLoadingState({ isLoading: false, error: null, retryCount: 0 });
          return;
        } else {
          console.warn('البيانات المحملة من localStorage غير صحيحة:', validation.errors);
        }
      }

      // المحاولة الثانية: محاولة تحميل من API (إذا كان متوفراً)
      try {
        const response = await fetch(`/api/invoice/${invoiceId}`);
        if (response.ok) {
          const apiOrder = await response.json();
          const validation = validateOrderData(apiOrder);
          if (validation.isValid) {
            console.log('تم تحميل بيانات صحيحة من API');
            setOrder(apiOrder);
            const html = generateInvoiceHTML(apiOrder);
            setInvoiceHTML(html);
            setLoadingState({ isLoading: false, error: null, retryCount: 0 });
            return;
          }
        }
      } catch (apiError) {
        console.warn('فشل في تحميل البيانات من API:', apiError);
      }

      // إذا لم نجد البيانات، نُظهر رسالة خطأ واضحة بدلاً من إنشاء بيانات خاطئة
      throw new Error('لم يتم العثور على بيانات الفاتورة. يرجى التأكد من صحة الرابط أو التواصل مع المكتبة.');

    } catch (error) {
      console.error('خطأ في تحميل بيانات الفاتورة:', error);
      setLoadingState(prev => ({
        isLoading: false,
        error: 'حدث خطأ في تحميل الفاتورة. يرجى المحاولة مرة أخرى.',
        retryCount: prev.retryCount + 1
      }));
    }
  };

  // دالة إعادة المحاولة
  const handleRetry = () => {
    const invoiceId = getInvoiceIdFromUrl();
    if (invoiceId) {
      loadInvoiceData(invoiceId);
    }
  };

  // دالة إعادة تحميل البيانات
  const handleRefresh = () => {
    const invoiceId = getInvoiceIdFromUrl();
    if (invoiceId) {
      // مسح البيانات المخزنة مؤقتاً
      sessionStorage.removeItem('currentInvoice');
      loadInvoiceData(invoiceId);
    }
  };

  // تحميل البيانات عند تحميل المكون
  useEffect(() => {
    const invoiceId = getInvoiceIdFromUrl();
    if (!invoiceId) {
      setLoadingState({
        isLoading: false,
        error: 'معرف الفاتورة غير موجود في الرابط',
        retryCount: 0
      });
      return;
    }

    loadInvoiceData(invoiceId);
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
    navigate(-1);
  };

  // عرض حالة التحميل
  if (loadingState.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">جاري تحميل الفاتورة...</h2>
          <p className="text-gray-600">يرجى الانتظار</p>
        </div>
      </div>
    );
  }

  // عرض حالة الخطأ
  if (loadingState.error && !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-800 mb-2">خطأ في تحميل الفاتورة</h1>
          <p className="text-gray-600 mb-4">{loadingState.error}</p>
          <div className="space-y-2">
            <Button 
              onClick={handleRetry}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg w-full"
            >
              إعادة المحاولة
            </Button>
            <Button 
              onClick={handleGoBack}
              variant="outline"
              className="w-full"
            >
              العودة للصفحة السابقة
            </Button>
          </div>
          {loadingState.retryCount > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              عدد المحاولات: {loadingState.retryCount}
            </p>
          )}
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
              <h1 className="text-xl font-bold text-gray-800">فاتورة رقم {order?.id}</h1>
              <p className="text-sm text-gray-600">مكتبة تفانين</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              title="تحديث البيانات"
            >
              <RefreshCw className="w-4 h-4" />
              تحديث
            </Button>
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

      {/* Warning Message */}
      {loadingState.error && order && (
        <div className="p-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-yellow-800 mb-1">تنبيه</h4>
                  <p className="text-yellow-700 text-sm">{loadingState.error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Preview */}
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          {/* إضافة مكون التحقق من صحة البيانات */}
          {order && (
            <InvoiceValidation 
              order={order} 
              onValidationResult={(isValid, errors) => setValidationResult({ isValid, errors })}
            />
          )}
          
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

          {/* Debug Info (في بيئة التطوير فقط) */}
          {process.env.NODE_ENV === 'development' && order && (
            <div className="mt-6 bg-gray-100 rounded-lg p-4">
              <h4 className="font-bold text-gray-800 mb-2">معلومات التشخيص</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p>معرف الفاتورة: {order.id}</p>
                <p>تاريخ الإنشاء: {order.createdAt.toString()}</p>
                <p>عدد المنتجات: {order.items.length}</p>
                <p>المجموع: {order.total} جنيه</p>
                <p>عدد المحاولات: {loadingState.retryCount}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invoice;