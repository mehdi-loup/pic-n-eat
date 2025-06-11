'use client';
import { getSinglePostData } from '@/actions';
import Preloader from '@/components/Preloader';
import SinglePostContent, {
} from '@/components/SinglePostContent';
import { usePrivy } from '@privy-io/react-auth';
import { useQuery } from '@tanstack/react-query';

export default function SinglePostPage({ params }: { params: { id: string } }) {
  const { user } = usePrivy();
  const { data, isLoading } = useQuery({
    queryKey: ['post', params.id, user?.id],
    queryFn: () => {
      if (!user) throw new Error('User not authenticated');
      return getSinglePostData(params.id, user);
    },
    enabled: !!user,
  });

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
