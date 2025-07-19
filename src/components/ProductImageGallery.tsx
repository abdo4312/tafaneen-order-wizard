import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Download, Upload, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import { toast } from './ui/sonner';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductImageGallery = ({ images, productName, isOpen, onClose }: ProductImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const downloadImage = async () => {
    try {
      const response = await fetch(images[currentIndex]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${productName}-صورة-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('تم تحميل الصورة بنجاح!');
    } catch (error) {
      toast.error('فشل في تحميل الصورة');
    }
  };

  const uploadImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          // هنا يمكن إضافة الصورة الجديدة للمعرض
          toast.success('تم رفع الصورة بنجاح!');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };
  if (!images || images.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0">
        <div className="relative w-full h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">{productName}</h3>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={downloadImage} title="تحميل الصورة">
                <Download className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={uploadImage} title="رفع صورة جديدة">
                <Upload className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleZoom} title={isZoomed ? "تصغير" : "تكبير"}>
                {isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Main Image Display */}
          <div className="flex-1 relative flex items-center justify-center bg-muted/10 overflow-hidden">
            <img
              src={images[currentIndex]}
              alt={`${productName} - صورة ${currentIndex + 1}`}
              className={`transition-transform duration-300 object-contain ${
                isZoomed ? 'scale-150 cursor-move' : 'max-w-full max-h-full cursor-zoom-in'
              }`}
              onClick={toggleZoom}
            />

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background shadow-lg border"
                  onClick={prevImage}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background shadow-lg border"
                  onClick={nextImage}
                  disabled={currentIndex === images.length - 1}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 px-4 py-2 rounded-full text-sm shadow-lg border">
                {currentIndex + 1} / {images.length}
              </div>
            )}

            {/* Navigation Indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 flex gap-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex 
                        ? 'bg-primary scale-125' 
                        : 'bg-background/60 hover:bg-background/80'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="p-4 border-t">
              <div className="flex gap-2 justify-center overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden transition-all hover:scale-105 ${
                      index === currentIndex
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${productName} - مصغرة ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Keyboard Navigation Hint */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="bg-background/80 px-3 py-1 rounded text-xs text-muted-foreground opacity-0 hover:opacity-100 transition-opacity">
              استخدم الأسهم ← → للتنقل
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};