export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  price: number;
  image: string;
  description: string;
  category: string;
  subcategory?: string;
  brand?: string;
  inStock?: boolean;
  featured?: boolean;
  isNew?: boolean;
  salesCount?: number;
  rating?: number;
  tags?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  color?: string;
  size?: string;
  notes?: string;
  printingOptions?: PrintingOptions;
  uploadedFile?: File;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  street: string;
  buildingNumber: string;
  floor: string;
  area: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerInfo: CustomerInfo;
  paymentMethod: string;
  deliveryFee: number;
  paymentFee: number;
  subtotal: number;
  total: number;
  createdAt: Date;
}

export interface DeliveryArea {
  id: string;
  name: string;
  price: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  feePercentage: number;
  number?: string;
}

export interface PrintingOptions {
  printType: 'single' | 'double';
  colorType: 'bw' | 'color';
  paperSize: 'a4' | 'a3';
  paperType: 'normal' | 'glossy' | 'coated';
  copies: number;
}

export interface PrintingPrices {
  [key: string]: {
    [key: string]: {
      [key: string]: {
        [key: string]: number;
      };
    };
  };
}