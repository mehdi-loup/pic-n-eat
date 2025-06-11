'use client';
import { postEntry } from '@/actions';
import PostRating from '@/components/PostRating';
import { usePrivy } from '@privy-io/react-auth';
import { Button, TextArea } from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { CloudUploadIcon, SendIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import Autocomplete from 'react-google-autocomplete'

export default function CreatePage() {
  const fileInRef = useRef<HTMLInputElement>(null);
  const { user } = usePrivy();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [location, setLocation] = useState<{
    googlePlaceId: string;
    address: string;
    latitude: number;
    longitude: number;
  } | null>(null);

  const { mutate: uploadImage, isPending: isUploading, data: imageUrl } = useMutation({
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
      <div className="flex flex-col gap-4">
        <div>
          <div className="min-h-64 p-2 bg-gray-400 rounded-md relative">
            {imageUrl && <img src={imageUrl} className="rounded-md" alt="" />}
            <div className="absolute inset-0 flex items-center justify-center">
              <input
                onChange={(ev) => {
                  const file = ev.target.files?.[0];
                  if (file) {
                    uploadImage(file);
                  }
                }}
                className="hidden"
                type="file"
                ref={fileInRef}
              />
              <Button
                disabled={isUploading}
                onClick={() => fileInRef?.current?.click()}
                type="button"
                variant="surface"
              >
                {!isUploading && <CloudUploadIcon size={16} />}
                {isUploading ? 'Uploading...' : 'Choose image'}
              </Button>
            </div>
          </div>
        </div>
        <PostRating onRatingChange={setRating} />
        <div className="flex flex-col gap-2">
          <TextArea name="description" className="h-16" placeholder="Add photo description..." />
        </div>
        <Autocomplete
          apiKey={process.env.GOOGLE_API_KEY}
          onPlaceSelected={(place) => {
            setLocation({
              address: place.formatted_address ?? place.vicinity,
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
              googlePlaceId: place.place_id
            });
          }}
        />
      </div>
      <div className="flex mt-4 justify-center">
        <Button disabled={!imageUrl || !rating || !location}>
          <SendIcon size={16} />
          Publish
        </Button>
      </div>
    </form>
  );
}
