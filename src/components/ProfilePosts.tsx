'use client';
import PostsGrid from '@/components/PostsGrid';
import type { Post } from '@prisma/client';
import { useEffect, useState } from 'react';
import Preloader from './Preloader';

export default function ProfilePosts({ privyId }: { privyId: string }) {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`/api/posts?authors=${privyId}`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [privyId]);

  if (!posts || loading) {
    return <Preloader />
  }

  if (posts.length === 0) {
    return "No post yet";
  }

  return <PostsGrid posts={posts} />;
}
