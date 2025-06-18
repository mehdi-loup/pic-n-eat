'use server';

import { getAllPostsWithLocation } from '@/actions';
import MapClient from './MapClient';

export default async function MapPage() {
  const posts = await getAllPostsWithLocation();
  return (
    <div className="max-w-3xl mx-auto py-4">
      <MapClient posts={posts} />
    </div>
  );
}
