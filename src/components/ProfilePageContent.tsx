'use client';
import ProfilePageInfo from '@/components/ProfilePageInfo';
import ProfilePosts from '@/components/ProfilePosts';
import type { Profile } from '@prisma/client';

export default function ProfilePageContent({
  profile,
  isOurProfile = false,
  ourFollow = false,
}: {
  profile: Profile;
  isOurProfile?: boolean;
  ourFollow: boolean;
}) {
  return (
    <main className='w-full h-full'>
      <ProfilePageInfo profile={profile} isOurProfile={isOurProfile} ourFollow={ourFollow} />
      <section className="mt-4">
        <ProfilePosts privyId={profile.privyId} />
      </section>
    </main>
  );
}
