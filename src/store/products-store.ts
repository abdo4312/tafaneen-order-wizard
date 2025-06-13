
import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  category: string;
  subcategory: string;
  brand: string;
  image: string;
  description: string;
  inStock: boolean;
  featured: boolean;
  isNew: boolean;
  salesCount: number;
  rating: number;
  tags: string[];
}

interface ProductsState {
  products: Product[];
  categories: Record<string, string[]>;
  getProductsByCategory: (category: string, subcategory?: string) => Product[];
  getFeaturedProducts: () => Product[];
  getNewProducts: () => Product[];
  getBestSellers: () => Product[];
  getRecommendedProducts: (userPreferences: string[]) => Product[];
  searchProducts: (query: string) => Product[];
}

const initialProducts: Product[] = [
  // أقلام جافة - روتو
  {
    id: '1',
    name: 'قلم روتو أزرق كلاسيك',
    nameEn: 'Roto Blue Classic Pen',
    price: 5,
    category: 'pens',
    subcategory: 'ballpoint',
    brand: 'roto',
    image: '/placeholder.svg',
    description: 'قلم جاف عالي الجودة من روتو، كتابة سلسة ومريحة',
    inStock: true,
    featured: true,
    isNew: false,
    salesCount: 150,
    rating: 4.5,
    tags: ['قلم', 'جاف', 'أزرق', 'روتو', 'كلاسيك']
  },
  {
    id: '2',
    name: 'قلم روتو أسود بريميوم',
    nameEn: 'Roto Black Premium Pen',
    price: 7,
    category: 'pens',
    subcategory: 'ballpoint',
    brand: 'roto',
    image: '/placeholder.svg',
    description: 'قلم جاف فاخر من روتو بتصميم أنيق',
    inStock: true,
    featured: false,
    isNew: true,
    salesCount: 120,
    rating: 4.3,
    tags: ['قلم', 'جاف', 'أسود', 'روتو', 'بريميوم']
  },
  {
    id: '3',
    name: 'قلم روتو أحمر سبورت',
    nameEn: 'Roto Red Sport Pen',
    price: 6,
    category: 'pens',
    subcategory: 'ballpoint',
    brand: 'roto',
    image: '/placeholder.svg',
    description: 'قلم جاف من روتو بتصميم رياضي عصري',
    inStock: true,
    featured: false,
    isNew: true,
    salesCount: 90,
    rating: 4.2,
    tags: ['قلم', 'جاف', 'أحمر', 'روتو', 'سبورت']
  },
  // أقلام جافة - برافو
  {
    id: '4',
    name: 'قلم برافو أحمر فاخر',
    nameEn: 'Bravo Red Luxury Pen',
    price: 8,
    category: 'pens',
    subcategory: 'ballpoint',
    brand: 'bravo',
    image: '/placeholder.svg',
    description: 'قلم جاف ممتاز من برافو بجودة استثنائية',
    inStock: true,
    featured: true,
    isNew: false,
    salesCount: 200,
    rating: 4.7,
    tags: ['قلم', 'جاف', 'أحمر', 'برافو', 'فاخر']
  },
  {
    id: '5',
    name: 'قلم برافو أزرق كلاسيك',
    nameEn: 'Bravo Blue Classic Pen',
    price: 6,
    category: 'pens',
    subcategory: 'ballpoint',
    brand: 'bravo',
    image: '/placeholder.svg',
    description: 'قلم جاف تقليدي من برافو بأداء موثوق',
    inStock: true,
    featured: false,
    isNew: false,
    salesCount: 180,
    rating: 4.4,
    tags: ['قلم', 'جاف', 'أزرق', 'برافو', 'كلاسيك']
  },
  {
    id: '6',
    name: 'قلم برافو أسود بزنس',
    nameEn: 'Bravo Black Business Pen',
    price: 9,
    category: 'pens',
    subcategory: 'ballpoint',
    brand: 'bravo',
    image: '/placeholder.svg',
    description: 'قلم جاف أنيق من برافو مثالي للأعمال',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 75,
    rating: 4.6,
    tags: ['قلم', 'جاف', 'أسود', 'برافو', 'بزنس']
  },
  // أقلام جافة - بريما
  {
    id: '7',
    name: 'قلم بريما أخضر إيكو',
    nameEn: 'Prima Green Eco Pen',
    price: 10,
    category: 'pens',
    subcategory: 'ballpoint',
    brand: 'prima',
    image: '/placeholder.svg',
    description: 'قلم جاف صديق للبيئة من بريما',
    inStock: true,
    featured: false,
    isNew: true,
    salesCount: 80,
    rating: 4.2,
    tags: ['قلم', 'جاف', 'أخضر', 'بريما', 'إيكو']
  },
  // أقلام رصاص - Faber-Castell
  {
    id: '8',
    name: 'قلم رصاص فابر كاستل HB كلاسيك',
    nameEn: 'Faber-Castell HB Classic Pencil',
    price: 12,
    category: 'pens',
    subcategory: 'pencil',
    brand: 'faber-castell',
    image: '/placeholder.svg',
    description: 'قلم رصاص عالي الجودة من فابر كاستل، مثالي للكتابة والرسم',
    inStock: true,
    featured: true,
    isNew: false,
    salesCount: 300,
    rating: 4.8,
    tags: ['قلم', 'رصاص', 'فابر كاستل', 'HB', 'كلاسيك']
  },
  {
    id: '9',
    name: 'قلم رصاص فابر كاستل 2B آرت',
    nameEn: 'Faber-Castell 2B Art Pencil',
    price: 15,
    category: 'pens',
    subcategory: 'pencil',
    brand: 'faber-castell',
    image: '/placeholder.svg',
    description: 'قلم رصاص فني من فابر كاستل للرسم الاحترافي',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 150,
    rating: 4.9,
    tags: ['قلم', 'رصاص', 'فابر كاستل', '2B', 'آرت']
  },
  // أقلام رصاص - DOMS
  {
    id: '10',
    name: 'قلم رصاص دومز HB اقتصادي',
    nameEn: 'DOMS HB Economy Pencil',
    price: 4,
    category: 'pens',
    subcategory: 'pencil',
    brand: 'doms',
    image: '/placeholder.svg',
    description: 'قلم رصاص ممتاز من دومز بسعر اقتصادي',
    inStock: true,
    featured: false,
    isNew: false,
    salesCount: 250,
    rating: 4.1,
    tags: ['قلم', 'رصاص', 'دومز', 'HB', 'اقتصادي']
  },
  {
    id: '11',
    name: 'قلم رصاص دومز 2B سوفت',
    nameEn: 'DOMS 2B Soft Pencil',
    price: 5,
    category: 'pens',
    subcategory: 'pencil',
    brand: 'doms',
    image: '/placeholder.svg',
    description: 'قلم رصاص ناعم من دومز للكتابة المريحة',
    inStock: true,
    featured: false,
    isNew: true,
    salesCount: 180,
    rating: 4.3,
    tags: ['قلم', 'رصاص', 'دومز', '2B', 'ناعم']
  }
];

const categories = {
  'pens': ['ballpoint', 'pencil'],
  'notebooks': ['ruled', 'plain', 'graph'],
  'accessories': ['erasers', 'rulers', 'sharpeners']
};

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: initialProducts,
  categories,
  
  getProductsByCategory: (category: string, subcategory?: string) => {
    const { products } = get();
    return products.filter(p => 
      p.category === category && (!subcategory || p.subcategory === subcategory)
    );
  },
  
  getFeaturedProducts: () => {
    const { products } = get();
    return products.filter(p => p.featured);
  },
  
  getNewProducts: () => {
    const { products } = get();
    return products.filter(p => p.isNew);
  },
  
  getBestSellers: () => {
    const { products } = get();
    return products
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 6);
  },
  
  getRecommendedProducts: (userPreferences: string[]) => {
    const { products } = get();
    if (!userPreferences.length) return products.slice(0, 4);
    
    return products
      .filter(p => p.tags.some(tag => userPreferences.includes(tag)))
      .slice(0, 6);
  },
  
  searchProducts: (query: string) => {
    const { products } = get();
    const searchTerm = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.nameEn.toLowerCase().includes(searchTerm) ||
      p.brand.toLowerCase().includes(searchTerm) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
}));
