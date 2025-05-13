import Image from 'next/image';
import type { Equipment } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
      {equipment.price && (
        <CardFooter>
          <Badge variant="secondary" className="text-lg font-semibold">{equipment.price}</Badge>
        </CardFooter>
      )}
    </Card>
  );
}
