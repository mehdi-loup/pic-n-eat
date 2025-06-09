'use client';
import CommentForm from '@/components/CommentForm';
import { usePrivy } from '@privy-io/react-auth';

export default async function SessionCommentForm({ postId }: { postId: string }) {
  const { user } = usePrivy();

  return <CommentForm postId={postId} avatar={user?.farcaster?.pfp || ''} />;
}
