import type { Profile } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

async function fetchProfiles(ids?: string[]): Promise<Profile[]> {
  const url = ids ? `/api/profiles?ids=${ids.join(',')}` : '/api/profiles';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch profiles');
  }
  return response.json();
}

export function useProfiles(ids?: string[]) {
  return useQuery({
    queryKey: ['profiles', ids],
    queryFn: () => fetchProfiles(ids),
  });
}
