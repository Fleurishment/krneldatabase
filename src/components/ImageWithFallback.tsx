import { useState, useCallback } from 'react';
import { User, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallbackType?: 'servant' | 'ce' | 'generic';
  onError?: () => void;
}

export function ImageWithFallback({
  src,
  alt,
  className = '',
  containerClassName = '',
  fallbackType = 'generic',
  onError,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  }, [onError]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted',
          containerClassName
        )}
      >
        {fallbackType === 'servant' && <User className="w-1/2 h-1/2 text-muted-foreground" />}
        {fallbackType === 'ce' && <ImageIcon className="w-1/2 h-1/2 text-muted-foreground" />}
        {fallbackType === 'generic' && <ImageIcon className="w-1/2 h-1/2 text-muted-foreground" />}
      </div>
    );
  }

  return (
    <div className={cn('relative', containerClassName)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  );
}
