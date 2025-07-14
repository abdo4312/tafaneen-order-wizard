import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer, ShoppingCart, FileText, Calculator } from 'lucide-react';
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

  const calculateSheetsRequired = () => {
    if (!pageInfo) return 0;
    
    if (printingOptions.printType === 'single') {
      return pageInfo.pageCount; // كل صفحة تحتاج ورقة منفصلة
    } else {
      return Math.ceil(pageInfo.pageCount / 2); // صفحتان في كل ورقة
    }
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

    const sheetsRequired = calculateSheetsRequired();
    const printTypeText = printingOptions.printType === 'single' ? 'وجه واحد' : 'وجهين';
    const colorTypeText = printingOptions.colorType === 'bw' ? 'أبيض وأسود' : 'ملون';

    // Create a product for the printing service
    const printingProduct: Product = {
      id: `print-${Date.now()}`,
      name: `طباعة مستند - ${file.name}`,
      price: totalPrice,
      image: '/placeholder.svg',
      description: `طباعة ${pageInfo.pageCount} صفحة (${sheetsRequired} ورقة) × ${printingOptions.copies} نسخة - ${printTypeText} - ${colorTypeText}`,
      category: 'printing'
    };

    // Add to cart with printing options and file
    addItem(printingProduct, 1);
    
    toast.success(`تم إضافة طلب الطباعة للسلة بنجاح! (${pageInfo.pageCount} صفحة، ${sheetsRequired} ورقة)`);
    
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

        {/* Service Description */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            كيفية استخدام الخدمة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-gray-800 mb-3">📁 الملفات المدعومة:</h4>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• ملفات PDF</li>
                <li>• مستندات Word (.doc, .docx)</li>
                <li>• الصور (JPG, PNG)</li>
                <li>• الحد الأقصى: 50 ميجابايت</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-3">⚙️ خيارات الطباعة:</h4>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• <strong>وجه واحد:</strong> كل صفحة في ورقة منفصلة</li>
                <li>• <strong>وجهين:</strong> صفحتان في كل ورقة</li>
                <li>• أبيض وأسود أو ملون</li>
                <li>• أحجام مختلفة (A4, A3)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <DocumentUpload 
          file={file} 
          onFileSelect={handleFileSelect} 
        />

        {/* File Analysis Results */}
        {file && pageInfo && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-800">
              <Calculator className="w-5 h-5" />
              نتائج تحليل الملف
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{pageInfo.pageCount}</div>
                <div className="text-sm text-gray-600">إجمالي الصفحات</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">{calculateSheetsRequired()}</div>
                <div className="text-sm text-gray-600">
                  الأوراق المطلوبة
                  <br />
                  <span className="text-xs">({printingOptions.printType === 'single' ? 'وجه واحد' : 'وجهين'})</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">{calculatePrice()}</div>
                <div className="text-sm text-gray-600">التكلفة الإجمالية (جنيه)</div>
              </div>
            </div>
          </div>
        )}

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
          <h4 className="font-bold text-yellow-800 mb-2">📋 ملاحظات مهمة:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• تأكد من جودة الملف قبل الرفع</li>
              <li>• سيتم حساب السعر بناءً على عدد الصفحات الفعلي</li>
              <li>• الأسعار شاملة جميع الخدمات</li>
              <li>• سيتم مراجعة الملف قبل الطباعة</li>
            </ul>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• في حالة وجود مشكلة سيتم التواصل معك</li>
              <li>• ملفات PDF و Word: حساب تلقائي للصفحات</li>
              <li>• الصور: كل صورة = صفحة واحدة</li>
              <li>• الطباعة على وجهين توفر في التكلفة</li>
            </ul>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-bold text-blue-800 mb-3">💰 معلومات الأسعار:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-blue-700 mb-2">طباعة أبيض وأسود (A4):</h5>
              <ul className="text-blue-600 space-y-1">
                <li>• وجه واحد: 1 جنيه/صفحة</li>
                <li>• وجهين: 1.5 جنيه/صفحة</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-blue-700 mb-2">طباعة ملونة (A4):</h5>
              <ul className="text-blue-600 space-y-1">
                <li>• وجه واحد: 3 جنيه/صفحة</li>
                <li>• وجهين: 4 جنيه/صفحة</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPrinting;