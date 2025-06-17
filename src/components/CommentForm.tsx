'use client';
import { postComment } from '@/actions';
import { usePrivy } from '@privy-io/react-auth';
import { Button, TextArea } from '@radix-ui/themes';
import { useQueryClient } from '@tanstack/react-query';
import { SendIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CommentForm({ postId }: { postId: string }) {
  const router = useRouter();
  const { user } = usePrivy();
  const [commentText, setCommentText] = useState('');
  const queryClient = useQueryClient();

  return (
    <form
      action={async (data) => {
        if (!user) throw new Error('No connected user');
        if (!commentText) {
          return;
        }
        await postComment(data, user);
        setCommentText('');
        // Invalidate posts cache to trigger a refetch
        queryClient.invalidateQueries({ queryKey: ['post', postId, user?.id] });
        router.refresh();
      }}
    >
      <input type="hidden" name="postId" value={postId} />
      <div className="w-full flex flex-col gap-2 relative">
        <TextArea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          variant="classic"
          className="w-full"
          name="text"
          rows={4}
          placeholder="Tell the world what you think..."
        />
        <div className="absolute bottom-2 right-2">
          <Button type="submit" disabled={commentText === ''}>
            <SendIcon size={14} />
          </Button>
        </div>
      </div>
    </form>
  );
}
