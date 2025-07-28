
import React from 'react';

interface PaymentSummaryProps {
  subtotal: number;
  deliveryFee: number;
  paymentFee: number;
  total: number;
  customerArea: string;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  subtotal,
  deliveryFee,
  paymentFee,
  total,
  customerArea
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-bold text-lg mb-4">ملخص الطلب</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>المجموع الفرعي</span>
          <span>{subtotal} جنيه</span>
        </div>
        <div className="flex justify-between">
          <span>رسوم التوصيل ({customerArea})</span>
          <span>{deliveryFee} جنيه</span>
        </div>
        {paymentFee > 0 && (
          <div className="flex justify-between text-orange-600">
            <span>رسوم الدفع الإلكتروني (1%)</span>
            <span>{paymentFee} جنيه</span>
          </div>
        )}
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>المجموع الكلي</span>
          <span>{total} جنيه</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
