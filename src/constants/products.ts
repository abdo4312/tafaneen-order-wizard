import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'hello-spiral-notebook-200-a4',
    name: 'كشكول سلك 4 فواصل 200 A4 Hello',
    nameEn: 'Hello Spiral Notebook 4 Dividers 200 A4',
    price: 170,
    image: '/lovable-uploads/be84f29a-d7f3-4b3d-840c-46189a1fb33a.png',
    images: [
      '/lovable-uploads/be84f29a-d7f3-4b3d-840c-46189a1fb33a.png',
      '/lovable-uploads/1030f5c6-b219-49f6-9e19-a421d36dcdf8.png'
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
  }
];