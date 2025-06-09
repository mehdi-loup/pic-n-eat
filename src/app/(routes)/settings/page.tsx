'use client';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, logout } = usePrivy();
  const router = useRouter();

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Profile settings</h1>
      <p className="text-gray-500 text-xs text-center -mt-4 mb-4">
        {user?.farcaster?.displayName || user?.email?.address}
      </p>
      <div className="flex justify-center mt-4 pt-4 border-t border-gray-300">
        <Button
          type="submit"
          variant="classic"
          onClick={async () => {
            await logout();
            router.push('/');
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
