
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import Button from '../Button';
import { useAuthStore } from '../../store/auth-store';
import { useToast } from '../../hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, CheckCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { login, signup, loading } = useAuthStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك مرة أخرى!"
        });
        onClose();
        setFormData({ name: '', email: '', password: '' });
      } else {
        let errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
        
        if (result.error?.includes('Invalid login credentials')) {
          errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
        } else if (result.error?.includes('Email not confirmed')) {
          errorMessage = "يرجى تأكيد بريدك الإلكتروني أولاً";
        }
        
        toast({
          title: "خطأ في تسجيل الدخول",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } else {
      const result = await signup(formData.name, formData.email, formData.password);
      
      if (result.success) {
        if (result.needsVerification) {
          setUserEmail(formData.email);
          setShowEmailSent(true);
        } else {
          toast({
            title: "تم إنشاء الحساب بنجاح",
            description: `مرحباً بك ${formData.name}!`
          });
          onClose();
          setFormData({ name: '', email: '', password: '' });
        }
      } else {
        let errorMessage = "حدث خطأ في إنشاء الحساب";
        
        if (result.error?.includes('already registered')) {
          errorMessage = "هذا البريد الإلكتروني مستخدم بالفعل";
        } else if (result.error?.includes('Password should be at least')) {
          errorMessage = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
        } else if (result.error?.includes('email')) {
          errorMessage = "البريد الإلكتروني غير صحيح";
        }
        
        toast({
          title: "خطأ في إنشاء الحساب",
          description: errorMessage,
          variant: "destructive"
        });
      }
    }
  };

  const handleBackToForm = () => {
    setShowEmailSent(false);
    setFormData({ name: '', email: '', password: '' });
  };

  if (showEmailSent) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6" />
              تم إرسال رابط التحقق
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 text-center">
            <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">تحقق من بريدك الإلكتروني</h3>
              <p className="text-gray-600">
                تم إرسال رابط التحقق إلى:
              </p>
              <p className="font-bold text-green-600">{userEmail}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>خطوات التفعيل:</strong>
              </p>
              <ol className="text-sm text-blue-700 mt-2 space-y-1 text-right">
                <li>1. تحقق من صندوق الوارد في بريدك الإلكتروني</li>
                <li>2. اضغط على رابط التحقق في الرسالة</li>
                <li>3. عد إلى هذه الصفحة وسجل الدخول</li>
              </ol>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleBackToForm}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                العودة إلى النموذج
              </Button>
              
              <Button
                onClick={onClose}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                إغلاق
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-red-600">
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <div className="relative">
                  <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pr-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pr-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pr-10 pl-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-500">كلمة المرور يجب أن تكون 6 أحرف على الأقل</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold"
            >
              {loading ? 'جاري المعالجة...' : (isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب')}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              {isLogin ? 'ليس لديك حساب؟ إنشاء حساب جديد' : 'لديك حساب بالفعل؟ تسجيل الدخول'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
