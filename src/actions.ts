'use server';

import type { User } from '@privy-io/react-auth';
import { uniq } from 'lodash';
import { prisma } from './db';
import type { UserInfo } from './types';

export async function getSessionEmail(): Promise<string | null | undefined> {
  return 'mouloud@gmail.com';
}

export async function getSessionEmailOrThrow(): Promise<string> {
  const userEmail = await getSessionEmail();
  if (!userEmail) {
    throw 'not logged in';
  }
  return userEmail;
}

export async function upsertProfile(newUserInfo: UserInfo, privyId: string) {
  await prisma.profile.upsert({
    where: {
      privyId,
    },
    update: newUserInfo,
    create: {
      privyId,
      ...newUserInfo,
    },
  });
}

export async function postEntry(data: FormData, user: User) {
  const sessionEmail = user.email?.address || user.id;
  const postDoc = await prisma.post.create({
    data: {
      author: sessionEmail,
      image: data.get('image') as string,
      description: (data.get('description') as string) || '',
    },
  });
  return postDoc.id;
}

export async function postComment(data: FormData) {
  const authorEmail = await getSessionEmailOrThrow();
  return prisma.comment.create({
    data: {
      author: authorEmail,
      postId: data.get('postId') as string,
      text: data.get('text') as string,
    },
  });
}

async function updatePostLikesCount(postId: string) {
  await prisma.post.update({
    where: { id: postId },
    data: {
      likesCount: await prisma.like.count({ where: { postId } }),
    },
  });
}

export async function likePost(data: FormData) {
  const postId = data.get('postId') as string;
  await prisma.like.create({
    data: {
      author: await getSessionEmailOrThrow(),
      postId,
    },
  });
  await updatePostLikesCount(postId);
}

export async function removeLikeFromPost(data: FormData) {
  const postId = data.get('postId') as string;
  await prisma.like.deleteMany({
    where: {
      postId,
      author: await getSessionEmailOrThrow(),
    },
  });
  await updatePostLikesCount(postId);
}

export async function getSinglePostData(postId: string) {
  const post = await prisma.post.findFirstOrThrow({ where: { id: postId } });
  const authorProfile = await prisma.profile.findFirstOrThrow({ where: { privyId: post.author } });
  const comments = await prisma.comment.findMany({ where: { postId: post.id } });
  const commentsAuthors = await prisma.profile.findMany({
    where: {
      privyId: { in: uniq(comments.map((c) => c.author)) },
    },
  });
  const sessionEmail = await getSessionEmailOrThrow();
  const myLike = await prisma.like.findFirst({
    where: {
      author: sessionEmail,
      postId: post.id,
    },
  });
  const myBookmark = await prisma.bookmark.findFirst({
    where: {
      author: sessionEmail,
      postId: post.id,
    },
  });
  return {
    post,
    authorProfile,
    comments,
    commentsAuthors,
    myLike,
    myBookmark,
  };
}

export async function followProfile(profileIdToFollow: string) {
  const sessionProfile = await prisma.profile.findFirstOrThrow({
    where: { privyId: await getSessionEmailOrThrow() },
  });
  await prisma.follower.create({
    data: {
      followingProfileEmail: sessionProfile.privyId,
      followingProfileId: sessionProfile.id,
      followedProfileId: profileIdToFollow,
    },
  });
}

export async function unfollowProfile(profileIdToUnfollow: string) {
  const sessionProfile = await prisma.profile.findFirstOrThrow({
    where: { privyId: await getSessionEmailOrThrow() },
  });
  await prisma.follower.deleteMany({
    where: {
      followingProfileEmail: profileIdToUnfollow,
      followingProfileId: sessionProfile.id,
    },
  });
}

export async function bookmarkPost(postId: string) {
  const sessionEmail = await getSessionEmailOrThrow();
  await prisma.bookmark.create({
    data: {
      author: sessionEmail,
      postId,
    },
  });
}

export async function unbookmarkPost(postId: string) {
  const sessionEmail = await getSessionEmailOrThrow();
  await prisma.bookmark.deleteMany({
    where: {
      author: sessionEmail,
      postId,
    },
  });
}
