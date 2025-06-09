
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import { useCheckoutStore } from '../store/checkout-store';
import { DELIVERY_AREAS } from '../constants/locations';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { customerInfo, setCustomerInfo } = useCheckoutStore();
  
  const [formData, setFormData] = useState({
    name: customerInfo.name || '',
    phone: customerInfo.phone || '',
    street: customerInfo.street || '',
    buildingNumber: customerInfo.buildingNumber || '',
    floor: customerInfo.floor || '',
    area: customerInfo.area || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^01[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = 'رقم الهاتف غير صحيح';
    }
    
    if (!formData.street.trim()) {
      newErrors.street = 'اسم الشارع مطلوب';
    }
    
    if (!formData.buildingNumber.trim()) {
      newErrors.buildingNumber = 'رقم العقار مطلوب';
    }
    
    if (!formData.floor.trim()) {
      newErrors.floor = 'رقم الدور مطلوب';
    }
    
    if (!formData.area) {
      newErrors.area = 'المنطقة مطلوبة';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setCustomerInfo(formData);
      navigate('/payment');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="معلومات التوصيل" 
        onBack={() => navigate('/cart')}
      />
      
      <div className="p-6 max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">بيانات التوصيل</h2>
          
          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">الاسم</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="أدخل اسمك الكامل"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">رقم الهاتف</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="01xxxxxxxxx"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Street */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">الشارع</label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.street ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="اسم الشارع"
            />
            {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
          </div>

          {/* Building Number */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">رقم العقار</label>
            <input
              type="text"
              value={formData.buildingNumber}
              onChange={(e) => handleInputChange('buildingNumber', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.buildingNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="رقم العقار"
            />
            {errors.buildingNumber && <p className="text-red-500 text-sm mt-1">{errors.buildingNumber}</p>}
          </div>

          {/* Floor */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">الدور</label>
            <input
              type="text"
              value={formData.floor}
              onChange={(e) => handleInputChange('floor', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.floor ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="رقم الدور"
            />
            {errors.floor && <p className="text-red-500 text-sm mt-1">{errors.floor}</p>}
          </div>

          {/* Area Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">المنطقة</label>
            <select
              value={formData.area}
              onChange={(e) => handleInputChange('area', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.area ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">اختر المنطقة</option>
              {DELIVERY_AREAS.map((area) => (
                <option key={area.id} value={area.name}>
                  {area.name} - {area.price} جنيه
                </option>
              ))}
            </select>
            {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium"
          >
            التالي - طريقة الدفع
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
