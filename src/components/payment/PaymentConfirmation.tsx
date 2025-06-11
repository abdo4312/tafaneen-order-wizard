
import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../Button';

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
        onClick={onConfirm}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-bold"
      >
        تأكيد الطلب والدفع
      </Button>
    </div>
  );
};

export default PaymentConfirmation;
