# مكتبة تفانين - Tafianen Library E-commerce

![Arabic E-commerce](https://img.shields.io/badge/Language-Arabic-green)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.19-purple)
![Express](https://img.shields.io/badge/Express-4.19-yellow)

## نظرة عامة | Overview

**مكتبة تفانين** is a modern Arabic e-commerce application designed for a library and stationery shop. Built with React, TypeScript, and Express.js, this application provides a complete shopping experience with Arabic RTL support.

### المميزات الرئيسية | Key Features

- 🛍️ **كتالوج المنتجات** - Browse pens, notebooks, and stationery items
- 🛒 **سلة التسوق** - Add, remove, and modify quantities
- 💳 **عملية الدفع** - Customer information, delivery areas, payment methods
- 📝 **إدارة الطلبات** - Invoice generation and WhatsApp integration
- 🤖 **مساعد المنتجات** - Smart chatbot for product recommendations
- 🌏 **دعم العربية** - Full Arabic interface with RTL support

## التقنيات المستخدمة | Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Wouter** for routing
- **Zustand** for state management
- **TanStack Query** for data fetching

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** database
- **Drizzle ORM** for database operations
- **In-memory storage** with PostgreSQL fallback

## البنية المعمارية | Architecture

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # Application pages
│   │   ├── components/    # Reusable UI components
│   │   ├── store/         # Zustand stores
│   │   └── lib/          # Utility functions
├── server/                # Backend Express server
│   ├── index.ts          # Main server file
│   ├── routes.ts         # API routes
│   └── storage.ts        # Storage interface
├── shared/               # Shared types and schemas
│   └── schema.ts        # Drizzle database schema
└── assets/              # Static assets and images
```

## التثبيت والتشغيل | Installation & Setup

### المتطلبات | Prerequisites
- Node.js 18+
- PostgreSQL database

### خطوات التثبيت | Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tafianen-library.git
   cd tafianen-library
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment variables
   cp .env.example .env
   
   # Configure your PostgreSQL database URL
   DATABASE_URL="postgresql://username:password@localhost:5432/tafianen"
   ```

4. **Push database schema**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## الأوامر المتاحة | Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio for database management

## قاعدة البيانات | Database Schema

### الجداول | Tables

- **users** - معلومات المستخدمين | User authentication
- **products** - كتالوج المنتجات | Product catalog with categories and pricing
- **orders** - تتبع الطلبات | Order tracking with customer information

## الصفحات الرئيسية | Main Pages

1. **الصفحة الرئيسية** (`/`) - Product catalog and featured items
2. **سلة التسوق** (`/cart`) - Shopping cart management
3. **عملية الدفع** (`/checkout`) - Customer information form
4. **الدفع** (`/payment`) - Payment method selection
5. **تأكيد الطلب** (`/confirmation`) - Order confirmation
6. **الفاتورة** (`/invoice`) - Digital invoice with WhatsApp sharing

## التحديثات الأخيرة | Recent Updates

### يناير 2025 | January 2025

- ✅ **تحديث أمني** - Fixed CVE-2025-30208 vulnerability (Vite 5.4.14 → 5.4.19)
- ✅ **انتقال إلى Replit** - Migrated from Lovable platform
- ✅ **تحسين التوجيه** - Replaced react-router-dom with Wouter
- ✅ **تطوير الخادم** - Migrated to Express.js from Edge Functions
- ✅ **قاعدة البيانات** - PostgreSQL with Drizzle ORM integration

## المساهمة | Contributing

نرحب بالمساهمات! الرجاء اتباع الخطوات التالية:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## الترخيص | License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## التواصل | Contact

- **الموقع الإلكتروني** | Website: [Coming Soon]
- **البريد الإلكتروني** | Email: info@tafianen.com
- **واتساب** | WhatsApp: +966XXXXXXXX

---

<div align="center">
Built with ❤️ for Arabic e-commerce | مبني بحب للتجارة الإلكترونية العربية
</div>