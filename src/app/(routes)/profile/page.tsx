'use client';
import ProfilePageContent from '@/components/ProfilePageContent';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

export default async function ProfilePage() {
  const { user } = usePrivy();
  const router = useRouter();

  if (!user?.farcaster) {
    return router.push('/settings');
  }

  return (
    <ProfilePageContent
      ourFollow={null}
      profile={{
        avatar: user.farcaster?.pfp,
        privyId: user.id,
        bio: user.farcaster.bio,
        username: user.farcaster.username,
        name: user.farcaster.displayName,
        subtitle: user.farcaster.bio,
      }}
      isOurProfile={true}
    />
  );
}
