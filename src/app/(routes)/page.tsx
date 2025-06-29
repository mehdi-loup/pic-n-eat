'use client';
import { upsertProfile } from '@/actions';
import Preloader from '@/components/Preloader';
import UserHome from '@/components/UserHome';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import { WalletIcon } from 'lucide-react';
import { Suspense } from 'react';

export default function UserPage() {
  const { ready, authenticated, user } = usePrivy();

  const { login } = useLogin({
    onComplete: ({ user }) => {
      upsertProfile(
        {
          avatar: user.farcaster?.pfp || user.twitter?.profilePictureUrl || '',
          name: user.farcaster?.displayName || user.twitter?.name || '',
          username: user.farcaster?.username || user.twitter?.username || '',
          subtitle: user.farcaster?.url || '',
          bio: user.farcaster?.bio || '',
        },
        user.id
      );
    },
  });

  if (!ready) {
    return <Preloader />;
  }

  if (!user || !authenticated) {
    return (
      <button
        type="button"
        className="bg-violet-600 hover:bg-violet-700 py-3 px-6 text-white rounded-lg flex items-center gap-2"
        onClick={login}
      >
        <WalletIcon size={20} />
        Log in
      </button>
    );
  }

  return (
    <Suspense fallback={<Preloader />}>
      <UserHome privyId={user.id} />
    </Suspense>
  );
}
