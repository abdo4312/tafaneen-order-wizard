import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Image, Calculator, Eye, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const DocumentPrinting: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [printType, setPrintType] = useState<'single' | 'double'>('single');
  const [paperSize, setPaperSize] = useState<'A4' | 'A3'>('A4');
  const [copies, setCopies] = useState(1);
  const [pageCount, setPageCount] = useState<number | null>(null);

  const prices = {
    A4: { single: 1, double: 0.75 },
    A3: { single: 2, double: 1.5 }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Simulate page count analysis
      setTimeout(() => {
        setPageCount(Math.floor(Math.random() * 20) + 1);
      }, 1000);
    }
  };

  const calculateSheets = () => {
    if (!pageCount) return 0;
    return printType === 'double' ? Math.ceil(pageCount / 2) : pageCount;
  };

  const calculateTotal = () => {
    const sheets = calculateSheets();
    return sheets * prices[paperSize][printType] * copies;
  };

  const getSavings = () => {
    if (!pageCount || printType === 'single') return 0;
    const singleSideSheets = pageCount * copies;
    const doubleSideSheets = calculateSheets() * copies;
    return singleSideSheets - doubleSideSheets;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="طباعة المستندات" 
        onBack={() => navigate('/')}
      />
      
      <div className="p-4 space-y-6" dir="rtl">
        {/* Service Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              خدمة طباعة المستندات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <p>قم بتحميل ملفك (PDF، Word، أو صور) وحدد خيارات الطباعة التالية:</p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-2">نوع الطباعة:</h4>
                <ul className="space-y-1">
                  <li>• وجه واحد</li>
                  <li>• وجهين</li>
                </ul>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-bold text-green-800 mb-2">سيتم تحليل ملفك تلقائياً وعرض:</h4>
                <ul className="space-y-1">
                  <li>• إجمالي عدد الصفحات في الملف</li>
                  <li>• عدد الأوراق المطلوبة للطباعة (بناءً على اختيار وجه/وجهين)</li>
                  <li>• التكلفة الإجمالية للطباعة</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              رفع الملف
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Upload className="w-12 h-12 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">اضغط لرفع الملف</p>
                    <p className="text-sm text-gray-500">PDF, Word, JPG, PNG (حتى 50 ميجابايت)</p>
                  </div>
                </div>
              </label>
            </div>
            
            {selectedFile && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} ميجابايت
                    </p>
                  </div>
                  {pageCount && (
                    <Badge className="mr-auto bg-green-100 text-green-800">
                      {pageCount} صفحة
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Printing Options */}
        {selectedFile && pageCount && (
          <Card>
            <CardHeader>
              <CardTitle>خيارات الطباعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Print Type */}
              <div>
                <label className="block font-medium mb-2">نوع الطباعة</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPrintType('single')}
                    className={`p-3 border rounded-lg text-center ${
                      printType === 'single' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300'
                    }`}
                  >
                    <div className="font-medium">وجه واحد</div>
                    <div className="text-sm text-gray-500">{pageCount} ورقة</div>
                  </button>
                  <button
                    onClick={() => setPrintType('double')}
                    className={`p-3 border rounded-lg text-center ${
                      printType === 'double' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300'
                    }`}
                  >
                    <div className="font-medium">وجهين</div>
                    <div className="text-sm text-gray-500">{calculateSheets()} ورقة</div>
                    {getSavings() > 0 && (
                      <div className="text-xs text-green-600">توفير {getSavings()} ورقة</div>
                    )}
                  </button>
                </div>
              </div>

              {/* Paper Size */}
              <div>
                <label className="block font-medium mb-2">حجم الورق</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaperSize('A4')}
                    className={`p-3 border rounded-lg text-center ${
                      paperSize === 'A4' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300'
                    }`}
                  >
                    A4
                  </button>
                  <button
                    onClick={() => setPaperSize('A3')}
                    className={`p-3 border rounded-lg text-center ${
                      paperSize === 'A3' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300'
                    }`}
                  >
                    A3
                  </button>
                </div>
              </div>

              {/* Copies */}
              <div>
                <label className="block font-medium mb-2">عدد النسخ</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCopies(Math.max(1, copies - 1))}
                    className="w-10 h-10 border rounded-lg flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{copies}</span>
                  <button
                    onClick={() => setCopies(copies + 1)}
                    className="w-10 h-10 border rounded-lg flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Price Calculation */}
        {selectedFile && pageCount && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                حساب التكلفة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>عدد الصفحات:</span>
                  <span>{pageCount} صفحة</span>
                </div>
                <div className="flex justify-between">
                  <span>عدد الأوراق المطلوبة:</span>
                  <span>{calculateSheets()} ورقة</span>
                </div>
                <div className="flex justify-between">
                  <span>سعر الورقة ({paperSize} - {printType === 'single' ? 'وجه واحد' : 'وجهين'}):</span>
                  <span>{prices[paperSize][printType]} جنيه</span>
                </div>
                <div className="flex justify-between">
                  <span>عدد النسخ:</span>
                  <span>{copies}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>الإجمالي:</span>
                  <span>{calculateTotal()} جنيه</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {selectedFile && pageCount && (
          <div className="space-y-3">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 flex items-center justify-center gap-2">
              <Eye className="w-5 h-5" />
              معاينة قبل الطباعة
            </Button>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
              تأكيد الطلب - {calculateTotal()} جنيه
            </Button>
          </div>
        )}

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>ملاحظات مهمة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• يدعم النظام ملفات PDF وWord والصور بصيغ JPG/PNG</p>
              <p>• الحد الأقصى لحجم الملف: 50 ميجابايت</p>
              <p>• سيتم عرض معاينة للملف قبل تأكيد الطباعة</p>
              <p>• الطباعة على وجهين توفر 50% من الأوراق والتكلفة</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentPrinting;