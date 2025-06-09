import { getSinglePostData } from '@/actions';
import SinglePostContent from '@/components/SinglePostContent';

export default async function ModalPostContent({ postId }: { postId: string }) {
  const { post, authorProfile, comments, commentsAuthors, myLike } =
    await getSinglePostData(postId);
  return (
    <SinglePostContent
      post={post}
      authorProfile={authorProfile}
      comments={comments}
      commentsAuthors={commentsAuthors}
      myLike={myLike}
    />
  );
}
