import React from 'react';
import { Calculator, FileText, Printer, DollarSign } from 'lucide-react';
import { PrintingOptions } from '../../types';
import { PRINTING_PRICES, PRINTING_OPTIONS } from '../../constants/printing';
import { FilePageInfo, formatFileType } from '../../utils/page-counter';

interface PriceCalculatorProps {
  options: PrintingOptions;
  file: File | null;
  pageInfo?: FilePageInfo;
}

const PriceCalculator: React.FC<PriceCalculatorProps> = ({ options, file, pageInfo }) => {
  const calculatePrice = () => {
    if (!file || !pageInfo) return 0;
    
    const { printType, colorType, paperSize, paperType, copies } = options;
    const pricePerPage = PRINTING_PRICES[printType]?.[colorType]?.[paperSize]?.[paperType] || 0;
    
    // حساب التكلفة = عدد الصفحات × سعر الصفحة × عدد النسخ
    return pageInfo.pageCount * pricePerPage * copies;
  };

  const calculateSheetsRequired = () => {
    if (!pageInfo) return 0;
    
    if (options.printType === 'single') {
      return pageInfo.pageCount; // كل صفحة تحتاج ورقة منفصلة
    } else {
      return Math.ceil(pageInfo.pageCount / 2); // صفحتان في كل ورقة
    }
  };

  const getOptionLabel = (category: string, value: string) => {
    const optionGroup = PRINTING_OPTIONS[category as keyof typeof PRINTING_OPTIONS];
    const option = optionGroup?.find(opt => opt.value === value);
    return option?.label || value;
  };

  const totalPrice = calculatePrice();
  const sheetsRequired = calculateSheetsRequired();
  const pricePerPage = PRINTING_PRICES[options.printType]?.[options.colorType]?.[options.paperSize]?.[options.paperType] || 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-purple-600" />
        حساب التكلفة
      </h3>
      
      {file && pageInfo ? (
        <div className="space-y-4">
          {/* File Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              معلومات الملف
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-700">اسم الملف:</span>
                  <span className="font-medium text-blue-900 truncate max-w-48" title={file.name}>
                    {file.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">نوع الملف:</span>
                  <span className="font-medium text-blue-900">{formatFileType(pageInfo.fileType)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-700">عدد الصفحات:</span>
                  <span className="font-bold text-lg text-blue-600">{pageInfo.pageCount} صفحة</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">الأوراق المطلوبة:</span>
                  <span className="font-bold text-lg text-blue-600">{sheetsRequired} ورقة</span>
                </div>
              </div>
            </div>
          </div>

          {/* Printing Options Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
              <Printer className="w-4 h-4" />
              خيارات الطباعة المختارة
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-green-700">النوع:</span>
                <div className="font-medium text-green-900">{getOptionLabel('printType', options.printType)}</div>
              </div>
              <div>
                <span className="text-green-700">اللون:</span>
                <div className="font-medium text-green-900">{getOptionLabel('colorType', options.colorType)}</div>
              </div>
              <div>
                <span className="text-green-700">الحجم:</span>
                <div className="font-medium text-green-900">{getOptionLabel('paperSize', options.paperSize)}</div>
              </div>
              <div>
                <span className="text-green-700">النوع:</span>
                <div className="font-medium text-green-900">{getOptionLabel('paperType', options.paperType)}</div>
              </div>
            </div>
          </div>
          
          {/* Price Calculation */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              تفاصيل الحساب
            </h4>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded p-3 text-center">
                  <div className="text-purple-700 text-xs mb-1">سعر الصفحة الواحدة</div>
                  <div className="font-bold text-lg text-purple-600">{pricePerPage} جنيه</div>
                </div>
                <div className="bg-white rounded p-3 text-center">
                  <div className="text-purple-700 text-xs mb-1">عدد الصفحات</div>
                  <div className="font-bold text-lg text-purple-600">{pageInfo.pageCount}</div>
                </div>
                <div className="bg-white rounded p-3 text-center">
                  <div className="text-purple-700 text-xs mb-1">عدد النسخ</div>
                  <div className="font-bold text-lg text-purple-600">{options.copies}</div>
                </div>
              </div>
              
              <div className="bg-white rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-purple-700 font-medium">المعادلة:</span>
                  <span className="font-mono text-purple-800">
                    {pageInfo.pageCount} × {pricePerPage} × {options.copies} = {totalPrice} جنيه
                  </span>
                </div>
                <div className="text-xs text-purple-600">
                  (عدد الصفحات × سعر الصفحة × عدد النسخ)
                </div>
              </div>
            </div>
          </div>
          
          {/* Total Price */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white text-center">
            <div className="text-lg font-medium mb-2">السعر الإجمالي</div>
            <div className="text-4xl font-bold mb-2">{totalPrice} جنيه</div>
            <div className="text-green-100 text-sm">
              {sheetsRequired} ورقة × {options.copies} نسخة = {sheetsRequired * options.copies} ورقة إجمالي
            </div>
          </div>

          {/* Savings Information */}
          {options.printType === 'double' && pageInfo.pageCount > 1 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">💡 توفير في التكلفة</h4>
              <div className="text-sm text-yellow-700">
                باختيار الطباعة على وجهين، وفرت {pageInfo.pageCount - sheetsRequired} ورقة!
                <br />
                <span className="text-xs">
                  (بدلاً من {pageInfo.pageCount} ورقة، ستحتاج فقط {sheetsRequired} ورقة)
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12">
          <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">يرجى رفع ملف أولاً</h4>
          <p className="text-sm">سيتم حساب التكلفة تلقائياً بعد تحليل الملف</p>
          {file && !pageInfo && (
            <div className="mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-blue-600">جاري تحليل الملف...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PriceCalculator;