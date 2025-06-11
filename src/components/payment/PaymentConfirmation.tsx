
import React, { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import Button from '../Button';
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

  const handlePaymentConfirmation = () => {
    if (!transactionNumber.trim()) {
      toast({
        title: "يرجى إدخال رقم العملية",
        variant: "destructive",
      });
      return;
    }

    onConfirm();
  };

  return (
    <div className="p-4 space-y-4">
      {/* Payment Confirmation */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-green-800 text-lg mb-2">تفاصيل الدفع</h3>
            <div className="text-green-700 space-y-2">
              <p><strong>المبلغ المطلوب:</strong> {totalAmount} جنيه</p>
              <p><strong>رقم المحفظة:</strong> 01066334002</p>
              <p><strong>طريقة الدفع:</strong> {selectedMethod === 'vodafone-cash' ? 'فودافون كاش' : 'إنستاباي'}</p>
            </div>
          </div>
        </div>
      </div>

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
            />
            <p className="text-sm text-gray-600 mt-1">
              يرجى إدخال رقم العملية الذي ظهر لك بعد إتمام التحويل
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
              <p>• يجب تحويل المبلغ بالضبط: <strong>{totalAmount} جنيه</strong></p>
              <p>• أي مبلغ مختلف (أكثر أو أقل) سيؤدي إلى رفض الطلب</p>
              <p>• احتفظ برقم العملية لمراجعتها مع المكتبة</p>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handlePaymentConfirmation}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-bold"
      >
        تأكيد الطلب والدفع
      </Button>
    </div>
  );
};

export default PaymentConfirmation;
