
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
  // أقلام جافة - روتق
  {
    id: '1',
    name: 'قلم روتق أزرق',
    nameEn: 'Rotq Blue Pen',
    price: 5,
    category: 'pens',
    subcategory: 'ballpoint',
    brand: 'rotq',
    image: '/placeholder.svg',
    description: 'قلم جاف عالي الجودة من روتق',
    inStock: true,
    featured: true,
    isNew: false,
    salesCount: 150,
    rating: 4.5,
    tags: ['قلم', 'جاف', 'أزرق', 'روتق']
  },
  {
    id: '2',
    name: 'قلم روتق أسود',
    nameEn: 'Rotq Black Pen',
    price: 5,
    category: 'pens',
    subcategory: 'ballpoint',
    brand: 'rotq',
    image: '/placeholder.svg',
    description: 'قلم جاف عالي الجودة من روتق',
    inStock: true,
    featured: false,
    isNew: true,
    salesCount: 120,
    rating: 4.3,
    tags: ['قلم', 'جاف', 'أسود', 'روتق']
  },
  // أقلام جافة - برافو
  {
    id: '3',
    name: 'قلم برافو أحمر',
    nameEn: 'Bravo Red Pen',
    price: 4,
    category: 'pens',
    subcategory: 'ballpoint',
    brand: 'bravo',
    image: '/placeholder.svg',
    description: 'قلم جاف ممتاز من برافو',
    inStock: true,
    featured: true,
    isNew: false,
    salesCount: 200,
    rating: 4.7,
    tags: ['قلم', 'جاف', 'أحمر', 'برافو']
  },
  // أقلام جافة - بريما
  {
    id: '4',
    name: 'قلم بريما أخضر',
    nameEn: 'Prima Green Pen',
    price: 6,
    category: 'pens',
    subcategory: 'ballpoint',
    brand: 'prima',
    image: '/placeholder.svg',
    description: 'قلم جاف فاخر من بريما',
    inStock: true,
    featured: false,
    isNew: true,
    salesCount: 80,
    rating: 4.2,
    tags: ['قلم', 'جاف', 'أخضر', 'بريما']
  },
  // أقلام رصاص - Faber-Castell
  {
    id: '5',
    name: 'قلم رصاص فابر كاستل HB',
    nameEn: 'Faber-Castell HB Pencil',
    price: 8,
    category: 'pens',
    subcategory: 'pencil',
    brand: 'faber-castell',
    image: '/placeholder.svg',
    description: 'قلم رصاص عالي الجودة من فابر كاستل',
    inStock: true,
    featured: true,
    isNew: false,
    salesCount: 300,
    rating: 4.8,
    tags: ['قلم', 'رصاص', 'فابر كاستل', 'HB']
  },
  // أقلام رصاص - DOMS
  {
    id: '6',
    name: 'قلم رصاص دومز 2B',
    nameEn: 'DOMS 2B Pencil',
    price: 3,
    category: 'pens',
    subcategory: 'pencil',
    brand: 'doms',
    image: '/placeholder.svg',
    description: 'قلم رصاص ممتاز من دومز',
    inStock: true,
    featured: false,
    isNew: true,
    salesCount: 180,
    rating: 4.4,
    tags: ['قلم', 'رصاص', 'دومز', '2B']
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
