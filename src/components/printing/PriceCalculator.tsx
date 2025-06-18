import React from 'react';
import { Calculator } from 'lucide-react';
import { PrintingOptions } from '../../types';
import { PRINTING_PRICES, PRINTING_OPTIONS } from '../../constants/printing';

interface PriceCalculatorProps {
  options: PrintingOptions;
  file: File | null;
}

const PriceCalculator: React.FC<PriceCalculatorProps> = ({ options, file }) => {
  const calculatePrice = () => {
    if (!file) return 0;
    
    const { printType, colorType, paperSize, paperType, copies } = options;
    const pricePerPage = PRINTING_PRICES[printType]?.[colorType]?.[paperSize]?.[paperType] || 0;
    
    return pricePerPage * copies;
  };

  const getOptionLabel = (category: string, value: string) => {
    const optionGroup = PRINTING_OPTIONS[category as keyof typeof PRINTING_OPTIONS];
    const option = optionGroup?.find(opt => opt.value === value);
    return option?.label || value;
  };

  const totalPrice = calculatePrice();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-purple-600" />
        حساب التكلفة
      </h3>
      
      {file ? (
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3">تفاصيل الطلب:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>الملف:</span>
                <span className="font-medium">{file.name}</span>
              </div>
              <div className="flex justify-between">
                <span>نوع الطباعة:</span>
                <span className="font-medium">{getOptionLabel('printType', options.printType)}</span>
              </div>
              <div className="flex justify-between">
                <span>لون الطباعة:</span>
                <span className="font-medium">{getOptionLabel('colorType', options.colorType)}</span>
              </div>
              <div className="flex justify-between">
                <span>حجم الورق:</span>
                <span className="font-medium">{getOptionLabel('paperSize', options.paperSize)}</span>
              </div>
              <div className="flex justify-between">
                <span>نوع الورق:</span>
                <span className="font-medium">{getOptionLabel('paperType', options.paperType)}</span>
              </div>
              <div className="flex justify-between">
                <span>عدد النسخ:</span>
                <span className="font-medium">{options.copies}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-green-800">السعر الإجمالي:</span>
              <span className="text-2xl font-bold text-green-600">{totalPrice} جنيه</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              {PRINTING_PRICES[options.printType]?.[options.colorType]?.[options.paperSize]?.[options.paperType] || 0} جنيه × {options.copies} نسخة
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <Calculator className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p>يرجى رفع ملف أولاً لحساب التكلفة</p>
        </div>
      )}
    </div>
  );
};

export default PriceCalculator;