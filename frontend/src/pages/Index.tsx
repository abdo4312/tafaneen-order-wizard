import React, { useState } from 'react';
import { Search, ShoppingCart, Star, TrendingUp, Sparkles, Zap, Gift, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useCartStore } from '../store/cart-store';
import { useProductsStore } from '../store/products-store';
import Button from '../components/Button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import ProductAssistant from '../components/ProductAssistant';

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { getTotalItems } = useCartStore();
  const { 
    getFeaturedProducts, 
    getNewProducts, 
    getBestSellers, 
    searchProducts,
    getProductsByCategory
  } = useProductsStore();

  const featuredProducts = getFeaturedProducts();
  const newProducts = getNewProducts();
  const bestSellers = getBestSellers();

  const categories = [
    { id: 'all', name: 'الكل', icon: '📚' },
    { id: 'pens-ballpoint-roto', name: 'أقلام ROTO ليكويد بول', icon: '🖊️' },
    { id: 'pens-ballpoint-bravo', name: 'أقلام برافو الجافة', icon: '✒️' },
    { id: 'pens-ballpoint-prima', name: 'أقلام بريما الجافة', icon: '🖋️' },
    { id: 'pens-pencil-faber-castell', name: 'أقلام فابر كاستل الرصاص', icon: '✏️' },
    { id: 'pens-pencil-doms', name: 'أقلام دومز الرصاص', icon: '📝' },
    { id: 'notebooks-spiral', name: 'كشاكيل السلك', icon: '📓' },
  ];

  const getFilteredProducts = () => {
    if (selectedCategory === 'all') return [];
    
    const [category, subcategory, ...brandParts] = selectedCategory.split('-');
    const brand = brandParts.join('-');
    const products = getProductsByCategory(category, subcategory);
    
    if (brand) {
      return products.filter(p => p.brand === brand);
    }
    return products;
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      {/* Header */}
      <header className="bg-background/80 shadow-sm sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                مكتبة تفانين
              </h1>
            </div>
            
            <div className="flex-1 max-w-xl mx-8 hidden md:block">
              <div className="relative group">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <Input
                  type="text"
                  placeholder="ابحث عن كشاكيل، أقلام، والمزيد..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 w-full bg-secondary hover:bg-background focus:ring-2 focus:ring-primary transition-all duration-300 rounded-full text-lg py-6"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative cursor-pointer group" onClick={handleCartClick}>
                <div className="relative p-3 rounded-full transition-colors duration-300 hover:bg-secondary">
                  <ShoppingCart className="w-6 h-6 text-foreground/80 group-hover:text-primary transition-colors" />
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-1 -left-1 bg-primary text-primary-foreground text-xs rounded-full w-6 h-6 flex items-center justify-center border-2 border-background">
                      {getTotalItems()}
                    </Badge>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Results */}
        {searchQuery && (
          <div className="mb-8 animate-fade-in">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span>نتائج البحث عن "{searchQuery}"</span>
              <Zap className="w-7 h-7 text-accent" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {searchProducts(searchQuery).map((product, index) => (
                <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            {searchProducts(searchQuery).length === 0 && (
              <div className="text-center py-16">
                <div className="text-7xl mb-6 opacity-40">🔍</div>
                <p className="text-muted-foreground text-xl">لم يتم العثور على منتجات مطابقة</p>
              </div>
            )}
          </div>
        )}

        {!searchQuery && (
          <>
            {/* Welcome Section */}
            <div className="relative bg-gradient-to-br from-secondary to-background rounded-3xl p-8 md:p-12 text-foreground mb-12 overflow-hidden group transition-all duration-500">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full transition-transform duration-700 group-hover:scale-[3]"></div>
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-accent/10 rounded-full transition-transform duration-700 group-hover:scale-[4]"></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold mb-3">أهلاً بك في مكتبة تفانين</h1>
                  <p className="text-muted-foreground text-lg md:text-xl mb-6">الجودة والإتقان في كل ما تحتاجه.</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-background/80 px-4 py-2 rounded-full border">
                      <Star className="w-5 h-5 text-accent fill-current" />
                      <span className="font-semibold">منتجات عالية الجودة</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block text-8xl text-primary/60 group-hover:text-primary group-hover:scale-110 transition-all duration-500">
                  <Gift />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <span>تصفح الأقسام</span>
                <Sparkles className="w-7 h-7 text-accent" />
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4">
                {categories.map((category, index) => (
                  <Button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    variant={selectedCategory === category.id ? 'default' : 'secondary'}
                    className="flex items-center gap-3 whitespace-nowrap transition-all duration-300 hover:scale-105 py-6 px-5 rounded-xl"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <span className="text-2xl">{category.icon}</span>
                    <span className="font-semibold">{category.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Category Products */}
            {selectedCategory !== 'all' && (
              <div className="mb-12 animate-fade-in">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span>{categories.find(c => c.id === selectedCategory)?.name}</span>
                  <div className="w-2.5 h-2.5 bg-accent rounded-full"></div>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {getFilteredProducts().map((product, index) => (
                    <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Tabs defaultValue="featured" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-10 bg-secondary p-2 rounded-xl">
                <TabsTrigger value="featured" className="flex items-center gap-2 rounded-lg text-lg py-3 transition-all duration-300">
                  <Star className="w-5 h-5 text-accent" />
                  المميزة
                </TabsTrigger>
                <TabsTrigger value="bestsellers" className="flex items-center gap-2 rounded-lg text-lg py-3 transition-all duration-300">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  الأكثر مبيعاً
                </TabsTrigger>
                <TabsTrigger value="new" className="flex items-center gap-2 rounded-lg text-lg py-3 transition-all duration-300">
                  <Sparkles className="w-5 h-5 text-accent" />
                  وصل حديثًا
                </TabsTrigger>
              </TabsList>

              <TabsContent value="featured" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {featuredProducts.map((product, index) => (
                    <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="bestsellers" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {bestSellers.map((product, index) => (
                    <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="new" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {newProducts.map((product, index) => (
                    <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
      
      {/* Add Product Assistant */}
      <ProductAssistant />
    </div>
  );
};

export default Index;