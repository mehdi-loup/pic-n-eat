'use client';
import { DollarSignIcon, Star } from 'lucide-react';
import { useState } from 'react';

interface PostPriceProps {
  initialPrice?: number;
  onPriceChange?: (Price: number) => void;
  size?: number;
  disabled?: boolean;
}

export default function PostPrice({
  initialPrice = 0,
  onPriceChange,
  size = 24,
  disabled = false,
}: PostPriceProps) {
  const [price, setPrice] = useState(initialPrice);
  const [hoverPrice, setHoverPrice] = useState(0);

  const handlePriceChange = (newPrice: number) => {
    if (disabled) return;
    setPrice(newPrice);
    onPriceChange?.(newPrice);
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handlePriceChange(star)}
          onMouseEnter={() => !disabled && setHoverPrice(star)}
          onMouseLeave={() => !disabled && setHoverPrice(0)}
          disabled={disabled}
          className={`transition-colors duration-200 ${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'
          }`}
        >
          <DollarSignIcon
            size={size}
            className={`${
              star <= (hoverPrice || price)
                ? 'text-dollar'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
