import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'hello-spiral-notebook-200-a4',
    name: 'كشكول سلك 4 فواصل 200 A4 Hello',
    nameEn: 'Hello Spiral Notebook 4 Dividers 200 A4',
    price: 130,
    image: '/images/notebook-wire-4-dividers-200-a4-hello-1.jpg',
    images: [
      '/images/notebook-wire-4-dividers-200-a4-hello-1.jpg'
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
    id: 'bravo-mega-notebook-242-6subjects',
    name: 'كشكول سلك 242ق متقسم 6مواد Bravo Mega ساسكو هارد كافر',
    nameEn: 'Bravo Mega Spiral Notebook 242 pages 6 subjects Hard Cover',
    price: 170,
    image: '/images/bravo-mega-notebook.jpeg',
    images: [
      '/images/bravo-mega-notebook.jpeg'
    ],
    description: 'كشكول سلك برافو ميجا 242 ورقة متقسم 6 مواد، ساسكو هارد كافر، مقاس 19.5×27.3 سم',
    category: 'notebooks',
    subcategory: 'spiral',
    brand: 'Bravo',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 0,
    rating: 4.9,
    tags: ['كشكول', 'سلك', 'برافو', '242ق', 'ميجا', '6مواد', 'هارد كافر']
  },
  {
    id: 'bravo-classic-notebook-120-3subjects-pen',
    name: 'كشكول سلك برافو 120ق A4 ساسكو غلاف بلاستيك متقسم 3 مواد كلاسيك + قلم',
    nameEn: 'Bravo Classic Spiral Notebook 120 pages A4 3 subjects with Pen',
    price: 120,
    image: '/images/bravo-classic-notebook-pen.jpeg',
    images: [
      '/images/bravo-classic-notebook-pen.jpeg'
    ],
    description: 'كشكول سلك برافو كلاسيك 120 ورقة A4، ساسكو غلاف بلاستيك متقسم 3 مواد + قلم مجاني',
    category: 'notebooks',
    subcategory: 'spiral',
    brand: 'Bravo',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 0,
    rating: 4.7,
    tags: ['كشكول', 'سلك', 'برافو', '120ق', 'كلاسيك', '3مواد', 'قلم', 'A4']
  },
  {
    id: 'bravo-hardcover-notebook-170-a5',
    name: 'نوت هارد كافر 170 ق برافو A5',
    nameEn: 'Bravo Hard Cover Notebook 170 pages A5',
    price: 95,
    image: '/images/bravo-hardcover-notebook-a5.jpeg',
    images: [
      '/images/bravo-hardcover-notebook-a5.jpeg'
    ],
    description: 'نوت برافو هارد كافر 170 ورقة بحجم A5، غلاف صلب مقاوم للتلف',
    category: 'notebooks',
    subcategory: 'hardcover',
    brand: 'Bravo',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 0,
    rating: 4.6,
    tags: ['نوت', 'هارد كافر', 'برافو', '170ق', 'A5', 'غلاف صلب']
  },
  {
    id: 'adeeb-arabic-hardcover-spiral-120-a4',
    name: 'كشكول هارد كافر سلك عربي الأديب 120ق A4',
    nameEn: 'Al-Adeeb Arabic Hard Cover Spiral Notebook 120 pages A4',
    price: 115,
    image: '/images/adeeb-arabic-hardcover-notebook.jpeg',
    images: [
      '/images/adeeb-arabic-hardcover-notebook.jpeg'
    ],
    description: 'كشكول الأديب سلك هارد كافر 120 ورقة A4، مصمم خصيصاً للكتابة العربية بجودة عالية',
    category: 'notebooks',
    subcategory: 'spiral',
    brand: 'Al-Adeeb',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 0,
    rating: 4.8,
    tags: ['كشكول', 'هارد كافر', 'سلك', 'عربي', 'الأديب', '120ق', 'A4']
  },
  {
    id: 'hello-spiral-3dividers-140-a5',
    name: 'كشكول سلك 3فواصل 140 ق A5 Hello',
    nameEn: 'Hello Spiral Notebook 3 Dividers 140 pages A5',
    price: 85,
    image: '/images/hello-spiral-3dividers-a5-updated.jpeg',
    images: [
      '/images/hello-spiral-3dividers-a5-updated.jpeg'
    ],
    description: 'كشكول سلك Hello بـ 3 فواصل، 140 ورقة، حجم A5 مناسب للاستخدام اليومي',
    category: 'notebooks',
    subcategory: 'spiral',
    brand: 'Hello',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 0,
    rating: 4.5,
    tags: ['كشكول', 'سلك', 'Hello', '140ق', 'A5', '3فواصل']
  },
  {
    id: 'mohammed-amira-colorful-spiral-100-a5',
    name: 'كشكول سلك A5 100 ورقة محمد وأميرة ألوان',
    nameEn: 'Mohammed and Amira Colorful Spiral Notebook 100 pages A5',
    price: 33,
    image: '/images/mohammed-amira-colorful-notebook.jpeg',
    images: [
      '/images/mohammed-amira-colorful-notebook.jpeg'
    ],
    description: 'كشكول سلك محمد وأميرة بألوان جذابة، 100 ورقة A5، مناسب للأطفال والطلاب',
    category: 'notebooks',
    subcategory: 'spiral',
    brand: 'Mohammed & Amira',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 0,
    rating: 4.4,
    tags: ['كشكول', 'سلك', 'محمد وأميرة', '100ق', 'A5', 'ألوان', 'أطفال']
  },
  {
    id: 'bravo-english-spiral-80-a4',
    name: 'كشكول سلك برافو 80ق A4 إنجليزي ساسكو',
    nameEn: 'Bravo English Spiral Notebook 80 pages A4 Sasco',
    price: 50,
    image: '/images/bravo-english-80-a4.jpeg',
    images: [
      '/images/bravo-english-80-a4.jpeg'
    ],
    description: 'كشكول سلك برافو 80 ورقة A4 إنجليزي، ساسكو عالي الجودة، مناسب لطلاب اللغة الإنجليزية',
    category: 'notebooks',
    subcategory: 'spiral',
    brand: 'Bravo',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 0,
    rating: 4.3,
    tags: ['كشكول', 'سلك', 'برافو', '80ق', 'A4', 'إنجليزي', 'ساسكو']
  },
  {
    id: 'nawar-craft-pin-60-a5-arabic',
    name: 'كشكول A5 كرافت دبوس 60 ورقة عربي Nawar',
    nameEn: 'Nawar Craft Pin Notebook 60 pages A5 Arabic',
    price: 25,
    image: '/images/nawar-craft-pin-60-a5.jpeg',
    images: [
      '/images/nawar-craft-pin-60-a5.jpeg'
    ],
    description: 'كشكول نوار كرافت بدبوس 60 ورقة A5 عربي، تصميم بسيط وأنيق بسعر اقتصادي',
    category: 'notebooks',
    subcategory: 'pin-bound',
    brand: 'Nawar',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 0,
    rating: 4.2,
    tags: ['كشكول', 'كرافت', 'دبوس', '60ق', 'A5', 'عربي', 'نوار']
  },
  {
    id: 'shorouq-english-spiral-100',
    name: 'كشكول سلك 100ق الشروق إنجليزي',
    nameEn: 'Al-Shorouq English Spiral Notebook 100 pages',
    price: 45,
    image: '/images/shorouq-english-100-spiral.jpeg',
    images: [
      '/images/shorouq-english-100-spiral.jpeg'
    ],
    description: 'كشكول سلك الشروق 100 ورقة إنجليزي، مناسب لدراسة اللغة الإنجليزية وممارسة الكتابة',
    category: 'notebooks',
    subcategory: 'spiral',
    brand: 'Al-Shorouq',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 0,
    rating: 4.1,
    tags: ['كشكول', 'سلك', 'الشروق', '100ق', 'إنجليزي']
  },
  {
    id: 'sasco-block-note-spiral-40-a4',
    name: 'بلوك نوت ساسكو كبير سلك فوق 40 ق A4',
    nameEn: 'Sasco Large Block Note Spiral Top 40 pages A4',
    price: 40,
    image: '/images/sasco-block-note-spiral-40-a4.jpeg',
    images: [
      '/images/sasco-block-note-spiral-40-a4.jpeg'
    ],
    description: 'بلوك نوت ساسكو كبير بسلك من الأعلى، 40 ورقة A4، مناسب للملاحظات والرسم',
    category: 'notebooks',
    subcategory: 'block-note',
    brand: 'Sasco',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 0,
    rating: 4.0,
    tags: ['بلوك نوت', 'ساسكو', '40ق', 'A4', 'سلك فوق', 'كبير']
  },
  {
    id: 'andalusi-lesson-prep-hardcover-120',
    name: 'دفتر تحضير دروس هارد كافر أندلسية 120ق سلوفان',
    nameEn: 'Andalusi Lesson Preparation Hardcover Notebook 120 pages Cellophane',
    price: 95,
    image: '/images/andalusi-lesson-prep-hardcover-120.jpeg',
    images: [
      '/images/andalusi-lesson-prep-hardcover-120.jpeg'
    ],
    description: 'دفتر تحضير دروس أندلسية بغلاف صلب وسلوفان، 120 ورقة، مناسب للمعلمين لتحضير الدروس',
    category: 'notebooks',
    subcategory: 'lesson-prep',
    brand: 'Andalusi',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 0,
    rating: 4.4,
    tags: ['دفتر تحضير', 'أندلسية', '120ق', 'هارد كافر', 'سلوفان', 'معلمين']
  },
  {
    id: 'ghareeb-mg2-spiral-60-a4',
    name: 'كشكول سلك 60 ق A4 غريب MG-2',
    nameEn: 'Ghareeb MG-2 Spiral Notebook 60 pages A4',
    price: 35,
    image: '/images/ghareeb-mg2-spiral-60-a4.jpeg',
    images: [
      '/images/ghareeb-mg2-spiral-60-a4.jpeg'
    ],
    description: 'كشكول غريب سلك MG-2 بـ 60 ورقة A4، جودة ممتازة وسعر اقتصادي',
    category: 'notebooks',
    subcategory: 'spiral',
    brand: 'Ghareeb',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 0,
    rating: 4.0,
    tags: ['كشكول', 'سلك', 'غريب', 'MG-2', '60ق', 'A4']
  },
  {
    id: 'mohammed-amira-spiral-60-a5',
    name: 'كشكول سلك A5 60 ورقة محمد وأميرة',
    nameEn: 'Mohammed & Amira Spiral Notebook A5 60 pages',
    price: 23,
    image: '/images/mohammed-amira-spiral-60-a5.jpeg',
    images: [
      '/images/mohammed-amira-spiral-60-a5.jpeg'
    ],
    description: 'كشكول محمد وأميرة سلك A5 بـ 60 ورقة، مناسب للأطفال والاستخدام اليومي بسعر ممتاز',
    category: 'notebooks',
    subcategory: 'spiral',
    brand: 'Mohammed & Amira',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 0,
    rating: 4.2,
    tags: ['كشكول', 'سلك', 'محمد وأميرة', '60ق', 'A5', 'أطفال']
  },
  {
    id: 'al-ustaz-spiral-60-a5',
    name: 'كشكول سلك الأستاذ 60ق A5',
    nameEn: 'Al-Ustaz Spiral Notebook 60 pages A5',
    price: 30,
    image: '/images/al-ustaz-spiral-60-a5.jpeg',
    images: [
      '/images/al-ustaz-spiral-60-a5.jpeg'
    ],
    description: 'كشكول الأستاذ سلك 60 ورقة A5، جودة ممتازة ومناسب للطلاب والاستخدام العام',
    category: 'notebooks',
    subcategory: 'spiral',
    brand: 'Al-Ustaz',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 0,
    rating: 4.1,
    tags: ['كشكول', 'سلك', 'الأستاذ', '60ق', 'A5', 'طلاب']
  },
  {
    id: 'mohammed-amira-disney-glossy-60-a5',
    name: 'كشكول سلك 60 ق A5 محمد وأميرة ديزني لامع كوشيه',
    nameEn: 'Mohammed & Amira Disney Glossy Coated Spiral Notebook 60 pages A5',
    price: 27,
    image: '/images/mohammed-amira-disney-glossy-60-a5.jpeg',
    images: [
      '/images/mohammed-amira-disney-glossy-60-a5.jpeg'
    ],
    description: 'كشكول محمد وأميرة بطبعة ديزني لامعة كوشيه، 60 ورقة A5، مناسب للأطفال محبي الشخصيات المشهورة',
    category: 'notebooks',
    subcategory: 'spiral',
    brand: 'Mohammed & Amira',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 0,
    rating: 4.3,
    tags: ['كشكول', 'سلك', 'محمد وأميرة', 'ديزني', 'لامع', 'كوشيه', '60ق', 'A5', 'أطفال']
  },
  {
    id: 'mohammed-amira-fluorescent-80-a5',
    name: 'كشكول سلك محمد وأميرة 80 ق A5 فسفوري ملون',
    nameEn: 'Mohammed & Amira Fluorescent Colored Spiral Notebook 80 pages A5',
    price: 28,
    image: '/images/mohammed-amira-fluorescent-80-a5.jpeg',
    images: [
      '/images/mohammed-amira-fluorescent-80-a5.jpeg'
    ],
    description: 'كشكول محمد وأميرة بألوان فسفورية زاهية، 80 ورقة A5، مناسب للأطفال الذين يحبون الألوان المشرقة',
    category: 'notebooks',
    subcategory: 'spiral',
    brand: 'Mohammed & Amira',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 0,
    rating: 4.2,
    tags: ['كشكول', 'سلك', 'محمد وأميرة', 'فسفوري', 'ملون', '80ق', 'A5', 'أطفال']
  },
  {
    id: 'al-ustaz-spiral-100-a5',
    name: 'كشكول سلك الأستاذ 100ق A5',
    nameEn: 'Al-Ustaz Spiral Notebook 100 pages A5',
    price: 35,
    image: '/images/al-ustaz-spiral-100-a5.jpeg',
    images: [
      '/images/al-ustaz-spiral-100-a5.jpeg'
    ],
    description: 'كشكول الأستاذ سلك 100 ورقة A5، جودة ممتازة مع المزيد من الصفحات للاستخدام المكثف',
    category: 'notebooks',
    subcategory: 'spiral',
    brand: 'Al-Ustaz',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 0,
    rating: 4.2,
    tags: ['كشكول', 'سلك', 'الأستاذ', '100ق', 'A5', 'طلاب']
  },
  {
    id: 'mohammed-amira-spiral-140-a5',
    name: 'كشكول سلك A5 140 ق محمد وأميرة',
    nameEn: 'Mohammed & Amira Spiral Notebook A5 140 pages',
    price: 50,
    image: '/images/mohammed-amira-spiral-140-a5.jpeg',
    images: [
      '/images/mohammed-amira-spiral-140-a5.jpeg'
    ],
    description: 'كشكول محمد وأميرة سلك A5 بـ 140 ورقة، النسخة المتميزة للأطفال مع صفحات أكثر للاستخدام المكثف',
    category: 'notebooks',
    subcategory: 'spiral',
    brand: 'Mohammed & Amira',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 0,
    rating: 4.4,
    tags: ['كشكول', 'سلك', 'محمد وأميرة', '140ق', 'A5', 'أطفال', 'متميز']
  },
  {
    id: 'xl-5-subject-spiral-200',
    name: 'كشكول سلك 200ق متقسم 5 مادة XL وسط',
    nameEn: 'XL 5-Subject Spiral Notebook 200 pages Medium',
    price: 115,
    image: '/images/xl-5-subject-spiral-200.jpeg',
    images: [
      '/images/xl-5-subject-spiral-200.jpeg'
    ],
    description: 'كشكول XL سلك 200 ورقة متقسم 5 مواد، مناسب للطلاب الذين يدرسون عدة مواد في دفتر واحد',
    category: 'notebooks',
    subcategory: 'multi-subject',
    brand: 'XL',
    inStock: true,
    featured: true,
    isNew: true,
    salesCount: 0,
    rating: 4.3,
    tags: ['كشكول', 'سلك', 'XL', '200ق', 'متقسم', '5 مادة', 'وسط', 'طلاب']
  }
];
