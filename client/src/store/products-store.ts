
import { create } from 'zustand';
import { PRODUCTS } from '../constants/products';
import { Product } from '../types';


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


const categories = {
  'notebooks': ['spiral']
};

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: PRODUCTS,
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
