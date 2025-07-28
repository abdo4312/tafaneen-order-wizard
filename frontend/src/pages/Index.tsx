import React, { useState } from 'react';
import { Search, ShoppingCart, Star, TrendingUp, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-red-600">مكتبة تفانين</h1>
            </div>
            
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="ابحث عن المنتجات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 w-full"
                />
              </div>
            </div>

            <div className="flex items-center">
              <div className="relative cursor-pointer" onClick={handleCartClick}>
                <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-red-600 transition-colors" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Results */}
        {searchQuery && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">نتائج البحث عن "{searchQuery}"</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchProducts(searchQuery).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {searchProducts(searchQuery).length === 0 && (
              <p className="text-center text-gray-500 py-8">لم يتم العثور على منتجات مطابقة</p>
            )}
          </div>
        )}

        {!searchQuery && (
          <>
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 text-white mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">مرحباً بك في مكتبة تفانين</h1>
                  <p className="text-red-100 text-lg">كل اللي محتاجه في مكان واحد</p>
                </div>
                <div className="text-6xl">🖊️</div>
              </div>
            </div>


            {/* Categories */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span>الأقسام</span>
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 whitespace-nowrap ${
                      selectedCategory === category.id
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Category Products */}
            {selectedCategory !== 'all' && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {getFilteredProducts().map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}

            <Tabs defaultValue="featured" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="featured" className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  المميزة
                </TabsTrigger>
                <TabsTrigger value="bestsellers" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  الأكثر مبيعاً
                </TabsTrigger>
                <TabsTrigger value="new" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  الجديد
                </TabsTrigger>
              </TabsList>

              <TabsContent value="featured" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="bestsellers" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {bestSellers.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="new" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {newProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
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