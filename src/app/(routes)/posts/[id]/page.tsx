'use client';
import { getSinglePostData } from '@/actions';
import EmptyState from '@/components/EmptyState';
import Preloader from '@/components/Preloader';
import SinglePostContent, {} from '@/components/SinglePostContent';
import { usePrivy } from '@privy-io/react-auth';
import { useQuery } from '@tanstack/react-query';
import { Paintbrush2 } from 'lucide-react';

export default function SinglePostPage({ params }: { params: { id: string } }) {
  const { user } = usePrivy();
  const { data, isLoading, error } = useQuery({
    queryKey: ['post', params.id, user?.id],
    queryFn: () => {
      if (!user) throw new Error('User not authenticated');
      return getSinglePostData(params.id, user);
    },
    enabled: !!user,
  });

  if (error) {
    return <EmptyState title="Post not found" icon={Paintbrush2} />;
  }

  if (isLoading || !data) {
    return <Preloader />;
  }

  return (
    <SinglePostContent
      post={data.post}
      authorProfile={data.authorProfile}
      comments={data.comments}
      commentsAuthors={data.commentsAuthors}
      myLike={Boolean(data.myLike)}
    />
  );
}
