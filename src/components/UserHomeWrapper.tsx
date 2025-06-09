'use client';
import { upsertProfile } from '@/actions';
import UserHome from '@/components/UserHome';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import { WalletIcon } from 'lucide-react';
import { Suspense } from 'react';
import Preloader from './Preloader';

export default function UserHomeWrapper() {
  const { ready, authenticated, user } = usePrivy();

  const { login } = useLogin({
    onComplete: ({ user }) => {
      upsertProfile(
        {
          avatar: user.farcaster?.pfp || '',
          name: user.farcaster?.displayName || '',
          username: user.farcaster?.username || '',
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
      <UserHome email={user.email?.address || user.id} />
    </Suspense>
  );
}
