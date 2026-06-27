import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: {
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

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
