
import type { Metadata } from 'next';
import { ProjectsPageClientContent } from '@/components/page-clients/ProjectsPageClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, getItemListSchema, SITE_URL } from '@/lib/seo';
import { FISH_TANK_PROJECTS_DATA, SERVICE_AREA_TEXT } from '@/lib/constants';

const description =
  `Explore Vinoos Trading’s portfolio of custom fish tank and aquarium builds delivered across the UAE and the wider region, including ${SERVICE_AREA_TEXT}, from saltwater display tanks to commercial rack systems.`;

export const metadata: Metadata = {
  title: 'Custom Fish Tank Projects in the UAE',
  description,
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'Custom Fish Tank Projects in the UAE | Vinoos Trading EST.',
    description,
    url: `${SITE_URL}/projects`,
    type: 'website',
  },
};

export default function ProjectsPage() {
  return (
    <>
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Fish Tank Projects', path: '/projects' },
          ]),
          getItemListSchema('Custom Fish Tank Projects', FISH_TANK_PROJECTS_DATA),
        ]}
      />
      <ProjectsPageClientContent />
    </>
  );
}
