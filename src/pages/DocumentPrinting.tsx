import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer, ShoppingCart } from 'lucide-react';
import Header from '../components/Header';
import DocumentUpload from '../components/printing/DocumentUpload';
import PrintingOptions from '../components/printing/PrintingOptions';
import PriceCalculator from '../components/printing/PriceCalculator';
import Button from '../components/Button';
import { PrintingOptions as PrintingOptionsType, Product } from '../types';
import { PRINTING_PRICES } from '../constants/printing';
import { useCartStore } from '../store/cart-store';
import { toast } from '../components/ui/sonner';
import { FilePageInfo } from '../utils/page-counter';

const DocumentPrinting: React.FC = () => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  
  const [file, setFile] = useState<File | null>(null);
  const [pageInfo, setPageInfo] = useState<FilePageInfo | null>(null);
  const [printingOptions, setPrintingOptions] = useState<PrintingOptionsType>({
    printType: 'single',
    colorType: 'bw',
    paperSize: 'a4',
    paperType: 'normal',
    copies: 1
  });

  const handleFileSelect = (selectedFile: File | null, filePageInfo?: FilePageInfo) => {
    setFile(selectedFile);
    setPageInfo(filePageInfo || null);
  };

  const calculatePrice = () => {
    if (!file || !pageInfo) return 0;
    
    const { printType, colorType, paperSize, paperType, copies } = printingOptions;
    const pricePerPage = PRINTING_PRICES[printType]?.[colorType]?.[paperSize]?.[paperType] || 0;
    
    // حساب التكلفة = عدد الصفحات × سعر الصفحة × عدد النسخ
    return pageInfo.pageCount * pricePerPage * copies;
  };

  const handleConfirmOrder = () => {
    if (!file) {
      toast.error('يرجى رفع ملف أولاً');
      return;
    }

    if (!pageInfo) {
      toast.error('يرجى انتظار انتهاء تحليل الملف');
      return;
    }

    const totalPrice = calculatePrice();
    
    if (totalPrice === 0) {
      toast.error('خطأ في حساب السعر');
      return;
    }

    // Create a product for the printing service
    const printingProduct: Product = {
      id: `print-${Date.now()}`,
      name: `طباعة مستند - ${file.name}`,
      price: totalPrice,
      image: '/placeholder.svg',
      description: `طباعة ${pageInfo.pageCount} صفحة × ${printingOptions.copies} نسخة من ${file.name}`,
      category: 'printing'
    };

    // Add to cart with printing options and file
    addItem(printingProduct, 1);
    
    toast.success(`تم إضافة طلب الطباعة للسلة بنجاح! (${pageInfo.pageCount} صفحة)`);
    
    // Navigate to cart
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header 
        title="طباعة المستندات" 
        onBack={() => navigate('/')}
      />
      
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4">
            <Printer className="w-12 h-12" />
            <div>
              <h1 className="text-2xl font-bold mb-2">خدمة طباعة المستندات</h1>
              <p className="text-blue-100">ارفع ملفك واختر خيارات الطباعة المناسبة</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <DocumentUpload 
          file={file} 
          onFileSelect={handleFileSelect} 
        />

        {/* Options Section */}
        <PrintingOptions 
          options={printingOptions}
          onOptionsChange={setPrintingOptions}
        />

        {/* Price Calculator */}
        <PriceCalculator 
          options={printingOptions}
          file={file}
          pageInfo={pageInfo}
        />

        {/* Action Button */}
        <div className="flex gap-4">
          <Button
            onClick={handleConfirmOrder}
            disabled={!file || !pageInfo}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-bold flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-5 h-5" />
            تأكيد الطلب وإضافة للسلة
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="px-6 py-3 rounded-lg"
          >
            العودة للرئيسية
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-bold text-yellow-800 mb-2">تعليمات مهمة:</h4>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• تأكد من جودة الملف قبل الرفع</li>
            <li>• سيتم حساب السعر بناءً على عدد الصفحات الفعلي في الملف</li>
            <li>• الأسعار شاملة جميع الخدمات</li>
            <li>• سيتم مراجعة الملف قبل الطباعة</li>
            <li>• في حالة وجود مشكلة في الملف سيتم التواصل معك</li>
            <li>• ملفات PDF و Word سيتم حساب صفحاتها تلقائياً</li>
            <li>• كل صورة تُحسب كصفحة واحدة</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DocumentPrinting;