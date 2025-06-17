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
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['post', params.id, user?.id],
    queryFn: () => {
      if (!user) throw new Error('User not authenticated');
      return getSinglePostData(params.id, user);
    },
    enabled: !!user,
  });

  if (isLoading || isFetching) {
    return <Preloader />;
  }

  if (error || !data) {
    return <EmptyState title="Post not found" icon={Paintbrush2} />;
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
