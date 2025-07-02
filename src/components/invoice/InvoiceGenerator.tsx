import React, { useState } from 'react';
import { Plus, Minus, Trash2, FileText, Download, MessageCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { generateInvoiceHTML, downloadInvoiceHTML, sendInvoiceToWhatsApp } from '../../utils/invoice';
import { Order, CartItem, CustomerInfo } from '../../types';
import { toast } from '../ui/sonner';

interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

const DELIVERY_AREAS = [
  { name: 'البوابة الأولى', price: 20 },
  { name: 'البوابة الثانية', price: 20 },
  { name: 'البوابة الثالثة', price: 20 },
  { name: 'البوابة الرابعة', price: 25 },
  { name: 'مساكن الضباط', price: 30 }
];

const PAYMENT_METHODS = [
  { id: 'cod', name: 'الدفع عند الاستلام', feePercentage: 0 },
  { id: 'vodafone_cash', name: 'فودافون كاش', feePercentage: 1 },
  { id: 'instapay', name: 'انستا باي', feePercentage: 0 }
];

const InvoiceGenerator: React.FC = () => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    street: '',
    buildingNumber: '',
    floor: '',
    area: ''
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: '1',
      name: '',
      description: '',
      quantity: 1,
      price: 0
    }
  ]);

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [notes, setNotes] = useState('');

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      name: '',
      description: '',
      quantity: 1,
      price: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDeliveryFee = () => {
    const area = DELIVERY_AREAS.find(a => a.name === customerInfo.area);
    return area ? area.price : 0;
  };

  const getPaymentFee = () => {
    const method = PAYMENT_METHODS.find(m => m.id === paymentMethod);
    if (method && method.feePercentage > 0) {
      return Math.ceil((getSubtotal() + getDeliveryFee()) * (method.feePercentage / 100));
    }
    return 0;
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee() + getPaymentFee();
  };

  const validateForm = () => {
    if (!customerInfo.name.trim()) {
      toast.error('يرجى إدخال اسم العميل');
      return false;
    }
    if (!customerInfo.phone.trim()) {
      toast.error('يرجى إدخال رقم هاتف العميل');
      return false;
    }
    if (!customerInfo.area) {
      toast.error('يرجى اختيار منطقة التوصيل');
      return false;
    }
    if (items.some(item => !item.name.trim() || item.price <= 0)) {
      toast.error('يرجى إكمال جميع بيانات المنتجات');
      return false;
    }
    return true;
  };

  const generateOrder = (): Order => {
    const orderId = `TFN-${Date.now()}`;
    
    const cartItems: CartItem[] = items.map(item => ({
      product: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: '/placeholder.svg',
        category: 'custom'
      },
      quantity: item.quantity
    }));

    return {
      id: orderId,
      createdAt: new Date(),
      items: cartItems,
      customerInfo,
      paymentMethod,
      subtotal: getSubtotal(),
      deliveryFee: getDeliveryFee(),
      paymentFee: getPaymentFee(),
      total: getTotal()
    };
  };

  const handleDownload = () => {
    if (!validateForm()) return;
    
    const order = generateOrder();
    downloadInvoiceHTML(order);
    toast.success('تم تحميل الفاتورة بنجاح');
  };

  const handleSendWhatsApp = () => {
    if (!validateForm()) return;
    
    const order = generateOrder();
    sendInvoiceToWhatsApp(order);
    toast.success('تم إرسال الفاتورة عبر واتساب');
  };

  const handlePreview = () => {
    if (!validateForm()) return;
    
    const order = generateOrder();
    const html = generateInvoiceHTML(order);
    
    // فتح نافذة جديدة لمعاينة الفاتورة
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-red-600" />
            إنشاء فاتورة مخصصة - مكتبة تفانين
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* معلومات العميل */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">معلومات العميل</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">اسم العميل *</Label>
                <Input
                  id="customerName"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  placeholder="اكتب اسم العميل"
                />
              </div>
              
              <div>
                <Label htmlFor="customerPhone">رقم الهاتف *</Label>
                <Input
                  id="customerPhone"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  placeholder="01xxxxxxxxx"
                />
              </div>
              
              <div>
                <Label htmlFor="street">الشارع</Label>
                <Input
                  id="street"
                  value={customerInfo.street}
                  onChange={(e) => setCustomerInfo({...customerInfo, street: e.target.value})}
                  placeholder="اسم الشارع"
                />
              </div>
              
              <div>
                <Label htmlFor="buildingNumber">رقم العقار</Label>
                <Input
                  id="buildingNumber"
                  value={customerInfo.buildingNumber}
                  onChange={(e) => setCustomerInfo({...customerInfo, buildingNumber: e.target.value})}
                  placeholder="رقم العقار"
                />
              </div>
              
              <div>
                <Label htmlFor="floor">الدور</Label>
                <Input
                  id="floor"
                  value={customerInfo.floor}
                  onChange={(e) => setCustomerInfo({...customerInfo, floor: e.target.value})}
                  placeholder="رقم الدور"
                />
              </div>
              
              <div>
                <Label htmlFor="area">المنطقة *</Label>
                <Select value={customerInfo.area} onValueChange={(value) => setCustomerInfo({...customerInfo, area: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المنطقة" />
                  </SelectTrigger>
                  <SelectContent>
                    {DELIVERY_AREAS.map((area) => (
                      <SelectItem key={area.name} value={area.name}>
                        {area.name} - {area.price} جنيه
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* المنتجات */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2">المنتجات</h3>
              <Button onClick={addItem} className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 ml-2" />
                إضافة منتج
              </Button>
            </div>
            
            {items.map((item, index) => (
              <Card key={item.id} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-4">
                    <Label>اسم المنتج *</Label>
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      placeholder="اسم المنتج"
                    />
                  </div>
                  
                  <div className="md:col-span-3">
                    <Label>الوصف</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="وصف المنتج"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label>الكمية</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateItem(item.id, 'quantity', Math.max(1, item.quantity - 1))}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                        className="text-center w-16"
                        min="1"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateItem(item.id, 'quantity', item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label>السعر (جنيه)</Label>
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="md:col-span-1">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-2 text-left">
                  <span className="text-sm text-gray-600">
                    الإجمالي: <strong>{(item.price * item.quantity).toFixed(2)} جنيه</strong>
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* طريقة الدفع */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">طريقة الدفع</h3>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="اختر طريقة الدفع" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    {method.name} {method.feePercentage > 0 && `(رسوم ${method.feePercentage}%)`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ملاحظات إضافية */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">ملاحظات إضافية</h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أي ملاحظات خاصة بالطلب..."
              rows={3}
            />
          </div>

          {/* ملخص التكاليف */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">ملخص التكاليف</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span>{getSubtotal().toFixed(2)} جنيه</span>
                </div>
                <div className="flex justify-between">
                  <span>رسوم التوصيل ({customerInfo.area || 'غير محدد'}):</span>
                  <span>{getDeliveryFee().toFixed(2)} جنيه</span>
                </div>
                {getPaymentFee() > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>رسوم الدفع الإلكتروني:</span>
                    <span>{getPaymentFee().toFixed(2)} جنيه</span>
                  </div>
                )}
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-lg text-red-600">
                  <span>المجموع الكلي:</span>
                  <span>{getTotal().toFixed(2)} جنيه</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* أزرار الإجراءات */}
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={handlePreview}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              معاينة الفاتورة
            </Button>
            
            <Button
              onClick={handleDownload}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              تحميل الفاتورة
            </Button>
            
            <Button
              onClick={handleSendWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              إرسال عبر واتساب
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceGenerator;