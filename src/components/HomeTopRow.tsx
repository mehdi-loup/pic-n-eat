'use client';
import type { Profile } from '@prisma/client';
import { Avatar } from '@radix-ui/themes';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomeTopRow({
  profiles,
}: {
  profiles: Profile[];
}) {
  const router = useRouter();

  return (
    <div className="absolute -top-4 -left-4 py-4 w-[calc(100%+2rem)] overflow-x-auto">
      <div className="flex gap-3 w-fit px-4">
        <div>
          <button
            type="button"
            className="size-[92px] bg-gradient-to-tr from-ig-orange to-ig-red text-white rounded-full flex items-center justify-center"
            onClick={() => router.push('/create')}
          >
            <PlusIcon size="42" />
          </button>
          <p className="text-center text-gray-400 text-sm">New Story</p>
        </div>
        {profiles.length === 0 && <p className="text-center text-gray-400 text-sm">No profiles</p>}
        {profiles.map((profile) => (
          <div key={profile.username} className="w-24 flex flex-col justify-center items-center">
            <button type='button' onClick={() => router.push(`/users/${profile.id}`)}>
              <div className="inline-block p-1 rounded-full bg-gradient-to-tr from-ig-orange to-ig-red">
                <div className="inline-block p-0.5 bg-white dark:bg-black rounded-full">
                  <Avatar size="6" radius="full" fallback={'avatar'} src={profile.avatar || ''} />
                </div>
              </div>
            </button>
            <p className="text-center text-gray-400 text-sm">{profile.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
