import { useMutation } from '@tanstack/react-query';

async function uploadImage(file: File): Promise<string> {
  const data = new FormData();
  data.set('file', file);
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: data,
  });
  if (!response.ok) {
    throw new Error('Failed to upload image');
  }
  return response.json();
}

export function useUploadImage() {
  return useMutation({
    mutationFn: uploadImage,
  });
}
