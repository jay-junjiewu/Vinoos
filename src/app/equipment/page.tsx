import { EquipmentCard } from '@/components/showcase/EquipmentCard';
import { EQUIPMENT_DATA } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aquarium Equipment - AquaCraft Showcase',
  description: 'Browse our selection of high-quality fish tank equipment and supplies.',
};

export default function EquipmentPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-primary tracking-tight sm:text-5xl">
          Equipment Showcase
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Find the best gear for your aquarium. We offer a curated selection of filters, lights, heaters, and more to keep your aquatic pets thriving.
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
