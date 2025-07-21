import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  fallbackSrc = '/assets/placeholder.jpg',
  ...props
}) => {
  const [error, setError] = useState(false);

  // تحويل مسار الصورة إلى المسار الصحيح
  const normalizedSrc = src.startsWith('/')
    ? `./assets/${src.split('/').pop()}`
    : src;

  return (
    <img
      src={error ? fallbackSrc : normalizedSrc}
      alt={alt}
      className={cn('transition-opacity duration-300', className)}
      onError={(e) => {
        console.error(`Error loading image: ${normalizedSrc}`);
        setError(true);
      }}
      loading="lazy"
      {...props}
    />
  );
};
