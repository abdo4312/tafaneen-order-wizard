import { Product } from '../types';
export const PRODUCTS: Product[] = [
  // أقلام ليكويد بول ROTO
  {
    id: 'roto-liquid-ball-blue',
    name: 'قلم ليكويد بول ROTO - أزرق',
    nameEn: 'ROTO Liquid Ball Pen - Blue',
    price: 15,
    image: '/lovable-uploads/71293346-9ca9-42bd-9823-11e2f170d8c9.png',
    description: 'قلم ليكويد بول من ROTO باللون الأزرق، حبر سائل ناعم وجودة عالية',
    category: 'pens',
    subcategory: 'ballpoint',
    brand: 'roto',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 25,
    rating: 4.5,
    tags: ['قلم', 'ليكويد', 'أزرق', 'ROTO']
  },
  {
    id: 'roto-liquid-ball-red',
    name: 'قلم ليكويد بول ROTO - أحمر',
    nameEn: 'ROTO Liquid Ball Pen - Red',
    price: 15,
    image: '/lovable-uploads/df3ee4db-67ee-42dc-a7b6-a79d2ca4283b.png',
    description: 'قلم ليكويد بول من ROTO باللون الأحمر، حبر سائل ناعم وجودة عالية',
    category: 'pens',
    subcategory: 'ballpoint',
    brand: 'roto',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 20,
    rating: 4.5,
    tags: ['قلم', 'ليكويد', 'أحمر', 'ROTO']
  },
  {
    id: 'roto-liquid-ball-black',
    name: 'قلم ليكويد بول ROTO - أسود',
    nameEn: 'ROTO Liquid Ball Pen - Black',
    price: 15,
    image: '/lovable-uploads/e4772264-4d3f-498c-9b70-08ad804e4282.png',
    description: 'قلم ليكويد بول من ROTO باللون الأسود، حبر سائل ناعم وجودة عالية',
    category: 'pens',
    subcategory: 'ballpoint',
    brand: 'roto',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 30,
    rating: 4.5,
    tags: ['قلم', 'ليكويد', 'أسود', 'ROTO']
  },
  // منتجات أخرى
  {
    id: '1',
    name: 'كروت شخصية',
    price: 50,
    image: '/placeholder.svg',
    description: 'كروت شخصية عالية الجودة',
    category: 'printing'
  },
  {
    id: '2',
    name: 'بروشور إعلاني',
    price: 30,
    image: '/placeholder.svg',
    description: 'بروشورات إعلانية ملونة',
    category: 'advertising'
  },
  {
    id: '3',
    name: 'ختم شركة',
    price: 80,
    image: '/placeholder.svg',
    description: 'أختام شركات بتصاميم احترافية',
    category: 'stamps'
  },
  {
    id: '4',
    name: 'لافتة إعلانية',
    price: 150,
    image: '/placeholder.svg',
    description: 'لافتات إعلانية كبيرة الحجم',
    category: 'banners'
  },
  {
    id: '5',
    name: 'كتالوج منتجات',
    price: 120,
    image: '/placeholder.svg',
    description: 'كتالوجات منتجات مطبوعة بجودة عالية',
    category: 'catalogs'
  },
  {
    id: '6',
    name: 'ستيكرات ملونة',
    price: 25,
    image: '/placeholder.svg',
    description: 'ستيكرات ملونة بأشكال متنوعة',
    category: 'stickers'
  }
];
