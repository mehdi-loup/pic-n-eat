import { upsertProfile } from '@/actions';
import { useLogin } from '@privy-io/react-auth';
import { WalletIcon } from 'lucide-react';

export function LoginButton() {
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
