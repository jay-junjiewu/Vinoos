
import type { Metadata } from 'next';
import { ProjectsPageClientContent } from '@/components/page-clients/ProjectsPageClient';

export const metadata: Metadata = {
  title: 'Fish Tank Projects - Vinoos',
  description: 'Explore our portfolio of custom fish tank builds and aquarium designs (excluding acrylic).',
};

export default function ProjectsPage() {
  return <ProjectsPageClientContent />;
}
