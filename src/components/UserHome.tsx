'use client';
import HomeTopRow from '@/components/HomeTopRow';
import type { Profile } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import HomePosts from './HomePosts';
import Preloader from './Preloader';

export default function UserHome({ privyId }: { privyId: string }) {
  const { data: topUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const response = await fetch('/api/profiles');
      if (!response.ok) throw new Error('Failed to fetch profiles');
      return response.json() as Promise<Profile[]>;
    },
  });

  const { data: follows = [], isLoading: followsLoading } = useQuery({
    queryKey: ['follows', privyId],
    queryFn: async () => {
      const response = await fetch(`/api/follows?followerId=${privyId}`);
      if (!response.ok) throw new Error('Failed to fetch follows');
      return response.json() as Promise<{ followedProfileId: string }[]>;
    },
    enabled: !!privyId,
  });

  const { data: followerProfiles = [], isLoading: followersLoading } = useQuery({
    queryKey: ['profiles', follows.map(f => f.followedProfileId)],
    queryFn: async () => {
      if (follows.length === 0) return [];
      const response = await fetch(`/api/profiles?ids=${follows.map(f => f.followedProfileId).join(',')}`);
      if (!response.ok) throw new Error('Failed to fetch follower profiles');
      return response.json() as Promise<Profile[]>;
    },
    enabled: follows.length > 0,
  });

  const filteredTopUsers = topUsers.filter((u) => u.privyId !== privyId);

  if (usersLoading || followersLoading || followsLoading) {
    return <Preloader />;
  }

  return (
    <div className="relative w-full flex flex-col">
      <HomeTopRow profiles={filteredTopUsers} />
      {followerProfiles ? <HomePosts followers={followerProfiles} /> : <Preloader />}
    </div>
  );
}
