'use client';
import { Star } from 'lucide-react';
import { useState } from 'react';

interface PostRatingProps {
    initialRating?: number;
    onRatingChange?: (rating: number) => void;
    size?: number;
    disabled?: boolean;
}

export default function PostRating({
    initialRating = 0,
    onRatingChange,
    size = 24,
    disabled = false,
}: PostRatingProps) {
    const [rating, setRating] = useState(initialRating);
    const [hoverRating, setHoverRating] = useState(0);

    const handleRatingChange = (newRating: number) => {
        if (disabled) return;
        setRating(newRating);
        onRatingChange?.(newRating);
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    onMouseEnter={() => !disabled && setHoverRating(star)}
                    onMouseLeave={() => !disabled && setHoverRating(0)}
                    disabled={disabled}
                    className={`transition-colors duration-200 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'
                        }`}
                >
                    <Star
                        size={size}
                        className={`${star <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300 dark:text-gray-600'
                            }`}
                    />
                </button>
            ))}
        </div>
    );
} 