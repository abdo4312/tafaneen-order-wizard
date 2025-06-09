
import { Order } from '../types';

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
        @media print {
            body { background: white; }
            .invoice-container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="invoice-header">
            <div class="logo">تفانين ستوديو</div>
            <div class="subtitle">TAFANEEN STUDIO & PRINT</div>
            <div class="subtitle">إنتاج إعلامي - استشارات - فعاليات - إعلان - تسويق</div>
        </div>
        
        <div class="invoice-info">
            <div>
                <strong>رقم الفاتورة:</strong> ${order.id}<br>
                <strong>التاريخ:</strong> ${formatDate(order.createdAt)}
            </div>
            <div>
                <strong>حالة الدفع:</strong> ${order.paymentMethod === 'cod' ? 'دفع عند الاستلام' : 
                  order.paymentMethod === 'vodafone_cash' ? 'فودافون كاش' : 'انستا باي'}
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
                    <span>${order.customerInfo.street} - عقار رقم ${order.customerInfo.buildingNumber} - الدور ${order.customerInfo.floor}</span>
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
                        <th>اللون</th>
                        <th>المقاس</th>
                        <th>السعر</th>
                        <th>الإجمالي</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map((item, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.product.name}</td>
                            <td>${item.quantity}</td>
                            <td>${item.color || '-'}</td>
                            <td>${item.size || '-'}</td>
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
                    <span>رسوم التوصيل:</span>
                    <span>${order.deliveryFee} جنيه</span>
                </div>
                ${order.paymentFee > 0 ? `
                <div class="total-row">
                    <span>رسوم الدفع (${order.paymentMethod === 'vodafone_cash' ? '1%' : '0%'}):</span>
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
                <strong>معلومات الدفع:</strong><br>
                رقم ${order.paymentMethod === 'vodafone_cash' ? 'فودافون كاش' : 'انستا باي'}: 01066334002<br>
                المبلغ المطلوب: ${order.total} جنيه
            </div>
            ` : ''}
        </div>

        <div class="footer">
            شكراً لاختياركم تفانين ستوديو<br>
            للاستفسارات: 01026274235
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

  return `🏪 *تفانين ستوديو - فاتورة جديدة*

📋 *رقم الفاتورة:* ${order.id}
📅 *التاريخ:* ${formatDate(order.createdAt)}

👤 *بيانات العميل:*
• الاسم: ${order.customerInfo.name}
• الهاتف: ${order.customerInfo.phone}
• العنوان: ${order.customerInfo.street} - عقار رقم ${order.customerInfo.buildingNumber} - الدور ${order.customerInfo.floor}
• المنطقة: ${order.customerInfo.area}

🛍️ *تفاصيل الطلب:*
${order.items.map((item, index) => 
  `${index + 1}. ${item.product.name}
   - الكمية: ${item.quantity}
   - اللون: ${item.color || 'غير محدد'}
   - المقاس: ${item.size || 'غير محدد'}
   - السعر: ${item.product.price * item.quantity} جنيه`
).join('\n')}

💰 *الحساب:*
• إجمالي المنتجات: ${order.subtotal} جنيه
• رسوم التوصيل: ${order.deliveryFee} جنيه
${order.paymentFee > 0 ? `• رسوم الدفع: ${order.paymentFee} جنيه\n` : ''}• *الإجمالي: ${order.total} جنيه*

💳 *طريقة الدفع:* ${order.paymentMethod === 'cod' ? 'دفع عند الاستلام' : 
  order.paymentMethod === 'vodafone_cash' ? 'فودافون كاش' : 'انستا باي'}

${order.paymentMethod !== 'cod' ? `💰 *رقم الدفع:* 01066334002` : ''}

شكراً لاختياركم تفانين ستوديو! 🙏`;
};

export const sendInvoiceToWhatsApp = (order: Order) => {
  const phoneNumber = '201026274235';
  const invoiceText = generateInvoiceText(order);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(invoiceText)}`;
  window.open(whatsappUrl, '_blank');
};

export const downloadInvoiceHTML = (order: Order) => {
  const htmlContent = generateInvoiceHTML(order);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoice-${order.id}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
