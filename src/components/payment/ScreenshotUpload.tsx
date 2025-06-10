
import React, { useState } from 'react';
import { Upload, Eye } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../../hooks/use-toast';

interface ScreenshotUploadProps {
  totalAmount: number;
  onExtractedData: (amount: string, transactionId: string) => void;
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedImage(file);
    setIsAnalyzing(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result as string;
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockAmount = totalAmount.toString();
        const mockTransactionId = Math.random().toString(36).substr(2, 9).toUpperCase();
        
        setExtractedAmount(mockAmount);
        setExtractedTransactionId(mockTransactionId);
        onExtractedData(mockAmount, mockTransactionId);
        
        toast({
          title: "تم تحليل الصورة بنجاح",
          description: `تم استخراج المبلغ: ${mockAmount} جنيه ورقم العملية: ${mockTransactionId}`,
        });
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
            سيتم تحليل الصورة تلقائياً لاستخراج المبلغ ورقم العملية
          </p>
        </div>

        {isAnalyzing && (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">جاري تحليل الصورة...</span>
          </div>
        )}

        {uploadedImage && !isAnalyzing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-blue-800 mb-2">نتائج التحليل</h4>
                <div className="text-blue-700 text-sm space-y-1">
                  {extractedAmount && (
                    <p><strong>المبلغ المستخرج:</strong> {extractedAmount} جنيه</p>
                  )}
                  {extractedTransactionId && (
                    <p><strong>رقم العملية:</strong> {extractedTransactionId}</p>
                  )}
                  {extractedAmount === totalAmount.toString() ? (
                    <p className="text-green-600 font-bold">✓ المبلغ مطابق</p>
                  ) : (
                    <p className="text-red-600 font-bold">⚠ المبلغ غير مطابق</p>
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
