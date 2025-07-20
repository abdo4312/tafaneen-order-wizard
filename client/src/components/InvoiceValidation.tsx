import React from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Order } from '../types';

interface InvoiceValidationProps {
  order: Order;
  onValidationResult: (isValid: boolean, errors: string[]) => void;
}

export const InvoiceValidation: React.FC<InvoiceValidationProps> = ({ order, onValidationResult }) => {
  const validateInvoiceData = (orderData: Order): { isValid: boolean; errors: string[], warnings: string[] } => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // التحقق من البيانات الأساسية
    if (!orderData.id) {
      errors.push('معرف الفاتورة مفقود');
    }
    
    // التحقق من بيانات العميل
    if (!orderData.customerInfo?.name) {
      errors.push('اسم العميل مطلوب');
    } else if (orderData.customerInfo.name === 'عميل' || orderData.customerInfo.name.includes('يرجى التواصل')) {
      errors.push('اسم العميل غير صحيح - يحتوي على قيم افتراضية');
    }
    
    if (!orderData.customerInfo?.phone) {
      errors.push('رقم هاتف العميل مطلوب');
    } else if (orderData.customerInfo.phone === '01066334002' || orderData.customerInfo.phone.includes('للاستفسار')) {
      errors.push('رقم هاتف العميل غير صحيح - لا يمكن أن يكون رقم المكتبة');
    }
    
    if (!orderData.customerInfo?.street || orderData.customerInfo.street.includes('غير متوفر')) {
      errors.push('عنوان العميل مطلوب');
    }
    
    if (!orderData.customerInfo?.area || orderData.customerInfo.area === 'غير محدد') {
      errors.push('منطقة العميل مطلوبة');
    }
    
    // التحقق من المنتجات
    if (!orderData.items || orderData.items.length === 0) {
      errors.push('لا توجد منتجات في الفاتورة');
    } else {
      orderData.items.forEach((item, index) => {
        if (!item.product?.name) {
          errors.push(`اسم المنتج ${index + 1} مفقود`);
        } else if (item.product.name.includes('غير محدد') || item.product.name.includes('لم يتم العثور')) {
          errors.push(`المنتج ${index + 1}: "${item.product.name}" - اسم المنتج غير صحيح`);
        }
        
        if (!item.quantity || item.quantity <= 0) {
          errors.push(`كمية المنتج ${index + 1} يجب أن تكون أكبر من صفر`);
        }
        
        if (!item.product?.price || item.product.price <= 0) {
          errors.push(`سعر المنتج ${index + 1} يجب أن يكون أكبر من صفر`);
        }
      });
    }
    
    // التحقق من المبالغ
    if (!orderData.total || orderData.total <= 0) {
      errors.push('المبلغ الإجمالي يجب أن يكون أكبر من صفر');
    }
    
    if (orderData.subtotal <= 0) {
      warnings.push('المجموع الفرعي صفر أو سالب');
    }
    
    // التحقق من صحة المبالغ
    const calculatedTotal = orderData.subtotal + orderData.deliveryFee + orderData.paymentFee;
    if (Math.abs(calculatedTotal - orderData.total) > 0.01) {
      warnings.push('هناك تضارب في حساب المجموع الإجمالي');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const validation = validateInvoiceData(order);
  
  // إبلاغ المكون الأب بنتيجة التحقق
  React.useEffect(() => {
    onValidationResult(validation.isValid, validation.errors);
  }, [validation.isValid, validation.errors, onValidationResult]);

  if (validation.isValid && validation.warnings.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">✅ بيانات الفاتورة صحيحة ومكتملة</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-4">
      {/* الأخطاء */}
      {validation.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-red-800 mb-2">⚠️ أخطاء في بيانات الفاتورة</h4>
              <ul className="list-disc list-inside space-y-1 text-red-700 text-sm">
                {validation.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
              <div className="mt-3 p-3 bg-red-100 rounded">
                <p className="text-red-800 text-sm font-medium">
                  هذه الفاتورة تحتوي على بيانات غير صحيحة. يرجى التواصل مع المكتبة على الرقم 01066334002 للحصول على الفاتورة الصحيحة.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* التحذيرات */}
      {validation.warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-yellow-800 mb-2">تحذيرات</h4>
              <ul className="list-disc list-inside space-y-1 text-yellow-700 text-sm">
                {validation.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceValidation;