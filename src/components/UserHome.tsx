'use client';
import HomeTopRow from '@/components/HomeTopRow';
import type { UserInfo } from '@/types';
import type { Profile } from '@prisma/client';
import { useEffect, useState } from 'react';
import HomePosts from './HomePosts';
import Preloader from './Preloader';

export default function UserHome({ privyId }: { privyId: string }) {
  const [topUsers, setTopUsers] = useState<Profile[]>([]);
  const [followerProfiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        fetch('/api/profiles')
          .then((res) => res.json())
          .then((users: Profile[]) => setTopUsers(users.filter(u => u.privyId !== privyId)));

        const followsData: { followedProfileId: string }[] = await fetch(
          `/api/follows?followerId=${privyId}`
        ).then((res) => res.json());

        if (followsData.length > 0) {
          const profilesData = await fetch(
            `/api/profiles?ids=${followsData.map((f) => f.followedProfileId).join(',')}`
          ).then((res) => res.json());
          setProfiles(profilesData);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [privyId]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="flex flex-col gap-8">
      <HomeTopRow profiles={topUsers} />
      <HomePosts followers={followerProfiles} />
    </div>
  );
}
