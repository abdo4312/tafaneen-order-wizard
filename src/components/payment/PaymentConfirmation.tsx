
import React, { useState } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import Button from '../Button';
import ScreenshotUpload from './ScreenshotUpload';
import { useToast } from '../../hooks/use-toast';

interface PaymentConfirmationProps {
  selectedMethod: string;
  totalAmount: number;
  onBack: () => void;
  onConfirm: () => void;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  selectedMethod,
  totalAmount,
  onBack,
  onConfirm
}) => {
  const { toast } = useToast();
  const [transactionNumber, setTransactionNumber] = useState('');
  const [extractedAmount, setExtractedAmount] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState(false);
  const [isAmountValid, setIsAmountValid] = useState(true);

  const handleExtractedData = (amount: string, transactionId: string, isValid: boolean) => {
    setExtractedAmount(amount);
    setTransactionNumber(transactionId);
    setUploadedImage(true);
    setIsAmountValid(isValid);
  };

  const handlePaymentConfirmation = () => {
    if (!transactionNumber.trim()) {
      toast({
        title: "يرجى إدخال رقم العملية",
        variant: "destructive",
      });
      return;
    }

    // التحقق من صحة المبلغ إذا تم تحميل صورة
    if (extractedAmount && !isAmountValid) {
      toast({
        title: "لا يمكن إكمال العملية",
        description: `المبلغ في الصورة (${extractedAmount}) لا يطابق المبلغ المطلوب (${totalAmount}). يجب أن يكون المبلغ مطابقاً تماماً.`,
        variant: "destructive",
      });
      return;
    }

    // إذا تم تحميل صورة والمبلغ غير صحيح، منع المتابعة
    if (uploadedImage && extractedAmount && parseFloat(extractedAmount) !== totalAmount) {
      toast({
        title: "عذراً، لا يمكن المتابعة",
        description: "المبلغ المحول غير مطابق للمبلغ المطلوب. يجب أن يكون المبلغ مطابقاً تماماً للمتابعة.",
        variant: "destructive",
      });
      return;
    }

    onConfirm();
  };

  const canProceed = !uploadedImage || (uploadedImage && isAmountValid);

  return (
    <div className="p-4 space-y-4">
      {/* Payment Confirmation */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-green-800 text-lg mb-2">تم إرسال تفاصيل الدفع</h3>
            <div className="text-green-700 space-y-2">
              <p><strong>المبلغ المطلوب:</strong> {totalAmount} جنيه</p>
              <p><strong>رقم المحفظة:</strong> 01066334002</p>
              <p><strong>طريقة الدفع:</strong> {selectedMethod === 'vodafone-cash' ? 'فودافون كاش' : 'إنستاباي'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot Upload */}
      <ScreenshotUpload
        totalAmount={totalAmount}
        onExtractedData={handleExtractedData}
      />

      {/* Amount Validation Warning */}
      {uploadedImage && !isAmountValid && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-red-800 mb-2">تحذير: عدم تطابق المبلغ</h4>
              <div className="text-red-700 text-sm space-y-2">
                <p>المبلغ في لقطة الشاشة لا يطابق المبلغ المطلوب.</p>
                <p><strong>المبلغ المطلوب:</strong> {totalAmount} جنيه</p>
                <p><strong>المبلغ الموجود:</strong> {extractedAmount} جنيه</p>
                <p className="font-bold">لا يمكن المتابعة حتى يتم تحويل المبلغ الصحيح.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Number Input */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-bold text-lg mb-4">تأكيد الدفع</h3>
        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              رقم العملية / Transaction ID
            </Label>
            <Input
              type="text"
              value={transactionNumber}
              onChange={(e) => setTransactionNumber(e.target.value)}
              placeholder="أدخل رقم العملية هنا"
              className="w-full"
              disabled={uploadedImage && !isAmountValid}
            />
            <p className="text-sm text-gray-600 mt-1">
              {uploadedImage 
                ? (isAmountValid 
                    ? "تم ملء الحقل تلقائياً من الصورة، يمكنك التعديل إذا لزم الأمر"
                    : "لا يمكن المتابعة - المبلغ غير مطابق"
                  )
                : "يرجى إدخال رقم العملية الذي ظهر لك بعد إتمام التحويل"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-blue-800 mb-2">تعليمات مهمة</h4>
            <div className="text-blue-700 text-sm space-y-2">
              <p>• تأكد من إتمام التحويل بالمبلغ الصحيح: <strong>{totalAmount} جنيه</strong></p>
              <p>• يجب أن يكون المبلغ مطابقاً تماماً - لا أكثر ولا أقل</p>
              <p>• احتفظ برقم العملية لمراجعتها مع المكتبة</p>
              <p>• يفضل تحميل لقطة شاشة لتسريع عملية التحقق</p>
              <p>• سيتم التحقق من الدفع قبل تجهيز الطلب</p>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handlePaymentConfirmation}
        disabled={!canProceed}
        className={`w-full py-3 rounded-lg text-lg font-bold ${
          canProceed 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
        }`}
      >
        {canProceed ? 'تأكيد الطلب والدفع' : 'لا يمكن المتابعة - المبلغ غير مطابق'}
      </Button>
    </div>
  );
};

export default PaymentConfirmation;
