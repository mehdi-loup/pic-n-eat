import LikesInfo from '@/components/LikesInfo';
import type { Post, Profile } from '@prisma/client';
import { Avatar } from '@radix-ui/themes';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Preloader from './Preloader';

export default function HomePosts({
  followers,
}: {
  followers: Profile[];
}) {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`/api/posts?authors=${followers.map((p) => p.privyId).join(',')}`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [followers]);

  return (
    <div className="max-w-md mx-auto flex flex-col gap-12">
      {loading ? <Preloader /> : posts.map((post) => {
        const profile = followers.find((p) => p.privyId === post.author);
        return (
          <div key={post.id} className="">
            <Link href={`/posts/${post.id}`}>
              <img className="block rounded-lg shadow-md shadow-black/50" src={post.image} alt="" />
            </Link>
            <div className="flex items-center gap-2 mt-4 justify-between">
              <div className="flex gap-2 items-center">
                <Avatar radius="full" src={profile?.avatar || ''} size="2" fallback="avatar" />
                <Link
                  className="font-bold text-gray-700 dark:text-gray-300"
                  href={`/users/${profile?.id}`}
                >
                  {profile?.name}
                </Link>
              </div>
              <div className="flex gap-2 items-center">
                <LikesInfo
                  post={post}
                  showText={false}
                  sessionLike={null}
                />
              </div>
            </div>
            <p className="mt-2 text-slate-600 dark:text-gray-400">{post.description}</p>
          </div>
        );
      })}
    </div>
  );
}
