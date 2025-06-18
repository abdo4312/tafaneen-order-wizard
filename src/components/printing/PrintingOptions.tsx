import React from 'react';
import { Settings } from 'lucide-react';
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Print Type */}
        <div className="space-y-2">
          <Label htmlFor="printType">نوع الطباعة</Label>
          <Select
            value={options.printType}
            onValueChange={(value) => handleOptionChange('printType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر نوع الطباعة" />
            </SelectTrigger>
            <SelectContent>
              {PRINTING_OPTIONS.printType.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color Type */}
        <div className="space-y-2">
          <Label htmlFor="colorType">لون الطباعة</Label>
          <Select
            value={options.colorType}
            onValueChange={(value) => handleOptionChange('colorType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر لون الطباعة" />
            </SelectTrigger>
            <SelectContent>
              {PRINTING_OPTIONS.colorType.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Paper Size */}
        <div className="space-y-2">
          <Label htmlFor="paperSize">حجم الورق</Label>
          <Select
            value={options.paperSize}
            onValueChange={(value) => handleOptionChange('paperSize', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر حجم الورق" />
            </SelectTrigger>
            <SelectContent>
              {PRINTING_OPTIONS.paperSize.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Paper Type */}
        <div className="space-y-2">
          <Label htmlFor="paperType">نوع الورق</Label>
          <Select
            value={options.paperType}
            onValueChange={(value) => handleOptionChange('paperType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر نوع الورق" />
            </SelectTrigger>
            <SelectContent>
              {PRINTING_OPTIONS.paperType.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Number of Copies */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="copies">عدد النسخ</Label>
          <Input
            type="number"
            min="1"
            max="1000"
            value={options.copies}
            onChange={(e) => handleOptionChange('copies', parseInt(e.target.value) || 1)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PrintingOptions;