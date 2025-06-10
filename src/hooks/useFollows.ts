import { useQuery } from '@tanstack/react-query';

interface Follow {
  followedProfileId: string;
}

async function fetchFollows(followerId: string): Promise<Follow[]> {
  const response = await fetch(`/api/follows?followerId=${followerId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch follows');
  }
  return response.json();
}

export function useFollows(followerId: string) {
  return useQuery({
    queryKey: ['follows', followerId],
    queryFn: () => fetchFollows(followerId),
    enabled: !!followerId,
  });
}
