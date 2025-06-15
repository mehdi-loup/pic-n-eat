'use client';
import { likePost, removeLikeFromPost } from '@/actions';
import type { Like, Post } from '@prisma/client';
import { usePrivy } from '@privy-io/react-auth';
import { useQueryClient } from '@tanstack/react-query';
import { HeartIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LikesInfo({
  post,
  sessionLike,
  showText = true,
}: {
  post: Post;
  sessionLike: boolean;
  showText?: boolean;
}) {
  const router = useRouter();
  const { user } = usePrivy();
  const [likedByMe, setLikedByMe] = useState(!!sessionLike);
  const queryClient = useQueryClient();

  return (
    <form
      action={async (data: FormData) => {
        if (!user) throw new Error('No connected user');
        setLikedByMe((prev) => !prev);
        if (likedByMe) {
          // remove like
          await removeLikeFromPost(data, user);
        } else {
          // add like
          await likePost(data, user);
        }
        // Invalidate the cache for this specific post
        queryClient.invalidateQueries({ queryKey: ['post', post.id, user.id] });
        router.refresh();
      }}
      className="flex items-center gap-2"
    >
      <input type="hidden" name="postId" value={post.id} />
      <button type="submit" className="">
        <HeartIcon className={likedByMe ? 'text-red-500 fill-red-500' : 'dark:text-white'} />
      </button>
      {showText && <p>{post.likesCount}</p>}
    </form>
  );
}
