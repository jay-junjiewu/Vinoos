
import type { Metadata } from 'next';
import { CabinetProjectsClientContent } from '@/components/page-clients/CabinetProjectsPageClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, getItemListSchema, SITE_URL } from '@/lib/seo';
import { CABINET_PROJECTS_DATA } from '@/lib/constants';

const description =
  'Aquarium cabinets and stands by Vinoos Trading. Aluminium and MDF cabinets engineered to support and complement custom fish tanks across the UAE and the wider region.';

export const metadata: Metadata = {
  title: 'Aquarium Cabinets & Stands (Aluminium & MDF)',
  description,
  alternates: { canonical: '/cabinet-projects' },
  openGraph: {
    title: 'Aquarium Cabinets & Stands | Vinoos Trading EST.',
    description,
    url: `${SITE_URL}/cabinet-projects`,
    type: 'website',
  },
};

export default function CabinetProjectsPage() {
  return (
    <>
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Cabinet Projects', path: '/cabinet-projects' },
          ]),
          getItemListSchema('Aquarium Cabinet Projects', CABINET_PROJECTS_DATA),
        ]}
      />
      <CabinetProjectsClientContent />
    </>
  );
}
