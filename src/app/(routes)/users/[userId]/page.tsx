'use client';
import Preloader from '@/components/Preloader';
import ProfilePageContent from '@/components/ProfilePageContent';
import type { Profile } from '@prisma/client';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';

export default function UserProfilePage({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const { user: connectedUser } = usePrivy();
  const [userProfile, setUserProfile] = useState<Profile | undefined>();
  const [ourFollow, setOurFollow] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!connectedUser) return;
      const [profilesData] = await fetch(`/api/profiles?ids=${userId}`).then((res) => res.json());
      setUserProfile(profilesData);

      const ourFollowData = await fetch(`/api/follows?followerId=${connectedUser.id}&followeeId=${profilesData.id}`).then((res) => res.json());
      setOurFollow(ourFollowData.length > 0)
      setLoading(false);
    }

    fetchData();
  }, [userId, connectedUser]);

  return loading ? <Preloader /> :
    userProfile ? (
      <ProfilePageContent
        isOurProfile={connectedUser?.id === userProfile?.id}
        ourFollow={ourFollow}
        profile={userProfile}
      />
    ) : (
      `User not found: ${userId}`
    );
}
