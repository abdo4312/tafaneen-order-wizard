
import React from 'react';
import { CreditCard, Wallet, DollarSign } from 'lucide-react';

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodSelect: (method: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodSelect
}) => {
  const paymentMethods = [
    {
      id: 'cash-on-delivery',
      title: 'الدفع عند الاستلام',
      description: 'ادفع نقداً عند وصول الطلب',
      icon: DollarSign,
      iconColor: 'text-green-600'
    },
    {
      id: 'vodafone-cash',
      title: 'فودافون كاش',
      description: '01066334002',
      icon: Wallet,
      iconColor: 'text-red-600',
      extraInfo: 'رسوم إضافية 1%'
    },
    {
      id: 'ansar-pay',
      title: 'انستا باي',
      description: '01066334002',
      icon: CreditCard,
      iconColor: 'text-blue-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-bold text-lg mb-4">اختر طريقة الدفع</h3>
      
      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          return (
            <div 
              key={method.id}
              onClick={() => onMethodSelect(method.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedMethod === method.id 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComponent className={`w-6 h-6 ${method.iconColor}`} />
                <div className="flex-1">
                  <h4 className="font-bold">{method.title}</h4>
                  <p className="text-gray-600 text-sm">{method.description}</p>
                  {method.extraInfo && (
                    <p className="text-orange-600 text-xs">{method.extraInfo}</p>
                  )}
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedMethod === method.id 
                    ? 'border-red-500 bg-red-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedMethod === method.id && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
