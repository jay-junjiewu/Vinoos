import Image from 'next/image';
import type { Equipment } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// Removed Badge import as it's no longer used for price

interface EquipmentCardProps {
  equipment: Equipment;
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="relative w-full h-48 sm:h-56 md:h-64">
        <Image
          src={equipment.imageUrl}
          alt={equipment.name}
          layout="fill"
          objectFit="cover"
          data-ai-hint={equipment.imageHint}
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{equipment.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{equipment.description}</CardDescription>
      </CardContent>
      {/* CardFooter with price has been removed */}
    </Card>
  );
}
