import React from 'react';
import { Settings, Info } from 'lucide-react';
import { PrintingOptions as PrintingOptionsType } from '../../types';
import { PRINTING_OPTIONS } from '../../constants/printing';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';

interface PrintingOptionsProps {
  options: PrintingOptionsType;
  onOptionsChange: (options: PrintingOptionsType) => void;
}

const PrintingOptions: React.FC<PrintingOptionsProps> = ({ options, onOptionsChange }) => {
  const handleOptionChange = (key: keyof PrintingOptionsType, value: any) => {
    onOptionsChange({
      ...options,
      [key]: value
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5 text-green-600" />
        خيارات الطباعة
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Print Type */}
        <div className="space-y-3">
          <Label htmlFor="printType" className="text-base font-medium">نوع الطباعة</Label>
          <Select
            value={options.printType}
            onValueChange={(value) => handleOptionChange('printType', value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="اختر نوع الطباعة" />
            </SelectTrigger>
            <SelectContent>
              {PRINTING_OPTIONS.printType.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <span>{option.label}</span>
                    {option.value === 'single' && <span className="text-xs text-gray-500">(كل صفحة في ورقة)</span>}
                    {option.value === 'double' && <span className="text-xs text-gray-500">(صفحتان في ورقة)</span>}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-700">
                {options.printType === 'single' ? 
                  'كل صفحة من الملف ستُطبع في ورقة منفصلة' : 
                  'سيتم طباعة صفحتين في كل ورقة (توفير في التكلفة)'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Color Type */}
        <div className="space-y-3">
          <Label htmlFor="colorType" className="text-base font-medium">لون الطباعة</Label>
          <Select
            value={options.colorType}
            onValueChange={(value) => handleOptionChange('colorType', value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="اختر لون الطباعة" />
            </SelectTrigger>
            <SelectContent>
              {PRINTING_OPTIONS.colorType.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <span>{option.label}</span>
                    {option.value === 'bw' && <span className="text-xs text-gray-500">(أقل تكلفة)</span>}
                    {option.value === 'color' && <span className="text-xs text-gray-500">(جودة أعلى)</span>}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Paper Size */}
        <div className="space-y-3">
          <Label htmlFor="paperSize" className="text-base font-medium">حجم الورق</Label>
          <Select
            value={options.paperSize}
            onValueChange={(value) => handleOptionChange('paperSize', value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="اختر حجم الورق" />
            </SelectTrigger>
            <SelectContent>
              {PRINTING_OPTIONS.paperSize.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <span>{option.label}</span>
                    {option.value === 'a4' && <span className="text-xs text-gray-500">(21×29.7 سم)</span>}
                    {option.value === 'a3' && <span className="text-xs text-gray-500">(29.7×42 سم)</span>}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Paper Type */}
        <div className="space-y-3">
          <Label htmlFor="paperType" className="text-base font-medium">نوع الورق</Label>
          <Select
            value={options.paperType}
            onValueChange={(value) => handleOptionChange('paperType', value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="اختر نوع الورق" />
            </SelectTrigger>
            <SelectContent>
              {PRINTING_OPTIONS.paperType.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <span>{option.label}</span>
                    {option.value === 'normal' && <span className="text-xs text-gray-500">(عادي)</span>}
                    {option.value === 'glossy' && <span className="text-xs text-gray-500">(لامع)</span>}
                    {option.value === 'coated' && <span className="text-xs text-gray-500">(كوشيه)</span>}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Number of Copies */}
        <div className="space-y-3 md:col-span-2">
          <Label htmlFor="copies" className="text-base font-medium">عدد النسخ</Label>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              min="1"
              max="1000"
              value={options.copies}
              onChange={(e) => handleOptionChange('copies', parseInt(e.target.value) || 1)}
              className="w-32 h-12 text-center text-lg font-bold"
            />
            <div className="text-sm text-gray-600">
              نسخة من المستند (كل نسخة تحتوي على جميع الصفحات)
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-3">ملخص الخيارات المختارة:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">النوع:</span>
            <div className="font-medium">{options.printType === 'single' ? 'وجه واحد' : 'وجهين'}</div>
          </div>
          <div>
            <span className="text-gray-600">اللون:</span>
            <div className="font-medium">{options.colorType === 'bw' ? 'أبيض وأسود' : 'ملون'}</div>
          </div>
          <div>
            <span className="text-gray-600">الحجم:</span>
            <div className="font-medium">{options.paperSize.toUpperCase()}</div>
          </div>
          <div>
            <span className="text-gray-600">النسخ:</span>
            <div className="font-medium">{options.copies} نسخة</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintingOptions;