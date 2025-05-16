
import Image from 'next/image';
import type { Equipment } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EquipmentCardProps {
  equipment: Equipment;
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="relative w-full aspect-[4/3] sm:aspect-auto sm:h-56 md:h-64">
        <Image
          src={equipment.imageUrl}
          alt={equipment.name}
          fill
          style={{ objectFit: 'cover' }}
          data-ai-hint={equipment.imageHint}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          // Consider adding priority if these cards are often above the fold
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{equipment.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{equipment.description}</CardDescription>
      </CardContent>
    </Card>
  );
}

