import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { PROJECT_COLLECTIONS, type ProjectCollectionKey } from '@/lib/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
  }[] = [
    { path: '', changeFrequency: 'weekly', priority: 1 },
    { path: '/projects', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/acrylic-projects', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/cabinet-projects', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/equipment', changeFrequency: 'monthly', priority: 0.7 },
  ];

  // One indexable URL per project detail page across all collections.
  const projectRoutes = (
    Object.keys(PROJECT_COLLECTIONS) as ProjectCollectionKey[]
  ).flatMap((key) =>
    PROJECT_COLLECTIONS[key].data.map((project) => ({
      path: `/${key}/${project.id}`,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    }))
  );

  return [...staticRoutes, ...projectRoutes].map(
    ({ path, changeFrequency, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })
  );
}
