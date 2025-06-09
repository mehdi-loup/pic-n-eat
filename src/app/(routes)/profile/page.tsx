'use client';
import Preloader from '@/components/Preloader';
import ProfilePageContent from '@/components/ProfilePageContent';
import { usePrivy } from '@privy-io/react-auth';

export default function ProfilePage() {
  const { user } = usePrivy();

  if (!user?.farcaster && !user?.twitter) {
    return <Preloader />;
  }

  return (
    <ProfilePageContent
      ourFollow={false}
      profile={{
        id: user.id,
        avatar: user.farcaster?.pfp || user.twitter?.profilePictureUrl || '',
        privyId: user.id,
        bio: user.farcaster?.bio || '',
        username: user.farcaster?.username || user.twitter?.username || '',
        name: user.farcaster?.displayName || user.twitter?.name || '',
        subtitle: user.farcaster?.url || user.twitter?.subject || '',
      }}
      isOurProfile={true}
    />
  );
}
