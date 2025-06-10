
import React, { useState } from 'react';
import { Upload, Eye, AlertTriangle } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../../hooks/use-toast';

interface ScreenshotUploadProps {
  totalAmount: number;
  onExtractedData: (amount: string, transactionId: string, isValid: boolean) => void;
}

const ScreenshotUpload: React.FC<ScreenshotUploadProps> = ({
  totalAmount,
  onExtractedData
}) => {
  const { toast } = useToast();
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [extractedAmount, setExtractedAmount] = useState<string>('');
  const [extractedTransactionId, setExtractedTransactionId] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const isAmountValid = (amount: string): boolean => {
    const numericAmount = parseFloat(amount);
    return numericAmount === totalAmount;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedImage(file);
    setIsAnalyzing(true);
    setAnalysisComplete(false);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result as string;
        
        // محاكاة تحليل الصورة
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // في التطبيق الحقيقي، هنا سيتم استخدام API لتحليل الصورة
        // الآن سنحاكي نتائج مختلفة للاختبار
        const mockAmount = Math.random() > 0.5 ? totalAmount.toString() : (totalAmount + 10).toString();
        const mockTransactionId = Math.random().toString(36).substr(2, 9).toUpperCase();
        
        setExtractedAmount(mockAmount);
        setExtractedTransactionId(mockTransactionId);
        setAnalysisComplete(true);
        
        const isValid = isAmountValid(mockAmount);
        onExtractedData(mockAmount, mockTransactionId, isValid);
        
        if (isValid) {
          toast({
            title: "تم تحليل الصورة بنجاح",
            description: `تم استخراج المبلغ: ${mockAmount} جنيه ورقم العملية: ${mockTransactionId}`,
          });
        } else {
          toast({
            title: "تحذير: عدم تطابق المبلغ",
            description: `المبلغ في الصورة (${mockAmount}) لا يطابق المبلغ المطلوب (${totalAmount})`,
            variant: "destructive",
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "خطأ في تحليل الصورة",
        description: "حدث خطأ أثناء تحليل لقطة الشاشة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5" />
        تحميل لقطة شاشة التحويل (اختياري)
      </h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="screenshot" className="block text-sm font-medium text-gray-700 mb-2">
            اختر لقطة شاشة من عملية التحويل
          </Label>
          <Input
            id="screenshot"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full"
          />
          <p className="text-sm text-gray-600 mt-1">
            سيتم تحليل الصورة تلقائياً لاستخراج المبلغ ورقم العملية والتحقق من صحة المبلغ
          </p>
        </div>

        {isAnalyzing && (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">جاري تحليل الصورة...</span>
          </div>
        )}

        {uploadedImage && analysisComplete && (
          <div className={`border rounded-lg p-3 ${
            isAmountValid(extractedAmount) 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              {isAmountValid(extractedAmount) ? (
                <Eye className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
              )}
              <div>
                <h4 className={`font-bold mb-2 ${
                  isAmountValid(extractedAmount) ? 'text-green-800' : 'text-red-800'
                }`}>
                  نتائج التحليل
                </h4>
                <div className={`text-sm space-y-1 ${
                  isAmountValid(extractedAmount) ? 'text-green-700' : 'text-red-700'
                }`}>
                  {extractedAmount && (
                    <p><strong>المبلغ المستخرج:</strong> {extractedAmount} جنيه</p>
                  )}
                  <p><strong>المبلغ المطلوب:</strong> {totalAmount} جنيه</p>
                  {extractedTransactionId && (
                    <p><strong>رقم العملية:</strong> {extractedTransactionId}</p>
                  )}
                  
                  {isAmountValid(extractedAmount) ? (
                    <p className="text-green-600 font-bold">✓ المبلغ مطابق - يمكن المتابعة</p>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-red-600 font-bold">⚠ المبلغ غير مطابق</p>
                      <p className="text-red-600 text-xs">
                        يجب أن يكون المبلغ مطابقاً تماماً للمبلغ المطلوب. 
                        لا يمكن المتابعة مع مبلغ مختلف.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreenshotUpload;
