import { Order } from '../types';

// دالة حفظ البيانات مع نسخ احتياطية متعددة
export const saveInvoiceData = (order: Order): void => {
  try {
    console.log('حفظ بيانات الفاتورة:', order.id);
    
    // حفظ في localStorage الرئيسي
    const existingOrders = localStorage.getItem('orders');
    const orders = existingOrders ? JSON.parse(existingOrders) : [];
    
    // إزالة الطلب القديم إذا كان موجوداً
    const filteredOrders = orders.filter((o: Order) => o.id !== order.id);
    filteredOrders.push(order);
    
    localStorage.setItem('orders', JSON.stringify(filteredOrders));
    
    // حفظ نسخة احتياطية بمعرف مخصص
    localStorage.setItem(`invoice_${order.id}`, JSON.stringify(order));
    
    // حفظ في sessionStorage للجلسة الحالية
    sessionStorage.setItem('currentInvoice', JSON.stringify(order));
    
    // حفظ معلومات إضافية للتشخيص
    const debugInfo = {
      orderId: order.id,
      timestamp: new Date().toISOString(),
      customerName: order.customerInfo.name,
      customerPhone: order.customerInfo.phone,
      itemsCount: order.items.length,
      total: order.total
    };
    localStorage.setItem(`debug_${order.id}`, JSON.stringify(debugInfo));
    
    console.log('تم حفظ بيانات الفاتورة بنجاح');
  } catch (error) {
    console.error('خطأ في حفظ بيانات الفاتورة:', error);
  }
};

// دالة التحقق من صحة البيانات قبل الحفظ
export const validateAndSaveOrder = (order: Order): boolean => {
  try {
    // التحقق من البيانات الأساسية
    if (!order.id || !order.customerInfo?.name || !order.items?.length) {
      console.error('بيانات الطلب غير مكتملة:', {
        hasId: !!order.id,
        hasCustomerName: !!order.customerInfo?.name,
        hasItems: !!order.items?.length
      });
      return false;
    }
    
    // التحقق من صحة بيانات العميل
    if (order.customerInfo.name === 'عميل' || 
        order.customerInfo.phone.includes('للاستفسار') ||
        order.customerInfo.area === 'غير محدد') {
      console.warn('بيانات العميل تحتوي على قيم افتراضية:', order.customerInfo);
    }
    
    // التحقق من صحة المنتجات
    const hasValidProducts = order.items.every(item => 
      item.product?.name && 
      !item.product.name.includes('لم يتم العثور') &&
      item.quantity > 0 &&
      item.product.price > 0
    );
    
    if (!hasValidProducts) {
      console.warn('بعض المنتجات تحتوي على بيانات غير صحيحة');
    }
    
    // حفظ البيانات
    saveInvoiceData(order);
    return true;
    
  } catch (error) {
    console.error('خطأ في التحقق من صحة البيانات:', error);
    return false;
  }
};

