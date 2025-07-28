import React, { useState } from 'react';
import { Search, ShoppingCart, Star, TrendingUp, Sparkles, Zap, Heart, Gift } from 'lucide-react';
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
  
  const { items, getTotalItems } = useCartStore();
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-yellow-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="relative">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  مكتبة تفانين
                </h1>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-sm font-medium text-gray-600">أجود المنتجات</span>
              </div>
            </div>
            
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative group">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                <Input
                  type="text"
                  placeholder="ابحث عن المنتجات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 w-full border-2 border-gray-200 hover:border-red-300 focus:border-red-500 transition-all duration-300 rounded-full"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="relative cursor-pointer group" onClick={handleCartClick}>
                <div className="relative p-2 rounded-full transition-all duration-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-yellow-50">
                  <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-red-600 transition-colors" />
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-2 -left-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                      {getTotalItems()}
                    </Badge>
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-110"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Results */}
        {searchQuery && (
          <div className="mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>نتائج البحث عن "{searchQuery}"</span>
              <Zap className="w-6 h-6 text-yellow-500 animate-pulse" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchProducts(searchQuery).map((product, index) => (
                <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            {searchProducts(searchQuery).length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-50">🔍</div>
                <p className="text-gray-500 text-lg">لم يتم العثور على منتجات مطابقة</p>
              </div>
            )}
          </div>
        )}

        {!searchQuery && (
          <>
            {/* Welcome Section */}
            <div className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-3xl p-8 text-white mb-8 overflow-hidden group hover:shadow-2xl transition-all duration-500 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400/10 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-6 h-6 text-yellow-400 animate-pulse" />
                    <h1 className="text-3xl font-bold">مرحباً بك في مكتبة تفانين</h1>
                  </div>
                  <p className="text-red-100 text-lg mb-4">كل اللي محتاجه في مكان واحد</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-yellow-400/20 px-3 py-1 rounded-full">
                      <Gift className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm">توصيل مجاني للطلبات الكبيرة</span>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-400/20 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm">جودة عالية مضمونة</span>
                    </div>
                  </div>
                </div>
                <div className="text-8xl group-hover:scale-110 transition-transform duration-500 animate-bounce">🖊️</div>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span>الأقسام</span>
                <Sparkles className="w-6 h-6 text-yellow-500 animate-spin" />
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {categories.map((category, index) => (
                  <Button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 whitespace-nowrap transition-all duration-300 hover:scale-105 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-yellow-50 hover:text-red-600 border-2 border-gray-200 hover:border-red-300'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span>{category.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Category Products */}
            {selectedCategory !== 'all' && (
              <div className="mb-8 animate-fade-in">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>{categories.find(c => c.id === selectedCategory)?.name}</span>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {getFilteredProducts().map((product, index) => (
                    <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Tabs defaultValue="featured" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-gradient-to-r from-gray-100 to-yellow-50 p-1 rounded-full">
                <TabsTrigger value="featured" className="flex items-center gap-2 rounded-full transition-all duration-300 hover:bg-gradient-to-r hover:from-red-100 hover:to-yellow-100">
                  <Star className="w-4 h-4 text-yellow-500" />
                  المميزة
                </TabsTrigger>
                <TabsTrigger value="bestsellers" className="flex items-center gap-2 rounded-full transition-all duration-300 hover:bg-gradient-to-r hover:from-red-100 hover:to-yellow-100">
                  <TrendingUp className="w-4 h-4 text-red-500" />
                  الأكثر مبيعاً
                </TabsTrigger>
                <TabsTrigger value="new" className="flex items-center gap-2 rounded-full transition-all duration-300 hover:bg-gradient-to-r hover:from-red-100 hover:to-yellow-100">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  الجديد
                </TabsTrigger>
              </TabsList>

              <TabsContent value="featured" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {featuredProducts.map((product, index) => (
                    <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="bestsellers" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {bestSellers.map((product, index) => (
                    <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="new" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {newProducts.map((product, index) => (
                    <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
      
      {/* Add Product Assistant */}
      <ProductAssistant />
    </div>
  );
};

export default Index;