# مكتبة تفانين - Tafianen Library E-commerce

## Project Overview
This is a complete Arabic e-commerce application for a library/stationery shop called "مكتبة تفانين" (Tafianen Library). The project has been successfully migrated from Lovable to Replit and now uses:

- **Frontend**: React with TypeScript, Vite, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Routing**: Wouter (replaced react-router-dom for Replit compatibility)
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: In-memory storage with fallback to PostgreSQL schema

## Key Features
- **Product Catalog**: Browse pens, notebooks, and stationery items
- **Shopping Cart**: Add, remove, modify quantities
- **Checkout Process**: Customer information, delivery areas, payment methods
- **Order Management**: Invoice generation, WhatsApp integration
- **Product Assistant**: Smart chatbot for product recommendations
- **Multi-language**: Arabic interface with RTL support

## Project Architecture

### Frontend Structure
- `client/src/pages/`: Main application pages (Index, Cart, Checkout, Payment, Confirmation, Invoice)
- `client/src/components/`: Reusable UI components
- `client/src/store/`: Zustand stores for state management (cart, checkout, products)
- `client/src/lib/`: Utility functions and configurations

### Backend Structure
- `server/index.ts`: Main Express server
- `server/routes.ts`: API routes including product assistant
- `server/storage.ts`: Storage interface with in-memory implementation
- `shared/schema.ts`: Drizzle schema definitions for database tables

### Database Schema
- **users**: User authentication (basic setup)
- **products**: Product catalog with categories, brands, pricing
- **orders**: Order tracking with customer info, items, payment details

## Recent Changes
- **GitHub Repository Setup** (January 20, 2025)
  - Created comprehensive Arabic/English README.md with project overview
  - Added .gitignore file for proper version control
  - Created .env.example for environment configuration
  - Added MIT license for open source distribution
  - Prepared project for GitHub updates with professional documentation

- **Security Update** (January 20, 2025)
  - Fixed CVE-2025-30208 vulnerability by upgrading Vite from ^5.4.14 to ^5.4.19
  - Security scan confirmed the vulnerability was patched in version 5.4.15+

- **Migration from Lovable to Replit** (January 2025)
  - Replaced react-router-dom with wouter for routing compatibility
  - Migrated Supabase Edge Functions to Express server routes
  - Updated database from Supabase to PostgreSQL with Drizzle
  - Removed all Supabase dependencies and configurations
  - Fixed client/server separation and security practices

## User Preferences
- Arabic language interface with RTL support
- Simple, clean design focused on usability
- Focus on stationery/library products
- WhatsApp integration for order communication

## Development Guidelines
- Follow fullstack_js guidelines in the codebase
- Use in-memory storage for development (can upgrade to PostgreSQL)
- Maintain separation between client and server code
- Keep components clean and reusable
- Use TypeScript for type safety

## Deployment Ready
The project is now fully compatible with Replit and ready for deployment.