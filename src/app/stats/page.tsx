import type { Metadata } from 'next';
import { StatsDashboard } from '@/components/stats/StatsDashboard';

// Private owner dashboard: keep it out of search and out of the sitemap.
export const metadata: Metadata = {
  title: 'Stats',
  robots: { index: false, follow: false },
  alternates: { canonical: '/stats' },
};

export default function StatsPage() {
  return <StatsDashboard />;
}
