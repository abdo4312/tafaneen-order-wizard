
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface PaymentInstructionsProps {
  selectedMethod: string;
  totalAmount: number;
}

const PaymentInstructions: React.FC<PaymentInstructionsProps> = ({
  selectedMethod,
  totalAmount
}) => {
  if (selectedMethod !== 'vodafone-cash' && selectedMethod !== 'ansar-pay') {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
        <div>
          <h4 className="font-bold text-blue-800 mb-2">تعليمات الدفع الإلكتروني</h4>
          <div className="text-blue-700 text-sm space-y-2">
            <p><strong>1.</strong> قم بتحويل المبلغ المطلوب: <span className="font-bold">{totalAmount} جنيه</span></p>
            <p><strong>2.</strong> رقم المحفظة: <span className="font-bold">01066334002</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInstructions;
