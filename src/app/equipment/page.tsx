import { EquipmentCard } from '@/components/showcase/EquipmentCard';
import { EQUIPMENT_DATA } from '@/lib/constants';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, SITE_URL } from '@/lib/seo';
import type { Metadata } from 'next';

const description =
  'Discover the equipment, machinery and warehouse facilities behind Vinoos Trading’s custom aquariums, including precision laser cutting used to build high-quality fish tanks in the UAE.';

export const metadata: Metadata = {
  title: 'Aquarium Equipment & Fabrication Facilities',
  description,
  alternates: { canonical: '/equipment' },
  openGraph: {
    title: 'Aquarium Equipment & Fabrication Facilities | Vinoos Trading EST.',
    description,
    url: `${SITE_URL}/equipment`,
    type: 'website',
  },
};

export default function EquipmentPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Equipment', path: '/equipment' },
        ])}
      />
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-primary tracking-tight sm:text-5xl">
          Equipment Showcase
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Our equipment, machinery, and warehouse facilities, the precision
          tooling behind every custom aquarium and acrylic build at Vinoos
          Trading EST.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {EQUIPMENT_DATA.map((equipment) => (
          <EquipmentCard key={equipment.id} equipment={equipment} />
        ))}
      </div>
    </div>
  );
}
