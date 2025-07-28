export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  price: number;
  image: string;
  images?: string[];
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
