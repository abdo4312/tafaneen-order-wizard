
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import Button from '../Button';
import { useToast } from '../../hooks/use-toast';
import { Mail, ArrowRight, RefreshCw } from 'lucide-react';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerificationSuccess: () => void;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({ 
  isOpen, 
  onClose, 
  email, 
  onVerificationSuccess 
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { toast } = useToast();

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationEmail = async () => {
    const code = generateVerificationCode();
    setSentCode(code);
    
    // محاكاة إرسال الإيميل - في التطبيق الحقيقي ستحتاج EmailJS أو خدمة أخرى
    console.log(`رمز التحقق المرسل إلى ${email}: ${code}`);
    
    toast({
      title: "تم إرسال رمز التحقق",
      description: `تم إرسال رمز مكون من 6 أرقام إلى ${email}`,
    });

    // بدء العد التنازلي لإعادة الإرسال
    setResendCooldown(60);
  };

  useEffect(() => {
    if (isOpen && !sentCode) {
      sendVerificationEmail();
    }
  }, [isOpen]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "رمز غير صحيح",
        description: "يرجى إدخال رمز مكون من 6 أرقام",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    // محاكاة التحقق - في التطبيق الحقيقي ستتحقق من الكود مع الخادم
    if (verificationCode === sentCode) {
      toast({
        title: "تم التحقق بنجاح",
        description: "تم تأكيد بريدك الإلكتروني بنجاح",
      });
      onVerificationSuccess();
      onClose();
    } else {
      toast({
        title: "رمز التحقق خاطئ",
        description: "يرجى التحقق من الرمز والمحاولة مرة أخرى",
        variant: "destructive"
      });
    }

    setLoading(false);
  };

  const handleResend = () => {
    if (resendCooldown === 0) {
      sendVerificationEmail();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
            <Mail className="w-6 h-6 text-red-600" />
            تأكيد البريد الإلكتروني
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-gray-600">
              تم إرسال رمز التحقق المكون من 6 أرقام إلى:
            </p>
            <p className="font-bold text-red-600 mt-1">{email}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verification-code">رمز التحقق</Label>
            <Input
              id="verification-code"
              type="text"
              placeholder="أدخل الرمز المكون من 6 أرقام"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-2xl font-mono tracking-widest"
              maxLength={6}
            />
          </div>

          <Button
            onClick={handleVerify}
            disabled={loading || verificationCode.length !== 6}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin ml-2" />
            ) : (
              <ArrowRight className="w-4 h-4 ml-2" />
            )}
            {loading ? 'جاري التحقق...' : 'تأكيد الرمز'}
          </Button>

          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">لم يصلك الرمز؟</p>
            <Button
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className="text-red-600 hover:text-red-800 font-medium bg-transparent border-0 hover:bg-transparent"
            >
              {resendCooldown > 0 
                ? `إعادة الإرسال خلال ${resendCooldown} ثانية`
                : 'إعادة إرسال الرمز'
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailVerificationModal;
