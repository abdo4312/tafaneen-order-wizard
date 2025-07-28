import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ExternalLink, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import Button from '../Button';
import { toast } from '../ui/sonner';

interface PaymentLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod: string;
  totalAmount: number;
}

const PaymentLinksModal: React.FC<PaymentLinksModalProps> = ({
  isOpen,
  onClose,
  paymentMethod,
  totalAmount
}) => {
  const paymentLinks = {
    'vodafone-cash': 'http://vf.eg/vfcash?id=mt&qrId=E9kZZk',
    'ansar-pay': 'https://ipn.eg/S/mosaadhosny7890/instapay/9M8VET'
  };

  const paymentNames = {
    'vodafone-cash': 'فودافون كاش',
    'ansar-pay': 'انستا باي'
  };

  const currentLink = paymentLinks[paymentMethod as keyof typeof paymentLinks];
  const currentName = paymentNames[paymentMethod as keyof typeof paymentNames];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('تم نسخ الرابط بنجاح!');
    }).catch(() => {
      toast.error('فشل في نسخ الرابط');
    });
  };

  const openPaymentLink = () => {
    window.open(currentLink, '_blank');
  };

  if (!currentLink) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
            <CheckCircle className="w-6 h-6" />
            إتمام عملية الدفع
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Amount */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <h3 className="text-lg font-bold text-green-800 mb-2">المبلغ المطلوب</h3>
            <p className="text-3xl font-bold text-green-600">{totalAmount} جنيه</p>
          </div>

          {/* Payment Method */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              طريقة الدفع المختارة: {currentName}
            </h4>
            
            <div className="space-y-3">
              <p className="text-blue-700 text-sm">
                يرجى الضغط على الرابط أدناه لإتمام عملية الدفع بشكل آمن:
              </p>
              
              {/* Payment Link */}
              <div className="bg-white border border-blue-300 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-600 break-all">{currentLink}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={openPaymentLink}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    فتح رابط الدفع
                  </Button>
                  <Button
                    onClick={() => copyToClipboard(currentLink)}
                    variant="outline"
                    className="px-3"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Alternative Payment Option */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-yellow-800 mb-2">في حالة وجود مشكلة</h4>
                <div className="text-yellow-700 text-sm space-y-2">
                  <p>إذا واجهت صعوبة في الوصول لخادم انستا باي، يرجى المحاولة مرة أخرى لاحقاً أو استخدام خيار فودافون كاش البديل.</p>
                  
                  {paymentMethod === 'ansar-pay' && (
                    <div className="mt-3">
                      <p className="font-medium mb-2">رابط فودافون كاش البديل:</p>
                      <Button
                        onClick={() => window.open(paymentLinks['vodafone-cash'], '_blank')}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm"
                      >
                        فتح فودافون كاش
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">تعليمات مهمة:</h4>
            <div className="text-gray-700 text-sm space-y-1">
              <p>• قم بحفظ إيصال المعاملة للمراجعة</p>
              <p>• تأكد من إدخال المبلغ الصحيح: {totalAmount} جنيه</p>
              <p>• في حالة وجود أي مشكلة، تواصل معنا على: 01066334002</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              تم الدفع - متابعة
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="px-6"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentLinksModal;