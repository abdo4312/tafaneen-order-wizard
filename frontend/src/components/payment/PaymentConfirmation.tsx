import React, { useState } from 'react';
import { CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import Button from '../Button';
import PaymentLinksModal from './PaymentLinksModal';

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
  const [showPaymentLinks, setShowPaymentLinks] = useState(false);

  const handlePaymentClick = () => {
    if (selectedMethod === 'vodafone-cash' || selectedMethod === 'ansar-pay') {
      setShowPaymentLinks(true);
    } else {
      onConfirm();
    }
  };

  const handlePaymentComplete = () => {
    setShowPaymentLinks(false);
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
              <p><strong>طريقة الدفع:</strong> {selectedMethod === 'vodafone-cash' ? 'فودافون كاش' : 'انستا باي'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-blue-800 mb-2">تعليمات الدفع الإلكتروني</h4>
            <div className="text-blue-700 text-sm space-y-2">
              <p>• سيتم توجيهك لرابط الدفع الآمن</p>
              <p>• تأكد من إدخال المبلغ بالضبط: <strong>{totalAmount} جنيه</strong></p>
              <p>• احتفظ بإيصال المعاملة للمراجعة</p>
              <p>• في حالة وجود مشكلة، جرب الطريقة البديلة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Action */}
      <div className="space-y-3">
        <Button
          onClick={handlePaymentClick}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-bold flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-5 h-5" />
          الانتقال لصفحة الدفع
        </Button>

        <Button
          onClick={onBack}
          variant="outline"
          className="w-full py-3 rounded-lg"
        >
          العودة لتغيير طريقة الدفع
        </Button>
      </div>

      {/* Payment Links Modal */}
      <PaymentLinksModal
        isOpen={showPaymentLinks}
        onClose={handlePaymentComplete}
        paymentMethod={selectedMethod}
        totalAmount={totalAmount}
      />
    </div>
  );
};

export default PaymentConfirmation;