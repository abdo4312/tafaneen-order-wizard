import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, DollarSign, AlertCircle, CheckCircle, Upload, Eye } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useCheckoutStore } from '../store/checkout-store';
import { useCartStore } from '../store/cart-store';
import { useToast } from '../hooks/use-toast';

const AREAS = [
  { name: 'البوابة الأولى', price: 20 },
  { name: 'البوابة الثانية', price: 20 },
  { name: 'البوابة الثالثة', price: 20 },
  { name: 'البوابة الرابعة', price: 25 },
  { name: 'مساكن الضباط', price: 30 }
];

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { customerInfo, paymentMethod, setPaymentMethod } = useCheckoutStore();
  const { getSubtotal } = useCartStore();
  
  const [selectedMethod, setSelectedMethod] = useState(paymentMethod || '');
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [transactionNumber, setTransactionNumber] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [extractedAmount, setExtractedAmount] = useState<string>('');
  const [extractedTransactionId, setExtractedTransactionId] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const getDeliveryFee = () => {
    const area = AREAS.find(a => a.name === customerInfo.area);
    return area ? area.price : 0;
  };

  const getPaymentFee = () => {
    if (selectedMethod === 'vodafone-cash') {
      return Math.ceil((getSubtotal() + getDeliveryFee()) * 0.01); // 1% fee
    }
    return 0;
  };

  const getTotalAmount = () => {
    return getSubtotal() + getDeliveryFee() + getPaymentFee();
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedMethod(method);
    setPaymentMethod(method);
    setShowPaymentConfirmation(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedImage(file);
    setIsAnalyzing(true);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result as string;
        
        // Simulate AI image analysis - في التطبيق الحقيقي، ستحتاج لـ API للذكاء الاصطناعي
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock extracted data - في التطبيق الحقيقي، ستأتي هذه البيانات من تحليل الصورة
        const mockAmount = getTotalAmount().toString();
        const mockTransactionId = Math.random().toString(36).substr(2, 9).toUpperCase();
        
        setExtractedAmount(mockAmount);
        setExtractedTransactionId(mockTransactionId);
        setTransactionNumber(mockTransactionId);
        
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

  const handleContinue = () => {
    if (!selectedMethod) {
      toast({
        title: "يرجى اختيار طريقة الدفع",
        variant: "destructive",
      });
      return;
    }

    if (selectedMethod === 'vodafone-cash' || selectedMethod === 'ansar-pay') {
      setShowPaymentConfirmation(true);
      return;
    }

    navigate('/confirmation');
  };

  const handlePaymentConfirmation = () => {
    if (!transactionNumber.trim()) {
      toast({
        title: "يرجى إدخال رقم العملية",
        variant: "destructive",
      });
      return;
    }

    // التحقق من المبلغ المستخرج إذا كانت هناك صورة
    if (extractedAmount && extractedAmount !== getTotalAmount().toString()) {
      toast({
        title: "تحذير: عدم تطابق المبلغ",
        description: `المبلغ في الصورة (${extractedAmount}) لا يطابق المبلغ المطلوب (${getTotalAmount()})`,
        variant: "destructive",
      });
      return;
    }

    navigate('/confirmation');
  };

  // إذا كان في مرحلة تأكيد الدفع الإلكتروني
  if (showPaymentConfirmation) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          title="تأكيد الدفع" 
          onBack={() => setShowPaymentConfirmation(false)}
        />
        
        <div className="p-4 space-y-4">
          {/* Payment Confirmation */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-green-800 text-lg mb-2">تم إرسال تفاصيل الدفع</h3>
                <div className="text-green-700 space-y-2">
                  <p><strong>المبلغ المطلوب:</strong> {getTotalAmount()} جنيه</p>
                  <p><strong>رقم المحفظة:</strong> 01066334002</p>
                  <p><strong>طريقة الدفع:</strong> {selectedMethod === 'vodafone-cash' ? 'فودافون كاش' : 'إنستاباي'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Screenshot Upload */}
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
                        {extractedAmount === getTotalAmount().toString() ? (
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
                  {uploadedImage 
                    ? "تم ملء الحقل تلقائياً من الصورة، يمكنك التعديل إذا لزم الأمر"
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
                  <p>• تأكد من إتمام التحويل قبل الضغط على "تأكيد الطلب"</p>
                  <p>• احتفظ برقم العملية لمراجعتها مع المكتبة</p>
                  <p>• يفضل تحميل لقطة شاشة لتسريع عملية التحقق</p>
                  <p>• سيتم التحقق من الدفع قبل تجهيز الطلب</p>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="طريقة الدفع" 
        onBack={() => navigate('/checkout')}
      />
      
      <div className="p-4 space-y-4">
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-bold text-lg mb-4">ملخص الطلب</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>المجموع الفرعي</span>
              <span>{getSubtotal()} جنيه</span>
            </div>
            <div className="flex justify-between">
              <span>رسوم التوصيل ({customerInfo.area})</span>
              <span>{getDeliveryFee()} جنيه</span>
            </div>
            {getPaymentFee() > 0 && (
              <div className="flex justify-between text-orange-600">
                <span>رسوم الدفع الإلكتروني (1%)</span>
                <span>{getPaymentFee()} جنيه</span>
              </div>
            )}
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>المجموع الكلي</span>
              <span>{getTotalAmount()} جنيه</span>
            </div>
          </div>
        </div>

        {/* Payment Instructions for Electronic Methods */}
        {(selectedMethod === 'vodafone-cash' || selectedMethod === 'ansar-pay') && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-blue-800 mb-2">تعليمات الدفع الإلكتروني</h4>
                <div className="text-blue-700 text-sm space-y-2">
                  <p><strong>1.</strong> قم بتحويل المبلغ المطلوب: <span className="font-bold">{getTotalAmount()} جنيه</span></p>
                  <p><strong>2.</strong> رقم المحفظة: <span className="font-bold">01066334002</span></p>
                  <p><strong>3.</strong> بعد التحويل، اضغط "متابعة" لإدخال رقم العملية</p>
                  <p><strong>4.</strong> يمكنك تحميل لقطة شاشة للتحقق التلقائي</p>
                  <p><strong>5.</strong> تأكد من الاحتفاظ برقم العملية لمراجعتها مع المكتبة</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-bold text-lg mb-4">اختر طريقة الدفع</h3>
          
          <div className="space-y-3">
            {/* Cash on Delivery */}
            <div 
              onClick={() => handlePaymentMethodSelect('cash-on-delivery')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedMethod === 'cash-on-delivery' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-green-600" />
                <div className="flex-1">
                  <h4 className="font-bold">الدفع عند الاستلام</h4>
                  <p className="text-gray-600 text-sm">ادفع نقداً عند وصول الطلب</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedMethod === 'cash-on-delivery' 
                    ? 'border-red-500 bg-red-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedMethod === 'cash-on-delivery' && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Vodafone Cash */}
            <div 
              onClick={() => handlePaymentMethodSelect('vodafone-cash')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedMethod === 'vodafone-cash' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Wallet className="w-6 h-6 text-red-600" />
                <div className="flex-1">
                  <h4 className="font-bold">فودافون كاش</h4>
                  <p className="text-gray-600 text-sm">01066334002</p>
                  <p className="text-orange-600 text-xs">رسوم إضافية 1%</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedMethod === 'vodafone-cash' 
                    ? 'border-red-500 bg-red-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedMethod === 'vodafone-cash' && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Ansar Pay */}
            <div 
              onClick={() => handlePaymentMethodSelect('ansar-pay')}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedMethod === 'ansar-pay' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <div className="flex-1">
                  <h4 className="font-bold">انستا باي</h4>
                  <p className="text-gray-600 text-sm">01066334002</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedMethod === 'ansar-pay' 
                    ? 'border-red-500 bg-red-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedMethod === 'ansar-pay' && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={handleContinue}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-lg font-bold"
        >
          {(selectedMethod === 'vodafone-cash' || selectedMethod === 'ansar-pay') 
            ? 'متابعة للدفع' 
            : 'تأكيد الطلب'
          }
        </Button>
      </div>
    </div>
  );
};

export default Payment;
