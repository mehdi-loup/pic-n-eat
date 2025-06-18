import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { useState } from 'react';

interface ImageProps extends HTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

export default function SafeImage({ src, alt = 'Image', className, ...props }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={cn('flex items-center justify-center bg-gray-100 rounded-md', className)}>
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <ImageIcon size={24} />
          <span className="text-sm">Failed to load image</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden shadow-md w-full h-full', className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse w-full min-h-[70vh]" />
      )}
      <img
        src={src}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        {...props}
        alt={alt}
      />
    </div>
  );
}
