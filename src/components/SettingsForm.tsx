'use client';
import { upsertProfile } from '@/actions';
import type { User } from '@privy-io/react-auth';
import { Button, Switch, TextArea, TextField } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';

export default function SettingsForm({
  user,
}: {
  user: User | null;
}) {
  const router = useRouter();

  if (!user) {
    throw new Error('User not found');
  }

  return (
    <form
      action={async (data: FormData) => {
        await upsertProfile(
          {
            avatar: data.get('avatar') as string,
            name: data.get('name') as string,
            username: data.get('username') as string,
            subtitle: data.get('subtitle') as string,
            bio: data.get('bio') as string,
          },
          user.id
        );
        router.push('/profile');
        router.refresh();
      }}
    >
      <input type="hidden" name="avatar" value={user.farcaster?.pfp || ''} />
      <div className="flex gap-4 items-center">
        <div>
          <div className="bg-gray-400 size-24 rounded-full overflow-hidden aspect-square shadow-md shadow-gray-400">
            <img className="" src={user.farcaster?.pfp || ''} alt="" />
          </div>
        </div>
        <div>
          <img src={user.farcaster?.pfp || ''} alt="Profile avatar" />
        </div>
      </div>
      <p className="mt-2 font-bold">username</p>
      <TextField.Root
        name="username"
        defaultValue={user.farcaster?.username || ''}
        placeholder="your_username"
      />
      <p className="mt-2 font-bold">name</p>
      <TextField.Root
        name="name"
        defaultValue={user.farcaster?.displayName || ''}
        placeholder="John Doe"
      />
      <p className="mt-2 font-bold">subtitle</p>
      <TextField.Root
        name="subtitle"
        defaultValue={user.farcaster?.bio || ''}
        placeholder="Graphic designer"
      />
      <p className="mt-2 font-bold">bio</p>
      <TextArea name="bio" defaultValue={user.farcaster?.bio || ''} />
      <label className="flex gap-2 items-center mt-2" htmlFor="dark-mode">
        <span>Dark mode </span>
        <Switch
          id="dark-mode"
          defaultChecked={localStorage.getItem('theme') === 'dark'}
          onCheckedChange={(isDark) => {
            const html = document.querySelector('html');
            const theme = isDark ? 'dark' : 'light';
            if (html) {
              html.dataset.theme = theme;
            }
            localStorage.setItem('theme', theme);
            window.location.reload();
          }}
        />
      </label>
      <div className="mt-4 flex justify-center">
        <Button variant="solid">Save settings</Button>
      </div>
    </form>
  );
}
