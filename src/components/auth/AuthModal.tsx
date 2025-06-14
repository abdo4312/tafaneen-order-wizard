
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import Button from '../Button';
import { useAuthStore } from '../../store/auth-store';
import { useToast } from '../../hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, CheckCircle } from 'lucide-react';
import { Separator } from '../ui/separator';

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

  const { login, signup, signInWithGoogle, signInWithFacebook, loading } = useAuthStore();
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

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك!"
        });
        onClose();
      } else {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "حدث خطأ أثناء تسجيل الدخول عبر Google",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ أثناء تسجيل الدخول عبر Google",
        variant: "destructive"
      });
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const result = await signInWithFacebook();
      if (result.success) {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك!"
        });
        onClose();
      } else {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "حدث خطأ أثناء تسجيل الدخول عبر Facebook",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ أثناء تسجيل الدخول عبر Facebook",
        variant: "destructive"
      });
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
          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-3 rounded-lg font-medium flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isLogin ? 'تسجيل الدخول عبر Google' : 'إنشاء حساب عبر Google'}
            </Button>

            <Button
              onClick={handleFacebookSignIn}
              disabled={loading}
              className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white py-3 rounded-lg font-medium flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              {isLogin ? 'تسجيل الدخول عبر Facebook' : 'إنشاء حساب عبر Facebook'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">أو</span>
            </div>
          </div>

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
