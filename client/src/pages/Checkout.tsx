
import React, { useState } from 'react';
import { useLocation } from 'wouter';
import Header from '../components/Header';
import Button from '../components/Button';
import { useCheckoutStore } from '../store/checkout-store';

const AREAS = [
  { name: 'البوابة الأولى', price: 20 },
  { name: 'البوابة الثانية', price: 20 },
  { name: 'البوابة الثالثة', price: 20 },
  { name: 'البوابة الرابعة', price: 25 },
  { name: 'مساكن الضباط', price: 30 }
];

const Checkout: React.FC = () => {
  const [, setLocation] = useLocation();
  const { customerInfo, setCustomerInfo } = useCheckoutStore();
  
  const [formData, setFormData] = useState({
    name: customerInfo.name || '',
    phone: customerInfo.phone || '',
    street: customerInfo.street || '',
    buildingNumber: customerInfo.buildingNumber || '',
    floor: customerInfo.floor || '',
    area: customerInfo.area || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.street || !formData.buildingNumber || !formData.area) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setCustomerInfo(formData);
    setLocation('/payment');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="معلومات التوصيل" 
        onBack={() => setLocation('/cart')}
      />
      
      <div className="p-4 space-y-4">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-bold text-lg mb-4">المعلومات الشخصية</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">الاسم *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="اكتب اسمك الكامل"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">رقم الهاتف *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="01xxxxxxxxx"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-bold text-lg mb-4">عنوان التوصيل</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">الشارع *</label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="اسم الشارع"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">رقم العقار *</label>
                <input
                  type="text"
                  value={formData.buildingNumber}
                  onChange={(e) => handleInputChange('buildingNumber', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="رقم العقار"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">الدور</label>
                <input
                  type="text"
                  value={formData.floor}
                  onChange={(e) => handleInputChange('floor', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="رقم الدور"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">المنطقة *</label>
              <select
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">اختر المنطقة</option>
                {AREAS.map((area) => (
                  <option key={area.name} value={area.name}>
                    {area.name} - رسوم التوصيل: {area.price} جنيه
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-lg font-bold"
        >
          متابعة إلى الدفع
        </Button>
      </div>
    </div>
  );
};

export default Checkout;
