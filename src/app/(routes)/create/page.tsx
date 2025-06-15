'use client';
import { postEntry } from '@/actions';
import PostRating from '@/components/PostRating';
import { usePrivy } from '@privy-io/react-auth';
import { Button, TextArea } from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { DollarSign, MapPin, SendIcon, Star, Type } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Autocomplete from 'react-google-autocomplete';
import CameraAccess from './components/CameraAccess';

export default function CreatePage() {
  const { user } = usePrivy();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [location, setLocation] = useState<{
    googlePlaceId: string;
    address: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [priceRange, setPriceRange] = useState<string | null>(null);

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

  if (!user) {
    return router.push('/settings');
  }

  return (
    <form
      className="max-w-md mx-auto"
      action={async (data) => {
        console.log('imageUrl', imageUrl, 'rating', rating, 'location', location);
        if (!imageUrl || !rating || !location) {
          return;
        }
        const id = await postEntry(data, user);
        router.push(`/posts/${id}`);
        router.prefetch('/browse');
      }}
    >
      <input type="hidden" name="image" value={imageUrl || ''} />
      <input type="hidden" name="location" value={location ? JSON.stringify(location) : ''} />
      <input type="hidden" name="rating" value={rating} />
      <input type="hidden" name="priceRange" value={priceRange || ''} />
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
              apiKey={process.env.GOOGLE_API_KEY}
              onPlaceSelected={(place) => {
                setLocation({
                  address: place.formatted_address ?? place.vicinity,
                  latitude: place.geometry.location.lat(),
                  longitude: place.geometry.location.lng(),
                  googlePlaceId: place.place_id,
                });
              }}
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline pr-10 text-slate-600"
              placeholder="Search restaurants or type location"
            />
            <button
              type="button"
              className="absolute right-0 top-0 mt-2 mr-2 text-orange-500 font-semibold flex items-center"
            >
              <SendIcon size={16} className="mr-1" /> Nearby
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
        <Button
          className="button"
          type="submit"
          disabled={!imageUrl || !rating || !location}
          style={{
            backgroundColor: '#FF6F2C',
            color: '#FFFFFF',
            padding: '15px 30px',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0px 4px 10px rgba(255, 111, 44, 0.3)',
          }}
        >
          <SendIcon size={16} className="mr-2" />
          Publish Post
        </Button>
      </div>
    </form>
  );
}
