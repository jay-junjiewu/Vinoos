import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { PROJECT_COLLECTIONS, type ProjectCollectionKey } from '@/lib/projects';
import { HERO_IMAGES, EQUIPMENT_DATA } from '@/lib/constants';

type Entry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
  images?: string[];
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const collectionKeys = Object.keys(
    PROJECT_COLLECTIONS
  ) as ProjectCollectionKey[];

  const staticRoutes: Entry[] = [
    {
      path: '',
      changeFrequency: 'weekly',
      priority: 1,
      images: HERO_IMAGES.map((img) => img.url),
    },
    { path: '/equipment', changeFrequency: 'monthly', priority: 0.7, images: EQUIPMENT_DATA.map((e) => e.imageUrl) },
  ];

  // Section pages: list a cover image per project in that collection.
  const sectionRoutes: Entry[] = collectionKeys.map((key) => ({
    path: `/${key}`,
    changeFrequency: 'monthly',
    priority: key === 'projects' ? 0.9 : 0.8,
    images: PROJECT_COLLECTIONS[key].data
      .map((project) => project.images[0]?.url)
      .filter((url): url is string => Boolean(url)),
  }));

  // Detail pages: list all images for that project (for Google Images).
  const projectRoutes: Entry[] = collectionKeys.flatMap((key) =>
    PROJECT_COLLECTIONS[key].data.map((project) => ({
      path: `/${key}/${project.id}`,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
      images: project.images.map((img) => img.url),
    }))
  );

  return [...staticRoutes, ...sectionRoutes, ...projectRoutes].map(
    ({ path, changeFrequency, priority, images }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
      ...(images && images.length ? { images } : {}),
    })
  );
}
