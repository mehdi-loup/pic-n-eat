'use client';
import HomeTopRow from '@/components/HomeTopRow';
import type { UserInfo } from '@/types';
import { useEffect, useState } from 'react';
import Preloader from './Preloader';

export default function UserHome({ email }: { email: string }) {
  const [follows, setFollows] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const followsData: { followedProfileId: string }[] = await fetch(
          `/api/follows?privyId=${email}`
        ).then((res) => res.json());
        setFollows(followsData);

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
  }, [email]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="flex flex-col gap-8">
      <HomeTopRow follows={follows} profiles={profiles} />
      {/* <HomePosts follows={follows} profiles={profiles} /> */}
    </div>
  );
}
