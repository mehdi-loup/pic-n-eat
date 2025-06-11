import { getSinglePostData } from '@/actions';
import SinglePostContent from '@/components/SinglePostContent';
import type { User } from '@privy-io/react-auth';

export default async function ModalPostContent({ postId, user }: { postId: string; user: User }) {
  const { post, authorProfile, comments, commentsAuthors, myLike } = await getSinglePostData(
    postId,
    user
  );
  return (
    <SinglePostContent
      post={post}
      authorProfile={authorProfile}
      comments={comments}
      commentsAuthors={commentsAuthors}
      myLike={Boolean(myLike)}
    />
  );
}
