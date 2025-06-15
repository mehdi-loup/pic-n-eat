'use client';
import { postEntry } from '@/actions';
import PostRating from '@/components/PostRating';
import { usePrivy } from '@privy-io/react-auth';
import { Button, TextArea } from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { DollarSign, LoaderIcon, MapPin, SendIcon, Star, Type } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Autocomplete from 'react-google-autocomplete';
import CameraAccess from './components/CameraAccess';

export default function CreatePage() {
  const { user } = usePrivy();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{
    googlePlaceId: string;
    address: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const { mutate: uploadImage, data: imageUrl } = useMutation({
    mutationFn: async (file: File) => {
      const data = new FormData();
      data.set('file', file);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      if (!response.ok) throw new Error('Failed to upload image');
      return response.json() as Promise<string>;
    },
  });

  const isFormValid = imageUrl && rating && location;

  if (!user) {
    return router.push('/settings');
  }

  return (
    <form
      className="max-w-md mx-auto"
      action={async (data) => {
        if (!imageUrl || !rating || !location) {
          console.error('imageUrl', imageUrl, 'rating', rating, 'location', location);
          return;
        }
        setIsLoading(true);
        const id = await postEntry(data, user);
        setIsLoading(false);
        router.push(`/posts/${id}`);
        router.prefetch('/browse');
      }}
    >
      <input type="hidden" name="image" value={imageUrl || ''} />
      <input type="hidden" name="location" value={location ? JSON.stringify(location) : ''} />
      <input type="hidden" name="rating" value={rating} />
      <input type="hidden" name="priceRange" value={priceRange || 0} />
      <div className="flex flex-col gap-4">
        <div className="min-h-64 bg-gray-400 rounded-md relative">
          {imageUrl ? (
            <img src={imageUrl} className="rounded-md" alt="" />
          ) : (
            <CameraAccess onImageCapture={uploadImage} />
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="location" className="text-sm font-bold mb-2 flex items-center">
            <MapPin size={16} className="mr-2 text-orange-500" /> Location{' '}
            <span className="text-orange-500">*</span>
          </label>
          <div className="relative flex items-center">
            <Autocomplete
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
              onPlaceSelected={(place) => {
                setLocation({
                  address: place.formatted_address ?? place.vicinity,
                  latitude: place.geometry.location.lat(),
                  longitude: place.geometry.location.lng(),
                  googlePlaceId: place.place_id,
                });
              }}
              defaultValue={location?.address || ''}
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline pr-10 text-slate-600"
              placeholder="Search restaurants or type location"
            />
            <button
              type="button"
              onClick={async () => {
                setIsLocating(true);
                if (navigator.geolocation) {
                  try {
                    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                      navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0,
                      });
                    });
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(
                      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
                    );
                    const data = await response.json();
                    if (data.results && data.results.length > 0) {
                      const place = data.results[0];
                      setLocation({
                        googlePlaceId: place.place_id,
                        address: place.formatted_address,
                        latitude,
                        longitude,
                      });
                    }
                  } catch (error) {
                    console.error('Error getting geolocation:', error);
                    alert('Please enable location services for this feature.');
                  } finally {
                    setIsLocating(false);
                  }
                } else {
                  console.error('Geolocation is not supported by this browser.');
                  alert('Geolocation is not supported by your browser.');
                  setIsLocating(false);
                }
              }}
              disabled={isLocating}
              className="absolute right-0 top-0 mt-2 mr-2 text-orange-500 font-semibold flex items-center"
            >
              {isLocating ? (
                'Locating...'
              ) : (
                <>
                  <SendIcon size={16} className="mr-1" /> Nearby
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="rating" className="text-sm font-bold mb-2 flex items-center">
            <Star size={16} className="mr-2 text-orange-500" /> Rating{' '}
            <span className="text-orange-500">*</span>
          </label>
          <PostRating onRatingChange={setRating} />
        </div>

        <div className="mb-4">
          <label htmlFor="price-range" className="text-sm font-bold mb-2 flex items-center">
            <DollarSign size={16} className="mr-2 text-orange-500" /> Price Range
          </label>
          <div className="flex space-x-2">
            {['$', '$$', '$$$', '$$$$'].map((price) => (
              <button
                key={price}
                type="button"
                onClick={() => setPriceRange(price)}
                className={`py-2 px-4 rounded-md border ${priceRange === price ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-100 border-gray-300 text-slate-600'}`}
              >
                {price}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="caption" className="text-sm font-bold mb-2 flex items-center">
            <Type size={16} className="mr-2 text-orange-500" /> Caption
          </label>
          <TextArea
            name="description"
            className="h-32 w-full p-2 border rounded-md resize-none text-slate-600"
            placeholder="Share your experience..."
          />
        </div>
      </div>
      <div className="flex mt-4 justify-center">
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-lg bg-gradient-to-tr from-ig-orange to-ig-red to-80% ${isFormValid ? 'cursor-pointer text-white' : 'grayscale text-gray-400 cursor-not-allowed'}`}
        >
          {isLoading ? <LoaderIcon /> : <SendIcon size={16} className="mr-2" />}
          {isLoading ? 'Loading...' : 'Publish Post'}
        </button>
      </div>
    </form>
  );
}
