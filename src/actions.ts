'use server';

import type { Profile } from '@prisma/client';
import type { User } from '@privy-io/react-auth';
import { uniq } from 'lodash';
import { prisma } from './db';
import type { UserInfo } from './types';

export async function getProfile(username: string) {
  const profile: Profile = await prisma.profile.findFirstOrThrow({
    where: { username: username },
  });

  return profile;
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
  const sessionEmail = user.id;
  const locationData = data.get('location') as string;

  if (!locationData) throw new Error('Location data required');

  const location = await prisma.location.upsert({
    where: {
      googlePlaceId: JSON.parse(locationData).googlePlaceId,
    },
    update: JSON.parse(locationData),
    create: JSON.parse(locationData),
  });

  const postDoc = await prisma.post.create({
    data: {
      author: sessionEmail,
      image: data.get('image') as string,
      description: (data.get('description') as string) || '',
      locationId: location.id,
      rating: Number(data.get('rating')),
      price: Number(data.get('price')),
    },
  });

  prisma.location.update({
    where: {
      googlePlaceId: JSON.parse(locationData).googlePlaceId,
    },
    data: {
      posts: { connect: postDoc },
    },
  });

  return postDoc.id;
}

export async function postComment(data: FormData, connectedUser: User) {
  const authorEmail = connectedUser.id;
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

export async function likePost(data: FormData, connectedUser: User) {
  const postId = data.get('postId') as string;
  await prisma.like.create({
    data: {
      author: connectedUser.id,
      postId,
    },
  });
  await updatePostLikesCount(postId);
}

export async function removeLikeFromPost(data: FormData, connectedUser: User) {
  const postId = data.get('postId') as string;
  await prisma.like.deleteMany({
    where: {
      postId,
      author: connectedUser.id,
    },
  });
  await updatePostLikesCount(postId);
}

export async function getSinglePostData(postId: string, connectedUser: User) {
  const post = await prisma.post.findFirstOrThrow({
    where: { id: postId },
    include: { location: true },
  });
  const authorProfile = await prisma.profile.findFirstOrThrow({ where: { privyId: post.author } });
  const comments = await prisma.comment.findMany({ where: { postId: post.id } });
  const commentsAuthors = await prisma.profile.findMany({
    where: {
      privyId: { in: uniq(comments.map((c) => c.author)) },
    },
  });

  const myLike = await prisma.like.findFirst({
    where: {
      author: connectedUser.id,
      postId: post.id,
    },
  });

  return {
    post,
    authorProfile,
    comments,
    commentsAuthors,
    myLike,
  };
}

export async function followProfile(profileIdToFollow: string, user: User) {
  const sessionProfile = await prisma.profile.findFirstOrThrow({
    where: { privyId: user.id },
  });

  await prisma.follower.create({
    data: {
      followingProfileEmail: sessionProfile.privyId,
      followingProfileId: sessionProfile.id,
      followedProfileId: profileIdToFollow,
    },
  });
}

export async function unfollowProfile(profileIdToUnfollow: string, user: User) {
  const sessionProfile = await prisma.profile.findFirstOrThrow({
    where: { privyId: user.id },
  });

  await prisma.follower.deleteMany({
    where: {
      followedProfileId: profileIdToUnfollow,
      followingProfileId: sessionProfile.id,
    },
  });
}
