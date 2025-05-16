
import type { Metadata } from 'next';
import { AcrylicProjectsClientContent } from '@/components/page-clients/AcrylicProjectsPageClient';

export const metadata: Metadata = {
  title: 'Acrylic Projects - Vinoos',
  description: 'Explore our portfolio of custom acrylic fish tank builds and aquarium designs.',
};

export default function AcrylicProjectsPage() {
  return <AcrylicProjectsClientContent />;
}
