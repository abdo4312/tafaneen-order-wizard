import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'hello-spiral-notebook-200-a4',
    name: 'كشكول سلك 4 فواصل 200 A4 Hello',
    nameEn: 'Hello Spiral Notebook 4 Dividers 200 A4',
    price: 130,
    image: '/lovable-uploads/كشكول سلك 4 فواصل 200 A4 Hello-صورة-1.jpg',
    images: [
      '/lovable-uploads/كشكول سلك 4 فواصل 200 A4 Hello-صورة-1.jpg'
    ],
    description: 'كشكول سلك بتصميم Hello، حجم A4 مع 4 فواصل، 200 ورقة، مثالي للطلاب والمكتب',
    category: 'notebooks',
    subcategory: 'spiral',
    brand: 'Hello',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 5,
    rating: 4.8,
    tags: ['كشكول', 'سلك', 'A4', '200ق', 'Hello', 'فواصل']
  },
  {
    id: 'roto-liquid-ball-pen',
    name: 'قلم روتو ليكويد بول',
    nameEn: 'Roto Liquid Ball Pen',
    price: 12,
    image: '/images/roto-liquid-blue.jpg',
    images: [
      '/images/roto-liquid-blue.jpg',
      '/images/roto-liquid-black.jpg',
      '/images/roto-liquid-red.jpg'
    ],
    description: 'قلم روتو ليكويد بول بحبر سائل وسن دقيق، كتابة سلسة ومريحة',
    category: 'pens',
    subcategory: 'ballpoint',
    brand: 'roto',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 150,
    rating: 4.7,
    tags: ['قلم', 'روتو', 'ليكويد', 'جاف', 'أزرق']
  },
  {
    id: 'bravo-classic-pen',
    name: 'قلم برافو كلاسيك',
    nameEn: 'Bravo Classic Pen',
    price: 5,
    image: '/images/bravo-classic.jpg',
    images: [
      '/images/bravo-classic.jpg'
    ],
    description: 'قلم برافو كلاسيك للكتابة اليومية، متوفر باللون الأزرق والأسود والأحمر',
    category: 'pens',
    subcategory: 'ballpoint',
    brand: 'bravo',
    inStock: true,
    featured: false,
    isNew: false,
    salesCount: 200,
    rating: 4.5,
    tags: ['قلم', 'برافو', 'كلاسيك', 'جاف']
  },
  {
    id: 'prima-gel-pen',
    name: 'قلم بريما جل',
    nameEn: 'Prima Gel Pen',
    price: 8,
    image: '/images/prima-gel-1.jpg',
    images: [
      '/images/prima-gel-1.jpg',
      '/images/prima-gel-2.jpg'
    ],
    description: 'قلم بريما جل بحبر سلس وألوان زاهية، مثالي للكتابة والرسم',
    category: 'pens',
    subcategory: 'gel',
    brand: 'prima',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 80,
    rating: 4.6,
    tags: ['قلم', 'بريما', 'جل', 'ملون']
  },
  {
    id: 'faber-castell-pencil',
    name: 'قلم رصاص فابر كاستل',
    nameEn: 'Faber-Castell Pencil',
    price: 7,
    image: '/images/faber-castell.jpg',
    images: [
      '/images/faber-castell.jpg'
    ],
    description: 'قلم رصاص فابر كاستل عالي الجودة، متوفر بدرجات مختلفة من HB إلى 6B',
    category: 'pens',
    subcategory: 'pencil',
    brand: 'faber-castell',
    inStock: true,
    featured: false,
    isNew: false,
    salesCount: 120,
    rating: 4.9,
    tags: ['قلم', 'رصاص', 'فابر كاستل']
  }
];
