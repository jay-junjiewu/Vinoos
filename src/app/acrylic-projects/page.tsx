
import type { Metadata } from 'next';
import { AcrylicProjectsClientContent } from '@/components/page-clients/AcrylicProjectsPageClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, getItemListSchema, SITE_URL } from '@/lib/seo';
import { ACRYLIC_PROJECTS_DATA } from '@/lib/constants';

const description =
  'Custom acrylic fabrication by Vinoos Trading — display boxes, filter boxes and bespoke acrylic aquarium components precision-built for homes and businesses across the UAE and the GCC.';

export const metadata: Metadata = {
  title: 'Custom Acrylic Fabrication & Aquarium Boxes',
  description,
  alternates: { canonical: '/acrylic-projects' },
  openGraph: {
    title: 'Custom Acrylic Fabrication & Aquarium Boxes | Vinoos Trading EST.',
    description,
    url: `${SITE_URL}/acrylic-projects`,
    type: 'website',
  },
};

export default function AcrylicProjectsPage() {
  return (
    <>
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Acrylic Projects', path: '/acrylic-projects' },
          ]),
          getItemListSchema('Acrylic Fabrication Projects', ACRYLIC_PROJECTS_DATA),
        ]}
      />
      <AcrylicProjectsClientContent />
    </>
  );
}
