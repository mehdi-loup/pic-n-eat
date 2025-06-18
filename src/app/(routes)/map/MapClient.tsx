'use client';
import type { Location, Post } from '@prisma/client';
import { Box, Card, Flex, Inset, Text } from '@radix-ui/themes';
import {
  APIProvider,
  Map as GoogleMap,
  type MapCameraChangedEvent,
  Marker,
} from '@vis.gl/react-google-maps';
import { DollarSign, MapPin, Star, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type PostWithLocation = Post & { location: Location | null };

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    const local = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (local === 'dark' || document.documentElement.dataset.theme === 'dark') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);
  return theme;
}

// Helper to aggregate post data by location
function aggregatePlaces(posts: PostWithLocation[]) {
  const map = new Map<string, { location: Location; posts: PostWithLocation[] }>();
  for (const post of posts) {
    if (!post.location) continue;
    if (!map.has(post.location.id)) {
      map.set(post.location.id, { location: post.location, posts: [] });
    }
    const entry = map.get(post.location.id);
    if (entry) entry.posts.push(post);
  }
  return Array.from(map.values());
}

export default function MapClient({ posts }: { posts: PostWithLocation[] }) {
  const theme = useTheme();
  const [selectedPost, setSelectedPost] = useState<PostWithLocation | null>(posts[0] || null);
  const [mapCenter, setMapCenter] = useState({
    lat: posts[0]?.location ? Number(posts[0].location.latitude) : 37.7749,
    lng: posts[0]?.location ? Number(posts[0].location.longitude) : -122.4194,
  });
  const [mapZoom, setMapZoom] = useState(12);
  const [visiblePosts, setVisiblePosts] = useState<PostWithLocation[]>([]);

  // Update visible posts when map moves
  const updateVisiblePosts = (event: MapCameraChangedEvent) => {
    const detail = event.detail;
    if (!detail || !detail.bounds) return;
    const bounds = detail.bounds;
    setVisiblePosts(
      posts.filter((post) => {
        if (!post.location) return false;
        const { latitude, longitude } = post.location;
        return (
          Number(latitude) >= bounds.south &&
          Number(latitude) <= bounds.north &&
          Number(longitude) >= bounds.west &&
          Number(longitude) <= bounds.east
        );
      })
    );
    // Also update center and zoom
    if (detail.center) setMapCenter({ lat: detail.center.lat, lng: detail.center.lng });
    if (detail.zoom) setMapZoom(detail.zoom);
  };

  // Aggregate places for cards
  const places = useMemo(() => aggregatePlaces(posts), [posts]);

  // For visible places, filter by visiblePosts
  const visiblePlaces = useMemo(() => {
    if (visiblePosts.length > 0) {
      const visibleIds = new Set(visiblePosts.map((p) => p.location?.id));
      return places.filter((p) => visibleIds.has(p.location.id));
    }
    return places.length <= 3 ? places : [...places].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [visiblePosts, places]);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string}>
      <div className="flex flex-col gap-4">
        <Text size="6" weight="bold" mb="2">
          Restaurant Map
        </Text>
        <div
          className="rounded-2xl shadow-md overflow-hidden mb-2 relative"
          style={{ height: 320 }}
        >
          <GoogleMap
            center={mapCenter}
            zoom={mapZoom}
            style={{ width: '100%', height: '100%' }}
            onBoundsChanged={updateVisiblePosts}
            mapId={theme === 'dark' ? 'a3efe1c035bad51b' : undefined}
            gestureHandling="greedy"
          >
            {posts.map((post) =>
              post.location ? (
                <Marker
                  key={post.id}
                  position={{
                    lat: Number(post.location.latitude),
                    lng: Number(post.location.longitude),
                  }}
                  onClick={() => setSelectedPost(post)}
                  icon={{
                    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                    fillColor:
                      selectedPost?.id === post.id
                        ? theme === 'dark'
                          ? '#60a5fa'
                          : '#3b82f6'
                        : theme === 'dark'
                          ? '#fdba74'
                          : '#f97316',
                    fillOpacity: 1,
                    strokeWeight: 0,
                    scale: 2,
                  }}
                />
              ) : null
            )}
          </GoogleMap>
          {/* Map legend */}
          <div
            className={`absolute bottom-2 left-2 rounded-lg px-3 py-1 text-xs flex gap-3 items-center shadow ${
              theme === 'dark' ? 'bg-gray-800/90 text-gray-200' : 'bg-white/90 text-gray-700'
            }`}
          >
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500" /> You
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-full bg-orange-400" /> Restaurant
            </span>
          </div>
        </div>
        {/* Selected place card (show first visible or first overall) */}
        {visiblePlaces[0] && (
          <Card size="3" variant="classic" className="bg-green-200 mb-2 border-1">
            <Flex justify="between" align="center" mb="1">
              <Text as="div" size="4" weight="bold" className="text-slate-700">
                {visiblePlaces[0].location.address.split(',')[0]}
              </Text>
              <Flex align="center" gap="2">
                <Users size={18} className="text-green-500" />
                <Text as="span" color="green" weight="bold">
                  {visiblePlaces[0].posts.length}
                </Text>
              </Flex>
            </Flex>
            <Text as="div" color="gray" size="2" mb="1">
              {visiblePlaces[0].location.address}
            </Text>
            <Flex align="center" gap="3" mb="2">
              <Star size={16} className="text-yellow-400" />
              <Text as="span" weight="bold" color="gray">
                {(
                  visiblePlaces[0].posts.reduce((sum, p) => sum + (p.rating ?? 0), 0) /
                  (visiblePlaces[0].posts.length || 1)
                ).toFixed(1)}
              </Text>
              <DollarSign size={16} className="text-green-600 ml-4" />
              <Text as="span" color="green" weight="bold">
                {'$'.repeat(
                  Math.round(
                    visiblePlaces[0].posts.reduce((sum, p) => sum + (p.price ?? 1), 0) /
                      (visiblePlaces[0].posts.length || 1)
                  ) || 1
                )}
              </Text>
              <MapPin size={16} className="text-orange-500 ml-4" />
              <Text as="span" color="orange" weight="bold">
                {visiblePlaces[0].location.address.split(',')[1]}
              </Text>
            </Flex>
            {/* Optionally: add a badge for 'Most Validated Restaurant' if desired */}
          </Card>
        )}
        {/* Places visible on map */}
        <Box mt="2">
          <Flex justify="between" align="center" mb="2">
            <Text as="span" size="4" weight="bold">
              Restaurants
            </Text>
            <Text as="span" color="gray" size="2">
              {visiblePlaces.length} results
            </Text>
          </Flex>
          <Flex direction="column" gap="3">
            {visiblePlaces.map((place) => (
              <Card
                key={place.location.id}
                size="2"
                variant="surface"
                className="bg-white transition-all cursor-pointer"
                tabIndex={0}
                onClick={() =>
                  setMapCenter({
                    lat: Number(place.location.latitude),
                    lng: Number(place.location.longitude),
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setMapCenter({
                      lat: Number(place.location.latitude),
                      lng: Number(place.location.longitude),
                    });
                  }
                }}
              >
                <Flex justify="between" align="center">
                  <Text as="div" size="3" weight="bold" className="text-slate-500">
                    {place.location.address.split(',')[0]}
                  </Text>
                  <Flex align="center" gap="2">
                    <Users size={16} className="text-green-500" />
                    <Text as="span" color="green" weight="bold">
                      {place.posts.length}
                    </Text>
                  </Flex>
                </Flex>
                <Text as="div" color="gray" size="1" mb="1">
                  {place.location.address}
                </Text>
                <Flex align="center" gap="2" mb="1">
                  <Star size={14} className="text-yellow-400" />
                  <Text as="span" weight="bold" color="gold">
                    {(
                      place.posts.reduce((sum, p) => sum + (p.rating ?? 0), 0) /
                      (place.posts.length || 1)
                    ).toFixed(1)}
                  </Text>
                  <DollarSign size={14} className="text-green-600 ml-2" />
                  <Text as="span" color="green" weight="bold">
                    {'$'.repeat(
                      Math.round(
                        place.posts.reduce((sum, p) => sum + (p.price ?? 1), 0) /
                          (place.posts.length || 1)
                      ) || 1
                    )}
                  </Text>
                  <MapPin size={14} className="text-orange-500 ml-2" />
                  <Text as="span" color="orange" weight="bold">
                    {place.location.address.split(',')[1]}
                  </Text>
                </Flex>
              </Card>
            ))}
          </Flex>
        </Box>
      </div>
    </APIProvider>
  );
}