export const generateInvoiceHTML = (order: Order): string => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'cod': return 'الدفع عند الاستلام';
      case 'vodafone_cash': return 'فودافون كاش';
      case 'instapay': return 'انستا باي';
      default: return 'غير محدد';
    }
  };

  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>فاتورة رقم ${order.id}</title>
    <style>
        body {
            font-family: 'Cairo', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            direction: rtl;
        }
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .invoice-header {
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .subtitle {
            font-size: 14px;
            opacity: 0.9;
        }
        .invoice-info {
            display: flex;
            justify-content: space-between;
            padding: 20px 30px;
            background-color: #f8f9fa;
            border-bottom: 2px solid #e9ecef;
        }
        .invoice-details {
            padding: 30px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #dc2626;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 2px solid #dc2626;
        }
        .customer-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .info-row {
            display: flex;
            margin-bottom: 8px;
        }
        .info-label {
            font-weight: bold;
            color: #495057;
            min-width: 100px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .items-table th {
            background-color: #dc2626;
            color: white;
            padding: 15px;
            text-align: center;
            font-weight: bold;
        }
        .items-table td {
            padding: 12px 15px;
            text-align: center;
            border-bottom: 1px solid #e9ecef;
        }
        .items-table tr:hover {
            background-color: #f8f9fa;
        }
        .total-section {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 5px 0;
        }
        .total-row.final {
            font-weight: bold;
            font-size: 18px;
            color: #dc2626;
            border-top: 2px solid #dc2626;
            padding-top: 15px;
            margin-top: 15px;
        }
        .payment-info {
            background-color: #e3f2fd;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            background-color: #f8f9fa;
            color: #6c757d;
            font-size: 14px;
        }
        .contact-info {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
        .contact-info h4 {
            color: #856404;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .contact-info p {
            color: #856404;
            margin: 5px 0;
            font-size: 14px;
        }
        @media print {
            body { background: white; }
            .invoice-container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="invoice-header">
            <div class="logo">مكتبة تفانين</div>
            <div class="subtitle">TAFANEEN LIBRARY & STATIONERY</div>
            <div class="subtitle">أدوات مكتبية - قرطاسية - طباعة - خدمات طلابية</div>
        </div>
        
        <div class="invoice-info">
            <div>
                <strong>رقم الفاتورة:</strong> ${order.id}<br />
                <strong>التاريخ:</strong> ${formatDate(order.createdAt)}
            </div>
            <div>
                <strong>حالة الدفع:</strong> ${getPaymentMethodName(order.paymentMethod)}
            </div>
        </div>

        <div class="invoice-details">
            <div class="section-title">بيانات العميل</div>
            <div class="customer-info">
                <div class="info-row">
                    <span class="info-label">الاسم:</span>
                    <span>${order.customerInfo.name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">الهاتف:</span>
                    <span>${order.customerInfo.phone}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">العنوان:</span>
                    <span>${order.customerInfo.street}، رقم العقار ${order.customerInfo.buildingNumber}${order.customerInfo.floor ? `، الدور ${order.customerInfo.floor}` : ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">المنطقة:</span>
                    <span>${order.customerInfo.area}</span>
                </div>
            </div>

            <div class="section-title">تفاصيل الطلب</div>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>م</th>
                        <th>اسم المنتج</th>
                        <th>الكمية</th>
                        <th>السعر الوحدة</th>
                        <th>الإجمالي</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map((item, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.product.name}</td>
                            <td>${item.quantity}</td>
                            <td>${item.product.price} جنيه</td>
                            <td>${item.product.price * item.quantity} جنيه</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="total-section">
                <div class="total-row">
                    <span>إجمالي المنتجات:</span>
                    <span>${order.subtotal} جنيه</span>
                </div>
                <div class="total-row">
                    <span>رسوم التوصيل (${order.customerInfo.area}):</span>
                    <span>${order.deliveryFee} جنيه</span>
                </div>
                ${order.paymentFee > 0 ? `
                <div class="total-row">
                    <span>رسوم الدفع الإلكتروني (1%):</span>
                    <span>${order.paymentFee} جنيه</span>
                </div>
                ` : ''}
                <div class="total-row final">
                    <span>الإجمالي النهائي:</span>
                    <span>${order.total} جنيه</span>
                </div>
            </div>

            ${order.paymentMethod !== 'cod' ? `
            <div class="payment-info">
                <strong>معلومات الدفع الإلكتروني:</strong><br />
                ${order.paymentMethod === 'vodafone_cash' ? 'رقم فودافون كاش' : 'رقم انستا باي'}: 01066334002<br />
                المبلغ المطلوب: ${order.total} جنيه<br />
                <small>يرجى الاحتفاظ بإيصال المعاملة</small>
            </div>
            ` : ''}

            <div class="contact-info">
                <h4>📞 للاستفسارات والمتابعة</h4>
                <p>رقم المكتبة: <strong>01026274235</strong><br />
                في حالة تأخير الطلب أو أي استفسار، تواصل معنا<br />
                ساعات العمل: من 10 صباحاً حتى 12 مساءً</p>
            </div>
        </div>

        <div class="footer">
            شكراً لاختياركم مكتبة تفانين<br />
            نتطلع لخدمتكم مرة أخرى
        </div>
    </div>
</body>
</html>`;
};

export const generateInvoiceText = (order: Order): string => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'cod': return 'الدفع عند الاستلام';
      case 'vodafone_cash': return 'فودافون كاش';
      case 'instapay': return 'انستا باي';
      default: return 'غير محدد';
    }
  };

  return `🏪 *مكتبة تفانين - فاتورة جديدة*

📋 *رقم الفاتورة:* ${order.id}
📅 *التاريخ:* ${formatDate(order.createdAt)}

👤 *بيانات العميل:*
• الاسم: ${order.customerInfo.name}
• الهاتف: ${order.customerInfo.phone}
• العنوان: ${order.customerInfo.street}، رقم العقار ${order.customerInfo.buildingNumber}${order.customerInfo.floor ? `، الدور ${order.customerInfo.floor}` : ''}
• المنطقة: ${order.customerInfo.area}

🛍️ *تفاصيل الطلب:*
${order.items.map((item, index) => 
  `${index + 1}. ${item.product.name}
   - الكمية: ${item.quantity}
   - السعر: ${item.product.price} جنيه للقطعة
   - الإجمالي: ${item.product.price * item.quantity} جنيه`
).join('\n\n')}

💰 *الحساب:*
• إجمالي المنتجات: ${order.subtotal} جنيه
• رسوم التوصيل (${order.customerInfo.area}): ${order.deliveryFee} جنيه
${order.paymentFee > 0 ? `• رسوم الدفع الإلكتروني (1%): ${order.paymentFee} جنيه\n` : ''}• *الإجمالي النهائي: ${order.total} جنيه*

💳 *طريقة الدفع:* ${getPaymentMethodName(order.paymentMethod)}

${order.paymentMethod !== 'cod' ? `
💰 *معلومات الدفع:*
رقم ${order.paymentMethod === 'vodafone_cash' ? 'فودافون كاش' : 'انستا باي'}: 01066334002
المبلغ المطلوب: ${order.total} جنيه
` : ''}

📞 *للاستفسارات:* 01026274235

شكراً لاختياركم مكتبة تفانين! 🙏
نتطلع لخدمتكم مرة أخرى`;
};

export const sendInvoiceToWhatsApp = (order: Order) => {
  const phoneNumber = '201026274235';
  const invoiceText = generateInvoiceText(order);
  
  // حفظ البيانات قبل الإرسال
  validateAndSaveOrder(order);
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(invoiceText)}`;
  window.open(whatsappUrl, '_blank');
};

export const downloadInvoiceHTML = (order: Order) => {
  const htmlContent = generateInvoiceHTML(order);
  
  // إنشاء نافذة جديدة للطباعة بحجم مناسب
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // انتظار تحميل المحتوى ثم طباعة
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // إغلاق النافذة بعد الطباعة
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 500);
    };
  }
};