
import React, { useState } from 'react';
import { ShoppingCart, Star, Images } from 'lucide-react';
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative group">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        
        {/* Multiple Images Indicator */}
        {product.images && product.images.length > 1 && (
          <button
            onClick={() => setIsGalleryOpen(true)}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <div className="flex items-center gap-2 text-white">
              <Images className="w-6 h-6" />
              <span>عرض {product.images.length} صور</span>
            </div>
          </button>
        )}
        
        {product.isNew && (
          <Badge className="absolute top-2 right-2 bg-green-500 text-white">
            جديد
          </Badge>
        )}
        {product.featured && (
          <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
            مميز
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg">{product.name}</h3>
          {product.rating && (
            <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{product.rating}</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
        {product.brand && (
          <p className="text-xs text-gray-500 mb-3">الماركة: {product.brand}</p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-red-600 font-bold text-lg">{product.price} جنيه</span>
            {product.salesCount && (
              <span className="text-xs text-gray-500">تم بيع {product.salesCount} قطعة</span>
            )}
          </div>
          
          <Button
            onClick={handleAddToCart}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            disabled={product.inStock === false}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.inStock !== false ? 'إضافة للسلة' : 'غير متوفر'}
          </Button>
        </div>
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
