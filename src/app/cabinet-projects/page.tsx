
import type { Metadata } from 'next';
import { CabinetProjectsClientContent } from '@/components/page-clients/CabinetProjectsPageClient';

export const metadata: Metadata = {
  title: 'Cabinet Projects - Vinoos',
  description: 'Explore our portfolio of custom cabinet builds and designs.',
};

export default function CabinetProjectsPage() {
  return <CabinetProjectsClientContent />;
}
