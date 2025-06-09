'use client';
import { followProfile, unfollowProfile } from '@/actions';
import type { Follower } from '@prisma/client';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@radix-ui/themes';
import { UserMinus2Icon, UserMinusIcon, UserPlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function FollowButton({
  profileIdToFollow,
  ourFollow = false,
}: {
  profileIdToFollow: string;
  ourFollow: boolean;
}) {
  const { user } = usePrivy();
  const router = useRouter();
  const [isFollowed, setIsFollowed] = useState<boolean>(!!ourFollow);

  return (
    <form
      action={async () => {
        if (!user) return
        setIsFollowed((prev) => !prev);
        if (isFollowed) {
          await unfollowProfile(profileIdToFollow, user);
        } else {
          await followProfile(profileIdToFollow, user);
        }
        router.refresh();
      }}
    >
      <button
        type="submit"
        className={`flex items-center gap-2 px-4 py-2 text-white rounded-md text-lg ${isFollowed
          ? 'bg-gradient-to-tr from-ig-orange to-ig-red from-50%'
          : 'bg-gradient-to-tr from-ig-orange to-ig-red to-80%'
          }`}
      >
        {isFollowed ? <UserMinusIcon /> : <UserPlusIcon />}
        {isFollowed ? 'Unfollow' : 'Follow'}
      </button>
    </form>
  );
}
