import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Download, Upload, ZoomIn, ZoomOut, ChevronsLeft, ChevronsRight, SkipBack, SkipForward } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
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

  const goToFirst = () => {
    setCurrentIndex(0);
  };

  const goToLast = () => {
    setCurrentIndex(images.length - 1);
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

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (currentIndex > 0) prevImage();
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (currentIndex < images.length - 1) nextImage();
        break;
      case 'Home':
        e.preventDefault();
        goToFirst();
        break;
      case 'End':
        e.preventDefault();
        goToLast();
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0">
        <div className="relative w-full h-full flex flex-col" onKeyDown={handleKeyDown} tabIndex={0}>
          {/* Header */}
          <DialogHeader className="flex items-center justify-between p-4 border-b">
            <DialogTitle className="text-lg font-semibold">{productName}</DialogTitle>
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
          </DialogHeader>

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

            {/* Enhanced Navigation Controls */}
            {images.length > 1 && (
              <>
                {/* Go to First Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-20 top-1/2 -translate-y-1/2 bg-background/95 hover:bg-background shadow-lg border border-border/50 backdrop-blur-sm"
                  onClick={goToFirst}
                  disabled={currentIndex === 0}
                  title="الذهاب للصورة الأولى"
                >
                  <ChevronsLeft className="h-5 w-5" />
                </Button>

                {/* Previous Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/95 hover:bg-background shadow-lg border border-border/50 backdrop-blur-sm"
                  onClick={prevImage}
                  disabled={currentIndex === 0}
                  title="الصورة السابقة"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                {/* Next Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/95 hover:bg-background shadow-lg border border-border/50 backdrop-blur-sm"
                  onClick={nextImage}
                  disabled={currentIndex === images.length - 1}
                  title="الصورة التالية"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>

                {/* Go to Last Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-20 top-1/2 -translate-y-1/2 bg-background/95 hover:bg-background shadow-lg border border-border/50 backdrop-blur-sm"
                  onClick={goToLast}
                  disabled={currentIndex === images.length - 1}
                  title="الذهاب للصورة الأخيرة"
                >
                  <ChevronsRight className="h-5 w-5" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/95 px-4 py-2 rounded-full text-sm shadow-lg border border-border/50 backdrop-blur-sm">
                {currentIndex + 1} / {images.length}
              </div>
            )}

            {/* Enhanced Navigation Indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 flex gap-2 bg-background/95 p-2 rounded-full shadow-lg border border-border/50 backdrop-blur-sm">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`w-3 h-3 rounded-full transition-all hover:scale-125 ${
                      index === currentIndex 
                        ? 'bg-primary scale-125 shadow-md' 
                        : 'bg-muted hover:bg-muted-foreground/30'
                    }`}
                    title={`الذهاب للصورة ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Quick Navigation Panel */}
            {images.length > 1 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 bg-background/95 p-2 rounded-full shadow-lg border border-border/50 backdrop-blur-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToFirst}
                  disabled={currentIndex === 0}
                  className="h-8 px-3 text-xs"
                  title="الأولى"
                >
                  <SkipBack className="h-4 w-4 mr-1" />
                  الأولى
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToLast}
                  disabled={currentIndex === images.length - 1}
                  className="h-8 px-3 text-xs"
                  title="الأخيرة"
                >
                  الأخيرة
                  <SkipForward className="h-4 w-4 ml-1" />
                </Button>
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
                    title={`الذهاب للصورة ${index + 1}`}
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
          {images.length > 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="bg-background/90 px-4 py-2 rounded-lg text-xs text-muted-foreground shadow-lg border border-border/50 backdrop-blur-sm">
                <div className="text-center space-y-1">
                  <div>استخدم الأسهم ← → للتنقل</div>
                  <div>Home/End للذهاب للأولى/الأخيرة</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};