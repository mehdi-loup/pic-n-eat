import Comment from '@/components/Comment';
import LikesInfo from '@/components/LikesInfo';
import PostRating from '@/components/PostRating';
import Preloader from '@/components/Preloader';
import SessionCommentForm from '@/components/SessionCommentForm';
import type { Comment as CommentModel, Like, Location, Post, Profile } from '@prisma/client';
import { MapPin } from 'lucide-react';
import { Suspense } from 'react';
import PostPrice from './PostPrice';

export interface Props {
  post: Post & { location: Location | null };
  authorProfile: Profile;
  comments: CommentModel[];
  commentsAuthors: Profile[];
  myLike: boolean;
}

export default function SinglePostContent({
  post,
  authorProfile,
  comments,
  commentsAuthors,
  myLike,
}: Props) {
  console.log(post);
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <img className="rounded-md" src={post.image} alt={post.description} />

          {post.location?.address ? (
            <div className="mt-2 flex justify-center items-center">
              <MapPin size={16} className="mr-2 " />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${post.location.latitude.toString()},${post.location.longitude.toString()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-md"
              >
                {post.location.address}
              </a>
            </div>
          ) : null}
        </div>
        <div>
          {post.createdAt ? (
            <Comment
              createdAt={post.createdAt}
              text={post.description}
              authorProfile={authorProfile}
            />
          ) : null}
          <div className="pt-4 flex flex-col gap-4">
            {comments.map((comment) => (
              <div key={comment.id}>
                {comment.createdAt ? (
                  <Comment
                    createdAt={comment.createdAt}
                    text={comment.text}
                    authorProfile={commentsAuthors.find((a) => a.privyId === comment.author)}
                  />
                ) : null}
              </div>
            ))}
          </div>
          <div className="flex text-gray-700 dark:text-gray-400 items-center gap-2 justify-between py-4 mt-4 border-t border-gray-300 dark:border-gray-700">
            <LikesInfo post={post} sessionLike={myLike} />
            {post.price ? (
              <div className="flex items-center gap-2">
                <PostPrice initialPrice={post.price} disabled={true} size={20} />
              </div>
            ) : null}
            {post.rating ? (
              <div className="flex items-center gap-2">
                <PostRating initialRating={post.rating} disabled={true} size={20} />
              </div>
            ) : null}
          </div>
          <div className="pt-8 border-t border-gray-300 dark:border-gray-700">
            <Suspense fallback={<Preloader />}>
              <SessionCommentForm postId={post.id} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
