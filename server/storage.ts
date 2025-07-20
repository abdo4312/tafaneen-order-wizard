import { users, orders, products, type User, type InsertUser, type Order, type InsertOrder, type Product, type InsertProduct } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrders(): Promise<Order[]>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private orders: Map<string, Order>;
  private products: Map<string, Product>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.orders = new Map();
    this.products = new Map();
    this.currentId = 1;
    
    // Initialize with some sample products
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: Product[] = [
      {
        id: "hello-spiral-notebook-200-a4",
        name: "كشكول سلك 4 فواصل 200 A4 Hello",
        description: "كشكول سلك بتصميم Hello، حجم A4 مع 4 فواصل، 200 ورقة، مثالي للطلاب والمكتب",
        price: 130,
        image: "/files_2723941-1752961293443-كشكول سلك 4 فواصل 200 A4 Hello-صورة-1_1753003363031.jpg",
        category: "notebooks",
        subcategory: "spiral",
        brand: "hello",
        featured: true,
        newProduct: true,
        bestSeller: true,
        inStock: true,
      },
      {
        id: "pen-roto-black",
        name: "قلم روتو أسود",
        description: "قلم ليكويد بول متميز",
        price: 8,
        image: "/images/pen-roto-black.jpg",
        category: "pens",
        subcategory: "ballpoint",
        brand: "roto",
        featured: true,
        newProduct: true,
        bestSeller: false,
        inStock: true,
      },
      {
        id: "bravo-mega-notebook-242-6subjects",
        name: "كشكول سلك 242ق متقسم 6مواد Bravo Mega ساسكو هارد كافر",
        description: "كشكول سلك برافو ميجا 242 ورقة متقسم 6 مواد، ساسكو هارد كافر، مقاس 19.5×27.3 سم",
        price: 170,
        image: "/bravo-mega-notebook.jpeg",
        category: "notebooks",
        subcategory: "spiral",
        brand: "bravo",
        featured: true,
        newProduct: true,
        bestSeller: false,
        inStock: true,
      },
      {
        id: "bravo-classic-notebook-120-3subjects-pen",
        name: "كشكول سلك برافو 120ق A4 ساسكو غلاف بلاستيك متقسم 3 مواد كلاسيك + قلم",
        description: "كشكول سلك برافو كلاسيك 120 ورقة A4، ساسكو غلاف بلاستيك متقسم 3 مواد + قلم مجاني",
        price: 120,
        image: "/bravo-classic-notebook-pen.jpeg",
        category: "notebooks",
        subcategory: "spiral",
        brand: "bravo",
        featured: true,
        newProduct: true,
        bestSeller: false,
        inStock: true,
      },
      {
        id: "bravo-hardcover-notebook-170-a5",
        name: "نوت هارد كافر 170 ق برافو A5",
        description: "نوت برافو هارد كافر 170 ورقة بحجم A5، غلاف صلب مقاوم للتلف",
        price: 95,
        image: "/bravo-hardcover-notebook-a5.jpeg",
        category: "notebooks",
        subcategory: "hardcover",
        brand: "bravo",
        featured: true,
        newProduct: true,
        bestSeller: false,
        inStock: true,
      },
      {
        id: "adeeb-arabic-hardcover-spiral-120-a4",
        name: "كشكول هارد كافر سلك عربي الأديب 120ق A4",
        description: "كشكول الأديب سلك هارد كافر 120 ورقة A4، مصمم خصيصاً للكتابة العربية بجودة عالية",
        price: 115,
        image: "/adeeb-arabic-hardcover-notebook.jpeg",
        category: "notebooks",
        subcategory: "spiral",
        brand: "al-adeeb",
        featured: true,
        newProduct: true,
        bestSeller: false,
        inStock: true,
      },
      {
        id: "hello-spiral-3dividers-140-a5",
        name: "كشكول سلك 3فواصل 140 ق A5 Hello",
        description: "كشكول سلك Hello بـ 3 فواصل، 140 ورقة، حجم A5 مناسب للاستخدام اليومي",
        price: 85,
        image: "/hello-spiral-3dividers-a5-updated.jpeg",
        category: "notebooks",
        subcategory: "spiral",
        brand: "hello",
        featured: true,
        newProduct: true,
        bestSeller: false,
        inStock: true,
      },
      {
        id: "mohammed-amira-colorful-spiral-100-a5",
        name: "كشكول سلك A5 100 ورقة محمد وأميرة ألوان",
        description: "كشكول سلك محمد وأميرة بألوان جذابة، 100 ورقة A5، مناسب للأطفال والطلاب",
        price: 33,
        image: "/mohammed-amira-colorful-notebook.jpeg",
        category: "notebooks",
        subcategory: "spiral",
        brand: "mohammed-amira",
        featured: true,
        newProduct: true,
        bestSeller: false,
        inStock: true,
      },
      {
        id: "bravo-english-spiral-80-a4",
        name: "كشكول سلك برافو 80ق A4 إنجليزي ساسكو",
        description: "كشكول سلك برافو 80 ورقة A4 إنجليزي، ساسكو عالي الجودة، مناسب لطلاب اللغة الإنجليزية",
        price: 50,
        image: "/bravo-english-80-a4.jpeg",
        category: "notebooks",
        subcategory: "spiral",
        brand: "bravo",
        featured: true,
        newProduct: true,
        bestSeller: false,
        inStock: true,
      },
      {
        id: "nawar-craft-pin-60-a5-arabic",
        name: "كشكول A5 كرافت دبوس 60 ورقة عربي Nawar",
        description: "كشكول نوار كرافت بدبوس 60 ورقة A5 عربي، تصميم بسيط وأنيق بسعر اقتصادي",
        price: 25,
        image: "/nawar-craft-pin-60-a5.jpeg",
        category: "notebooks",
        subcategory: "pin-bound",
        brand: "nawar",
        featured: true,
        newProduct: true,
        bestSeller: false,
        inStock: true,
      },
      {
        id: "shorouq-english-spiral-100",
        name: "كشكول سلك 100ق الشروق إنجليزي",
        description: "كشكول سلك الشروق 100 ورقة إنجليزي، مناسب لدراسة اللغة الإنجليزية وممارسة الكتابة",
        price: 45,
        image: "/shorouq-english-100-spiral.jpeg",
        category: "notebooks",
        subcategory: "spiral",
        brand: "al-shorouq",
        featured: true,
        newProduct: true,
        bestSeller: false,
        inStock: true,
      },
      {
        id: "sasco-block-note-spiral-40-a4",
        name: "بلوك نوت ساسكو كبير سلك فوق 40 ق A4",
        description: "بلوك نوت ساسكو كبير بسلك من الأعلى، 40 ورقة A4، مناسب للملاحظات والرسم",
        price: 40,
        image: "/sasco-block-note-spiral-40-a4.jpeg",
        category: "notebooks",
        subcategory: "block-note",
        brand: "sasco",
        featured: true,
        newProduct: true,
        bestSeller: false,
        inStock: true,
      },
      {
        id: "andalusi-lesson-prep-hardcover-120",
        name: "دفتر تحضير دروس هارد كافر أندلسية 120ق سلوفان",
        description: "دفتر تحضير دروس أندلسية بغلاف صلب وسلوفان، 120 ورقة، مناسب للمعلمين لتحضير الدروس",
        price: 95,
        image: "/andalusi-lesson-prep-hardcover-120.jpeg",
        category: "notebooks",
        subcategory: "lesson-prep",
        brand: "andalusi",
        featured: true,
        newProduct: true,
        bestSeller: false,
        inStock: true,
      },
      {
        id: "ghareeb-mg2-spiral-60-a4",
        name: "كشكول سلك 60 ق A4 غريب MG-2",
        description: "كشكول غريب سلك MG-2 بـ 60 ورقة A4، جودة ممتازة وسعر اقتصادي",
        price: 35,
        image: "/ghareeb-mg2-spiral-60-a4.jpeg",
        category: "notebooks",
        subcategory: "spiral",
        brand: "ghareeb",
        featured: true,
        newProduct: true,
        bestSeller: false,
        inStock: true,
      },
      {
        id: "mohammed-amira-spiral-60-a5",
        name: "كشكول سلك A5 60 ورقة محمد وأميرة",
        description: "كشكول محمد وأميرة سلك A5 بـ 60 ورقة، مناسب للأطفال والاستخدام اليومي بسعر ممتاز",
        price: 23,
        image: "/mohammed-amira-spiral-60-a5.jpeg",
        category: "notebooks",
        subcategory: "spiral",
        brand: "mohammed-amira",
        featured: true,
        newProduct: true,
        bestSeller: false,
        inStock: true,
      },
      {
        id: "al-ustaz-spiral-60-a5",
        name: "كشكول سلك الأستاذ 60ق A5",
        description: "كشكول الأستاذ سلك 60 ورقة A5، جودة ممتازة ومناسب للطلاب والاستخدام العام",
        price: 30,
        image: "/al-ustaz-spiral-60-a5.jpeg",
        category: "notebooks",
        subcategory: "spiral",
        brand: "al-ustaz",
        featured: true,
        newProduct: true,
        bestSeller: false,
        inStock: true,
      },
      {
        id: "mohammed-amira-disney-glossy-60-a5",
        name: "كشكول سلك 60 ق A5 محمد وأميرة ديزني لامع كوشيه",
        description: "كشكول محمد وأميرة بطبعة ديزني لامعة كوشيه، 60 ورقة A5، مناسب للأطفال محبي الشخصيات المشهورة",
        price: 27,
        image: "/mohammed-amira-disney-glossy-60-a5.jpeg",
        category: "notebooks",
        subcategory: "spiral",
        brand: "mohammed-amira",
        featured: true,
        newProduct: true,
        bestSeller: false,
        inStock: true,
      },
      {
        id: "mohammed-amira-fluorescent-80-a5",
        name: "كشكول سلك محمد وأميرة 80 ق A5 فسفوري ملون",
        description: "كشكول محمد وأميرة بألوان فسفورية زاهية، 80 ورقة A5، مناسب للأطفال الذين يحبون الألوان المشرقة",
        price: 28,
        image: "/mohammed-amira-fluorescent-80-a5.jpeg",
        category: "notebooks",
        subcategory: "spiral",
        brand: "mohammed-amira",
        featured: true,
        newProduct: true,
        bestSeller: false,
        inStock: true,
      },
      {
        id: "al-ustaz-spiral-100-a5",
        name: "كشكول سلك الأستاذ 100ق A5",
        description: "كشكول الأستاذ سلك 100 ورقة A5، جودة ممتازة مع المزيد من الصفحات للاستخدام المكثف",
        price: 35,
        image: "/al-ustaz-spiral-100-a5.jpeg",
        category: "notebooks",
        subcategory: "spiral",
        brand: "al-ustaz",
        featured: true,
        newProduct: true,
        bestSeller: false,
        inStock: true,
      },
      {
        id: "mohammed-amira-spiral-140-a5",
        name: "كشكول سلك A5 140 ق محمد وأميرة",
        description: "كشكول محمد وأميرة سلك A5 بـ 140 ورقة، النسخة المتميزة للأطفال مع صفحات أكثر للاستخدام المكثف",
        price: 50,
        image: "/mohammed-amira-spiral-140-a5.jpeg",
        category: "notebooks",
        subcategory: "spiral",
        brand: "mohammed-amira",
        featured: true,
        newProduct: true,
        bestSeller: false,
        inStock: true,
      },
      {
        id: "xl-5-subject-spiral-200",
        name: "كشكول سلك 200ق متقسم 5 مادة XL وسط",
        description: "كشكول XL سلك 200 ورقة متقسم 5 مواد، مناسب للطلاب الذين يدرسون عدة مواد في دفتر واحد",
        price: 115,
        image: "/xl-5-subject-spiral-200.jpeg",
        category: "notebooks",
        subcategory: "multi-subject",
        brand: "xl",
        featured: true,
        newProduct: true,
        bestSeller: false,
        inStock: true,
      }
    ];
    
    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const order: Order = { 
      ...insertOrder, 
      createdAt: new Date(),
      status: insertOrder.status || "pending",
    };
    this.orders.set(order.id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const product: Product = { 
      ...insertProduct,
      description: insertProduct.description || null,
      image: insertProduct.image || null,
      subcategory: insertProduct.subcategory || null,
      brand: insertProduct.brand || null,
      featured: insertProduct.featured || false,
      newProduct: insertProduct.newProduct || false,
      bestSeller: insertProduct.bestSeller || false,
      inStock: insertProduct.inStock || true,
    };
    this.products.set(product.id, product);
    return product;
  }
}

export const storage = new MemStorage();
