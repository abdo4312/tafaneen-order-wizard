import React, { useState } from 'react';
import { ShoppingCart, Star, Images, Heart, Zap } from 'lucide-react';
import { useCartStore } from '../store/cart-store';
import { Product } from '../types';
import { Badge } from './ui/badge';
import Button from './Button';
import { ProductImageGallery } from './ProductImageGallery';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    addItem(product);
    console.log('تم إضافة المنتج للسلة:', {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category
    });
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative group/image overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
        
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Hover overlay with animations */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"></div>
        
        {/* Multiple Images Indicator */}
        {product.images && product.images.length > 1 && (
          <button
            onClick={() => setIsGalleryOpen(true)}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-30"
          >
            <div className="flex items-center gap-2 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <Images className="w-6 h-6" />
              <span className="font-medium">عرض {product.images.length} صور</span>
            </div>
          </button>
        )}
        
        {/* Badges with animations */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-30">
          {product.isNew && (
            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg animate-pulse">
              <Zap className="w-3 h-3 mr-1" />
              جديد
            </Badge>
          )}
          {product.featured && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg animate-bounce">
              <Star className="w-3 h-3 mr-1 fill-current" />
              مميز
            </Badge>
          )}
        </div>

        {/* Heart icon for favorites */}
        <div className="absolute top-3 left-3 z-30">
          <button className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110">
            <Heart className="w-4 h-4 text-red-500 hover:fill-current transition-colors" />
          </button>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg text-gray-800 group-hover:text-red-600 transition-colors duration-300">
            {product.name}
          </h3>
          {product.rating && (
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-yellow-700">{product.rating}</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        {product.brand && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500 font-medium">الماركة: {product.brand}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-red-600 font-bold text-xl">{product.price}</span>
              <span className="text-gray-500 text-sm">جنيه</span>
            </div>
            {product.salesCount && (
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">تم بيع {product.salesCount} قطعة</span>
              </div>
            )}
          </div>
          
          <Button
            onClick={handleAddToCart}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all duration-300 transform hover:scale-105 ${
              product.inStock !== false
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            disabled={product.inStock === false}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm">
              {product.inStock !== false ? 'إضافة للسلة' : 'غير متوفر'}
            </span>
          </Button>
        </div>

        {/* Hover effect indicator */}
        <div className={`mt-4 h-1 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full transition-all duration-300 ${
          isHovered ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
        }`}></div>
      </div>
      
      {/* Image Gallery Modal */}
      {product.images && product.images.length > 1 && (
        <ProductImageGallery
          images={product.images}
          productName={product.name}
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductCard;