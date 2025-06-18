'use client';
import LikesInfo from '@/components/LikesInfo';
import type { Like, Post, Profile } from '@prisma/client';
import { usePrivy } from '@privy-io/react-auth';
import { Avatar } from '@radix-ui/themes';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Preloader from './Preloader';
import SafeImage from './SafeImage';

export default function HomePosts({
  followers,
}: {
  followers: Profile[];
}) {
  const { user } = usePrivy();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      if (user) {
        const response = await fetch(`/api/likes?authors=${user.id}`).then(r => r.json());
        setLikes(response)
      }
      if (followers.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/posts?authors=${followers.map((p) => p.privyId).join(',')}`).then(r => r.json());
        setPosts(response);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [followers, user]);

  return (
    <div className="min-h-[calc(100vh-120px)] max-w-md mx-auto mt-32 flex flex-col gap-12">
      {loading ? <Preloader /> : posts.length === 0 ? 'No post yet. Try to follow more people☝️' : posts.map((post) => {
        const profile = followers.find((p) => p.privyId === post.author);
        const isLiked = likes.some(({ postId }) => postId === post.id)
        return (
          <div key={post.id} className="w-full">
            <Link href={`/posts/${post.id}`}>
              <SafeImage  src={post.image} alt={post.id} className='min-h-80' />
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
                  sessionLike={isLiked}
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
