import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Building, Layers, CheckCircle, Sparkles } from 'lucide-react';
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.street || !formData.buildingNumber || !formData.area) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setCustomerInfo(formData);
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-yellow-50">
      <Header 
        title="معلومات التوصيل" 
        onBack={() => navigate('/cart')}
      />
      
      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">معلومات التوصيل</h2>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            املأ البيانات لإتمام عملية الطلب
          </p>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-lg text-gray-800">المعلومات الشخصية</h3>
          </div>
          
          <div className="space-y-6">
            <div className="relative group">
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-red-500" />
                الاسم الكامل *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 hover:border-red-300 group-hover:shadow-md"
                placeholder="اكتب اسمك الكامل"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            
            <div className="relative group">
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500" />
                رقم الهاتف *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 hover:border-red-300 group-hover:shadow-md"
                placeholder="01xxxxxxxxx"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-lg text-gray-800">عنوان التوصيل</h3>
          </div>
          
          <div className="space-y-6">
            <div className="relative group">
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-yellow-500" />
                الشارع *
              </label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 hover:border-yellow-300 group-hover:shadow-md"
                placeholder="اسم الشارع"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Building className="w-4 h-4 text-yellow-500" />
                  رقم العقار *
                </label>
                <input
                  type="text"
                  value={formData.buildingNumber}
                  onChange={(e) => handleInputChange('buildingNumber', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 hover:border-yellow-300 group-hover:shadow-md"
                  placeholder="رقم العقار"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              
              <div className="relative group">
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-yellow-500" />
                  الدور
                </label>
                <input
                  type="text"
                  value={formData.floor}
                  onChange={(e) => handleInputChange('floor', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 hover:border-yellow-300 group-hover:shadow-md"
                  placeholder="رقم الدور"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
            
            <div className="relative group">
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-yellow-500" />
                المنطقة *
              </label>
              <select
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 hover:border-yellow-300 group-hover:shadow-md"
              >
                <option value="">اختر المنطقة</option>
                {AREAS.map((area) => (
                  <option key={area.name} value={area.name}>
                    {area.name} - رسوم التوصيل: {area.price} جنيه
                  </option>
                ))}
              </select>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="relative group">
          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              متابعة إلى الدفع
            </div>
          </Button>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;